// src/data/packages.ts

export type Question = {
  id: number;
  text: string;
  answer: string;
  likes: number;
  dislikes: number;
};

export type Package = {
  id: number;
  title: string;
  questions: Question[];
};


export const packages: Package[] = [
  {
    id: 1,
    title: "Синхрон-lite. Випуск XXVII",
    questions: [
      {
        id: 1,
        text: "Доктор Кріс Брітт дуже швидко діагностував пухлину мозку у нового пацієнта.Причиною діагнозу стали незвичайні відчуття під час НЬОГО. Назвіть його двокореневим словом.",
        answer: "рукостискання",
        likes: 0,
        dislikes: 0,
      },
      {
        id: 2,
        text: "Щоб показати ЇЇ, під час зйомок одного з фільмів Стенлі Кубрика на великий аркуш скла, який рухався і обертався, була приклеєна ручка. Назвіть її.",
        answer: "невагомість",
        likes: 0,
        dislikes: 0,
      },
    ],
  },
];
