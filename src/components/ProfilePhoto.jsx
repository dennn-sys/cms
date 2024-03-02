import React from "react";
import { cn } from "../lib/utils";
import { useStore } from "../store/useStore";

export default function ProfilePhoto({ variant }) {
  const avatar = useStore((state) => state.avatar);

  let style;

  if (variant === "main") {
    style = "size-[180px] ring-[10px] ring-background";
  } else if (variant === "post") {
    style = "size-[42px]";
  }

  return (
    <div
      className={cn(
        "overflow-clip rounded-full bg-background text-center",
        style,
      )}
    >
      <img src={avatar} alt="profile picture" />
    </div>
  );
}
