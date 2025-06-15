import Navbar from "./components/Navbar";
import Main from "./pages/Main";
import { Route, Routes } from "react-router";
import PostForm from "./pages/PostForm";
import SignForm from "./pages/SignForm";
import { ToastContainer } from "react-toastify";
import NotFound from "./pages/NotFound";

function App() {
  return (
    <>
      <Navbar />
      <Routes>
        <Route path="/" element={<Main />} />
        <Route path="/form/:mood" element={<PostForm />} />
        <Route path="/sign" element={<SignForm />} />
        <Route path="/*" element={<NotFound />} />
      </Routes>
      <ToastContainer position="top-right" autoClose={3000} />
    </>
  );
}

export default App;
