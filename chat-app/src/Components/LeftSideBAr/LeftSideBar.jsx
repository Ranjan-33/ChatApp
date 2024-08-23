import React from "react";
import "./LeftSideBar.css";
import assets from "../../assets/assets";
import { logout } from "../../Config/firebase";
import { useNavigate } from "react-router-dom";
const LeftSideBar = () => {
  const naviagate = useNavigate();
  return (
    <div className="ls">
      <div className="ls-top">
        <div className="ls-nav">
          <img src={assets.logo} className="logo" alt="" />
          <div className="menu">
            <img src={assets.menu_icon} alt="" />
            <div className="sub-menu">
              <p onClick={() => naviagate("/profile")}>Edit profile </p>
              <hr />
              <p onClick={() => logout()}>Logout</p>
            </div>
          </div>
        </div>
        <div className="ls-search">
          <img src={assets.search_icon} alt="" />
          <input type="text" placeholder="Search here" />
        </div>
      </div>
      <div className="ls-list">
        {Array(12)
          .fill("")
          .map((item, index) => (
            <div key={index} className="friends">
              <img src={assets.profile_img} alt="" className="hover-zoom" />
              <div>
                <p>Richard</p>
                <span>Heloo how are you ?</span>
              </div>
            </div>
          ))}
      </div>
    </div>
  );
};

export default LeftSideBar;
