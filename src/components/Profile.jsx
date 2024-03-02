import ProfilePhoto from "./ProfilePhoto";
import { Link } from "./Link";
import { LuMail, LuDownloadCloud } from "react-icons/lu";
import { BsPatchCheckFill } from "react-icons/bs";

export default function Profile({ name, resume, title }) {
  return (
    <div className="flex w-full flex-col items-center  justify-center gap-4 border-b-2  pb-8 lg:h-[116px] lg:translate-y-0 lg:flex-row lg:items-end lg:gap-0">
      <div className="flex h-[90px] items-end lg:mr-4 lg:h-[180px] lg:translate-y-[15px]">
        <ProfilePhoto variant="main" />
      </div>

      <div className=" flex-grow text-center lg:mr-4 lg:justify-end lg:text-left">
        <h1 className="mr-2 inline text-4xl font-bold text-foreground">
          {name}
        </h1>
        <BsPatchCheckFill className="relative top-[-4px] inline text-[--blue]" />
        <span className="block">{title}</span>
      </div>

      <div className="flex min-w-[262px] flex-grow items-end justify-center gap-4 lg:justify-end">
        <Link
          className="bg-muted text-muted-foreground"
          href={resume}
          target="_blank"
          rel="noreferrer"
        >
          <LuDownloadCloud />
          <span>My Resume</span>
        </Link>
        <Link href="#message">
          <LuMail />
          <span>Message</span>
        </Link>
      </div>
    </div>
  );
}
