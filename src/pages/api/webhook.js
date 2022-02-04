import { buffer } from 'micro'
import * as admin from 'firebase-admin'


// Establish connection to stripe
const stripe = require('stripe')('sk_test_51KOxW9B3lRPqVGfjiT5KkSZnHM2GhPpzQ2NnphNR47JQi3Gq1RXRhjz8n0Q5dyt0Q09lHBKp5WD38XPwYq3iejNN00cHxv7OsS')
const endpointSecret = process.env.STRIPE_SIGNING_SECRET;
// Secure connection to Firebase from the backend
const serviceAccount = require('../../../permissions.json');
const app = !admin.apps.length ? admin.initializeApp({
    credential: admin.credential.cert(serviceAccount)
}) : admin.app();

const fulfillOrder = async (session) => {
  // console.log('Fulfilling order', session)
  return app
    .firestore()
    .collection('users')
    .doc(session.metadata.email)
    .collection('orders')
    .doc(session.id)
    .set({
      amount: session.amount_total / 100,
      amount_shipping: session.total_details.amount_shipping / 100,
      images: JSON.parse(session.metadata.images),
      timestamp: admin.firestore.FieldValue.serverTimestamp()
    })
    .then(() => {
      console.log(`SUCCESS: order ${session.id} had been added to the DB`)
    })
}

export default async (req, res) => {
  if (req.method === "POST") {
    const requestBuffer = await buffer(req)
    const payload = requestBuffer.toString()
    const sig = req.headers['stripe-signature']
    let event;
    //verify the EVENT posted came from stripe
    try {
      event = stripe.webhooks.constructEvent(payload, sig, endpointSecret)
    } catch (err) {
      console.log('ERROR', err.message)
      return res.status(400).send(`Webhook Error: ${err.message}`)
    }

    //handle the checkout.session.completed event
    if (event.type === 'checkout.session.completed') {
      const session = event.data.object
      //fullfill the order
      return fulfillOrder(session)
        .then(() => 
          //console.log('Success 200')
          res.status(200))
        .catch((err) => res.status(400).send(`Webhook Error: ${err.message}`));
    }
  }
}
export const config = {
  api: {
    bodyParser: false,
    externalResolver: true
  },
};