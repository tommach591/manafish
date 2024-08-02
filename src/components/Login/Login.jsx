import { useState } from "react";
import "./Login.css";
import {
  createAccount,
  getAllAccount,
  loginAccount,
} from "../../utils/Account";
import { useNavigate } from "react-router-dom";
import { useMana } from "../../utils/ManaContext";
import { useFish } from "../../utils/FishContext";

function Login() {
  const navigate = useNavigate();
  const { handleBalanceLogin } = useMana();
  const { handleFishLogin } = useFish();

  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  return (
    <div className="Login">
      <input
        type="text"
        value={username}
        onChange={(event) => setUsername(event.currentTarget.value)}
      />
      <input
        type="text"
        value={password}
        onChange={(event) => setPassword(event.currentTarget.value)}
      />
      <button
        onClick={() => {
          if (username && password)
            createAccount(username, password).then((res) => {
              if (res) {
                console.log(res);
              } else {
                alert("Account already exists.");
              }
            });
        }}
      >
        Create Account
      </button>
      <button
        onClick={() => {
          if (username && password)
            loginAccount(username, password).then((res) => {
              if (res) {
                handleBalanceLogin(res._id);
                handleFishLogin(res._id);
                navigate("/");
              } else {
                alert("Invalid username or password.");
              }
            });
        }}
      >
        Sign In
      </button>
      <button
        onClick={() => {
          getAllAccount().then((res) => {
            console.log(res);
          });
        }}
      >
        Print Account
      </button>
    </div>
  );
}

export default Login;
