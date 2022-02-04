import React from 'react';
import Header from "../components/Header";
import Image from "next/image";
import { selectItems, selectTotal } from '../slices/basketSlice';
import { useSelector } from "react-redux";
import CheckOutProduct from '../components/CheckOutProduct';
import Currency from 'react-currency-format';
import { useSession } from 'next-auth/react';
import { loadStripe } from '@stripe/stripe-js';
import axios from 'axios';

const stripePromise=loadStripe('pk_test_51KOxW9B3lRPqVGfj6kfHf1o6weOwfQKPKIP0CFdCWuoFOOjwpkP3UL3uGy6Vi57hz9PygO3luNVfb0iI90Jhq3sZ00EO0MwaWd');

function checkout ()  {
  const items = useSelector(selectItems);
  const {data: session} =useSession();
  const total=useSelector(selectTotal);

  const createCheckoutSession= async() => {
    const stripe = await stripePromise;
    
    //call the backend to create a checkout session
    const checkoutSession = await axios.post("/api/createCheckoutSession", 
      {
        items: items,
        email: session.user.email,
      });
      //redirect user to checkout
      const result = await stripe.redirectToCheckout({
        sessionId: checkoutSession.data.id
      })
      if (result.error) {
        alert(result.error.message);
      }
  };
  return (
    <div className="bg-gray-100">
      <Header />
      <main className="lg:flex max-w-screen-2xl mx-auto">
       
        {/* left */}
        <div className="flex-grow m-5 shadow-sm">
            <Image src="https://links.papareact.com/ikj"
                width={1020}
                height={250}
                objectFit="contain"
            />
            <div className="flex flex-col p-5 space-y-10 bg-white">
              <h1 className="text-3xl border-b pb-4">
                  { items.length === 0 ? "Your Amazon Basket is Empty.": `Shopping Basket (${items.length})`}
              </h1>
                
              {items.map((item, i) => (
                <CheckOutProduct 
                  key={i}
                  id={item.id}
                  title={item.title}
                  rating={item.rating}
                  price={item.price}
                  description={item.description}
                  category={item.category}
                  image={item.image}
                  hasPrime={item.hasPrime}
                />
              ))}  
            </div>
          </div>

        {/*right cost*/}
        <div className=" flex flex-col bg-white p-10 shadow-md">
          {items.length >0 && (
            <>
              <h2 className="whitespace-nowrap"> Subtotal ({items.length}) items:
                <span className="font-bold mb-5">
                  <strong>$ {total}</strong>
                </span>
                {/*
                <span className="font-bold">
                  <Currency quantity={total} />
                </span>
                */}
              </h2>
              <button 
              role="link"
              onClick={createCheckoutSession}
              disabled= {!session}
              className= {`button mt-2 ${ 
                !session && 
                "from-gray-300 to-gray-500 border-gray-200 text-gray-300 cursor-not-allowed"
              }`}
              >
                { !session ? "Sign in to check out" : "Proceed to checkout"}
              </button>
            </>
          )}
        </div>
      <div />
    </main>
  </div>
  );
}

export default checkout;
