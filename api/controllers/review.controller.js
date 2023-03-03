import { createError} from "../utils/createError.js";
import Review from "../models/review.model.js";
import Gig from "../models/gig.model.js";

export const createReview = async (req, res, next) => {
  if (req.isSeller)
    return next(createError(403, "Sellers can't create a review!"));

  const newReview = new Review({
    userId: req.userId,
    gigId: req.body.gigId,
    desc: req.body.desc,
    stars: req.body.stars,
  });

  try {
    const review = await Review.findOne({
      gigId: req.body.gigId,
      userId: req.userId,
    });
    if (review)
      return next(
        createError(403, "You have already created a review for this gig!")
      );

    const saveReview = await newReview.save();
    //Update the Review for our gig
    await Gig.findByIdAndUpdate(req.body.gigId, {
      $inc: { totalStars: req.body.stars, stars: 1 },
    });
    res.status(200).send(saveReview);
  } catch (error) {
    return next(error);
  }
};
export const getReviews = async (req, res, next) => {
  try {
    const reviews = await Review.find({ gigId: req.params.gigId });
    res.status(200).send(reviews);
  } catch (error) {
    return next(error);
  }
};
export const deleteReview = async (req, res, next) => {
  try {
    await Review.findByIdAndDelete(req.params.id);
    res.status(200).send("Review has been deleted!");
  } catch (error) {
    next(error);
  }
};
