import { useEffect, useRef, useState } from "react";

import { FcLike } from "react-icons/fc";
import { LuCheck, LuPencil, LuX } from "react-icons/lu";
import { collection, doc, getDocs, updateDoc } from "firebase/firestore";

import { cn } from "../lib/utils";
import { db } from "../config/firebase";
import Spinner from "./ui/Spinner";
import PostHeader from "./ui/PostHeader";

export default function About() {
  const [content, setContent] = useState("Loading...");
  const [date, setDate] = useState("Jan 1, 2000");
  const [hashtag, setHashtag] = useState("");
  const [id, setId] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [onEdit, setOnEdit] = useState(false);

  const contentRef = useRef();
  const hashtagRef = useRef();
  const textareaRef = useRef();
  const inputRef = useRef();

  useEffect(() => {
    const getData = async () => {
      const about = collection(db, "about");
      try {
        const data = await getDocs(about);
        const dataObject = data.docs.map((doc) => ({
          ...doc.data(),
          id: doc.id,
        }));
        setContent(dataObject[0].content);
        setDate(dataObject[0].date);
        setHashtag(dataObject[0].hashtag);
        setId(dataObject[0].id);
      } catch (error) {
        alert("Failed to fetch data. Please try again later.");
      }
    };

    getData();
  }, []);

  const toggleEdit = () => {
    setOnEdit((prev) => !prev);
  };

  const formattedDate = () => {
    const currentDate = new Date();
    const month = currentDate.toLocaleString("default", { month: "short" });
    const day = currentDate.getDate();
    const year = currentDate.getFullYear();
    return `${month} ${day}, ${year}`;
  };

  const updateAbout = async () => {
    if (
      (contentRef.current === "" || contentRef.current === undefined) &&
      (hashtagRef.current === "" || hashtagRef.current === undefined)
    )
      return alert("Nothing to update.");

    try {
      setIsLoading(true);
      const contentValue =
        contentRef.current === "" || contentRef.current === undefined
          ? content
          : contentRef.current;
      const hashtagValue =
        hashtagRef.current === "" || hashtagRef.current === undefined
          ? hashtag
          : hashtagRef.current;
      const dateValue = formattedDate();

      const docRef = doc(db, "about", id);
      await updateDoc(docRef, {
        date: dateValue,
        content: contentValue,
        hashtag: hashtagValue,
      });
      setContent(contentValue);
      setHashtag(hashtagValue);
      setDate(dateValue);
    } catch (error) {
      alert(error);
    }
    textareaRef.current.value = "";
    inputRef.current.value = "";
    setIsLoading(false);
    toggleEdit();
  };

  return (
    <div id="about" className="space-y-5">
      <div className="flex justify-between rounded-lg bg-background p-4 text-foreground shadow-md">
        <h2 className=" text-xl font-bold">About</h2>
        <button
          className={cn("text-lg", onEdit && "hidden")}
          disabled={onEdit}
          onClick={toggleEdit}
        >
          <LuPencil />
        </button>
        <div className={cn("hidden items-center space-x-4", onEdit && "flex")}>
          <button
            className="grid size-6 place-items-center rounded-full text-[--blue]"
            disabled={isLoading}
            onClick={updateAbout}
          >
            {isLoading ? (
              <Spinner className="text-2xl" />
            ) : (
              <LuCheck className="text-2xl" />
            )}
          </button>
          <button
            className="grid size-6 place-items-center rounded-full"
            disabled={isLoading}
            onClick={toggleEdit}
          >
            <LuX className="text-2xl" />
          </button>
        </div>
      </div>
      <div className="rounded-lg bg-background text-foreground shadow-md">
        <div className="project-header space-y-2 p-4">
          <PostHeader title="Rodenmhar A. Ismael" date={date} />
          <p className={cn("text-pretty", onEdit && "hidden")}>{content}</p>
          <textarea
            ref={textareaRef}
            cols="30"
            rows="10"
            placeholder={content}
            disabled={isLoading}
            className={cn(
              "hidden w-full resize-none rounded-md p-2 outline outline-2 outline-[--blue]",
              onEdit && "block",
            )}
            onChange={(e) => {
              contentRef.current = e.target.value;
            }}
          />
        </div>
        <div className="project-footer flex items-start gap-3 p-4">
          <FcLike className="text-2xl" />
          <p className={cn("text-muted-foreground", onEdit && "hidden")}>
            {hashtag}
          </p>
          <input
            ref={inputRef}
            type="text"
            placeholder={hashtag}
            disabled={isLoading}
            className={cn(
              "hidden h-8 w-full rounded p-2 outline outline-2 outline-[--blue]",
              onEdit && "block",
            )}
            onChange={(e) => {
              hashtagRef.current = e.target.value;
            }}
          />
        </div>
      </div>
    </div>
  );
}
