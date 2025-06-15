import React, { useContext } from "react";
import { Link } from "react-router";
import { AuthContext } from "../AuthContext";

export default function AddButton() {
  const { isLoggedIn } = useContext(AuthContext);
  return (
    <>
      {isLoggedIn && (
        <Link
          to="/form/add"
          className="btn btn-active btn-primary fixed bottom-3 right-3 rounded-full w-12 h-12 flex items-center justify-center p-3"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth={2.5}
            stroke="currentColor"
            className="size-6"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M12 4.5v15m7.5-7.5h-15"
            />
          </svg>
        </Link>
      )}
    </>
  );
}
