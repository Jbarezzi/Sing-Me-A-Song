import { testRepository } from "../repositories/testRepository";

function recommendations() {
  const data = [
    {
      name: "+Que Amizade - Froid",
      youtubeLink: "https://www.youtube.com/watch?v=tJBo8aIv0sU",
      score: 11,
    },
    {
      name: "Site - Froid",
      youtubeLink: "https://www.youtube.com/watch?v=2WQ09rapbSk",
      score: 7,
    },
    {
      name: "Fanfic - Froid",
      youtubeLink: "https://www.youtube.com/watch?v=TT-e3dudzPA",
      score: 6,
    },
    {
      name: "Flash - Froid",
      youtubeLink: "https://www.youtube.com/watch?v=ELHu7-dzngA",
      score: 35,
    },
    {
      name: "Fantasmas - Froid",
      youtubeLink: "https://www.youtube.com/watch?v=KB2I-5hNA0c",
      score: 6,
    },
    {
      name: "Psiu - Froid",
      youtubeLink: "https://www.youtube.com/watch?v=nafEsZz49mo",
      score: 10,
    },
    {
      name: "Avec Moi - Froid",
      youtubeLink: "https://www.youtube.com/watch?v=YLbd3hw4q3k",
      score: 25,
    },
    {
      name: "Beijinho - Froid",
      youtubeLink: "https://www.youtube.com/watch?v=4Kiu05AAFBo",
      score: 5,
    },
    {
      name: "Sdds Sant - Furamil 2Cão",
      youtubeLink: "https://www.youtube.com/watch?v=euF9FpzIO1k",
      score: 45,
    },
  ];

  return data;
}

async function mockData() {
  const data = recommendations();
  await testRepository.insert(data);
  return;
}

export const testService = {
  mockData,
};
