"use client";

import convertToSubcurrency from "@/lib/convertToSubcurrency";
import {
  PaymentElement,
  useElements,
  useStripe,
} from "@stripe/react-stripe-js";
import { FormEvent, useEffect, useState } from "react";
import Spinner from "./Spinner";

export default function CheckoutPage({ amount }: { amount: number }) {
  const stripe = useStripe(); //podemos acceder a metodos del componente de stripe donde realizamos el pago.
  const elements = useElements(); //Los datos que utilizamos en el formulario ya que donde pagamos es un componente de stripe.

  const [errorMessage, setErrorMessage] = useState<string>(); //Para manejo de errores
  const [clientSecret, setClientSecret] = useState(""); //clientSecret es responsable de procesar los pagos dependiendo del metodo de pago que seleccionemos
  const [loading, setLoading] = useState(false); //manejar las cargas cuando realicemos el lpago

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    if (!stripe || !elements) {
      return;
    }
    const { error: submitError } = await elements.submit();

    if (submitError) {
      setErrorMessage(submitError.message);
      setLoading(false);
      return;
    }
    //Basicamente lo que hacemos con Stripe es que prepare un pago para nosotros de esa manera
    //cuando el usuario procede y lo confirma cargara su tarjeta en consecuencia
    const { error } = await stripe.confirmPayment({
      elements, //los datos de la  tarjeta
      clientSecret, //client secret
      confirmParams: {
        //si todo salio bien podemos seguir adelante y redirigir el rumbo a la url
        return_url: `http://localhost:3000/payment-success?amount=${amount}`,
      },
    });

    if (error) {
      //Este error es cuando el unico error alcanzable es de los datos de la tarjeta.
      //Muestra errores como detalles del pago incompletos.
      setErrorMessage(error.message);
    } else {
      //La UI del pago se cierra automaticamente con una animacion de success
      //La persona is redirigida a ru  `return_url`
    }
    setLoading(false);
  };
  
  useEffect(() => {
    fetch("/api/create-payment-intent", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ amount: convertToSubcurrency(amount) }),
    })
      .then((res) => res.json())
      .then((data) => setClientSecret(data.clientSecret));
  }, [amount]);

  if (!clientSecret || !stripe || !elements) {
    return <Spinner />;
  }

  return (
    <form onSubmit={handleSubmit} className="bg-white p-10 rounded-xl">
      {clientSecret && <PaymentElement />}
      {errorMessage && <div>{errorMessage}</div>}
      <button
        disabled={!stripe || loading}
        className="bg-black p-5 mt-5 w-[300px] font-bold rounded-xl hover:bg-gray-900"
      >
        {!loading ? `Pay $${amount}` : <Spinner />}
      </button>
    </form>
  );
}
