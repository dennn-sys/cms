import { useEffect, useRef, useState } from "react";

import { LuPlus } from "react-icons/lu";
import { ref, uploadBytesResumable } from "firebase/storage";
import {
  addDoc,
  collection,
  deleteDoc,
  doc,
  getDocs,
} from "firebase/firestore";

import Spinner from "./ui/Spinner";
import { TrashButton } from "./ui/Buttons";
import { db, storage } from "../config/firebase";

export default function Gallery() {
  const [imageData, setImageData] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  const inputRef = useRef();

  useEffect(() => {
    const photos = collection(db, "photos");
    const getData = async () => {
      try {
        const data = await getDocs(photos);
        setImageData(
          data.docs.map((doc) => ({
            ...doc.data(),
            id: doc.id,
          })),
        );
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
      const storagePath = `photos/${fileObj.name}`;
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
          const collectionRef = collection(db, "photos");
          try {
            await addDoc(collectionRef, { imageUrl: url });
            setImageData([{ imageUrl: url }, ...imageData]);
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

  const deleteFile = async (id, index) => {
    const choice = window.confirm(
      "Are you sure you want to delete this picture?",
    );
    if (choice) {
      try {
        setIsLoading(true);
        const docRef = doc(db, "photos", id);
        await deleteDoc(docRef, id);
        const newImageData = imageData.toSpliced(index, 1);
        setImageData(newImageData);
      } catch (error) {
        alert(error);
      }
      setIsLoading(false);
    }
  };

  return (
    <div
      id="photos"
      className="top-[90px] space-y-2 rounded-lg bg-background p-4 text-foreground  shadow-md lg:z-50"
    >
      <div className="flex items-center justify-between">
        <h2 className=" text-xl font-bold">Photos</h2>
        <label
          htmlFor="add-photo"
          className="flex size-6 items-center justify-center text-2xl"
          disabled={isLoading}
        >
          {isLoading ? <Spinner /> : <LuPlus />}
        </label>
        <input
          ref={inputRef}
          id="add-photo"
          type="file"
          accept="image/png, image/jpeg, image/webp"
          onChange={uploadFile}
          hidden
          disabled={isLoading}
        />
      </div>
      <p className="pb-2 ">Here are some of my graphic design works.</p>
      <div className="grid grid-cols-4 gap-1 overflow-clip rounded-lg md:grid-cols-6 lg:grid-cols-3">
        {imageData.map((image, index) => (
          <div key={index} className="relative">
            <img
              src={image.imageUrl}
              width="300"
              height="300"
              alt=""
              className="size-[155px] object-cover"
            />
            <TrashButton
              className="absolute right-2 top-2 grid size-6 place-items-center rounded-full bg-muted"
              disabled={isLoading}
              onClick={() => {
                deleteFile(imageData[index].id, index);
              }}
            />
          </div>
        ))}
      </div>
    </div>
  );
}
