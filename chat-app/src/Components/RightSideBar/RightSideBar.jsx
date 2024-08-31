import React, { useContext, useReducer, useState, useEffect } from "react";
import "./RightSideBar.css";
import assets from "../../assets/assets";

import "./RightSideBar";
import { logout } from "../../Config/firebase";
import { AppContext } from "../../Context/AppContext";
const RightSideBar = () => {
  const { chatUser, messages } = useContext(AppContext);
  const [msgImages, setMsgImages] = useState([]);
  useEffect(() => {
    let tempVar = [];
    messages.map((msg) => {
      if (msg.image) {
        tempVar.push(msg.image);
      }
    });
    setMsgImages(tempVar);
  }, [messages]);
  return chatUser ? (
    <div className="rs">
      <div className="rs-profile">
        <img src={chatUser.userData.avatar} alt="" />
        <h3>
          {Date.now() - chatUser.userData.lastSeen <= 70000 ? (
            <img className="dot" src={assets.green_dot} alt="" />
          ) : null}
          {chatUser.userData.name}
        </h3>
        <p> {chatUser.userData.bio}</p>
      </div>
      <hr />
      <div className="rs-media">
        <p>Media</p>

        <div>
          {msgImages.map((url, index) => (
            <img
              onClick={() => window.open(url)}
              key={index}
              src={url}
              alt=""
            ></img>
          ))}
          {/* <img src={assets.pic1} alt="" />
          <img src={assets.pic2} alt="" />
          <img src={assets.pic3} alt="" />
          <img src={assets.pic4} alt="" />
          <img src={assets.pic2} alt="" />
          <img src={assets.pic1} alt="" /> */}
        </div>
      </div>
      <button className="logout" onClick={() => logout()}>
        {" "}
        Logout
      </button>
    </div>
  ) : (
    <div className="rs ">
      <button className="logout" onClick={() => logout()}>
        {" "}
        Logout{" "}
      </button>
    </div>
  );
};

export default RightSideBar;
