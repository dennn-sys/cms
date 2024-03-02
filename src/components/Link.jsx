import { cn } from "../lib/utils";

export const Link = ({ className, children, ...rest }) => {
  return (
    <a
      className={cn(
        "flex h-9 min-w-fit cursor-pointer items-center rounded-md bg-[--blue] px-3 font-medium text-white shadow-md active:scale-95",
        className,
      )}
      {...rest}
    >
      <div className="flex items-center gap-2">{children}</div>
    </a>
  );
};
