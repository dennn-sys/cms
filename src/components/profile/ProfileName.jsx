/* eslint-disable react/prop-types */
import { useEffect, useRef, useState } from "react";

import { BsPatchCheckFill } from "react-icons/bs";
import { collection, doc, getDocs, updateDoc } from "firebase/firestore";

import { cn } from "../../lib/utils";
import { db } from "../../config/firebase";
import { EditButton, CheckButton, XButton } from "../ui/Buttons";

export default function ProfileName() {
  const [name, setName] = useState("My name is...");
  const [title, setTitle] = useState("Loading...");
  const [id, setId] = useState("");
  const [editName, setEditName] = useState(false);
  const [editTitle, setEditTitle] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const nameRef = useRef(name);
  const titleRef = useRef(title);

  useEffect(() => {
    const profile = collection(db, "profile");
    const getData = async () => {
      try {
        const data = await getDocs(profile);
        const dataObject = data.docs.map((doc) => ({
          ...doc.data(),
          id: doc.id,
        }));
        setName(dataObject[0].name);
        setTitle(dataObject[0].title);
        setId(dataObject[0].id);
      } catch (error) {
        alert("Failed to fetch data. Please try again later.");
      }
    };
    getData();
  }, []);

  const toggleEdit = (field) => {
    field === "name"
      ? setEditName((prev) => !prev)
      : setEditTitle((prev) => !prev);
  };

  const updateField = async (field) => {
    if (field === "name" && nameRef.current === "")
      return alert("Name is empty");

    if (field === "title" && titleRef.current === "")
      return alert("Title is empty");

    try {
      setIsLoading(true);
      const value = field === "name" ? nameRef.current : titleRef.current;
      const docRef = doc(db, "profile", id);
      await updateDoc(docRef, field, value);
      field === "name" ? setName(value) : setTitle(value);
    } catch (error) {
      alert(error);
    }
    setIsLoading(false);
    toggleEdit(field);
  };

  return (
    <div className=" flex-grow text-center lg:mr-4 lg:justify-end lg:text-left">
      <div className="relative w-full">
        <div className={editName ? "invisible" : "visible"}>
          <h1 className="mr-2 inline text-4xl font-bold text-foreground">
            {name}
          </h1>
          <BsPatchCheckFill className="relative top-[-4px] inline text-[--blue]" />
          <EditButton
            className="ml-4"
            disabled={editName || editTitle}
            onClick={() => {
              toggleEdit("name");
            }}
          />
        </div>
        <InputField
          visibility={editName}
          isLoading={isLoading}
          placeholder={name}
          max={22}
          onChange={(e) => {
            nameRef.current = e.target.value;
          }}
          accept={() => updateField("name")}
          cancel={() => toggleEdit("name")}
        />
      </div>
      <div className="relative w-full">
        <div className={editTitle ? "invisible" : "visible"}>
          <span className="">{title}</span>
          <EditButton
            className="ml-4"
            disabled={editName || editTitle}
            onClick={() => {
              toggleEdit("title");
            }}
          />
        </div>
        <InputField
          visibility={editTitle}
          isLoading={isLoading}
          placeholder={title}
          max={50}
          onChange={(e) => {
            titleRef.current = e.target.value;
          }}
          accept={() => updateField("title")}
          cancel={() => toggleEdit("title")}
        />
      </div>
    </div>
  );
}

const InputField = ({
  visibility,
  isLoading,
  placeholder,
  max,
  accept,
  cancel,
  onChange,
}) => {
  return (
    <div
      className={cn(
        "absolute top-0 flex w-full items-center space-x-4",
        visibility ? "visible" : "invisible",
      )}
    >
      <input
        type="text"
        className="edit-input"
        placeholder={placeholder}
        maxLength={max}
        disabled={isLoading}
        onChange={onChange}
      />
      <CheckButton disabled={isLoading} onClick={accept} />
      <XButton disabled={isLoading} onClick={cancel} />
    </div>
  );
};
