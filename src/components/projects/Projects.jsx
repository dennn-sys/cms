import { useState, useEffect } from "react";
import { db, storage } from "../../config/firebase";
import { ref, uploadBytes } from "firebase/storage";
import {
  getDocs,
  addDoc,
  deleteDoc,
  doc,
  collection,
  updateDoc,
} from "firebase/firestore";
import ProjectCard from "./ProjectCard";
import * as yup from "yup";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { placeholder } from "../../assets";

import {
  PlusButton,
  CheckButton,
  XButton,
  TrashButton,
  EditButton,
} from "../ui/Buttons";
import { cn } from "../../lib/utils";
import { FcLike } from "react-icons/fc";
import { LuCamera } from "react-icons/lu";
import Spinner from "../ui/Spinner";

const defaultData = [
  {
    title: "Project",
    date: "Jan 1, 2000",
    post: "Loading...",
    stack: "",
    image: placeholder,
  },
];

export default function Projects() {
  const [projectsData, setProjectsData] = useState(defaultData);
  const [project, setProject] = useState(defaultData[0]);
  const [imageFile, setImageFile] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [onEdit, setOnEdit] = useState(false);
  const [onAdd, setOnAdd] = useState(false);
  const [refetch, setRefetch] = useState(false);

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
  }, [refetch]);

  const toggleRefetch = () => {
    setRefetch((prev) => !prev);
  };

  const resetAll = () => {
    reset();
    setProject(defaultData[0]);
    setImageFile(null);
    setOnEdit(false);
    setOnAdd(false);
    toggleRefetch();
  };

  const handleImage = (event) => {
    if (event.target.files && event.target.files[0]) {
      setProject({
        ...project,
        image: URL.createObjectURL(event.target.files[0]),
      });
      setImageFile(event.target.files[0]);
    }
  };

  const submit = async (data) => {
    if (onAdd && !imageFile) return alert("Please choose a project image.");

    try {
      setIsLoading(true);
      const fileObj = imageFile;
      const storagePath = imageFile ? `projects/${fileObj.name}` : "";
      const storageRef = ref(storage, storagePath);
      const url = `https://storage.googleapis.com/portfolio-94f51.appspot.com/${storagePath}`;

      const collectionRef = collection(db, "projects");
      const newDataObj = { ...data, image: imageFile ? url : project.image };

      if (imageFile) await uploadBytes(storageRef, fileObj);

      if (onAdd) {
        await addDoc(collectionRef, newDataObj);
        alert("New project has been added.");
      } else {
        const docRef = doc(db, "projects", project.id);
        await updateDoc(docRef, newDataObj);
        alert("Project has been updated.");
      }
      resetAll();
    } catch (error) {
      alert(error);
    } finally {
      setIsLoading(false);
      setOnEdit(false);
      setOnAdd(false);
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

  return (
    <div id="projects" className="space-y-5">
      <div className="space-y-2 rounded-lg bg-background p-4 text-foreground shadow-md">
        <div className="flex items-center justify-between">
          <h2 className=" text-xl font-bold">Projects</h2>
          <PlusButton
            className={onEdit || onAdd ? "hidden" : ""}
            disabled={onEdit || onAdd}
            onClick={() => setOnAdd(true)}
          />
        </div>
      </div>
      <div
        className={cn(
          "rounded-lg bg-background text-foreground shadow-md",
          onEdit || onAdd ? "" : "hidden",
        )}
      >
        <form onSubmit={handleSubmit(submit)}>
          <div className="flex flex-col space-y-4 p-4">
            <h2 className=" text-xlg font-bold">
              {onEdit ? "Edit project" : "Add new project"}
            </h2>
            <input
              type="text"
              name="name"
              placeholder={onEdit ? project.title : "Title"}
              defaultValue={onEdit ? project.title : undefined}
              disabled={isLoading}
              className="edit-input"
              {...register("title")}
            />
            <p className="form-status">{errors.title?.message}</p>
            <input
              type="text"
              name="date"
              placeholder={onEdit ? project.date : "Date"}
              defaultValue={onEdit ? project.date : undefined}
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
              placeholder={onEdit ? project.post : "Description"}
              defaultValue={onEdit ? project.post : ""}
              disabled={isLoading}
              className="edit-textarea"
              {...register("post")}
            />
            <p className="form-status">{errors.post?.message}</p>
            <div className="relative flex w-full items-center justify-center bg-green-400">
              <img src={project.image} alt="img" className="object-contain" />
              <div className="absolute bottom-4 flex w-full justify-end px-4">
                <label
                  htmlFor="project-image"
                  className="flex size-10 items-center justify-center rounded-full bg-muted text-2xl"
                  disabled={isLoading}
                >
                  {isLoading ? <Spinner /> : <LuCamera />}
                </label>
                <input
                  id="project-image"
                  type="file"
                  accept="image/png, image/jpeg, image/webp"
                  className="hidden outline-[--blue]"
                  disabled={isLoading}
                  onChange={(event) => handleImage(event)}
                />
              </div>
            </div>

            <div className="project-footer flex items-start gap-3 pt-4">
              <FcLike className="text-2xl" />
              <input
                type="text"
                placeholder={onEdit ? project.stack : "#TechStack #Used"}
                defaultValue={onEdit ? project.stack : undefined}
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
                onClick={(event) => {
                  event.preventDefault();
                  resetAll();
                }}
              />
            </div>
          </div>
        </form>
      </div>
      {projectsData.map((project, index) => (
        <div
          key={project.title}
          className={cn("relative", onEdit || onAdd ? "hidden" : "")}
        >
          <ProjectCard
            title={project.title}
            date={project.date}
            post={project.post}
            image={project.image}
            stack={project.stack}
          />
          <div className="absolute right-4 top-4 flex gap-4">
            <EditButton
              disabled={isLoading}
              onClick={() => {
                setOnEdit(true);
                setProject(projectsData[index]);
              }}
            />
            <TrashButton
              disabled={isLoading}
              onClick={() => {
                deleteProject(project.id, index);
              }}
            />
          </div>
        </div>
      ))}
    </div>
  );
}
