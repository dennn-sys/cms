import { useState, useEffect } from "react";
import { db, storage } from "../../config/firebase";
import { ref, uploadBytesResumable } from "firebase/storage";
import {
  getDocs,
  addDoc,
  deleteDoc,
  doc,
  collection,
} from "firebase/firestore";
import ProjectCard from "./ProjectCard";
import * as yup from "yup";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";

import { PlusButton, CheckButton, XButton, TrashButton } from "../ui/Buttons";
import { cn } from "../../lib/utils";
import { FcLike } from "react-icons/fc";

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
  const [isLoading, setIsLoading] = useState(false);
  const [onEdit, setOnEdit] = useState(false);

  const schema = yup.object().shape({
    title: yup.string().required("Please enter the project title."),
    date: yup.string().required("Please enter the project date."),
    post: yup.string().required("Please enter the project description."),
    stack: yup.string().required("Please enter the used techstack."),
  });

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm({ resolver: yupResolver(schema) });

  useEffect(() => {
    const getData = async () => {
      const projects = collection(db, "projects");
      try {
        const data = await getDocs(projects);
        setProjectsData(
          data.docs.map((doc) => ({ ...doc.data(), id: doc.id })),
        );
      } catch (error) {
        alert("Failed to fetch data. Please try again later.");
      }
    };

    getData();
  }, []);

  const toggleEdit = () => {
    setOnEdit((prev) => !prev);
  };

  const uploadProject = async (data) => {
    if (data.image.length === 0) return alert("Plese choose a project image.");

    try {
      setIsLoading(true);
      const fileObj = data.image[0];
      const storagePath = `projects/${fileObj.name}`;
      const storageRef = ref(storage, storagePath);
      const uploadTask = uploadBytesResumable(storageRef, fileObj);
      uploadTask.on(
        "state_changed",
        (snapshot) => {
          console.log(snapshot.state);
        },
        (err) => {
          console.log(err);
        },
        async () => {
          const url = `https://storage.googleapis.com/portfolio-94f51.appspot.com/${storagePath}`;
          const collectionRef = collection(db, "projects");
          try {
            await addDoc(collectionRef, { ...data, image: url });
            const newProjectsData = [{ ...data, image: url }, ...projectsData];
            setProjectsData(newProjectsData);
            setIsLoading(false);
            reset();
            toggleEdit();
          } catch (error) {
            alert(error);
          }
        },
      );
    } catch (error) {
      alert(error);
    }
  };

  const deleteProject = async (id, index) => {
    const choice = window.confirm(
      "Are you sure you want to delete this project?",
    );
    if (choice) {
      try {
        setIsLoading(true);
        const docRef = doc(db, "projects", id);
        await deleteDoc(docRef, id);
        const newProjectsData = projectsData.toSpliced(index, 1);
        setProjectsData(newProjectsData);
      } catch (error) {
        alert(error);
      }
      setIsLoading(false);
    }
  };

  console.log("Projects rendered");
  return (
    <div id="projects" className="space-y-5">
      <div className="space-y-2 rounded-lg bg-background p-4 text-foreground shadow-md">
        <div className="flex items-center justify-between">
          <h2 className=" text-xl font-bold">Projects</h2>
          <PlusButton
            className={onEdit && "hidden"}
            disabled={onEdit}
            onClick={toggleEdit}
          />
        </div>
      </div>
      <div
        className={cn(
          "rounded-lg bg-background text-foreground shadow-md",
          onEdit ? "" : "hidden",
        )}
      >
        <form onSubmit={handleSubmit(uploadProject)}>
          <div className="flex flex-col space-y-4 p-4">
            <h2 className=" text-xlg font-bold">Add new project</h2>
            <input
              type="text"
              name="name"
              placeholder="Title"
              disabled={isLoading}
              className="edit-input"
              {...register("title")}
            />
            <p className="form-status">{errors.title?.message}</p>
            <input
              type="text"
              name="date"
              placeholder="Date"
              disabled={isLoading}
              className="edit-input"
              {...register("date")}
            />
            <p className="form-status">{errors.date?.message}</p>
            <textarea
              name="project-post"
              id=""
              cols="30"
              rows="10"
              placeholder="Description"
              disabled={isLoading}
              className="edit-textarea"
              {...register("post")}
            />
            <p className="form-status">{errors.post?.message}</p>
            <input
              type="file"
              disabled={isLoading}
              className="outline-[--blue]"
              {...register("image")}
            />

            <div className="project-footer flex items-start gap-3">
              <FcLike className="text-2xl" />
              <input
                type="text"
                placeholder="#TechStack #Used"
                disabled={isLoading}
                className="edit-input"
                {...register("stack")}
              />
            </div>
            <p className="form-status">{errors.stack?.message}</p>
            <div className="flex items-center justify-end space-x-4">
              <CheckButton disabled={isLoading} type="submit" />
              <XButton
                type="cancel"
                disabled={isLoading}
                onClick={(e) => {
                  e.target.preventDefault;
                  toggleEdit();
                }}
              />
            </div>
          </div>
        </form>
      </div>
      {projectsData.map((project, index) => (
        <div key={project.title} className="relative">
          <ProjectCard
            title={project.title}
            date={project.date}
            post={project.post}
            image={project.image}
            stack={project.stack}
          />
          <TrashButton
            className="absolute right-4 top-4 grid size-6 place-items-center rounded-full bg-muted"
            disabled={isLoading}
            onClick={() => {
              deleteProject(project.id, index);
            }}
          />
        </div>
      ))}
    </div>
  );
}
