import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import type { Package } from "../types";

type HomePageProps = {
  username: string | null;
  setUsername: React.Dispatch<React.SetStateAction<string | null>>;
};

const HomePage: React.FC<HomePageProps> = ({ username, setUsername }) => {
  const [packages, setPackages] = useState<Package[]>([]);
  const [newTitle, setNewTitle] = useState("");
  const [inputUsername, setInputUsername] = useState("");
  const authorized = !!username;

  useEffect(() => {
    fetch("http://localhost:5000/packages")
      .then((res) => {
        if (!res.ok) throw new Error("Server error while loading packages");
        return res.json();
      })
      .then((data) => setPackages(data))
      .catch((err) => console.error("Помилка завантаження:", err));
  }, []);

  const handleLogin = () => {
    if (inputUsername.trim()) {
      localStorage.setItem("username", inputUsername.trim());
      setUsername(inputUsername.trim());
    }
  };

  const handleAddPackage = async () => {
    if (!newTitle.trim() || !username) {
      console.warn("Порожня назва або відсутній користувач");
      return;
    }

    try {
      const body = JSON.stringify({ title: newTitle.trim(), createdBy: username });
      console.log("Надсилаємо POST /packages:", body);

      const res = await fetch("http://localhost:5000/packages", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body,
      });

      if (res.ok) {
        const newPack = await res.json();
        newPack.questions = [];
        setPackages((prev) => [newPack, ...prev]);
        setNewTitle("");
      } else {
        const errorData = await res.json();
        console.error("Сервер повернув помилку:", errorData);
        alert("Не вдалося створити пакет: " + errorData.message);
      }
    } catch (err) {
      console.error("Помилка запиту:", err);
      alert("Не вдалося відправити запит на сервер.");
    }
  };

  if (!authorized) {
    return (
      <div style={{ textAlign: "center", display: "flex", alignItems: "center", alignContent: "center",justifyContent: "center",flexDirection:"column", padding: "40px" }}>
        <h2>Вхід до системи</h2>
        <input
          type="text"
          placeholder="Введіть ваше ім'я"
          value={inputUsername}
          onChange={(e) => setInputUsername(e.target.value)}
        />
        <br />
        <button onClick={handleLogin} style={{ marginTop: "10px" }}>
          Увійти
        </button>
      </div>
    );
  }

  return (
    <div style={{ textAlign: "center", display: "flex", alignItems: "center", alignContent: "center",justifyContent: "center", flexDirection:"column", margin: "auto", paddingTop: "80px" }}>
      <h1>Список пакетів</h1>
      {packages.map((pack) => (
        <div key={pack.id}>
          <Link to={`/package/${pack.id}`}>
            <button>{pack.title}</button>
          </Link>
        </div>
      ))}

      <div style={{ marginTop: "20px" }}>
        <input
          type="text"
          placeholder="Назва нового пакету"
          value={newTitle}
          onChange={(e) => setNewTitle(e.target.value)}
        />
        <button onClick={handleAddPackage} style={{ marginLeft: "10px" }}>
          Додати
        </button>
      </div>
    </div>
  );
};

export default HomePage;
