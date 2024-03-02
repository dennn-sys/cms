import { useState, useEffect } from "react";
import { db } from "../config/firebase";
import { getDocs, collection } from "firebase/firestore";
import { useStore } from "../store/useStore";

// import Topbar from "./Topbar";
import CoverPhoto from "./CoverPhoto";
import Profile from "./Profile";

const defaultData = {
  cover: "",
  name: "Denn-sys",
  resume: "",
  title: "Loading...",
};

export default function Header() {
  const [profileData, setProfileData] = useState(defaultData);
  const profile = collection(db, "profile");
  const cover = profileData.cover;
  const name = profileData.name;
  const resume = profileData.resume;
  const title = profileData.title;

  const updateAvatar = useStore((state) => state.updateAvatar);

  async function getProfile() {
    try {
      const data = await getDocs(profile);
      const dataObject = data.docs.map((doc) => ({ ...doc.data() }));
      setProfileData(dataObject[0]);
      updateAvatar(dataObject[0].avatar);
    } catch (error) {
      alert("Failed to fetch data. Please try again later.");
    }
  }

  useEffect(() => {
    getProfile();
  }, []);

  return (
    <div className="flex h-fit w-full justify-center bg-background ">
      <div className="flex h-fit max-w-[1366px] flex-grow flex-col items-center">
        {/* <Topbar /> */}
        <CoverPhoto cover={cover} />
        <div className="w-full max-w-[1302px] px-5">
          <Profile name={name} resume={resume} title={title} />
        </div>
      </div>
    </div>
  );
}
