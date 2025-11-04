// Dados dos jogos e utilitários
// Suporte a múltiplos blocos colados no final do arquivo:
// usamos import raw (string) e fazemos um parser que aceita
// vários objetos JSON top-level concatenados e os mescla.
import rawData from "./gameData.json?raw";

function parseMultiDataset(raw) {
  const acc = {
    translation_bank: [],
    match_pairs: [],
    multiple_choice: [],
    fill_blank: [],
    free_translation: [],
    match_madness: [],
  };

  // Scanner para extrair objetos JSON top-level concatenados
  let inString = false;
  let escape = false;
  let depth = 0;
  let start = -1;
  const blocks = [];
  for (let i = 0; i < raw.length; i++) {
    const ch = raw[i];
    if (inString) {
      if (escape) { escape = false; continue; }
      if (ch === "\\") { escape = true; continue; }
      if (ch === '"') { inString = false; }
      continue;
    } else {
      if (ch === '"') { inString = true; continue; }
      if (ch === '{' || ch === '[') {
        if (depth === 0 && ch === '{') start = i;
        depth++;
        continue;
      }
      if (ch === '}' || ch === ']') {
        depth--;
        if (depth === 0 && start >= 0) {
          blocks.push(raw.slice(start, i + 1));
          start = -1;
        }
        continue;
      }
    }
  }

  // Se não encontramos múltiplos blocos, tente parse simples
  if (blocks.length === 0) {
    try {
      const single = JSON.parse(raw);
      return mergeInto(acc, single);
    } catch {
      return acc; // vazio em caso de erro
    }
  }

  for (const b of blocks) {
    try {
      const obj = JSON.parse(b);
      mergeInto(acc, obj);
    } catch {
      // ignora blocos inválidos para não quebrar o app
    }
  }
  return acc;
}

function mergeInto(acc, obj) {
  if (!obj || typeof obj !== 'object') return acc;
  const keys = [
    'translation_bank',
    'match_pairs',
    'multiple_choice',
    'fill_blank',
    'free_translation',
    'match_madness',
  ];
  for (const k of keys) {
    if (Array.isArray(obj[k])) acc[k] = acc[k].concat(obj[k]);
  }
  return acc;
}

export const GAME_TYPES = {
  TRANSLATION_BANK: "translation_bank",
  MATCH_PAIRS: "match_pairs",
  MULTIPLE_CHOICE: "multiple_choice",
  FILL_BLANK: "fill_blank",
  FREE_TRANSLATION: "free_translation",
  MATCH_MADNESS: "match_madness",
};

// gameLibrary agora vem do JSON para facilitar manutenção e expansão
export const gameLibrary = parseMultiDataset(rawData);

export const getRandomGames = (count = 2) => {
  const gameTypes = Object.values(GAME_TYPES)
  const selected = []

  for (let i = 0; i < count; i++) {
    const randomType = gameTypes[Math.floor(Math.random() * gameTypes.length)]
    const games = gameLibrary[randomType]
    const randomGame = games[Math.floor(Math.random() * games.length)]
    selected.push({ type: randomType, game: randomGame })
  }

  return selected
}

export const initializeProgressData = () => {
  return {
    totalGamesPlayed: 0,
    totalCorrectAnswers: 0,
    totalWrongAnswers: 0,
    gameStats: {
      [GAME_TYPES.TRANSLATION_BANK]: { played: 0, correct: 0, wrong: 0 },
      [GAME_TYPES.MATCH_PAIRS]: { played: 0, correct: 0, wrong: 0 },
      [GAME_TYPES.MULTIPLE_CHOICE]: { played: 0, correct: 0, wrong: 0 },
      [GAME_TYPES.FILL_BLANK]: { played: 0, correct: 0, wrong: 0 },
      [GAME_TYPES.FREE_TRANSLATION]: { played: 0, correct: 0, wrong: 0 },
      [GAME_TYPES.MATCH_MADNESS]: { played: 0, correct: 0, wrong: 0 },
    },
    streakData: {
      currentStreak: 0,
      lastPlayedDate: null,
      dailyGamesCompleted: 0,
      dailyGamesRequired: 2,
    },
  }
}
