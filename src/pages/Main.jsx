import axios from "axios";
import React, { useContext, useEffect, useState } from "react";
import AddButton from "../components/AddButton";
import { AuthContext } from "../AuthContext";
import { toast } from "react-toastify";
import { useNavigate } from "react-router";

export default function Main() {
  const navigate = useNavigate();
  let [dataTemp, setDataTemp] = useState();
  useEffect(() => {
    async function fetchData() {
      let temp = await axios.get(
        `${import.meta.env.VITE_API_BASE_URL}/api/posts`
      );
      setDataTemp(temp.data);
      console.log(temp.data);
    }
    fetchData();
  }, []);

  const { isLoggedIn } = useContext(AuthContext);
  const token = isLoggedIn;
  //console.log(token);

  const handleDelete = async (postId) => {
    const previousPosts = [...dataTemp];
    setDataTemp((prev) => prev.filter((post) => post._id !== postId)); // optimistic UI

    try {
      await axios.delete(
        `${import.meta.env.VITE_API_BASE_URL}/api/posts/${postId}`,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );

      toast.success("Post deleted successfully!");
    } catch (err) {
      setDataTemp(previousPosts); // revert UI
      console.error("Delete failed:", err);
      toast.error("Failed to delete post.");
    }
  };

  return (
    <div className="w-[40%] mt-2 flex flex-col items-center mx-auto">
      {!dataTemp && (
        <h1 className="font-bold text-xl my-2">No Data To be Shown</h1>
      )}

      {dataTemp &&
        dataTemp.map((post) => (
          <div
            key={post._id}
            className="card bg-base-100 shadow border-1 my-2 w-full"
          >
            <figure>
              <img
                src={post.imageUrl}
                alt="Shoes"
                className="w-full h-[50vh] object-cover"
              />
            </figure>
            <div className="card-body">
              <h2 className="card-title">{post.title}</h2>
              <p>{post.description}</p>
              <h3 className="font-bold">By: {post.author.email}</h3>
              {token && localStorage.getItem("email") === post.author.email && (
                <div className="card-actions justify-end">
                  <button
                    className="btn ml-1"
                    onClick={() =>
                      navigate("/form/edit", { state: { post: post } })
                    }
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                      strokeWidth={1.5}
                      stroke="currentColor"
                      className="size-5 text-green-500"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="m16.862 4.487 1.687-1.688a1.875 1.875 0 1 1 2.652 2.652L6.832 19.82a4.5 4.5 0 0 1-1.897 1.13l-2.685.8.8-2.685a4.5 4.5 0 0 1 1.13-1.897L16.863 4.487Zm0 0L19.5 7.125"
                      />
                    </svg>
                  </button>
                  <button
                    className="btn ml-1"
                    onClick={() => handleDelete(post._id)}
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                      strokeWidth={1.5}
                      stroke="currentColor"
                      className="size-5 text-red-500"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="m14.74 9-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 0 1-2.244 2.077H8.084a2.25 2.25 0 0 1-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 0 0-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 0 1 3.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 0 0-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 0 0-7.5 0"
                      />
                    </svg>
                  </button>
                </div>
              )}
            </div>
          </div>
        ))}
      <AddButton />
    </div>
  );
}
