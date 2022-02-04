const stripe =require ('stripe') ('sk_test_51KOxW9B3lRPqVGfjiT5KkSZnHM2GhPpzQ2NnphNR47JQi3Gq1RXRhjz8n0Q5dyt0Q09lHBKp5WD38XPwYq3iejNN00cHxv7OsS');

export default async (req, res) => {
    const {items, email} = req.body;
    const transformedItems = items.map((item) => ({
      description: item.description,
      quantity: 1,
      price_data: {
        currency: 'usd',
        unit_amount: item.price * 100,
        product_data: {
          name: item.title,
          images: [item.image] //pass an array
        }
      }
    }))  

    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      mode: 'payment',
      line_items: transformedItems,
      shipping_rates: ['shr_1KP1L2B3lRPqVGfj5JyY01B3'],

      shipping_address_collection: {
      allowed_countries: ['US', 'CA']
      },
      metadata: {
      email,
      images: JSON.stringify(items.map(item => item.image))
      },
      success_url: `${process.env.HOST}/success`,
      cancel_url: `${process.env.HOST}/cancel`
    });
    
    res.status(200).json({ id: session.id })
};