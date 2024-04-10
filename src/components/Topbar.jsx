import { useRef } from "react";
import { auth } from "../config/firebase";
import { useAuthState } from "react-firebase-hooks/auth";
import { signOut } from "firebase/auth";

import { FaGithub } from "react-icons/fa";
import { LuLogOut } from "react-icons/lu";
import { MdDarkMode, MdLightMode } from "react-icons/md";
import { logo } from "../assets";
import { cn } from "../lib/utils";
import { useStore } from "../store/useStore";

export default function Topbar() {
  const [user] = useAuthState(auth);
  const userRef = useRef(false);
  const darkmode = useStore((state) => state.darkmode);
  const toggleDarkmode = useStore((state) => state.toggleDarkmode);

  userRef.current = user ? true : false;

  const logout = async () => {
    await signOut(auth);
    console.log("logged out");
  };

  return (
    <div className="flex h-10 w-full justify-center bg-background text-foreground shadow-md lg:h-14">
      <div className="flex w-full max-w-[2560px] items-center justify-between px-4">
        <div className=" flex size-[30px] items-center justify-center">
          <a
            href="https://dennn-sys.github.io/portfolio"
            target="_blank"
            rel="noreferrer"
          >
            <img src={logo} alt="logo" />
          </a>
        </div>

        <div className="flex items-center gap-4">
          <button
            onClick={logout}
            className={cn(
              "form-btn gap-2 bg-input px-2 text-muted-foreground",
              userRef.current ? "flex" : "hidden",
            )}
          >
            <LuLogOut />
            <span>Logout</span>
          </button>
          <button onClick={toggleDarkmode}>
            {darkmode ? (
              <MdLightMode className="text-3xl" />
            ) : (
              <MdDarkMode className="text-3xl" />
            )}
          </button>
          <a
            href="https://github.com/dennn-sys"
            target="_blank"
            rel="noreferrer"
          >
            <FaGithub className="text-3xl" />
          </a>
        </div>
      </div>
    </div>
  );
}
