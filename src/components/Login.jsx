import { useRef } from "react";
import * as yup from "yup";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { signInWithEmailAndPassword } from "firebase/auth";
import { auth } from "../config/firebase";
import Spinner from "./ui/Spinner";

export default function Login() {
  const loadingRef = useRef(false);
  const isLoading = loadingRef.current;

  const schema = yup.object().shape({
    email: yup.string().email().required("Please enter a valid email."),
    password: yup.string().required("Please enter a valid password."),
  });

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm({ resolver: yupResolver(schema) });

  const onLogin = async (data) => {
    loadingRef.current = true;
    try {
      await signInWithEmailAndPassword(auth, data.email, data.password);
      reset();
    } catch (e) {
      alert("login failed");
      console.log(e);
    } finally {
      loadingRef.current = false;
    }
  };

  return (
    <div className="flex h-[calc(100vh-2.5rem)] w-full items-center justify-center px-4 text-foreground lg:h-[calc(100vh-3.5rem)]">
      <div className="relative bottom-16 h-[300px] w-full max-w-[500px]">
        <h1 className="py-8 text-center text-2xl font-semibold">Login</h1>
        <form onSubmit={handleSubmit(onLogin)} className="space-y-8">
          <div>
            <p>Email</p>
            <input
              type="text"
              placeholder="name@email.com"
              className="form-input"
              disabled={isLoading ? true : false}
              {...register("email")}
            />
            <p className="form-status">{errors.email?.message}</p>
          </div>

          <div className="pb-8">
            <p>Password</p>
            <input
              type="password"
              placeholder="123456"
              className="form-input"
              disabled={isLoading ? true : false}
              {...register("password")}
            />
            <p className="form-status">{errors.password?.message}</p>
          </div>
          <button
            type="submit"
            className="form-btn"
            disabled={isLoading ? true : false}
          >
            {isLoading ? <Spinner /> : "Login"}
          </button>
        </form>
      </div>
    </div>
  );
}
