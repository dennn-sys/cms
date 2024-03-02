import PostHeader from "./PostHeader";
import { FcLike } from "react-icons/fc";

export default function Skills() {
  return (
    <div id="skills" className="space-y-5">
      <div className="space-y-2 rounded-lg bg-background p-4 text-foreground shadow-md">
        <h2 className=" text-xl font-bold">Skills</h2>
      </div>
      <div className="rounded-lg bg-background text-foreground shadow-md">
        <div className="project-header space-y-2 p-4">
          <PostHeader title="Rodenmhar A. Ismael" date="Feb, 21, 2024" />
          <p className="text-pretty">Here are my core skills.</p>
          <ul className="list-inside list-disc pl-4">
            <li>HTML</li>
            <li>CSS</li>
            <li>Javascript</li>
            <li>React</li>
            <li>Canva</li>
            <li>Photoshop</li>
          </ul>
          <p className="text-pretty">
            With excellent communication, adaptability, collaboration, and time
            management skills, I am well-equipped to thrive in any professional
            environment.
          </p>
        </div>
        <div className="project-footer flex items-start gap-3 p-4">
          <FcLike className="text-2xl" />
          <p className="text-muted-foreground">#myskillz</p>
        </div>
      </div>
    </div>
  );
}
