/* eslint-disable react/prop-types */
import { cn } from "../../lib/utils";
import { LuCheck, LuPencil, LuX } from "react-icons/lu";
import Spinner from "./Spinner";

export function EditButton({ className, ...rest }) {
  return (
    <button className={cn("text-lg", className)} {...rest}>
      <LuPencil />
    </button>
  );
}

export function CheckButton({ className, disabled, ...rest }) {
  return (
    <button
      className={cn(
        "grid size-6 place-items-center rounded-full text-[--blue]",
        className,
      )}
      disabled={disabled}
      {...rest}
    >
      {disabled ? (
        <Spinner className="text-2xl" />
      ) : (
        <LuCheck className="text-2xl" />
      )}
    </button>
  );
}

export function XButton({ className, disabled, ...rest }) {
  return (
    <button
      className={cn("grid size-6 place-items-center rounded-full", className)}
      disabled={disabled}
      {...rest}
    >
      <LuX className="text-2xl" />
    </button>
  );
}
