import { useEffect, useState } from "react";
import "./Login.css";
import { createAccount, loginAccount } from "../../utils/Account";
import { useNavigate } from "react-router-dom";
import { useMana } from "../../utils/ManaContext";
import { useFish } from "../../utils/FishContext";

function Login() {
  const navigate = useNavigate();
  const { userID, handleBalanceLogin } = useMana();
  const { handleFishLogin } = useFish();

  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  useEffect(() => {
    if (userID) navigate("/");
  }, [userID, navigate]);

  return (
    <div className="Login">
      <h1 className="LoginTitle">Manafish</h1>
      <div className="LoginInput">
        <input
          type="text"
          value={username}
          placeholder="Username"
          onChange={(event) => setUsername(event.currentTarget.value)}
        />
        <input
          type="password"
          value={password}
          placeholder="Password"
          onChange={(event) => setPassword(event.currentTarget.value)}
        />
      </div>
      <div className="LoginButtons">
        <button
          onClick={() => {
            if (username && password)
              loginAccount(username, password).then((res) => {
                if (res) {
                  handleBalanceLogin(res._id, username);
                  handleFishLogin(res._id);
                  navigate("/");
                } else alert("Invalid username or password.");
              });
            else alert("Invalid username or password.");
          }}
        >
          Sign In
        </button>
        <button
          onClick={() => {
            if (username.length >= 3 && password.length >= 8)
              createAccount(username, password).then((res) => {
                if (res) {
                  alert("Account created. Please log in.");
                } else {
                  alert("Account already exists.");
                }
              });
            else alert("Username minimum 3 length. Password minimum 8 length.");
          }}
        >
          Create Account
        </button>
      </div>
    </div>
  );
}

export default Login;
