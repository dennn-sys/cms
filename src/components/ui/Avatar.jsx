/* eslint-disable react/prop-types */

import { cn } from "../../lib/utils";
import { useStore } from "../../store/useStore";

export default function Avatar({ variant }) {
  const avatar = useStore((state) => state.avatar);

  let style;

  if (variant === "main") {
    style = "size-[180px] ring-[6px] ring-background";
  } else if (variant === "post") {
    style = "size-[42px]";
  }

  return (
    <div
      className={cn(
        "overflow-clip rounded-full bg-blue-300 text-center",
        style,
      )}
    >
      <img src={avatar} alt="profile picture" />
    </div>
  );
}
