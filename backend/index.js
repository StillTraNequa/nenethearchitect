const path = require('path');
const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const Stripe = require('stripe');
const nodemailer = require('nodemailer'); // For sending emails

dotenv.config();  // Load environment variables from .env file

const stripe = Stripe(process.env.STRIPE_SECRET_KEY);
const app = express();

function isValidEmail(email) {
  const re = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
  return re.test(email);
} 

// Define allowed origins for CORS
const allowedOrigins = [
  'http://localhost:3000',  // Local development frontend
  'https://nenethearchitect.com',  // Production frontend
];

// CORS middleware configuration
app.use(cors({
  origin: (origin, callback) => {
    if (!origin || allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  }
}));

// Middleware to parse JSON bodies
app.use(express.json());

// Basic route to test server is working
app.get('/', (req, res) => {
  res.send('Hello, the backend is working!');
});

// Serve static files from React build folder (production)
app.use(express.static(path.join(__dirname, 'build')));

// Catch-all route for React Router (for production)
app.get('*', (req, res) => {
  res.sendFile(path.resolve(__dirname, 'build', 'index.html'));
});

app.get('/nails/:slug', (req, res) => {
  const { slug } = req.params;

  if (!slug) {
    return res.status(400).send('Slug parameter is missing!');
  }

  // Proceed with normal logic if slug is present
  res.send(`Slug received: ${slug}`);
});

// Route to create checkout session
app.post('/create-checkout-session', async (req, res) => {
  console.log('Request received for /create-checkout-session');
  console.log(req.body);  // Log the request body for debugging

  try {
    const { items, optedIn, customer_email } = req.body;

    if (!customer_email || !isValidEmail(customer_email)) {
      return res.status(400).json({ error: 'Invalid email address' });
    }

    // Format the cart items into Stripe line items
    const line_items = items.map(item => {
      console.log('Item:', item);  // Log the item to make sure it contains the necessary fields

      return {
        price_data: {
          currency: 'usd',
          product_data: {
            name: item.title,  // The name of the product
            description: item.notes || 'Custom press-on nail set',  // Product description
          },
          unit_amount: parseInt(item.price.replace('$', '').replace('+', '')) * 100,  // Convert price to cents
        },
        quantity: item.quantity,  // Quantity of the item
      };
    });

    // Create a Stripe checkout session
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      line_items,
      mode: 'payment',
      success_url: `${process.env.FRONTEND_URL}/nails/thank-you`,
      cancel_url: `${process.env.FRONTEND_URL}/nails/cart`,
      metadata: {
        optedIn: optedIn ? 'true' : 'false',
      },
    });

    // Respond with the URL to redirect to Stripe's checkout page
    res.json({ url: session.url });
  } catch (err) {
    console.error('Error creating checkout session', err);
    res.status(500).json({ error: err.message });
  }
});

// Webhook for Stripe events
// Webhook for Stripe events
const endpointSecret = process.env.STRIPE_WEBHOOK_SECRET;

app.post('/nails/webhook', express.raw({ type: 'application/json' }), (request, response) => {
  const sig = request.headers['stripe-signature'];
  let event;

  try {
    event = stripe.webhooks.constructEvent(request.body, sig, endpointSecret);
  } catch (err) {
    console.error('Webhook signature verification failed:', err.message);
    return response.status(400).send(`Webhook Error: ${err.message}`);
  }

  // Log the incoming event data
  console.log('Received Webhook Event:', event);

  // Handle 'checkout.session.completed' event
  if (event.type === 'checkout.session.completed') {
    const session = event.data.object;

    // Log the customer email to check if it's valid
    console.log('Customer Email from Webhook:', session.customer_email); // Check this value

    // Send the confirmation email after successful payment
    sendOrderConfirmationEmail(session);
  }

  // Respond to acknowledge receipt of the event
  response.status(200).send('Webhook received');
});


// Function to send the confirmation email
function sendOrderConfirmationEmail(session) {
  const transporter = nodemailer.createTransport({
    host: 'smtp.hostinger.com',
    port: 465,
    secure: true,
    auth: {
      user: process.env.EMAIL_USER,  // Your email address
      pass: process.env.EMAIL_PASS,  // Your password (including the '#')
    },
  });

  const mailOptions = {
    from: process.env.EMAIL_USER,  // Sender email address
    to: session.customer_email,    // Customer's email from the Stripe session
    subject: 'Order Confirmation - NeNeNail’dIt',
    text: `
      Thank you for your purchase! Your order has been confirmed. We will start preparing it soon.

      Order Summary:
      - Product: ${session.display_items[0].custom.name}
      - Total: ${(session.amount_total / 100).toFixed(2)} ${session.currency.toUpperCase()}

      You will receive an email when your order is shipped.

      Best regards,
      NeNeNail’dIt Team
    `,
  };

  // Send the email
  transporter.sendMail(mailOptions, (error, info) => {
    if (error) {
      console.error('Error sending confirmation email:', error);
    } else {
      console.log('Confirmation email sent: ' + info.response);
    }
  });
}

// Start the server
app.listen(4242, () => {
  console.log('Server is running on port 4242');
});
