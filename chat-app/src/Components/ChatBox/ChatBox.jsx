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
  Timestamp,
} from "firebase/firestore";
import { db } from "../../Config/firebase";
import { toast } from "react-toastify";
import upload from "../../Lib/upload";

const ChatBox = () => {
  const {
    userData,
    messageId,
    chatUser,
    messages,
    setMessages,
    chatVisible,
    setChatVisible,
  } = useContext(AppContext);
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
            createdAt: new Date(),
          }),
        });

        // Update chat data for both users
        const userIDs = [chatUser.rId, userData.id];
        for (const id of userIDs) {
          const userChatsRef = doc(db, "chats", id);
          const userChatSnapshot = await getDoc(userChatsRef);

          if (userChatSnapshot.exists()) {
            const userChatData = userChatSnapshot.data();
            console.log("User chat data:", userChatData);

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
      console.error("Error sending message:", error);
      toast.error("Error sending message: " + error.message);
    }
  };
  // sending image
  const sendImage = async (e) => {
    try {
      const fileurl = await upload(e.target.files[0]);
      if (fileurl && messageId) {
        await updateDoc(doc(db, "messages", messageId), {
          messages: arrayUnion({
            sId: userData.id,
            image: fileurl,
            createdAt: new Date(),
          }),
        });

        const userIDs = [chatUser.rId, userData.id];
        for (const id of userIDs) {
          const userChatsRef = doc(db, "chats", id);
          const userChatSnapshot = await getDoc(userChatsRef);

          if (userChatSnapshot.exists()) {
            const userChatData = userChatSnapshot.data();
            console.log("User chat data:", userChatData);

            const chatIndex = userChatData.chatsData.findIndex(
              (c) => c.messageId === messageId // Ensure correct property name
            );

            if (chatIndex !== -1) {
              // Ensure chatIndex is valid
              userChatData.chatsData[chatIndex].lastMessage = "image";
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
      }
    } catch (error) {
      toast.error(error.message);
    }
  };

  const converTimeStamp = (Timestamp) => {
    let date = Timestamp.toDate();
    const hour = date.getHours();
    const minute = date.getMinutes();
    if (hour > 12) {
      return hour - 12 + ":" + minute + "PM";
    } else {
      return hour + ":" + minute + "AM";
    }
  };
  const handleKeyDown = (event) => {
    if (event.key === "Enter" && input.trim() !== "") {
      event.preventDefault(); // Prevent the default action of the Enter key
      sendMessage(); // Call the sendMessage function
    }
  };
  // useEffect(() => {
  //   if (messagesId) {
  //     const unSub = onSnapshot(doc(db, 'messages', messagesId), (res) => {
  //       setMessages(res.data().messages.reverse());
  //       console.log(res.data().messages.reverse());
  //     });
  //     return () => {
  //       unSub();
  //     };
  //   }
  // }, [messagesId]);

  useEffect(() => {
    console.log("useEffect triggered, messageId:", messageId);
    if (messageId) {
      const unSub = onSnapshot(
        doc(db, "messages", messageId),
        (res) => {
          try {
            const messagesData = res.data()?.messages;
            if (Array.isArray(messagesData)) {
              setMessages(messagesData.reverse());
              // console.log(messagesData.reverse());
            } else {
              console.error(
                "Error: Messages data is not an array or is undefined."
              );
            }
          } catch (error) {
            console.error("Error processing messages:", error);
          }
        },
        (error) => {
          console.error("Error fetching snapshot:", error);
        }
      );

      return () => {
        unSub();
      };
    }
  }, [messageId]);

  // message field

  return chatUser ? (
    <div className={`chat-box${chatVisible ? "" : "hidden"}`}>
      <div className="chat-user">
        <img src={chatUser.userData.avatar} alt="" />
        <p>
          {chatUser.userData.name}
          {Date.now() - chatUser.userData.lastSeen <= 70000 ? (
            <img className="dot" src={assets.green_dot} alt="" />
          ) : null}
        </p>
        <img src={assets.help_icon} className="help" alt="" />
        <img
          onClick={() => setChatVisible(false)}
          src={assets.arrow_icon}
          className="arrow"
          alt=""
        />
      </div>

      <div className="chat-msg">
        {messages.map((msg, index) => (
          <div
            key={index}
            className={msg.sId === userData.id ? "s-msg" : "r-msg"}
          >
            {msg["image"] ? (
              <img className="msg-img" src={msg.image} alt="" />
            ) : (
              <p className="msg">{msg.text}</p>
            )}
            <div>
              <img
                src={
                  msg.sId === userData.id
                    ? userData.avatar
                    : chatUser.userData.avatar
                }
                alt=""
              />
              <p>{converTimeStamp(msg.createdAt)}</p>
            </div>
          </div>
        ))}
      </div>
      <div className="chat-input">
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder="Send a message"
        />

        <input
          onChange={sendImage}
          type="file"
          id="image"
          accept="image/png , image/jpeg"
          hidden
        />
        <label htmlFor="image">
          <img src={assets.gallery_icon} alt="" />
        </label>
        <img onClick={sendMessage} src={assets.send_button} alt="" />
      </div>
    </div>
  ) : (
    <div className={`chat-welcome ${chatVisible ? "" : "hidden"}`}>
      <img src={assets.logo_icon} alt="" />
      <p>Chat Anytime Anywhere </p>
    </div>
  );
};

export default ChatBox;
