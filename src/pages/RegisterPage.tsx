import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

type Props = {
  setUsername: (name: string) => void;
};

const RegisterPage: React.FC<Props> = ({ setUsername }) => {
  const [mode, setMode] = useState<"login" | "register">("login");
  const [username, setUsernameInput] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");
  const navigate = useNavigate();

  const handleLogin = async () => {
    if (!username || !password) {
      setMessage("Введіть логін і пароль");
      return;
    }

    try {
      const res = await fetch("http://localhost:5000/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username, password }),
      });
      const data = await res.json();

      if (res.ok) {
        localStorage.setItem("username", username);
        setUsername(username);
        navigate("/");
      } else {
        setMessage(data.message || "Невірні дані входу");
      }
    } catch (err) {
      setMessage("Помилка з'єднання з сервером");
    }
  };

  const handleRegister = async () => {
    if (!username || !password) {
      setMessage("Введіть логін і пароль");
      return;
    }

    try {
      const res = await fetch("http://localhost:5000/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username, password }),
      });
      const data = await res.json();

      if (res.ok) {
        localStorage.setItem("username", username);
        setUsername(username);
        navigate("/");
      } else {
        setMessage(data.message || "Помилка реєстрації");
      }
    } catch (err) {
      setMessage("Помилка з'єднання з сервером");
    }
  };

  return (
    <div style={{ padding: "30px", textAlign: "center" }}>
      <h2>{mode === "login" ? "Вхід до системи" : "Реєстрація"}</h2>

      <input
        type="text"
        placeholder="Ім'я користувача"
        value={username}
        onChange={(e) => setUsernameInput(e.target.value)}
        style={{ marginTop: "10px" }}
      /><br />

      <input
        type="password"
        placeholder="Пароль"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        style={{ marginTop: "10px" }}
      /><br />

      {mode === "login" ? (
        <button onClick={handleLogin} style={{ marginTop: "15px" }}>
          Увійти
        </button>
      ) : (
        <button onClick={handleRegister} style={{ marginTop: "15px" }}>
          Зареєструватися
        </button>
      )}

      <p>{message}</p>

      <p style={{ marginTop: "20px" }}>
        {mode === "login" ? (
          <>
            Немає акаунту?{' '}
            <button onClick={() => setMode("register")} style={{ color: "#5c16c5", border: "none", background: "none", cursor: "pointer" }}>
              Зареєструватися
            </button>
          </>
        ) : (
          <>
            Вже є акаунт?{' '}
            <button onClick={() => setMode("login")} style={{ color: "#5c16c5", border: "none", background: "none", cursor: "pointer" }}>
              Увійти
            </button>
          </>
        )}
      </p>
    </div>
  );
};

export default RegisterPage;