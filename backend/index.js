const path = require('path');
const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const Stripe = require('stripe');
const nodemailer = require('nodemailer');

dotenv.config();

const stripe = Stripe(process.env.STRIPE_SECRET_KEY);
const app = express();
const PORT = process.env.PORT || 4242;

function isValidEmail(email) {
  const re = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
  return re.test(email);
}

// CORS config
const allowedOrigins = [
  'http://localhost:3000',
  'https://nenethearchitect.com',
];
app.use(cors({
  origin: (origin, callback) => {
    if (!origin || allowedOrigins.includes(origin)) callback(null, true);
    else callback(new Error('Blocked by CORS'));
  }
}));

// Serve static frontend from React build folder
const buildPath = path.join(__dirname, '../build');
app.use(express.static(buildPath));

// Stripe webhook requires raw body, must come BEFORE express.json for this route
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

  console.log('Received Webhook Event:', event.type);

  if (event.type === 'checkout.session.completed') {
    const session = event.data.object;
    console.log('Webhook customer email:', session.customer_email);
    console.log('Opted in:', session.metadata?.optedIn);
    sendOrderConfirmationEmail(session);
  }

  res.status(200).send('Webhook received');
});

// Normal JSON parsing for all other routes
app.use(express.json());

// Root test route
app.get('/', (req, res) => {
  res.send('Backend is working!');
});

// Dynamic nail slug route
app.get('/nails/:slug', (req, res) => {
  const { slug } = req.params;
  if (!slug) return res.status(400).send('Slug missing!');
  res.send(`Slug received: ${slug}`);
});

// Stripe checkout session route
app.post('/create-checkout-session', async (req, res) => {
  console.log('Creating checkout session...');
  const { items, optedIn, customer_email } = req.body;

  if (!customer_email || !isValidEmail(customer_email)) {
    return res.status(400).json({ error: 'Invalid email address' });
  }

  try {
    const line_items = items.map(item => ({
      price_data: {
        currency: 'usd',
        product_data: {
          name: item.title || 'Custom Nail Set',
          description: item.notes || 'Custom press-on nails',
          images: [item.thumbnail || 'https://nenethearchitect.com/nails-preview-placeholder.jpg']
        },
        unit_amount: parseInt(item.price.replace('$', '').replace('+', '')) * 100
      },
      quantity: item.quantity
    }));

    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      line_items,
      mode: 'payment',
      success_url: `${process.env.FRONTEND_URL}/nails/thank-you`,
      cancel_url: `${process.env.FRONTEND_URL}/nails/cart`,
      customer_email,
      metadata: {
        optedIn: optedIn ? 'true' : 'false'
      }
    });

    res.json({ url: session.url });
  } catch (err) {
    console.error('Error creating Stripe session:', err);
    res.status(500).json({ error: err.message });
  }
});

// Confirmation email sender
function sendOrderConfirmationEmail(session) {
  const transporter = nodemailer.createTransport({
    host: 'smtp.hostinger.com',
    port: 465,
    secure: true,
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS
    }
  });

  const mailOptions = {
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
      `
  };

  transporter.sendMail(mailOptions, (error, info) => {
    if (error) return console.error('Email failed:', error);
    console.log('Confirmation email sent:', info.response);
  });
}

// Fallback route to handle React Router paths like /nails
// Serve React for all frontend routes EXCEPT API/backend routes
app.get('*', (req, res, next) => {
  const isApi =
  req.path === '/create-checkout-session' ||
  req.path === '/nails/webhook';
 // Avoid overriding API routes
  if (isApi) return next();
  res.sendFile(path.join(buildPath, 'index.html'));
});


// Start server
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
