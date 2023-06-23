import React from "react";
import { useAuth0 } from "@auth0/auth0-react";

const LoginButton = () => {
  const { loginWithRedirect } = useAuth0();

  const handleLogin = () => {
    loginWithRedirect({ redirectUri: window.location.origin + "/auth0-demo" });
  };

  return <button className="loginBtn" onClick={handleLogin}>Log in</button>;
};

export default LoginButton;
