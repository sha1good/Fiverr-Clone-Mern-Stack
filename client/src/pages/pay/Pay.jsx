import { loadStripe } from "@stripe/stripe-js";
import { Elements } from "@stripe/react-stripe-js";
import newRequest from "../../utils/newRequest";
import "./Pay.scss";
import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import CheckoutForm from "../../components/checkOutForm/CheckoutForm";

//stripe has to be loaded at the top of the page

const stripePromise = loadStripe(
  "pk_test_51M1Bm9B9zyhx24DfdImjYTbJfDzbCUlqLmQGFFNyAgmVZ0qxB7qjcSryTc129JHYWd3FBoZp1ABqWVWXym2788TJ004QU6HHHs"
);

const Pay = () => {
  const [clientSecret, setClientSecret] = useState("");

  const { id } = useParams();

  useEffect(() => {
    const makeRequest = async () => {
      try {
        const res = await newRequest.post(
          `/orders/create-payment-intent/${id}`
        );
        setClientSecret(res.data.clientSecret);
      } catch (error) {
        console.log(error);
      }
    };
    makeRequest();
  }, []);

  const appearance = {
    theme: "stripe",
  };

  const options = {
    clientSecret,
    appearance,
  };
  return (
    <div className="pay">
      {clientSecret && (
        <Elements options={options} stripe={stripePromise}>
          <CheckoutForm />
        </Elements>
      )}
    </div>
  );
};

export default Pay;
