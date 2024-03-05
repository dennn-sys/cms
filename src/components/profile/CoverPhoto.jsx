import { useEffect, useState, useRef } from "react";

import { LuCamera } from "react-icons/lu";
import { ref, uploadBytesResumable } from "firebase/storage";
import { collection, doc, getDocs, updateDoc } from "firebase/firestore";

import Spinner from "../ui/Spinner";
import { db, storage } from "../../config/firebase";

export default function CoverPhoto() {
  const [cover, setCover] = useState("");
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
        setCover(dataObject[0].cover);
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
            await updateDoc(docRef, "cover", url);
            setCover(url);
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
    <div className="relative aspect-video h-full max-h-[400px] min-h-[210px] w-full overflow-clip bg-blue-500 lg:rounded-b-xl">
      {cover && (
        <img src={cover} alt="cover" className="size-full object-cover" />
      )}
      <div className="absolute bottom-4 flex w-full justify-end px-4">
        <label
          htmlFor="cover-photo"
          className="flex size-10 items-center justify-center rounded-full bg-muted text-2xl"
          disabled={isLoading}
        >
          {isLoading ? <Spinner /> : <LuCamera />}
        </label>
        <input
          ref={inputRef}
          id="cover-photo"
          type="file"
          accept="image/png, image/jpeg, image/webp"
          onChange={uploadFile}
          hidden
          disabled={isLoading}
        />
      </div>
    </div>
  );
}
