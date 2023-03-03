import React, { useState } from "react";
import "./Register.scss";
import upload from "../../utils/upload.js";
import newRequest from "../../utils/newRequest";
import { useNavigate } from "react-router-dom";
const Register = () => {
  const navigate = useNavigate();

  const [user, setUser] = useState({
    username: "",
    email: "",
    password: "",
    img: "",
    country: "",
    isSeller: false,
    phone: "",
    desc: "",
  });

  const [file, setFile] = useState(null);
  const [error, setError] = useState(null);

  const handleChange = (e) => {
    setUser((prev) => {
      return { ...prev, [e.target.name]: e.target.value };
    });
  };

  const handleSeller = (e) => {
    setUser((prev) => {
      return { ...prev, isSeller: e.target.checked };
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const url = await upload(file);
    try {
      await newRequest.post("/auth/register", {
        ...user,
        img: url,
      });

      navigate("/login");
    } catch (error) {
      console.log(error);
      setError(error.response.data);
    }
  };

  return (
    <div className="register">
      <form onSubmit={handleSubmit}>
        <div className="left">
          <h1>Create an account</h1>
          <label htmlFor="username">Username</label>
          <input
            type="text"
            name="username"
            placeholder="John"
            onChange={handleChange}
          />
          <label htmlFor="email">Email</label>
          <input
            type="email"
            name="email"
            placeholder="JohnDoe@gmail.com"
            onChange={handleChange}
          />
          <label htmlFor="password">Password</label>
          <input type="password" name="password" onChange={handleChange} />
          <label htmlFor="pPic">Profile Picture</label>
          <input type="file" onChange={(e) => setFile(e.target.files[0])} />
          <label htmlFor="country">Country</label>
          <input
            name="country"
            type="text"
            placeholder="USA"
            onChange={handleChange}
          />
          <button type="submit">Register</button>
          {error && <span>{error}</span>}
        </div>
        <div className="right">
          <h1>I want to become a seller</h1>
          <div className="toggle">
            <label>Activate the seller account</label>
            <label className="switch">
              <input type="checkbox" onChange={handleSeller} />
              <span className="slider round"></span>
            </label>
          </div>
          <label htmlFor="">Phone Number</label>
          <input
            type="text"
            name="phone"
            placeholder="+1 234 567 89"
            onChange={handleChange}
          />
          <label>Description</label>
          <textarea
            name="desc"
            placeholder="A short description of yourself"
            id=""
            cols="30"
            rows="10"
            onChange={handleChange}
          ></textarea>
        </div>
      </form>
    </div>
  );
};

export default Register;
