import { useEffect, useRef, useState } from "react";

import { FcLike } from "react-icons/fc";
import { collection, doc, getDocs, updateDoc } from "firebase/firestore";

import { cn } from "../lib/utils";
import { db } from "../config/firebase";
import PostHeader from "./ui/PostHeader";
import { formattedDate } from "../lib/utils";
import { CheckButton, EditButton, XButton, TrashButton } from "./ui/Buttons";

export default function Skills() {
  const [date, setDate] = useState("Jan 1, 2000");
  const [introduction, setIntroduction] = useState("Loading...");
  const [items, setItems] = useState(["skill 1", "skill 2", "skill 3"]);
  const [paragraph, setParagraph] = useState("My skills");
  const [hashtag, setHashtag] = useState("");
  const [id, setId] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
  const [onEdit, setOnEdit] = useState(false);
  const [refetch, setRefetch] = useState(false);

  const introductionRef = useRef();
  const itemsRef = useRef([]);
  const itemsCopyRef = useRef([]);
  const addNewRef = useRef();
  const paragraphRef = useRef();
  const hashtagRef = useRef();
  const inputRef1 = useRef();
  const inputRef2 = useRef();
  const inputRef3 = useRef();
  const inputRef4 = useRef();

  useEffect(() => {
    const getData = async () => {
      const skills = collection(db, "skills");
      try {
        const data = await getDocs(skills);
        const dataObject = data.docs.map((doc) => ({
          ...doc.data(),
          id: doc.id,
        }));
        setDate(dataObject[0].date);
        setIntroduction(dataObject[0].introduction);
        setItems(dataObject[0].items);
        setParagraph(dataObject[0].paragraph);
        setHashtag(dataObject[0].hashtag);
        setId(dataObject[0].id);
        itemsRef.current = [...dataObject[0].items];
        itemsCopyRef.current = [...dataObject[0].items];
      } catch (error) {
        alert("Failed to fetch data. Please try again later.");
      }
    };
    getData();
  }, [refetch]);

  const toggleEdit = () => {
    setOnEdit((prev) => !prev);
  };

  const toggleRefetch = () => {
    setRefetch((prev) => !prev);
  };

  const resetFields = () => {
    introductionRef.current = undefined;
    itemsRef.current = undefined;
    paragraphRef.current = undefined;
    addNewRef.current = undefined;
    hashtagRef.current = undefined;
    inputRef1.current.value = "";
    inputRef2.current.value = "";
    inputRef3.current.value = "";
    inputRef4.current.value = "";
    toggleRefetch();
  };

  const updateSkills = async () => {
    if (
      (!introductionRef.current || introductionRef.current === "") &&
      (!itemsRef.current ||
        itemsRef.current.toString() === itemsCopyRef.current.toString()) &&
      (!paragraphRef.current || paragraphRef.current === "") &&
      (!addNewRef.current || addNewRef.current === "") &&
      (!hashtagRef.current || hashtagRef.current === "")
    ) {
      alert("Nothing to update.");
      return;
    }
    try {
      setIsLoading(true);
      const introductionValue =
        !introductionRef.current || introductionRef.current === ""
          ? introduction
          : introductionRef.current;
      const itemsValue = addNewRef.current
        ? [...itemsRef.current, addNewRef.current]
        : itemsRef.current;
      const paragraphValue =
        !paragraphRef.current || paragraphRef.current === ""
          ? paragraph
          : paragraphRef.current;
      const hashtagValue =
        !hashtagRef.current || hashtagRef.current === ""
          ? hashtag
          : hashtagRef.current;
      const dateValue = formattedDate();

      const docRef = doc(db, "skills", id);
      await updateDoc(docRef, {
        date: dateValue,
        introduction: introductionValue,
        items: itemsValue,
        paragraph: paragraphValue,
        hashtag: hashtagValue,
      });
      setDate(dateValue);
      setIntroduction(introductionValue);
      setItems(itemsValue);
      setParagraph(paragraphValue);
      setHashtag(hashtagValue);
      resetFields();
      alert("Skills has been updated successfully.");
    } catch (error) {
      alert(error);
    } finally {
      setIsLoading(false);
      toggleEdit();
    }
  };

  const deleteSkill = (index) => {
    const newArray = items.toSpliced(index, 1);
    setItems(newArray);
    itemsRef.current = [...newArray];
  };

  return (
    <div id="skills" className="space-y-5">
      <div className="flex justify-between rounded-lg bg-background p-4 text-foreground shadow-md">
        <h2 className=" text-xl font-bold">Skills</h2>
        <EditButton
          className={onEdit ? "hidden" : ""}
          disabled={onEdit}
          onClick={toggleEdit}
        />
      </div>
      <div className="rounded-lg bg-background text-foreground shadow-md">
        <div className="project-header space-y-2 p-4">
          <PostHeader title="Rodenmhar A. Ismael" date={date} />
          <div className={cn("space-y-2", onEdit ? "hidden" : "")}>
            <p className="text-pretty">{introduction}</p>
            <ul className="list-inside list-disc pl-4">
              {items.map((item) => (
                <li key={item}>{item}</li>
              ))}
            </ul>
            <p className="text-pretty">{paragraph}</p>
            <div className="project-footer flex items-start gap-3 pt-6">
              <FcLike className="text-2xl" />
              <p className="text-muted-foreground">{hashtag}</p>
            </div>
          </div>
          <div className={cn("space-y-8", onEdit ? "" : "hidden")}>
            <input
              ref={inputRef1}
              type="text"
              placeholder={introduction}
              disabled={isLoading}
              className="edit-input w-full"
              onChange={(e) => {
                introductionRef.current = e.target.value;
              }}
            />
            <div className="space-y-4">
              {items.map((item, index) => (
                <div key={item} className="flex gap-4">
                  <input
                    type="text"
                    placeholder={item}
                    disabled={isLoading}
                    className="edit-input w-full"
                    onChange={(e) => {
                      itemsRef.current[index] = e.target.value;
                    }}
                  />
                  <TrashButton
                    disabled={isLoading}
                    onClick={() => deleteSkill(index)}
                  />
                </div>
              ))}
              <input
                ref={inputRef2}
                type="text"
                placeholder="Add new skill"
                disabled={isLoading}
                className="edit-input w-full"
                onChange={(e) => {
                  addNewRef.current = e.target.value;
                }}
              />
            </div>
            <textarea
              ref={inputRef3}
              cols="30"
              rows="5"
              placeholder={paragraph}
              disabled={isLoading}
              className="edit-textarea w-full"
              onChange={(e) => {
                paragraphRef.current = e.target.value;
              }}
            />
            <div className="project-footer flex items-center gap-3">
              <FcLike className="text-2xl" />
              <input
                ref={inputRef4}
                type="text"
                placeholder={hashtag}
                disabled={isLoading}
                className="edit-input w-full"
                onChange={(e) => {
                  hashtagRef.current = e.target.value;
                }}
              />
            </div>
            <div className="flex items-center justify-end space-x-4">
              <CheckButton disabled={isLoading} onClick={updateSkills} />
              <XButton
                disabled={isLoading}
                onClick={() => {
                  resetFields();
                  toggleEdit();
                }}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
