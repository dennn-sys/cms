import { useState, useEffect } from "react";
import { db } from "../config/firebase";
import { getDocs, collection } from "firebase/firestore";
import { LuGraduationCap, LuHome, LuPhone, LuMail } from "react-icons/lu";

const defaultData = [
  {
    address: "",
    contact: "",
    email: "",
    school: "",
    tagline: "Loading...",
  },
];

export default function Info() {
  const [infoData, setInfoData] = useState(defaultData);
  const info = collection(db, "info");
  const address = infoData[0].address;
  const contact = infoData[0].contact;
  const email = infoData[0].email;
  const school = infoData[0].school;
  const tagline = infoData[0].tagline;

  async function getInfo() {
    try {
      const data = await getDocs(info);
      setInfoData(data.docs.map((doc) => ({ ...doc.data() })));
    } catch (error) {
      alert("Failed to fetch data. Please try again later.");
    }
  }

  useEffect(() => {
    getInfo();
  }, []);

  return (
    <div className="space-y-2 rounded-lg bg-background p-4 text-foreground shadow-md">
      <h2 className=" text-xl font-bold">Info</h2>
      <p className="pb-2 text-center">{tagline}</p>
      <hr />
      <div className="flex items-center gap-3 pt-2">
        <LuGraduationCap className="text-2xl text-muted-foreground" />
        <span>Studied at {school}</span>
      </div>
      <div className="flex items-center gap-3">
        <LuHome className="text-2xl text-muted-foreground" />
        <span>Lives in {address}</span>
      </div>
      <div className="flex items-center gap-3">
        <LuPhone className="text-2xl text-muted-foreground" />
        <span>{contact}</span>
      </div>
      <div className="flex items-center gap-3">
        <LuMail className="text-2xl text-muted-foreground" />
        <span>{email}</span>
      </div>
    </div>
  );
}
