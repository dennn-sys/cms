import { FcLike } from "react-icons/fc";
import PostHeader from "./PostHeader";

export default function ProjectCard({ title, date, post, image, stack }) {
  return (
    <div className="rounded-lg bg-background text-foreground shadow-md">
      <div className="project-header space-y-2 p-4">
        <PostHeader title={title} date={date} />
        <p className="text-pretty">{post}</p>
      </div>
      <img src={image} alt="img" className="object-contain" />
      <div className="project-footer flex items-start gap-3 p-4">
        <FcLike className="text-2xl" />
        <p className="text-muted-foreground">{stack}</p>
      </div>
    </div>
  );
}
