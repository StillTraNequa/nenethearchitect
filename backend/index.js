// index.js
const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const Stripe = require('stripe');
const nodemailer = require('nodemailer');

dotenv.config();

const stripe = Stripe(process.env.STRIPE_SECRET_KEY);
const app = express();
const PORT = process.env.PORT || 4242;

// ---- helpers ----
function isValidEmail(email) {
  return /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/.test(email || '');
}

// ---- CORS ----
const allowedOrigins = [
  'http://localhost:3000',
  'https://nenethearchitect.com',
];
app.use(cors({
  origin: (origin, cb) => (!origin || allowedOrigins.includes(origin) ? cb(null, true) : cb(new Error('Blocked by CORS'))),
}));

// ---- STRIPE WEBHOOK (raw body FIRST) ----
const endpointSecret = process.env.STRIPE_WEBHOOK_SECRET;
app.post('/nails/webhook', express.raw({ type: 'application/json' }), (req, res) => {
  const sig = req.headers['stripe-signature'];
  let event;
  try {
    event = stripe.webhooks.constructEvent(req.body, sig, endpointSecret);
  } catch (err) {
    console.error('Webhook signature verification failed:', err.message);
    return res.status(400).send(`Webhook Error: ${err.message}`);
  }

  console.log('Webhook:', event.type);

  if (event.type === 'checkout.session.completed') {
    const session = event.data.object;
    const intent = session.metadata?.intent || 'order';
    console.log('Email:', session.customer_email, 'Intent:', intent, 'Opt-in:', session.metadata?.optedIn);
    if (intent === 'deposit') sendDepositConfirmationEmail(session);
    else sendOrderConfirmationEmail(session);
  }

  res.status(200).send('OK');
});

// ---- JSON for all other routes ----
app.use(express.json());

// ---- Health / simple routes ----
app.get('/', (_req, res) => res.send('Backend is working!'));
app.get('/healthz', (_req, res) => res.json({ ok: true }));

// ---- Experience inquiry (house 1–2, event 2–5) ----
app.post('/nails/experience-inquiry', async (req, res) => {
  const { type, name, email, phone, date, startTime, guestCount, location, notes } = req.body || {};
  const t = type === 'event' ? 'event' : 'house';

  const minGuests = t === 'event' ? 2 : 1;
  const maxGuests = t === 'event' ? 5 : 2;
  const guests = Math.min(Math.max(parseInt(guestCount || String(minGuests), 10), minGuests), maxGuests);

  if (!name || !isValidEmail(email) || !date || !location) {
    return res.status(400).json({ error: 'Missing required fields (name, email, date, location).' });
  }
  if (t === 'event' && !startTime) {
    return res.status(400).json({ error: 'Missing required field: start time for events.' });
  }

  try {
    const transporter = nodemailer.createTransport({
      host: 'smtp.hostinger.com',
      port: 465,
      secure: true,
      auth: { user: process.env.EMAIL_USER, pass: process.env.EMAIL_PASS },
    });

    const subject =
      t === 'event'
        ? `EVENT REQUEST — ${name} (${date} @ ${startTime}) • ${guests} guest(s)`
        : `HOUSE CALL REQUEST — ${name} (${date}) • ${guests} guest(s)`;

    const travelLine =
      t === 'event'
        ? 'Travel fee may apply depending on location.'
        : 'Travel fee: $20 (house call 1–2 guests).';

    await transporter.sendMail({
      from: process.env.EMAIL_USER,
      to: process.env.EMAIL_USER,
      subject,
      text: `
NeNe Nail’d It — ${t === 'event' ? 'Events' : 'House Call'} Inquiry

Type: ${t.toUpperCase()}
Name: ${name}
Email: ${email}
Phone: ${phone || '—'}
Date/Time: ${date}${t === 'event' ? ` ${startTime}` : ''}
Guests: ${guests}
Location: ${location}
Notes: ${notes || '—'}

Timing: ~${guests} hour(s) total (≈1 hr per set)
${travelLine}
      `.trim(),
    });

    await transporter.sendMail({
      from: process.env.EMAIL_USER,
      to: email,
      subject: `We got your ${t === 'event' ? 'event' : 'house call'} request — NeNe Nail’d It`,
      text: `
Hi ${name},

Thanks for your ${t === 'event' ? 'event' : 'house call'} request! I’ll email you shortly to confirm details.

— NeNe Nail’d It
      `.trim(),
    });

    res.json({ ok: true });
  } catch (err) {
    console.error('Experience inquiry email failed:', err);
    res.status(500).json({ error: 'Unable to send request right now. Please try again later.' });
  }
});

