import { useQuery } from "@tanstack/react-query";
import React, { useEffect, useRef, useState } from "react";
import { useLocation } from "react-router-dom";
import GigCard from "../../components/gigCard/GigCard";
//import { gigs } from "../../data";
import newRequest from "../../utils/newRequest";
import "./Gigs.scss";

const Gigs = () => {
  const [open, setOpen] = useState(false);
  const [sort, setSort] = useState("sales");
  const minRef = useRef();
  const maxRef = useRef();

  const { search } = useLocation();

  //console.log(search);

  const { isLoading, error, data, refetch } = useQuery({
    queryKey: ["gigs"],
    queryFn: () =>
      newRequest
        .get(
          `/gigs/${search}&min=${minRef.current.value}&max=${maxRef.current.value}&sort=${sort}`
        )
        .then((res) => {
          return res.data;
        }),
  });

  //console.log(data);

  const reSort = (type) => {
    setSort(type);
    setOpen(false);
  };

  useEffect(() => {
    refetch();
  }, [sort]);

  const apply = () => {
    refetch();
  };

  return (
    <div className="gigs">
      <div className="container">
        <span className="breadcrumbs">
          Fiverr {">"} Graphics & Design {">"}
        </span>
        <h1>AI Artists</h1>
        <p>
          Explore the boundaries of art and technology with Fiverrs AI artists
        </p>

        <div className="menu">
          <div className="left">
            <span>Budget</span>
            <input type="number" ref={minRef} placeholder="min" />
            <input type="number" ref={maxRef} placeholder="max" />
            <button onClick={apply}>Apply</button>
          </div>
          <div className="right">
            <span className="sortBy">Sort By</span>
            <span className="sortType">
              {sort === "sales" ? "Best Selling" : "Newest"}
            </span>
            <img src="/img/down.png" alt="" onClick={() => setOpen(!open)} />
            {open && (
              <div className="rightMenu">
                {sort === "sales" ? (
                  <span onClick={() => reSort("createdAt")}>Newest</span>
                ) : (
                  <span onClick={() => reSort("sales")}>Best Selling</span>
                )}
                <span onClick={() => reSort("sales")}>Popular</span>
              </div>
            )}
          </div>
        </div>
        <div className="cards">
          {isLoading
            ? "loading..."
            : error
            ? "Something Went Wrong!"
            : data.map((gig) => <GigCard gig={gig} key={gig._id} />)}
        </div>
      </div>
    </div>
  );
};

export default Gigs;
