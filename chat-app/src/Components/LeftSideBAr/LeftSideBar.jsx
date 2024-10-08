import React, { useContext, useState, useEffect } from "react";
import "./LeftSideBar.css";
import assets from "../../assets/assets";
import { db, logout } from "../../Config/firebase";
import { useNavigate } from "react-router-dom";
import {
  arrayUnion,
  collection,
  doc,
  getDoc,
  query,
  serverTimestamp,
  setDoc,
  updateDoc,
  where,
} from "firebase/firestore";
import { AppContext } from "../../Context/AppContext";
import { getDocs } from "firebase/firestore";
import { toast } from "react-toastify";
const LeftSideBar = () => {
  const naviagate = useNavigate();
  const {
    userData,
    chatData,
    chatUser,
    setChatUser,
    setMessagesId,
    messageId,
    chatVisible,
    setChatVisible,
  } = useContext(AppContext);
  const [user, setUser] = useState(null);
  const [showSearch, setShowSearch] = useState(false);

  // inputhandler
  const inputHandler = async (e) => {
    try {
      const input = e.target.value;
      if (input) {
        setShowSearch(true);
        const userRef = collection(db, "users");
        const q = query(userRef, where("username", "==", input.toLowerCase()));
        const querySnap = await getDocs(q);

        if (!querySnap.empty && querySnap.docs[0].data().id !== userData.id) {
          let userExit = false;

          //  check if the user exists in the chating
          for (let user of chatData) {
            if (user.rId === querySnap.docs[0].data().id) {
              userExit = true;
              break; // Exit the loop as soon as a match is found
            }
          }

          if (!userExit) {
            setUser(querySnap.docs[0].data());
          } else {
            setUser(null); // checking the user must not repeat
          }
        } else {
          setUser(null);
        }
      } else {
        setShowSearch(false);
      }
    } catch (error) {
      toast.error(error.message);
      console.error("Error searching user:", error);
    }
  };

  // adding user  in search list
  const addChat = async () => {
    const messagesRef = collection(db, "messages");
    const chatsRef = collection(db, "chats");

    try {
      const newMessageRef = doc(messagesRef);
      await setDoc(newMessageRef, {
        createAt: serverTimestamp(),
        messages: [],
      });

      await updateDoc(doc(chatsRef, user.id), {
        chatsData: arrayUnion({
          messageId: newMessageRef.id,
          lastMessage: "",
          rId: userData.id,
          updatedAt: Date.now(),
          messageSeen: true,
        }),
      });
      await updateDoc(doc(chatsRef, userData.id), {
        chatsData: arrayUnion({
          messageId: newMessageRef.id,
          lastMessage: "",
          rId: user.id,
          updatedAt: Date.now(),
          messageSeen: true,
        }),
      });
    } catch (error) {
      toast.error(error.messages);
      console.error(error);
    }
  };

  // showing user chats

  /* const setChat = async (item) => {
    setMessagesId(item.messageId);
    setChatUser(item);
    console.log(item);
  }; */
  const setChat = async (item) => {
    try {
      console.log("Setting messagesId:", item.messageId); // Check if messagesId is available
      if (!item.messageId) {
        console.error("Error: messagesId is undefined!");
      }
      setMessagesId(item.messageId); // Make sure this line correctly updates state
      setChatUser(item); // Set the chat user

      const userChatsRef = doc(db, "chats", userData.id);
      const userChatSnapshot = await getDoc(userChatsRef);
      const userChatData = userChatSnapshot.data();
      const chatIndex = userChatData.chatsData.findIndex(
        (c) => c.messageId === item.messageId
      );
      userChatData.chatsData[chatIndex].messageSeen = true;
      await updateDoc(userChatsRef, {
        chatsData: userChatData.chatsData,
      });
      setChatVisible(true);
    } catch (error) {
      toast.error(error.message);
    }
  };

  return (
    <div className={`ls ${chatVisible ? "hidden" : " "}`}>
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
          <div onClick={addChat} className="friends add-user">
            <img src={user.avatar} alt="" />
            <p>{user.name}</p>
          </div>
        ) : (
          chatData.map((item, index) => (
            <div
              onClick={() => setChat(item)}
              key={index}
              className={`friends ${
                item.messageSeen || item.messageId === messageId ? "" : "border"
              }`}
            >
              <img src={item.userData.avatar} alt="" className="hover-zoom" />
              <div>
                <p>{item.userData.name}</p>
                <span>{item.lastMessage} </span>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default LeftSideBar;
