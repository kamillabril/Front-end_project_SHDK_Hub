

import React from "react";
import type { Package } from "../types";


type Props = {
  packages: Package[];
  username: string | null;
  logout: () => void;
};

const ProfilePage: React.FC<Props> = ({ packages, username, logout }) => {

  const userQuestionCount = packages.reduce((total, pkg) => {
    const userQuestions = pkg.questions.filter((q) => q.author === username);
    return total + userQuestions.length;
  }, 0);

  return (
    <div style={{ padding: "2rem" }}>
      <h2>Профіль користувача</h2>
      <p><strong>Ім'я користувача:</strong> {username}</p>
      <p><strong>Кількість створених питань:</strong> {userQuestionCount}</p>
      <button onClick={logout} style={{ marginTop: "1rem" }}>
        Вийти з акаунту
      </button>
    </div>
  );
};

export default ProfilePage;
