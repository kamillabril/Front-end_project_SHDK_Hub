import React, { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import type { Package, Question } from "../types";

type PlayPageProps = {
  packages: Package[];
  username: string | null;
  deleteQuestionFromPackage: (packageId: number, questionId: number) => void;
};

const PlayPage: React.FC<PlayPageProps> = ({ packages, username, deleteQuestionFromPackage }) => {
  const { id } = useParams<{ id: string }>();
  const packageId = Number(id);
  const pack = packages.find((p) => p.id === packageId);

  const [questionIndex, setQuestionIndex] = useState(0);
  const [timeLeft, setTimeLeft] = useState(60);
  const [isRunning, setIsRunning] = useState(false);
  const [showAnswer, setShowAnswer] = useState(false);
  const [likes, setLikes] = useState<{ [key: number]: number }>({});
  const [dislikes, setDislikes] = useState<{ [key: number]: number }>({});

  useEffect(() => {
    let timer: NodeJS.Timeout;
    if (isRunning && timeLeft > 0) {
      timer = setTimeout(() => setTimeLeft((t) => t - 1), 1000);
    } else if (isRunning && timeLeft === 0) {
      setShowAnswer(true);
      setIsRunning(false);
    }
    return () => clearTimeout(timer);
  }, [isRunning, timeLeft]);

  if (!pack) {
    return <div style={{ padding: "20px" }}>Пакет не знайдено.</div>;
  }

  const questions = pack.questions;
  const currentQuestion = questions[questionIndex];

  const handleNext = () => {
    setQuestionIndex((i) => i + 1);
    setTimeLeft(60);
    setIsRunning(false);
    setShowAnswer(false);
  };

  const handleLike = () => {
    setLikes((prev) => ({
      ...prev,
      [currentQuestion.id]: (prev[currentQuestion.id] || 0) + 1,
    }));
  };

  const handleDislike = () => {
    setDislikes((prev) => ({
      ...prev,
      [currentQuestion.id]: (prev[currentQuestion.id] || 0) + 1,
    }));
  };

  const handleSkip = () => {
    setShowAnswer(true);
    setIsRunning(false);
  };

  const handleDelete = () => {
    if (window.confirm("Ви впевнені, що хочете видалити це питання?")) {
      deleteQuestionFromPackage(pack.id, currentQuestion.id);
      setShowAnswer(false);
      setIsRunning(false);
      setTimeLeft(60);
      if (questionIndex < questions.length - 1) {
        setQuestionIndex(questionIndex); 
      } else {
        setQuestionIndex((i) => Math.max(0, i - 1));
      }
    }
  };

  const canDelete =
    username === currentQuestion.author || username === "Admin";

  return (
    <div style={{ padding: "30px", textAlign: "center" }}>
      <h2>{pack.title}</h2>

      <div style={{ fontSize: "24px", margin: "20px 0" }}>
        <strong>Питання {questionIndex + 1}:</strong> {currentQuestion.text}
      </div>

      <div style={{ fontSize: "48px", margin: "20px 0" }}>
        ⏱ {timeLeft}s
      </div>

      {!isRunning && !showAnswer && (
        <div>
          <button onClick={() => setIsRunning(true)} style={{ marginRight: "10px" }}>
            ▶ Play
          </button>
          <button onClick={handleSkip}>⏩ Пропустити</button>
        </div>
      )}

      {showAnswer && (
        <>
          <div style={{ marginTop: "20px", fontSize: "20px" }}>
            <strong>Відповідь:</strong> {currentQuestion.answer}
          </div>
          <div style={{ marginTop: "10px" }}>
            <button onClick={handleLike} style={{ marginRight: "10px" }}>
              👍 {likes[currentQuestion.id] || 0}
            </button>
            <button onClick={handleDislike}>
              👎 {dislikes[currentQuestion.id] || 0}
            </button>
          </div>

          {canDelete && (
            <div style={{ marginTop: "20px" }}>
              <button onClick={handleDelete} style={{ color: "red" }}>
                🗑 Видалити питання
              </button>
            </div>
          )}

          {questionIndex < questions.length - 1 ? (
            <button onClick={handleNext} style={{ marginTop: "20px" }}>
              Наступне питання
            </button>
          ) : (
            <div style={{ marginTop: "20px", fontWeight: "bold" }}>
              Це було останнє питання!
            </div>
          )}
        </>
      )}

      <Link to="/" style={{ display: "block", marginTop: "30px", color: "#5c16c5" }}>
        ← Повернутись до головної
      </Link>
    </div>
  );
};

export default PlayPage;
