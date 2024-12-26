import React from "react";

export default function PaymentSuccess({
  searchParams: { amount },
}: {
  searchParams: { amount: string };
}) {
  return (
    <main className="lg:max-w-6xl md:w-screen sm:w-screen mx-auto p-10 text-white text-center border m-10 rounded-md bg-gradient-to-l from-orange-500 to-black">
      <div className="flex flex-col justify-center items-center gap-10 font-sans">
        <h1 className="text-3xl font-bold">Thank You!</h1>
        <h2 className="text-2xl">You successfully sent</h2>

        <div className="bg-white p-5 mt-5 w-[300px] rounded-xl  font-bold text-4xl text-black text-center">
          ${amount}
        </div>
      </div>
    </main>
  );
}
