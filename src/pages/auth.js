import React from "react";
import SignIn from "../components/auth/signIn";
import SignUp from "../components/auth/signUp";
import AuthDetails from "../components/authDetails";

const Auth = () => {
  return (
    <div>
      <SignIn />
      <SignUp />
      <AuthDetails />
    </div>
  );
};

export default Auth;
