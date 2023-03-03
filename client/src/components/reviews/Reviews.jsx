import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import React, { useState } from "react";
import newRequest from "../../utils/newRequest";
import Review from "../review/Review";
import "./Reviews.scss";

const Reviews = ({ gigId }) => {
  const queryClient = useQueryClient();
  const [err, setErr] = useState(null);

  const { isLoading, error, data } = useQuery({
    queryKey: ["reviews"],
    queryFn: () =>
      newRequest.get(`/reviews/${gigId}`).then((res) => {
        return res.data;
      }),
  });

  const mutation = useMutation({
    mutationFn: (review) => {
      return newRequest.post("/reviews", review);
    },
    onSuccess: () => {
      queryClient.invalidateQueries(["reviews"]);
    },
    onError: (error) => {
      setErr(error?.response?.data);
    },
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    const desc = e.target[0].value;
    const stars = e.target[1].value;
    mutation.mutate({ gigId, desc, stars });
    e.target[0].value = "";
    e.target[1].value = "";
  };
  return (
    <div className="review">
      <h2>Reviews</h2>
      <hr />
      {isLoading
        ? "loading"
        : error
        ? "Something went wrong!"
        : data.map((review) => <Review key={review._id} review={review} />)}
      <div className="add">
        <h3>Add a Review</h3>
        <form onSubmit={handleSubmit} className="addForm">
          <input type="text" placeholder="write your opinion" />
          <select name="" id="">
            <option value={1}>1</option>
            <option value={2}>2</option>
            <option value={3}>3</option>
            <option value={4}>4</option>
            <option value={5}>5</option>
          </select>
          <button>Send</button>
          {err && <span>{err}</span>}
        </form>
      </div>
    </div>
  );
};

export default Reviews;
