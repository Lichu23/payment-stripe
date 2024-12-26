"use server";
import { NextRequest, NextResponse } from "next/server";
//esto pasara solo en el server
//esto va a ser la API endpoint donde solo vamos a aceptar POST reuquests

//config de nuestro stripe que le hacce un require a nuestra dependencia llamada "stripe" e invocamos nuestra secret key
const stripe = require("stripe")(process.env.STRIPE_SECRET_KEY);

export async function POST(request: NextRequest) {
  try {
    //asumimos que el user pasa una cantidad en este caso de dinero en el body
    const { amount } = await request.json();
    //Necesitamos decirle a Stripe que estamos a punto de realizar un pago a la cuenta de Stripe asi que creamos algo 
    // llamado payment intent para decir stripe.paymentIntents.create que le vamos a pasar un monto
    const paymentIntent = await stripe.paymentIntents.create({
      amount: amount, //el monto que pasamos desde el cliente
      currency: "usd",
      automatic_payment_methods: { enabled: true }, //detecta basado el navegador del usuario y configura que metodo de pago esta disponible
    });
    //ahora una vez que esta todo ok necesitamos enviar devuelta la client secret
    //asi que solamente necesitamos retornar la respuesta donde esta el client secret
    return NextResponse.json({ clientSecret: paymentIntent.client_secret });
    
  } catch (error) {
    console.log("Internal Error", error);

    return NextResponse.json(
      { error: `Internal Server Error: ${error}` },
      { status: 500 }
    );
  }
}
