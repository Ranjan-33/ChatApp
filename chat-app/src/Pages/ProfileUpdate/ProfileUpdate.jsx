import React from "react";
import "./ProfileUpdate.css";
import assets from "../../assets/assets";

const ProfileUpdate = () => {
  return (
    <div className="profile">
      <div className="profile-container">
        <form>
          <h3>Profile Detals</h3>
          <label htmlFor="avatar">
            <input type="file" id="avatar" accept=".png, .jpg, .jpeg " hidden />
            <img src={assets.avatar_icon} alt="" />
            upload profile picture
          </label>
          <input type="text" placeholder="Your name " required />
          <textarea placeholder="Write Profile Bio " required></textarea>
          <button type="submit">Save</button>
        </form>
        <img className="profile-pic" src={assets.logo_icon} alt="" />
      </div>
    </div>
  );
};

export default ProfileUpdate;
