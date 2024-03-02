import ProfilePhoto from "./ProfilePhoto";

export default function PostHeader({ title, date }) {
  return (
    <div className="flex items-start gap-3">
      <div className="w-[42px]">
        <ProfilePhoto variant="post" />
      </div>
      <div>
        <h3 className=" inline font-bold">{title}</h3>
        <p className="text-sm text-muted-foreground">{date}</p>
      </div>
    </div>
  );
}
