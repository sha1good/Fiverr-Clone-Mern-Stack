import { createError } from "../utils/createError.js";
import Order from "../models/order.model.js";
import Gig from "../models/gig.model.js";
import Stripe from "stripe";

export const intent = async (req, res) => {
  const stripe = new Stripe(process.env.STRIPE_KEY);

  const gig = await Gig.findById(req.params.id);

  const paymentIntent = await stripe.paymentIntents.create({
    amount: gig.price * 100,
    currency: "usd",
    automatic_payment_methods: {
      enabled: true,
    },
  });

  const newOrder = new Order({
    gigId: gig._id,
    img: gig.coverImg,
    price: gig.price,
    title: gig.title,
    buyerId: req.userId,
    sellerId: req.userId,
    payment_intent: paymentIntent.id,
  });
  await newOrder.save();
  return res.status(200).send({
    clientSecret: paymentIntent.client_secret,
  });
};

// export const createOrder = async (req, res, next) => {
//   const gig = await Gig.findById(req.params.gigId);

//    //console.log(gig);
//   const newOrder = new Order({
//     gigId: gig._id,
//     img: gig.coverImg,
//     price: gig.price,
//     title: gig.title,
//     buyerId: req.userId,
//     sellerId: req.userId,
//     payment_intent: "temporary",
//   });
//   try {
//     await newOrder.save();
//     res.status(200).send("Successfully Created");
//   } catch (error) {
//     next(error);
//   }
// };

export const confirm = async (req, res, next) => {
  try {
    await Order.findOneAndUpdate(
      { payment_intent: req.body.payment_intent },
      { $set: { isCompleted: true } }
    );
    res.status(200).send("Order has been confirmed.");
  } catch (error) {
    next(error);
  }
};

//Order must have been completed before getting Orders details
export const getOrders = async (req, res, next) => {
  try {
    const order = await Order.find({
      ...(req.isSeller ? { sellerId: req.userId } : { buyerId: req.userId }),
      isCompleted: true,
    });
    res.status(200).send(order);
  } catch (error) {
    next(error);
  }
};
