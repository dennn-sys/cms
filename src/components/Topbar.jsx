import { useRef } from "react";
import { auth } from "../config/firebase";
import { useAuthState } from "react-firebase-hooks/auth";
import { signOut } from "firebase/auth";

import { FaGithub } from "react-icons/fa";
import { logo } from "../assets";

export default function Topbar() {
  const [user] = useAuthState(auth);
  const userRef = useRef(false);

  userRef.current = user ? true : false;

  const logout = async () => {
    await signOut(auth);
    console.log("logged out");
  };

  return (
    <div className="z-20 flex h-10 w-full items-center justify-between bg-background px-4 text-foreground shadow-md lg:h-14">
      <div className=" flex size-[30px] items-center justify-center rounded-full bg-blue-500 text-white">
        <a
          href="https://dennn-sys.github.io/portfolio"
          target="_blank"
          rel="noreferrer"
        >
          <img src={logo} alt="logo" className="" />
        </a>
      </div>

      <div className="flex items-center gap-2">
        <button
          onClick={logout}
          className={userRef.current ? "block" : "hidden"}
        >
          Logout
        </button>
        <a href="https://github.com/dennn-sys" target="_blank" rel="noreferrer">
          <FaGithub className="text-3xl" />
        </a>
      </div>
    </div>
  );
}
