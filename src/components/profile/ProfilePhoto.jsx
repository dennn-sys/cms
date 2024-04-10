import { useEffect, useState, useRef } from "react";

import { LuCamera } from "react-icons/lu";
import { ref, uploadBytesResumable } from "firebase/storage";
import { collection, doc, getDocs, updateDoc } from "firebase/firestore";

import Avatar from "../ui/Avatar";
import Spinner from "../ui/Spinner";
import { useStore } from "../../store/useStore";
import { db, storage } from "../../config/firebase";

export default function ProfilePhoto() {
  const setAvatar = useStore((state) => state.setAvatar);
  const [id, setId] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const inputRef = useRef();

  useEffect(() => {
    const profile = collection(db, "profile");
    const getData = async () => {
      try {
        const data = await getDocs(profile);
        const dataObject = data.docs.map((doc) => ({
          ...doc.data(),
          id: doc.id,
        }));
        setId(dataObject[0].id);
      } catch (error) {
        alert("Failed to fetch data. Please try again later.");
      }
    };
    getData();
  }, []);

  const uploadFile = async (event) => {
    try {
      setIsLoading(true);
      if (!event.target.files || event.target.files.length === 0) {
        setIsLoading(false);
        throw new Error("You must select an image to upload.");
      }
      const fileObj = event.target.files[0];
      const storagePath = `profile/${fileObj.name}`;
      const storageRef = ref(storage, storagePath);
      const uploadTask = uploadBytesResumable(storageRef, fileObj);
      uploadTask.on(
        "state_changed",
        (snapshot) => {
          console.log(snapshot.state);
        },
        (err) => {
          console.log(err);
        },
        async () => {
          const url = `https://storage.googleapis.com/portfolio-94f51.appspot.com/${storagePath}`;
          const docRef = doc(db, "profile", id);
          try {
            await updateDoc(docRef, "avatar", url);
            setAvatar(url);
          } catch (error) {
            alert(error);
          }
          setIsLoading(false);
          inputRef.current.value = "";
        },
      );
    } catch (error) {
      alert(error);
    }
  };

  return (
    <>
      <Avatar variant="main" />
      <div className="absolute bottom-2 right-2 flex w-full justify-end">
        <label
          htmlFor="profile-pic"
          className="flex size-10 items-center justify-center rounded-full bg-input text-2xl"
          disabled={isLoading}
        >
          {isLoading ? <Spinner /> : <LuCamera />}
        </label>
        <input
          ref={inputRef}
          id="profile-pic"
          type="file"
          accept="image/png, image/jpeg, image/webp"
          onChange={uploadFile}
          hidden
          disabled={isLoading}
        />
      </div>
    </>
  );
}