// ---- Stripe Checkout (orders vs deposits) ----
app.post('/create-checkout-session', async (req, res) => {
  console.log('Creating checkout session...');
  const { items, optedIn, customer_email, intent, meta } = req.body;
  if (!isValidEmail(customer_email)) return res.status(400).json({ error: 'Invalid email address' });

  const isDeposit = intent === 'deposit';

  try {
    let computedLineItems;
    if (isDeposit && meta?.guests) {
      const guests = Math.min(Math.max(parseInt(meta.guests, 10) || 2, 2), 5);
      const unit_amount = guests * 2500; // $25/guest
      computedLineItems = [{
        price_data: {
          currency: 'usd',
          product_data: {
            name: `Event Deposit — ${guests} guest(s)`,
            description: meta?.desc || 'Deposit to hold event slot',
            images: ['https://nenethearchitect.com/nails-preview-placeholder.jpg'],
          },
          unit_amount,
        },
        quantity: 1,
      }];
    }

    const line_items = computedLineItems || items.map(item => {
      const unit_amount =
        typeof item.priceCents === 'number'
          ? item.priceCents
          : parseInt(String(item.price).replace('$', '').replace('+', '')) * 100;

      return {
        price_data: {
          currency: 'usd',
          product_data: {
            name: item.title || (isDeposit ? 'Event Deposit' : 'Custom Nail Set'),
            description: item.notes || (isDeposit ? 'Deposit to hold event slot' : 'Custom press-on nails'),
            images: [item.thumbnail || 'https://nenethearchitect.com/nails-preview-placeholder.jpg'],
          },
          unit_amount,
        },
        quantity: item.quantity || 1,
      };
    });

    const sessionParams = {
      payment_method_types: ['card'],
      line_items,
      mode: 'payment',
      success_url: `${process.env.FRONTEND_URL}/nails/thank-you?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${process.env.FRONTEND_URL}/nails/cart`,
      customer_email,
      metadata: {
        intent: isDeposit ? 'deposit' : 'order',
        optedIn: optedIn ? 'true' : 'false',
        ...(meta || {}),
      },
    };

    if (!isDeposit) {
      sessionParams.shipping_address_collection = { allowed_countries: ['US'] };
      sessionParams.shipping_options = [
        { shipping_rate: 'shr_1S5D1k09Bl7clDYMWosKxSYP' }, // <- replace with your real $10 shipping rate id
      ];
    }

    const session = await stripe.checkout.sessions.create(sessionParams);
    res.json({ url: session.url });
  } catch (err) {
    console.error('Error creating Stripe session:', err);
    res.status(500).json({ error: err.message });
  }
});

// ---- email helpers ----
function sendOrderConfirmationEmail(session) {
  const transporter = nodemailer.createTransport({
    host: 'smtp.hostinger.com',
    port: 465,
    secure: true,
    auth: { user: process.env.EMAIL_USER, pass: process.env.EMAIL_PASS },
  });

  transporter.sendMail({
    from: process.env.EMAIL_USER,
    to: session.customer_email,
    subject: 'Order Confirmation - NeNeNail’dIt',
    text: `
Thank you for your purchase!

Order Confirmation:
- Customer: ${session.customer_email}
- Order ID: ${session.id}
- Total: $${(session.amount_total / 100).toFixed(2)}

We’ll begin preparing your nails soon. You’ll receive an update when it’s shipped.

Thank you again for shopping at NeNeNail’dIt 💅🏽
    `,
  }, (err, info) => {
    if (err) return console.error('Email failed:', err);
    console.log('Confirmation email sent:', info.response);
  });
}

function sendDepositConfirmationEmail(session) {
  const transporter = nodemailer.createTransport({
    host: 'smtp.hostinger.com',
    port: 465,
    secure: true,
    auth: { user: process.env.EMAIL_USER, pass: process.env.EMAIL_PASS },
  });

  transporter.sendMail({
    from: process.env.EMAIL_USER,
    to: session.customer_email,
    subject: 'Deposit Received — NeNe Nail’d It Events',
    text: `
Thanks for your deposit!

Details:
- Guests: ${session.metadata?.guests || '—'}
- Date/Time: ${session.metadata?.date || '—'} ${session.metadata?.startTime || '—'}
- Location: ${session.metadata?.location || '—'}
- Deposit: $${(session.amount_total / 100).toFixed(2)}
- Ref: ${session.id}

I’ll reach out shortly to confirm the rest of your event details. 💅🏽
    `.trim(),
  }, (err, info) => {
    if (err) return console.error('Deposit email failed:', err);
    console.log('Deposit email sent:', info.response);
  });
}

// No SPA fallback here (frontend is hosted elsewhere)

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
