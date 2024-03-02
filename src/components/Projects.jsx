import { useState, useEffect } from "react";
import { db } from "../config/firebase";
import { getDocs, collection } from "firebase/firestore";
import ProjectCard from "./ProjectCard";

const defaultData = [
  {
    title: "Project",
    date: "Jan 1, 2000",
    post: "Loading...",
    stack: "",
  },
];

export default function Projects() {
  const [projectsData, setProjectsData] = useState(defaultData);
  const projects = collection(db, "projects");

  async function getProjects() {
    try {
      const data = await getDocs(projects);
      setProjectsData(data.docs.map((doc) => ({ ...doc.data() })));
    } catch (error) {
      alert("Failed to fetch data. Please try again later.");
    }
  }

  useEffect(() => {
    getProjects();
  }, []);

  return (
    <div id="projects" className="space-y-5">
      <div className="space-y-2 rounded-lg bg-background p-4 text-foreground shadow-md">
        <h2 className=" text-xl font-bold">Projects</h2>
      </div>
      {projectsData.map((project) => (
        <ProjectCard
          key={project.title}
          title={project.title}
          date={project.date}
          post={project.post}
          image={project.image}
          stack={project.stack}
        />
      ))}
    </div>
  );
}
