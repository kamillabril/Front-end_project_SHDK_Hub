import React, { useState } from "react";
import { useParams, Link } from "react-router-dom";
import type { Package, Question } from "../types";

type PackagePageProps = {
  packages: Package[];
  addQuestionToPackage: (packageId: number, question: Question) => void;
  deleteQuestionFromPackage: (packageId: number, questionId: number) => void;
  username: string | null;
};

function PackagePage({
  packages,
  addQuestionToPackage,
  deleteQuestionFromPackage,
  username,
}: PackagePageProps) {
  const { id } = useParams<{ id: string }>();
  const packageId = Number(id);
  const pack = packages.find((p) => p.id === packageId);
  console.log(packageId)
  if (!pack) {
    return <div>Пакет не знайдено.</div>;
  } 

  const [newQuestionText, setNewQuestionText] = useState("");
  const [newAnswer, setNewAnswer] = useState("");
  const [visibleAnswers, setVisibleAnswers] = useState<{ [key: number]: boolean }>({});

  if (!pack) {
    return <div>Пакет не знайдено.</div>;
  }

  const toggleAnswer = (questionId: number) => {
    setVisibleAnswers((prev) => ({
      ...prev,
      [questionId]: !prev[questionId],
    }));
  };

  const handleAddQuestion = () => {
    if (newQuestionText.trim() === "" || newAnswer.trim() === "" || !username) return;

    const newQuestion: Question = {
      id: Date.now(),
      text: newQuestionText.trim(),
      answer: newAnswer.trim(),
      author: username,
    };

    addQuestionToPackage(pack.id, newQuestion);
    setNewQuestionText("");
    setNewAnswer("");
  };

  return (
    <div style={{ padding: "20px", textAlign: "center" }}>
      <h1>{pack.title}</h1>

      {pack.questions.length === 0 ? (
        <p>Питань поки що немає.</p>
      ) : (
        pack.questions.map((q) => (
          <div key={q.id} style={{ marginBottom: "15px" }}>
            <div>
              <strong>Питання:</strong> {q.text}
            </div>

            <div
              onClick={() => toggleAnswer(q.id)}
              style={{
                color: "#5c16c5",
                textDecoration: "underline",
                cursor: "pointer",
                marginTop: "5px",
                userSelect: "none",
                width: "fit-content",
                margin: "auto",
              }}
            >
              Відповідь
            </div>

            {visibleAnswers[q.id] && (
              <div style={{ marginTop: "5px", color: "black" }}>{q.answer}</div>
            )}

            {(username === q.author || username === "Admin") && (
              <button
                onClick={() => {
                  if (window.confirm("Видалити це питання?")) {
                    deleteQuestionFromPackage(pack.id, q.id);
                  }
                }}
                style={{
                  marginTop: "8px",
                  backgroundColor: "transparent",
                  border: "1px solid red",
                  color: "red",
                  padding: "4px 10px",
                  cursor: "pointer",
                }}
              >
                🗑 Видалити
              </button>
            )}
          </div>
        ))
      )}

      <div style={{ marginTop: "20px" }}>
        <input
          type="text"
          value={newQuestionText}
          onChange={(e) => setNewQuestionText(e.target.value)}
          placeholder="Текст нового питання"
          style={{ marginRight: "10px" }}
        />
        <input
          type="text"
          value={newAnswer}
          onChange={(e) => setNewAnswer(e.target.value)}
          placeholder="Відповідь на питання"
          style={{ marginRight: "10px" }}
        />
        <button onClick={handleAddQuestion}>Додати питання</button>
      </div>

      <Link to="/" style={{ display: "block", marginTop: "30px", color: "#5c16c5" }}>
        ← Повернутись до пакетів
      </Link>

      <Link to={`/play/${pack.id}`}>
        <button style={{ marginTop: "20px", padding: "10px 20px", fontSize: "16px" }}>
          ▶ Відтворити
        </button>
      </Link>
    </div>
  );
}

export default PackagePage;
