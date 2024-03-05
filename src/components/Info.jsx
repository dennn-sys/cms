import { useState, useEffect, useRef } from "react";
import { db } from "../config/firebase";
import { getDocs, doc, updateDoc, collection } from "firebase/firestore";
import { LuGraduationCap, LuHome, LuPhone, LuMail } from "react-icons/lu";
import { EditButton, CheckButton, XButton } from "./ui/Buttons";
import { cn } from "../lib/utils";

export default function Info() {
  const [address, setAddress] = useState("");
  const [contact, setContact] = useState("");
  const [email, setEmail] = useState("");
  const [school, setSchool] = useState("");
  const [tagline, setTagline] = useState("Loading...");
  const [id, setId] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [onEdit, setOnEdit] = useState(false);

  const addressRef = useRef();
  const contactRef = useRef();
  const emailRef = useRef();
  const schoolRef = useRef();
  const taglineRef = useRef();

  const inputRefA = useRef();
  const inputRefB = useRef();
  const inputRefC = useRef();
  const inputRefD = useRef();
  const inputRefE = useRef();

  useEffect(() => {
    const getData = async () => {
      const info = collection(db, "info");
      try {
        const data = await getDocs(info);
        const dataObject = data.docs.map((doc) => ({
          ...doc.data(),
          id: doc.id,
        }));
        setAddress(dataObject[0].address);
        setContact(dataObject[0].contact);
        setEmail(dataObject[0].email);
        setSchool(dataObject[0].school);
        setTagline(dataObject[0].tagline);
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

  const updateInfo = async () => {
    if (
      (addressRef.current === "" || addressRef.current === undefined) &&
      (contactRef.current === "" || contactRef.current === undefined) &&
      (emailRef.current === "" || emailRef.current === undefined) &&
      (schoolRef.current === "" || schoolRef.current === undefined) &&
      (taglineRef.current === "" || taglineRef.current === undefined)
    )
      return alert("Nothing to update.");

    const addressValue =
      addressRef.current === "" || addressRef.current === undefined
        ? address
        : addressRef.current;
    const contactValue =
      contactRef.current === "" || contactRef.current === undefined
        ? contact
        : contactRef.current;
    const emailValue =
      emailRef.current === "" || emailRef.current === undefined
        ? email
        : emailRef.current;
    const schoolValue =
      schoolRef.current === "" || schoolRef.current === undefined
        ? school
        : schoolRef.current;
    const taglineValue =
      taglineRef.current === "" || taglineRef.current === undefined
        ? tagline
        : taglineRef.current;

    try {
      setIsLoading(true);

      const docRef = doc(db, "info", id);
      await updateDoc(docRef, {
        address: addressValue,
        contact: contactValue,
        email: emailValue,
        school: schoolValue,
        tagline: taglineValue,
      });
    } catch (error) {
      alert(error);
    }
    setAddress(addressValue);
    setContact(contactValue);
    setEmail(emailValue);
    setSchool(schoolValue);
    setTagline(taglineValue);
    inputRefA.current.value = "";
    inputRefB.current.value = "";
    inputRefC.current.value = "";
    inputRefD.current.value = "";
    inputRefE.current.value = "";
    setIsLoading(false);
    toggleEdit();
  };

  return (
    <div className="space-y-2 rounded-lg bg-background p-4 text-foreground shadow-md">
      <div className="flex items-center justify-between">
        <h2 className=" text-xl font-bold">Info</h2>
        <EditButton
          className={onEdit && "hidden"}
          disabled={onEdit}
          onClick={toggleEdit}
        />
        <div className={cn("hidden items-center space-x-4", onEdit && "flex")}>
          <CheckButton disabled={isLoading} onClick={updateInfo} />
          <XButton disabled={isLoading} onClick={toggleEdit} />
        </div>
      </div>
      <p className={cn(" text-center", onEdit && "hidden")}>{tagline}</p>
      <input
        ref={inputRefA}
        type="text"
        placeholder={tagline}
        disabled={isLoading}
        className={cn("edit-input hidden h-6 w-full", onEdit && "block")}
        onChange={(e) => {
          taglineRef.current = e.target.value;
        }}
      />
      <hr className="pt-2" />
      <div className="flex items-center gap-3 pt-2">
        <LuGraduationCap className="text-2xl text-muted-foreground" />
        <span className={onEdit && "hidden"}>Studied at {school}</span>
        <input
          ref={inputRefB}
          type="text"
          placeholder={school}
          disabled={isLoading}
          className={cn("edit-input hidden h-6", onEdit && "block")}
          onChange={(e) => {
            schoolRef.current = e.target.value;
          }}
        />
      </div>
      <div className="flex items-center gap-3">
        <LuHome className="text-2xl text-muted-foreground" />
        <span className={onEdit && "hidden"}>Lives in {address}</span>
        <input
          ref={inputRefC}
          type="text"
          placeholder={address}
          disabled={isLoading}
          className={cn("edit-input hidden h-6", onEdit && "block")}
          onChange={(e) => {
            addressRef.current = e.target.value;
          }}
        />
      </div>
      <div className="flex items-center gap-3">
        <LuPhone className="text-2xl text-muted-foreground" />
        <span className={onEdit && "hidden"}>{contact}</span>
        <input
          ref={inputRefD}
          type="text"
          placeholder={contact}
          disabled={isLoading}
          className={cn("edit-input hidden h-6", onEdit && "block")}
          onChange={(e) => {
            contactRef.current = e.target.value;
          }}
        />
      </div>
      <div className="flex items-center gap-3">
        <LuMail className="text-2xl text-muted-foreground" />
        <span className={onEdit && "hidden"}>{email}</span>
        <input
          ref={inputRefE}
          type="text"
          placeholder={email}
          disabled={isLoading}
          className={cn("edit-input hidden h-6", onEdit && "block")}
          onChange={(e) => {
            emailRef.current = e.target.value;
          }}
        />
      </div>
    </div>
  );
}
