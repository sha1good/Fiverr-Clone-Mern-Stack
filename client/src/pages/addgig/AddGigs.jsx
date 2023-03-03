import "./AddGigs.scss";
import React, { useReducer, useState } from "react";
import { gigReducer, INITIAL_STATE } from "../../reducers/gigReducer";
import upload from "../../utils/upload";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import newRequest from "../../utils/newRequest";
import { useNavigate } from "react-router-dom";

const AddGigs = () => {
  const [singleFile, setSingleFile] = useState(undefined);
  const [files, setFiles] = useState(undefined);
  const [uploading, setUplaoding] = useState(false);

  const [state, dispatch] = useReducer(gigReducer, INITIAL_STATE);

  const handleChange = (event) => {
    dispatch({
      type: "CHANGE_INPUT",
      payload: { name: event.target.name, value: event.target.value },
    });
  };

  const handleUpload = async () => {
    setUplaoding(true);
    try {
      const coverImg2 = await upload(singleFile);

      const images2 = await Promise.all(
        [...files].map(async (file) => {
          const url = await upload(file);
          return url;
        })
      );
      setUplaoding(false);
      dispatch({
        type: "ADD_IMAGES",
        payload: { coverImg: coverImg2, images: images2 },
      });
    } catch (error) {
      console.log(error);
    }
  };

  // console.log([...files])

  const handleFeature = (event) => {
    event.preventDefault();
    dispatch({ type: "ADD_FEATURES", payload: event.target[0].value });
    event.target[0].value = "";
  };

  const queryClient = useQueryClient();
  const navigate = useNavigate();

  const mutation = useMutation({
    mutationFn: (gig) => newRequest.post(`/gigs`, gig),
    onSuccess: () => queryClient.invalidateQueries(["myGigs"]),
  });

  const handleSubmit = (event) => {
    event.preventDefault();
    mutation.mutate(state);
    navigate("/myGigs");
  };

  console.log(state);
  return (
    <div className="addGig">
      <div className="container">
        <h1>Add New Gig</h1>
        <div className="sections">
          <div className="left">
            <label htmlFor="title">Title</label>
            <input
              type="text"
              placeholder="e.g. I will do something I'm really good at"
              name="title"
              onChange={handleChange}
            />
            <label htmlFor="category">Category</label>
            <select name="cat" id="category" onChange={handleChange}>
              <option value="design">Design</option>
              <option value="web">Web Development</option>
              <option value="animation">Animation</option>
              <option value="music">Music</option>
            </select>
            <div className="images">
              <div className="imagesInput">
                <label htmlFor="coverImg">Cover Image</label>
                <input
                  type="file"
                  id="coverImg"
                  onChange={(e) => setSingleFile(e.target.files[0])}
                />
                <label htmlFor="uploadImg">Upload Images</label>
                <input
                  type="file"
                  id="uploadImg"
                  multiple
                  onChange={(e) => setFiles(e.target.files)}
                />
              </div>
              <button onClick={handleUpload}>
                {uploading ? "Uploading" : "Upload"}
              </button>
            </div>
            <label htmlFor="description">Description</label>
            <textarea
              name="desc"
              id="description"
              placeholder="Brief descriptions to introduce your service to customers"
              cols="0"
              rows="16"
              onChange={handleChange}
            />
            <button onClick={handleSubmit} disabled={uploading}>
              Create
            </button>
          </div>
          <div className="right">
            <label htmlFor="sTitle">Service Title</label>
            <input
              type="text"
              name="shortTitle"
              placeholder="e.g. One-page web design"
              onChange={handleChange}
            />
            <label htmlFor="sDesc">Short Description</label>
            <textarea
              name="shortDesc"
              placeholder="Short description of your service"
              cols="30"
              rows="10"
              onChange={handleChange}
            />
            <label htmlFor="dTime">Delivery Time (e.g. 3 days)</label>
            <input type="number" name="deliveryTime" onChange={handleChange} />
            <label htmlFor="rNumber">Revision Number</label>
            <input
              type="number"
              name="revisionNumber"
              onChange={handleChange}
            />
            <label htmlFor="addFeatures">Add Features</label>
            <form className="add" onSubmit={handleFeature}>
              <input type="text" placeholder="e.g. page design" />
              <button type="submit">add</button>
            </form>
            <div className="addedFeatures">
              {state?.features?.map((feature) => (
                <div className="item" key={feature}>
                  <button
                    onClick={() =>
                      dispatch({ type: "REMOVE_FEATURES", payload: feature })
                    }
                  >
                    {feature}
                    <span>X</span>
                  </button>
                </div>
              ))}
            </div>
            <label htmlFor="price">Price</label>
            <input
              type="number"
              id="price"
              name="price"
              onChange={handleChange}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default AddGigs;
