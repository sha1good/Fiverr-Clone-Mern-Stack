import React from "react";
import "./MyGigs.scss";
import { Link } from "react-router-dom";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import newRequest from "../../utils/newRequest";
import getCurrrentUser from "../../utils/getCurrentUser";

const MyGigs = () => {
  const currentUser = getCurrrentUser();
  const queryClient = useQueryClient();

  const { isLoading, error, data } = useQuery({
    queryKey: ["myGigs"],
    queryFn: () =>
      newRequest.get(`/gigs?userId=${currentUser._id}`).then((res) => {
        return res.data;
      }),
  });

  const mutation = useMutation({
    mutationFn: (id) => newRequest.delete(`/gigs/${id}`),
    onSuccess: () => queryClient.invalidateQueries(["myGigs"]),
  });

  const handleDelete = (id) => {
    mutation.mutate(id);
  };

  return (
    <div className="myGigs">
      {isLoading ? (
        "Loading..."
      ) : error ? (
        "Something went wrong"
      ) : (
        <div className="container">
          <div className="title">
            <h1>Gigs</h1>
            <Link to="/add" className="link">
              <button>Add New Gigs</button>
            </Link>
          </div>
          <table>
            <thead>
              <tr>
                <th>Image</th>
                <th>Title</th>
                <th>Price</th>
                <th>Sales</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              {data.map((gig) => (
                <tr key={gig._id}>
                  <td>
                    <img src={gig?.coverImg} alt="" className="img" />
                  </td>
                  <td>{gig?.title}</td>
                  <td>
                    {gig?.price}
                    <sup>99</sup>
                  </td>
                  <td>{gig?.sales}</td>
                  <td>
                    <img
                      src="/img/delete.png"
                      alt=""
                      className="deleteButton"
                      onClick={() => handleDelete(gig._id)}
                    />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default MyGigs;
