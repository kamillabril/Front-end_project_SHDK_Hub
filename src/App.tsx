import React, { useEffect, useState } from "react";
import { BrowserRouter, Routes, Route, useNavigate } from "react-router-dom";
import HomePage from "./pages/HomePage";
import PackagePage from "./pages/PackagePage";
import PlayPage from "./pages/PlayPage";
import ProfilePage from "./pages/ProfilePage";
import RegisterPage from "./pages/RegisterPage";
import Header from "./components/Header";
import type { Package, Question } from "./types";
import "./App.css";

function AppWrapper() {
  const navigate = useNavigate();
  const [packages, setPackages] = useState<Package[]>([]);
  const [username, setUsername] = useState<string | null>(null);

  useEffect(() => {
    const storedUsername = localStorage.getItem("username");
    if (storedUsername) {
      setUsername(storedUsername);
    }

    const loadPackages = async () => {
      try {
        const res = await fetch("http://localhost:5000/packages");
        const data = await res.json();

        setPackages(data);
        console.log(data);
      } catch (err) {
        console.error("Помилка завантаження пакетів", err);
      }
    };

    loadPackages();
  }, []);

  const addPackage = async (title: string, createdBy: string) => {
    try {
      const res = await fetch("http://localhost:5000/packages", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ title, createdBy }),
      });
      const newPackage = await res.json();
      setPackages([...packages, { ...newPackage, questions: [] }]);
    } catch (err) {
      console.error("Помилка при створенні пакету", err);
    }
  };

  const addQuestionToPackage = async (packageId: number, question: Question) => {
    try {
      const res = await fetch(`http://localhost:5000/packages/${packageId}/questions`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(question),
      });
      const newQuestion = await res.json();
      setPackages((prevPackages) =>
        prevPackages.map((pack) =>
          pack.id === packageId
            ? { ...pack, questions: [...pack.questions, newQuestion] }
            : pack
        )
      );
    } catch (err) {
      console.error("Помилка при додаванні питання", err);
    }
  };

  const deleteQuestionFromPackage = async (packageId: number, questionId: number) => {
    try {
      await fetch(`http://localhost:5000/packages/${packageId}/questions/${questionId}`, {
        method: "DELETE" });
      setPackages((prevPackages) =>
        prevPackages.map((pack) =>
          pack.id === packageId
            ? {
                ...pack,
                questions: pack.questions.filter((q) => q.id !== questionId),
              }
            : pack
        )
      );
    } catch (err) {
      console.error("Помилка при видаленні питання", err);
    }
  };

  const logout = () => {
    setUsername(null);
    localStorage.removeItem("username");
    navigate("/register"); 
  };

  return (
    <>
      <Header username={username} />
      <Routes>
        <Route
          path="/"
          element={
            <HomePage
              addPackage={addPackage}
              username={username}
              setUsername={setUsername}
            />
          }
        />
        <Route
          path="/package/:id"
          element={
            <PackagePage
              packages={packages}
              addQuestionToPackage={addQuestionToPackage}
              deleteQuestionFromPackage={deleteQuestionFromPackage}
              username={username}
            />
          }
        />
        <Route
          path="/play/:id"
          element={
            <PlayPage
              packages={packages}
              username={username}
              deleteQuestionFromPackage={deleteQuestionFromPackage}
            />
          }
        />
        <Route
          path="/profile"
          element={<ProfilePage packages={packages} username={username} logout={logout} />}
        />
        <Route path="/register" element={<RegisterPage setUsername={setUsername} />} />
        <Route
          path="*"
          element={<div style={{ padding: "20px", textAlign: "center" }}>Сторінку не знайдено 😕</div>}
        />
      </Routes>
    </>
  );
}

export default function App() {
  return (
    <BrowserRouter>
      <AppWrapper />
    </BrowserRouter>
  );
}
