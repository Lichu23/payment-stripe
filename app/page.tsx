"use client";

import CheckoutPage from "@/components/CheckoutPage";
import convertToSubcurrency from "@/lib/convertToSubcurrency";
import { Elements } from "@stripe/react-stripe-js";
import { loadStripe } from "@stripe/stripe-js";

if (process.env.NEXT_PUBLIC_STRIPE_PUBLIC_KEY === undefined) {
  throw new Error("NEXT_PUBLIC_STRIPE_PUBLIC_KEY is not defined");
}

const stripePromise = loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLIC_KEY);

export default function Home() {
  const amount = 50.0;
  return (
    <main className="lg:max-w-6xl md:w-screen sm:w-screen lg:h-full md:h-screen sm:h-screen mx-auto p-10 text-white text-center border m-10 rounded-md bg-gradient-to-l from-orange-500 to-black">
      <div className="mb-10">
        <h1 className="text-4xl font-extrabold mb-2">Soonny</h1>
        <h2 className="text-2xl">
          has requested <span className="font-bold">${amount}</span>
        </h2>
      </div>

      <Elements
        stripe={stripePromise}
        options={{
          mode: "payment",
          amount: convertToSubcurrency(amount),
          currency: "usd",
        }}
      >
        <CheckoutPage amount={amount} />
      </Elements>
    </main>
  );
}
