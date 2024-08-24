import "./ChatBox.css";
import assets from "../../assets/assets";
import { useContext, useState, useEffect } from "react";
import { AppContext } from "../../Context/AppContext";
import { doc, onSnapshot, updateDoc, getDoc } from "firebase/firestore";
import { db } from "../../Config/firebase";
import { arrayUnion } from "firebase/firestore/lite";
import { toast } from "react-toastify";
const ChatBox = () => {
  const { userData, messagesId, chatUser, messages, setMessages } =
    useContext(AppContext);
  const [input, setInput] = useState("");

  // message field

  return chatUser ? (
    <div className="chat-box">
      <div className="chat-user">
        <img src={chatUser.userData.avatar} alt="" />
        <p>
          {chatUser.userData.name}{" "}
          <img className="dot" src={assets.green_dot} alt="" />
        </p>
        <img src={assets.help_icon} className="help" alt="" />
      </div>
      <div className="chat-msg">
        <div className="s-msg">
          <p className="msg">
            {" "}
            Lorem ipsum dolor consectetur Lorem ipsum dolor sit amet. ....
          </p>
          <div>
            <img src={assets.profile_img} alt="" />
            <p>2:30 PM</p>
          </div>
        </div>
        <div className="s-msg">
          <img className="msg-img" src={assets.pic1} alt="" />
          <div>
            <img src={assets.profile_img} alt="" />
            <p>2:30 PM</p>
          </div>
        </div>
        <div className="r-msg">
          <p className="msg"> Lorem ipsum dolor consectetur ....</p>
          <div>
            <img src={assets.profile_img} alt="" />
            <p>2:30 PM</p>
          </div>
        </div>
      </div>
      <div className="chat-input">
        <input
          onChange={(e) => setInput(e.target.value)}
          value={input}
          type="text"
          placeholder="send  a message"
        />
        <input type="file" id="image" accept="image/png , image/jpeg" hidden />
        <label htmlFor="image">
          <img src={assets.gallery_icon} alt="" />
        </label>
        <img src={assets.send_button} alt="" />
      </div>
    </div>
  ) : (
    <div className="chat-welcome">
      <img src={assets.logo_icon} alt="" />
      <p>Chat Anytime Anywhere </p>
    </div>
  );
};

export default ChatBox;
