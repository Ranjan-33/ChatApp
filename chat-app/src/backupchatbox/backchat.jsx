/*
import "./ChatBox.css";
import assets from "../../assets/assets";
import { useContext, useState, useEffect } from "react";
import { AppContext } from "../../Context/AppContext";
import {
  doc,
  onSnapshot,
  updateDoc,
  getDoc,
  arrayUnion,
} from "firebase/firestore";
import { db } from "../../Config/firebase";
import { toast } from "react-toastify";

const ChatBox = () => {
  const { userData, messageId, chatUser, messages, setMessages } =
    useContext(AppContext);
  const [input, setInput] = useState("");

  // Function to send a message
  const sendMessage = async () => {
    try {
      if (input && messageId) {
        // Update the messages document in Firestore
        await updateDoc(doc(db, "messages", messageId), {
          messages: arrayUnion({
            sId: userData.id,
            text: input,
            createdAt: new Date(), // Corrected to new Date()
          }),
        });

        // Update chat data for both users
        const userIDs = [chatUser.rId, userData.id];
        for (const id of userIDs) {
          const userChatsRef = doc(db, "chats", id);
          const userChatSnapshot = await getDoc(userChatsRef);

          if (userChatSnapshot.exists()) {
            const userChatData = userChatSnapshot.data();
            console.log("User chat data:", userChatData); // Log for debugging

            const chatIndex = userChatData.chatsData.findIndex(
              (c) => c.messageId === messageId // Ensure correct property name
            );

            if (chatIndex !== -1) {
              // Ensure chatIndex is valid
              userChatData.chatsData[chatIndex].lastMessage = input.slice(
                0,
                30
              );
              userChatData.chatsData[chatIndex].updatedAt = Date.now();

              if (userChatData.chatsData[chatIndex].rId === userData.id) {
                userChatData.chatsData[chatIndex].messageSeen = false;
              }

              // Update the chat document
              await updateDoc(userChatsRef, {
                chatsData: userChatData.chatsData,
              });
            } else {
              console.error("Chat index not found for messageId:", messageId);
            }
          } else {
            console.error("User chat document does not exist for id:", id);
          }
        }

        // Clear the input field after sending the message
        setInput("");
      } else {
        console.error(
          "Input or messageId is missing. Input:",
          input,
          "messageId:",
          messageId
        );
      }
    } catch (error) {
      console.error("Error sending message:", error); // Improved error logging
      toast.error("Error sending message: " + error.message);
    }
  };

  // UseEffect to listen for updates to the messages
  useEffect(() => {
    if (messageId) {
      const unSub = onSnapshot(doc(db, "messages", messageId), (res) => {
        try {
          const messagesData = res.data()?.messages;
          if (Array.isArray(messagesData)) {
            setMessages(messagesData.reverse());
            console.log("Messages updated:", messagesData.reverse());
          } else {
            console.error(
              "Error: Messages data is not an array or is undefined."
            );
          }
        } catch (error) {
          console.error("Error processing messages:", error);
        }
      });

      return () => {
        unSub();
      };
    }
  }, [messageId, setMessages]);

  return chatUser ? (
    <div className="chat-box">
      <div className="chat-user">
        <img src={chatUser.userData.avatar} alt="User Avatar" />
        <p>
          {chatUser.userData.name}{" "}
          <img className="dot" src={assets.green_dot} alt="Online Status" />
        </p>
        <img src={assets.help_icon} className="help" alt="Help Icon" />
      </div>
      <div className="chat-msg">
        {messages.map((msg, index) => (
          <div
            key={index}
            className={msg.sId === userData.id ? "s-msg" : "r-msg"}
          >
            {msg.text && <p className="msg">{msg.text}</p>}
            <div>
              <img src={assets.profile_img} alt="Profile" />
              <p>
                {new Date(msg.createdAt.seconds * 1000).toLocaleTimeString()}
              </p>
            </div>
          </div>
        ))}
      </div>
      <div className="chat-input">
        <input
          onChange={(e) => setInput(e.target.value)}
          value={input}
          type="text"
          placeholder="Send a message"
        />
        <input type="file" id="image" accept="image/png, image/jpeg" hidden />
        <label htmlFor="image">
          <img src={assets.gallery_icon} alt="Gallery Icon" />
        </label>
        <img src={assets.send_button} alt="Send Button" onClick={sendMessage} />
      </div>
    </div>
  ) : (
    <div className="chat-welcome">
      <img src={assets.logo_icon} alt="Logo" />
      <p>Chat Anytime Anywhere</p>
    </div>
  );
};

export default ChatBox;

*/
