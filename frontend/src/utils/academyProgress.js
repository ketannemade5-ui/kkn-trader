// KKN TRADER - Academy Progress & LocalStorage Synchronization Utility

const STORAGE_KEY_COMPLETED = 'kkn_completed_lessons';
const STORAGE_KEY_SCORES = 'kkn_quiz_scores';
const STORAGE_KEY_LAST_LESSON = 'kkn_last_lesson';

export const getCompletedLessons = () => {
  try {
    const raw = localStorage.getItem(STORAGE_KEY_COMPLETED);
    return raw ? JSON.parse(raw) : [];
  } catch (e) {
    return [];
  }
};

export const markLessonCompletedLocal = (lessonSlug) => {
  try {
    const completed = getCompletedLessons();
    if (!completed.includes(lessonSlug)) {
      const updated = [...completed, lessonSlug];
      localStorage.setItem(STORAGE_KEY_COMPLETED, JSON.stringify(updated));
      return updated;
    }
    return completed;
  } catch (e) {
    return [];
  }
};

export const isLessonCompleted = (lessonSlug) => {
  const completed = getCompletedLessons();
  return completed.includes(lessonSlug);
};

export const getLevelProgress = (level) => {
  if (!level || !level.lessons || level.lessons.length === 0) return 0;
  const completed = getCompletedLessons();
  const levelCompletedCount = level.lessons.filter((l) => completed.includes(l.slug)).length;
  return Math.round((levelCompletedCount / level.lessons.length) * 100);
};

export const getOverallAcademyProgress = (allLevels) => {
  if (!allLevels || allLevels.length === 0) return 0;
  const totalLessons = allLevels.reduce((acc, lvl) => acc + (lvl.lessons?.length || 0), 0);
  if (totalLessons === 0) return 0;
  const completed = getCompletedLessons();
  return Math.round((completed.length / totalLessons) * 100);
};

export const saveLastOpenedLesson = (levelId, lessonSlug) => {
  try {
    localStorage.setItem(STORAGE_KEY_LAST_LESSON, JSON.stringify({ levelId, lessonSlug, timestamp: Date.now() }));
  } catch (e) {
    // ignore
  }
};

export const getLastOpenedLesson = () => {
  try {
    const raw = localStorage.getItem(STORAGE_KEY_LAST_LESSON);
    return raw ? JSON.parse(raw) : null;
  } catch (e) {
    return null;
  }
};

export const saveQuizScore = (levelId, score, totalQuestions) => {
  try {
    const raw = localStorage.getItem(STORAGE_KEY_SCORES);
    const scores = raw ? JSON.parse(raw) : {};
    scores[levelId] = {
      score,
      totalQuestions,
      percent: Math.round((score / totalQuestions) * 100),
      passed: (score / totalQuestions) >= 0.6,
      date: new Date().toISOString(),
    };
    localStorage.setItem(STORAGE_KEY_SCORES, JSON.stringify(scores));
    return scores;
  } catch (e) {
    return {};
  }
};

export const getQuizScores = () => {
  try {
    const raw = localStorage.getItem(STORAGE_KEY_SCORES);
    return raw ? JSON.parse(raw) : {};
  } catch (e) {
    return {};
  }
};
