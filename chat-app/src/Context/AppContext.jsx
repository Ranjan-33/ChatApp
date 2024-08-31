import { doc, getDoc, onSnapshot, updateDoc } from "firebase/firestore";
import { createContext, useState } from "react";
import { auth, db } from "../Config/firebase";
import { useNavigate } from "react-router-dom";
import { useEffect } from "react";

export const AppContext = createContext();

const AppContextProvider = (props) => {
  const navigate = useNavigate();
  const [userData, setUserData] = useState(null);
  const [chatData, setChatData] = useState(null);
  const [messageId, setMessagesId] = useState(null);
  const [messages, setMessages] = useState([]);
  const [chatUser, setChatUser] = useState(null);
  const [chatVisible, setChatVisible] = useState(false);

  const loadUserData = async (uid) => {
    try {
      const userRef = doc(db, "users", uid);
      const userSnap = await getDoc(userRef);
      const userData = userSnap.data();

      setUserData(userData);
      if (userData.avatar && userData.name) {
        navigate("/Chat");
      } else {
        navigate("/profile");
      }
      await updateDoc(userRef, {
        lastSeen: Date.now(),
      });
      setInterval(async () => {
        if (auth.ChatUser) {
          await updateDoc(userRef, {
            lastSeen: Date.now(),
          });
        }
      }, 60000);
    } catch (error) {
      console.error("Error loading user data:", error);
    }
  };
  // store the chat data of the user

  useEffect(() => {
    if (userData) {
      const chatRef = doc(db, "chats", userData.id);
      const unSub = onSnapshot(chatRef, async (res) => {
        const chatItems = res.data().chatsData;

        const tempData = [];
        for (const item of chatItems) {
          const userRef = doc(db, "users", item.rId);
          const userSnap = await getDoc(userRef);
          const userData = userSnap.data();
          tempData.push({ ...item, userData });
        }

        setChatData(tempData.sort((a, b) => b.updatedAt - a.updatedAt));
      });
      return () => {
        unSub();
      };
    }
  }, [userData]);

  const value = {
    userData,
    setUserData,
    chatData,
    setChatData,
    loadUserData,
    messages,
    setMessages,
    messageId,
    setMessagesId,
    chatUser,
    setChatUser,
    chatVisible,
    setChatVisible,
  };

  return (
    <AppContext.Provider value={value}>{props.children}</AppContext.Provider>
  );
};
export default AppContextProvider;
