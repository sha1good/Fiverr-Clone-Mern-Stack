import { useQuery } from "@tanstack/react-query";
import React from "react";
import newRequest from "../../utils/newRequest";
import "./Review.scss";

const Review = ({ review }) => {
  const { isLoading, error, data } = useQuery({
    queryKey: [review.userId],
    queryFn: () =>
      newRequest.get(`/users/${review.userId}`).then((res) => {
        return res.data;
      }),
  });
  return (
    <div className="reivew">
      {isLoading ? (
        "loading"
      ) : error ? (
        "error exist"
      ) : (
        <div className="user">
          <img src={data?.img || "/img/noavatar.jpg"} alt="" className="pp" />
          <div className="info">
            <span>{data?.username}</span>
            <div className="country">
              {/* <img
              src="https://fiverr-dev-res.cloudinary.com/general_assets/flags/1f1fa-1f1f8.png"
              alt=""
            /> */}
              <span>{data?.country}</span>
            </div>
          </div>
        </div>
      )}
      <div className="stars">
        {Array(review.stars)
          .fill()
          .map((item, i) => (
            <img src="/img/star.png" alt="" key={i} />
          ))}
        <span>{review.stars}</span>
      </div>
      <p>{review.desc}</p>
      <div className="helpful">
        <span>Helpful?</span>
        <img src="/img/like.png" alt="" />
        <span>Yes</span>
        <img src="/img/dislike.png" alt="" />
        <span>No</span>
      </div>
    </div>
  );
};

export default Review;
