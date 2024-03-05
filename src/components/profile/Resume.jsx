import { useEffect, useState, useRef } from "react";

import { ref, uploadBytesResumable } from "firebase/storage";
import { LuDownloadCloud, LuUploadCloud } from "react-icons/lu";
import { collection, doc, getDocs, updateDoc } from "firebase/firestore";

import { Link } from "../ui/Link";
import Spinner from "../ui/Spinner";
import { db, storage } from "../../config/firebase";
import { cn } from "../../lib/utils";

export default function Resume() {
  const [resume, setResume] = useState("");
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
        setResume(dataObject[0].resume);
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
      const storagePath = `files/${fileObj.name}`;
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
            await updateDoc(docRef, "resume", url);
            setResume(url);
          } catch (error) {
            alert(error);
          }
          setIsLoading(false);
          inputRef.current.value = "";
          alert("New resume has been uploaded.");
        },
      );
    } catch (error) {
      alert(error);
    }
  };

  return (
    <div className="flex min-w-[262px] flex-grow items-end justify-center gap-4 lg:justify-end">
      <Link
        className={cn(
          "bg-muted text-muted-foreground",
          isLoading && "pointer-events-none",
        )}
        href={resume}
        target="_blank"
        rel="noreferrer"
        disabled={isLoading}
      >
        <LuDownloadCloud />
        <span>My Resume</span>
      </Link>
      <label
        htmlFor="upload-resume"
        className="flex h-9 w-[83px] cursor-pointer items-center justify-center rounded-md bg-[--blue] px-3 font-medium text-white shadow-md active:scale-95"
        disabled={isLoading}
      >
        <div className="flex items-center gap-2">
          {isLoading ? (
            <Spinner />
          ) : (
            <>
              <LuUploadCloud />
              <span>New</span>
            </>
          )}
        </div>
      </label>
      <input
        ref={inputRef}
        id="upload-resume"
        type="file"
        accept="application/pdf"
        onChange={uploadFile}
        hidden
        disabled={isLoading}
      />
    </div>
  );
}
