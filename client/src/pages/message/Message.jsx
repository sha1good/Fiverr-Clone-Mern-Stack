import "./Message.scss";
import React from "react";
import { Link, useParams } from "react-router-dom";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import newRequest from "../../utils/newRequest.js";

const Message = () => {
  const { id } = useParams();
  const currentUser = JSON.parse(localStorage.getItem("currentUser"));
  const queryClient = useQueryClient();

  const { isLoading, error, data } = useQuery({
    queryKey: ["messages"],
    queryFn: () =>
      newRequest.get(`/messages/${id}`).then((res) => {
        return res.data;
      }),
  });

  const mutation = useMutation({
    mutationFn: (message) => newRequest.post(`/messages`, message),
    onSuccess: () => queryClient.invalidateQueries(["messages"]),
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    mutation.mutate({
      conversationId: id,
      desc: e.target[0].value,
    });
    e.target[0].value = "";
  };
  return (
    <div className="message">
      {isLoading ? (
        "Loading..."
      ) : error ? (
        "Error has occurred"
      ) : (
        <div className="container">
          <span className="breadcrumbs">
            <Link to="/messages" className="link">
              Messages
            </Link>{" "}
            {">"} John Doe {">"}
          </span>
          <div className="messages">
            {data?.map((message) => (
              <div
                className={
                  message.userId === currentUser._id ? "item owner" : "item"
                }
                key={message._id}
              >
                <img
                  src={
                    currentUser?.img ||
                    "https://images.pexels.com/photos/270408/pexels-photo-270408.jpeg?auto=compress&cs=tinysrgb&w=1600"
                  }
                  alt=""
                />
                <p>{message?.desc}</p>
              </div>
            ))}
            <hr />
            <form className="write" onSubmit={handleSubmit}>
              <textarea type="text" placeholder="write a message" />
              <button type="submit">send</button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default Message;
