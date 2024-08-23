import React, { useContext, useEffect, useState } from "react";
import "./ProfileUpdate.css";
import assets from "../../assets/assets";
import { onAuthStateChanged } from "firebase/auth";
import { auth, db } from "../../Config/firebase";
import { doc, updateDoc } from "firebase/firestore";
import { useNavigate } from "react-router-dom";
import { getDoc } from "firebase/firestore";
import { toast } from "react-toastify";
import upload from "../../Lib/Upload";
import { AppContext } from "../../Context/AppContext";

const ProfileUpdate = () => {
  const navigate = useNavigate();
  const [image, setImage] = useState(false);
  const [name, setname] = useState("");
  const [bio, setBio] = useState("");
  const [uid, SetUid] = useState("");
  const [prevImage, setPrevImage] = useState("");
  const { setUserData } = useContext(AppContext);

  const ProfileUpdate = async (event) => {
    event.preventDefault();
    try {
      if (!prevImage && !image) {
        toast.error("upload profile picture");
      }
      const docRef = doc(db, "users", uid);
      if (image) {
        const imgUrl = await upload(image);
        setPrevImage(imgUrl);
        await updateDoc(docRef, {
          avatar: imgUrl,
          name: name,
          bio: bio,
        });
      } else {
        await updateDoc(docRef, {
          name: name,
          bio: bio,
        });
      }

      const snap = await getDoc(docRef);
      setUserData(snap.data());
      navigate("/chat");
    } catch (error) {
      console.error("Error updating profile:", error);
      toast.error("Failed to update profile. Please try again.");
    }
  };

  useEffect(() => {
    onAuthStateChanged(auth, async (user) => {
      if (user) {
        SetUid(user.uid);
        const docRef = doc(db, "users", user.uid);
        const docSnap = await getDoc(docRef);
        if (docSnap.data().name) {
          setname(docSnap.data().name);
        }
        if (docSnap.data().bio) {
          setBio(docSnap.data().bio);
        }
        if (docSnap.data().avatar) {
          setPrevImage(docSnap.data().avatar);
        }
      } else {
        navigate("/");
      }
    });
  }, []);

  return (
    <div className="profile">
      <div className="profile-container">
        <form onSubmit={ProfileUpdate}>
          <h3>Profile Detals</h3>
          <label htmlFor="avatar">
            <input
              onChange={(e) => setImage(e.target.files[0])}
              type="file"
              id="avatar"
              accept=".png, .jpg, .jpeg "
              hidden
            />
            <img
              src={image ? URL.createObjectURL(image) : assets.avatar_icon}
              alt=""
            />
            upload profile picture
          </label>
          <input
            onChange={(e) => setname(e.target.value)}
            value={name}
            type="text"
            placeholder="Your name "
            required
          />
          <textarea
            onChange={(e) => setBio(e.target.value)}
            value={bio}
            placeholder="Write Profile Bio "
            required
          ></textarea>
          <button type="submit">Save</button>
        </form>
        <img
          className="profile-pic"
          src={
            image
              ? URL.createObjectURL(image)
              : prevImage
              ? prevImage
              : assets.logo_icon
          }
          alt=""
        />
      </div>
    </div>
  );
};

export default ProfileUpdate;
