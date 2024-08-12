import React from "react";
import "./Chat.css";
import ChatBox from "../../Components/ChatBox/ChatBox";
import RightSideBar from "../../Components/RightSideBar/RightSideBar";
import LeftSideBar from "../../Components/LeftSideBAr/LeftSideBar";
const Chat = () => {
  return (
    <div className="chat">
      <div className="chat-container">
        <LeftSideBar></LeftSideBar>
        <ChatBox></ChatBox>
        <RightSideBar></RightSideBar>
      </div>
      ;
    </div>
  );
};

export default Chat;
