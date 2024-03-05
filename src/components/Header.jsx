import { useState, useEffect } from "react";
import { db } from "../config/firebase";
import { getDocs, collection } from "firebase/firestore";
import { useStore } from "../store/useStore";

import CoverPhoto from "../components/profile/CoverPhoto";
import Profile from "../components/profile/Profile";

const defaultData = {
  cover: "",
  name: "Denn-sys",
  resume: "",
  title: "Loading...",
};

export default function Header() {
  const [profileData, setProfileData] = useState(defaultData);
  const profile = collection(db, "profile");
  const id = profileData.id;
  const cover = profileData.cover;
  const name = profileData.name;
  const resume = profileData.resume;
  const title = profileData.title;

  const setAvatar = useStore((state) => state.setAvatar);

  async function getProfile() {
    try {
      const data = await getDocs(profile);
      const dataObject = data.docs.map((doc) => ({
        ...doc.data(),
        id: doc.id,
      }));
      setProfileData(dataObject[0]);
      setAvatar(dataObject[0].avatar);
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
        <CoverPhoto />
        <div className="w-full max-w-[1302px] px-5">
          <Profile resume={resume} />
        </div>
      </div>
    </div>
  );
}
