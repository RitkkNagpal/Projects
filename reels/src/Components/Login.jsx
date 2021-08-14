import React, { useContext, useState } from "react";
import { AuthContext } from "../Context/AuthProvider";

const Login = (props) => {
  let { signin } = useContext(AuthContext);

  const [Email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");
  let handleSignin = async () => {
    try {
      let response = await signin(Email, password);
      props.history.push("/"); // navigate to home('/');
    } catch (err) {
      setEmail("");
      setPassword("");
      setMessage(err.message);
    }
  };
  return (
    <div>
      <h1>Login Page</h1>
      <div>
        <div className="Email">
          Email
          <input
            type="text"
            value={Email}
            onChange={(e) => {
              setEmail(e.target.value);
            }}
          />
        </div>

        <div className="password">
          Password{" "}
          <input
            type="text"
            value={password}
            onChange={(e) => {
              setPassword(e.target.value);
            }}
          />
        </div>
      </div>
      <button onClick={handleSignin}>Login</button>
      <h2 style ={{color : "red"}}>{message}</h2>
    </div>
  );
};

export default Login;
