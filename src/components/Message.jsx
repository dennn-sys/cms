import { useRef } from "react";

import PostHeader from "./PostHeader";
import { defaultAvatar } from "../assets";
import { IoSend } from "react-icons/io5";

export default function Message() {
  const messageRef = useRef("");

  function sendMessage(e) {
    e.preventDefault();

    if (messageRef.current === "") return;
    const messageURI = encodeURI(messageRef.current);
    window.location.href = `mailto:rodenmharismael@gmail.com?subject=Hello%20from%20Portfolio&body=${messageURI}`;
    messageRef.current = "";
    document.getElementById("message-textarea").value = "";
    alert("thank you for sending a message.");
  }

  return (
    <div id="message" className="space-y-5">
      <div className="rounded-lg bg-background text-foreground shadow-md">
        <div className="space-y-2 p-4">
          <PostHeader title="Rodenmhar A. Ismael" date="Feb, 21, 2024" />
          <p className="text-pretty pb-2">
            Please feel free to reach out to me.
          </p>
          <hr className="bg-muted" />
        </div>
        <div className="flex items-start gap-3 p-4">
          <div className="size-[32px] overflow-clip rounded-full">
            <img src={defaultAvatar} alt="avatar" />
          </div>
          <div className="flex w-full flex-col gap-2 overflow-clip rounded-lg bg-muted p-4">
            <textarea
              id="message-textarea"
              onChange={(e) => {
                messageRef.current = e.target.value;
              }}
              maxLength={300}
              placeholder="Write a message..."
              className="h-36 w-full resize-none bg-transparent pr-1 outline-none lg:h-40"
            />
            <button className="self-end" onClick={sendMessage}>
              <IoSend className="text-[--blue]" />
            </button>
          </div>
        </div>
      </div>
      <div className="space-y-2 rounded-lg bg-background p-4 text-foreground shadow-md">
        <h2 className=" text-center text-sm">Rodenmhar A. Ismael 2024</h2>
      </div>
    </div>
  );
}
