import React, { useContext, useState } from "react";
import "./LeftSideBar.css";
import assets from "../../assets/assets";
import { db, logout } from "../../Config/firebase";
import { useNavigate } from "react-router-dom";
import { collection, query, where } from "firebase/firestore";
import { AppContext } from "../../Context/AppContext";
import { getDocs } from "firebase/firestore";
const LeftSideBar = () => {
  const naviagate = useNavigate();
  const { userData } = useContext(AppContext);
  const [user, setUser] = useState(null);
  const [showSearch, setShowSearch] = useState(false);

  const inputHandler = async (e) => {
    try {
      const input = e.target.value;
      if (input) {
        setShowSearch(true);
        const userRef = collection(db, "users");
        const q = query(userRef, where("username", "==", input.toLowerCase()));
        const querySnap = await getDocs(q);
        if (!querySnap.empty && querySnap.docs[0].data().id !== userData.id) {
          setUser(querySnap.docs[0].data());
        } else {
          setUser(null);
        }
      } else {
        setShowSearch(false);
      }
    } catch (error) {
      console.error("Error searching user:", error);
    }
  };
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
          <input
            onChange={inputHandler}
            type="text"
            placeholder="Search here"
          />
        </div>
      </div>
      <div className="ls-list">
        {showSearch && user ? (
          <div className="friends add-user">
            <img src={user.avatar} alt="" />
            <p>{user.name}</p>
          </div>
        ) : (
          Array(12)
            .fill("")
            .map((item, index) => (
              <div key={index} className="friends">
                <img src={assets.profile_img} alt="" className="hover-zoom" />
                <div>
                  <p>Richard</p>
                  <span>Heloo how are you ?</span>
                </div>
              </div>
            ))
        )}
      </div>
    </div>
  );
};

export default LeftSideBar;
