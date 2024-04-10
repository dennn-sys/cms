import { auth } from "./config/firebase";
import { useAuthState } from "react-firebase-hooks/auth";
import { useStore } from "./store/useStore";

import { cn } from "./lib/utils";
import Topbar from "./components/Topbar";
import Header from "./components/Header";
import Navbar from "./components/Navbar";
import Aside from "./components/Aside";
import MainContent from "./components/MainContent";
import Login from "./components/Login";

function App() {
  const [user] = useAuthState(auth);
  const darkmode = useStore((state) => state.darkmode);

  return (
    <div
      className={cn(
        "flex w-full flex-col items-center bg-muted",
        darkmode && "dark",
      )}
    >
      <Topbar />
      {!user ? (
        <Login />
      ) : (
        <>
          <Header />

          <div className="order-2 flex w-full max-w-[1302px] flex-col items-center gap-5 p-5 lg:flex-row lg:items-start">
            <Aside />
            <MainContent />
          </div>
          <div className="sticky top-0 order-1 flex w-full justify-center bg-background shadow-md">
            <div className=" w-full max-w-[1302px] px-5">
              <Navbar />
            </div>
          </div>
        </>
      )}
    </div>
  );
}

export default App;
