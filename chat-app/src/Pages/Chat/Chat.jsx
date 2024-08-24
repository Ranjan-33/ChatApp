import React, { useEffect, useContext, useState } from "react";
import "./Chat.css";
import ChatBox from "../../Components/ChatBox/ChatBox";
import RightSideBar from "../../Components/RightSideBar/RightSideBar";
import LeftSideBar from "../../Components/LeftSideBAr/LeftSideBar";
import { AppContext } from "../../Context/AppContext";

const Chat = () => {
  const { chatData, userData } = useContext(AppContext);
  const [loading, setLoading] = useState(true);
  useEffect(() => {
    if (chatData && userData) {
      setLoading(false);
    }
  }, [chatData, userData]);
  return (
    <div className="chat">
      {loading ? (
        <p className="loading"> loading.....</p>
      ) : (
        <div className="chat-container">
          <LeftSideBar></LeftSideBar>
          <ChatBox></ChatBox>
          <RightSideBar></RightSideBar>
        </div>
      )}
      ;
    </div>
  );
};

export default Chat;
