import React from "react";
import LoginForm from "../components/LoginForm";
import SignUpForm from "../components/SignUpForm";

export default function SignForm() {
  return (
    <div className="grid grid-cols-2 gap-2 w-[80%] mx-auto">
      <SignUpForm />
      <LoginForm />
    </div>
  );
}
