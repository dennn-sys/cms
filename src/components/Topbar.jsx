import { useRef } from "react";
import { auth } from "../config/firebase";
import { useAuthState } from "react-firebase-hooks/auth";
import { signOut } from "firebase/auth";

import { FaGithub } from "react-icons/fa";
import { LuLogOut } from "react-icons/lu";
import { logo } from "../assets";
import { cn } from "../lib/utils";

export default function Topbar() {
  const [user] = useAuthState(auth);
  const userRef = useRef(false);

  userRef.current = user ? true : false;

  const logout = async () => {
    await signOut(auth);
    console.log("logged out");
  };

  return (
    <div className="z-20 flex h-10 w-full justify-center bg-background text-foreground shadow-md lg:h-14">
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
              "form-btn gap-2 bg-muted px-2 text-muted-foreground",
              userRef.current ? "flex" : "hidden",
            )}
          >
            <LuLogOut />
            <span>Logout</span>
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
