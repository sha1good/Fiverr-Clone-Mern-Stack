import React from "react";
import "./GigCard.scss";
import { Link } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import newRequest from "../../utils/newRequest";

function GigCard({ gig }) {
  const { isLoading, error, data } = useQuery({
    queryKey: [gig.userId],
    queryFn: () =>
      newRequest.get(`/users/${gig.userId}`).then((res) => {
        return res.data;
      }),
  });

  return (
    <Link to={`/gig/${gig._id}`} className="link">
      <div className="gigCard">
        <img src={gig?.coverImg} alt="" />
        <div className="info">
          {isLoading ? (
            "Loading"
          ) : error ? (
            "Something gone wrong!"
          ) : (
            <div className="user">
              <img src={data?.img || "/img/noavatar.jpg"} alt="" />
              <span>{data?.username}</span>
            </div>
          )}
          <p>{gig.title}</p>
          <div className="star">
            <img src="./img/star.png" alt="" />
            <span>
              {!isNaN(gig.totalStars / gig.stars) &&
                Math.round(gig.totalStars / gig.stars)}
            </span>
          </div>
        </div>
        <hr />
        <div className="details">
          <img src="./img/heart.png" alt="" />
          <div className="price">
            <span>STARTING AT</span>
            <h2>
              {" "}
              $ {gig?.price} <sup>99</sup>
            </h2>
          </div>
        </div>
      </div>
    </Link>
  );
}

export default GigCard;
