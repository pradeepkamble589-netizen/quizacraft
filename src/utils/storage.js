// LocalStorage utilities for QuizCraft with safe fallback

const STATS_KEY = 'quizcraft_stats';
const SETTINGS_KEY = 'quizcraft_settings';
const CUSTOM_QUIZZES_KEY = 'quizcraft_custom_quizzes';

export const getStoredStats = () => {
  try {
    const raw = localStorage.getItem(STATS_KEY);
    if (!raw) {
      return {
        bestScore: 0,
        bestTotal: 5,
        quizzesPlayed: 0,
        totalStars: 0,
        categoryScores: {},
      };
    }
    return JSON.parse(raw);
  } catch {
    return {
      bestScore: 0,
      bestTotal: 5,
      quizzesPlayed: 0,
      totalStars: 0,
      categoryScores: {},
    };
  }
};

export const saveQuizScore = ({ score, total, stars, categoryId }) => {
  try {
    const current = getStoredStats();
    const newQuizzesPlayed = (current.quizzesPlayed || 0) + 1;
    const newTotalStars = (current.totalStars || 0) + stars;

    // Check if score is better proportionally or higher
    const prevPercentage = current.bestTotal ? (current.bestScore / current.bestTotal) : 0;
    const currentPercentage = total ? (score / total) : 0;

    let newBestScore = current.bestScore || 0;
    let newBestTotal = current.bestTotal || 5;

    if (currentPercentage > prevPercentage || (currentPercentage === prevPercentage && score > newBestScore)) {
      newBestScore = score;
      newBestTotal = total;
    }

    const updated = {
      bestScore: newBestScore,
      bestTotal: newBestTotal,
      quizzesPlayed: newQuizzesPlayed,
      totalStars: newTotalStars,
      categoryScores: {
        ...(current.categoryScores || {}),
        [categoryId]: Math.max(score, current.categoryScores?.[categoryId] || 0)
      }
    };

    localStorage.setItem(STATS_KEY, JSON.stringify(updated));
    return updated;
  } catch {
    return null;
  }
};

export const getStoredSettings = () => {
  try {
    const raw = localStorage.getItem(SETTINGS_KEY);
    if (!raw) {
      return {
        soundEnabled: true,
        timerEnabled: true,
        defaultDuration: 20,
      };
    }
    return JSON.parse(raw);
  } catch {
    return {
      soundEnabled: true,
      timerEnabled: true,
      defaultDuration: 20,
    };
  }
};

export const saveStoredSettings = (settings) => {
  try {
    localStorage.setItem(SETTINGS_KEY, JSON.stringify(settings));
  } catch {
    // Ignore error
  }
};

export const getCustomQuizzes = () => {
  try {
    const raw = localStorage.getItem(CUSTOM_QUIZZES_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
};

export const saveCustomQuiz = (quiz) => {
  try {
    const list = getCustomQuizzes();
    const updated = [quiz, ...list.filter(q => q.id !== quiz.id)];
    localStorage.setItem(CUSTOM_QUIZZES_KEY, JSON.stringify(updated));
    return updated;
  } catch {
    return [];
  }
};
