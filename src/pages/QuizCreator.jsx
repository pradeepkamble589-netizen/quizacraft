import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '../components/ui/Button';
import { Input } from '../components/ui/Input';
import { saveCustomQuiz, getCustomQuizzes } from '../utils/storage';

export const QuizCreator = () => {
  const navigate = useNavigate();
  const [title, setTitle] = useState('');
  const [savedQuizzes, setSavedQuizzes] = useState([]);
  const [questions, setQuestions] = useState([
    {
      question: '',
      image: '🦁',
      options: ['', '', '', ''],
      correctIndex: 0,
      explanation: '',
    },
  ]);
  const [success, setSuccess] = useState(false);

  useEffect(() => {
    setSavedQuizzes(getCustomQuizzes());
  }, []);

  const handleQuestionChange = (qIndex, field, value) => {
    const updated = [...questions];
    updated[qIndex][field] = value;
    setQuestions(updated);
  };

  const handleOptionChange = (qIndex, oIndex, value) => {
    const updated = [...questions];
    updated[qIndex].options[oIndex] = value;
    setQuestions(updated);
  };

  const handleAddQuestion = () => {
    const defaultEmojis = ['🦁', '🐯', '🐘', '🦒', '🦓', '🐒', '🦜', '🦩', '🌴'];
    const randomEmoji = defaultEmojis[questions.length % defaultEmojis.length];

    setQuestions([
      ...questions,
      {
        question: '',
        image: randomEmoji,
        options: ['', '', '', ''],
        correctIndex: 0,
        explanation: '',
      },
    ]);
  };

  const handleRemoveQuestion = (qIndex) => {
    if (questions.length <= 1) return;
    setQuestions(questions.filter((_, i) => i !== qIndex));
  };

  const handleSaveAndPlay = (e) => {
    e.preventDefault();
    if (!title.trim()) {
      alert('Please enter a fun Quiz Title! 🦁');
      return;
    }

    // Validate questions
    for (let i = 0; i < questions.length; i++) {
      const q = questions[i];
      if (!q.question.trim()) {
        alert(`Question #${i + 1} needs question text!`);
        return;
      }
      if (q.options.some((opt) => !opt.trim())) {
        alert(`Question #${i + 1} needs all 4 answer options filled!`);
        return;
      }
    }

    const formattedQuestions = questions.map((q, idx) => ({
      id: `custom-q-${idx}-${Date.now()}`,
      category: 'custom',
      question: q.question,
      image: q.image || '🌟',
      options: [...q.options],
      correctIndex: q.correctIndex,
      answer: q.options[q.correctIndex],
      explanation: q.explanation || 'Great job answering this custom question!',
      funFact: 'You answered a custom jungle challenge!'
    }));

    const customQuiz = {
      id: `custom-${Date.now()}`,
      title,
      questions: formattedQuestions,
      createdAt: new Date().toISOString()
    };

    saveCustomQuiz(customQuiz);
    setSavedQuizzes(getCustomQuizzes());
    setSuccess(true);

    setTimeout(() => {
      navigate('/play', {
        state: {
          category: 'jungle',
          customQuestions: formattedQuestions,
        },
      });
    }, 800);
  };

  const handlePlaySavedQuiz = (quiz) => {
    navigate('/play', {
      state: {
        category: 'jungle',
        customQuestions: quiz.questions,
      },
    });
  };

  const OPTION_LABELS = ['A', 'B', 'C', 'D'];
  const OPTION_BG_COLORS = [
    'bg-blue-100 text-blue-800 border-blue-300',
    'bg-purple-100 text-purple-800 border-purple-300',
    'bg-amber-100 text-amber-800 border-amber-300',
    'bg-rose-100 text-rose-800 border-rose-300'
  ];

  return (
    <div className="flex-1 max-w-4xl mx-auto w-full p-4 sm:p-6 flex flex-col justify-center my-4">
      {/* Central White Jungle Quiz Builder Panel */}
      <div className="bg-white/95 backdrop-blur-md rounded-3xl p-6 sm:p-10 shadow-2xl border-4 border-emerald-400 relative overflow-hidden">
        {/* Decorative corner leaves */}
        <div className="absolute top-3 left-4 text-3xl opacity-40 select-none animate-bounce-slow">🌿</div>
        <div className="absolute top-4 right-5 text-3xl opacity-40 select-none animate-bounce-slow" style={{ animationDelay: '1.2s' }}>🍃</div>

        {/* Builder Header */}
        <div className="text-center mb-6">
          <span className="inline-block bg-emerald-100 text-emerald-900 border-2 border-emerald-300 text-xs sm:text-sm font-black px-4 py-1 rounded-full uppercase tracking-wider mb-2 shadow-sm">
            ✏️ Jungle Quiz Builder
          </span>
          <h1 className="text-3xl sm:text-4xl md:text-5xl font-black text-emerald-950 tracking-tight">
            Create Your Own Jungle Quiz!
          </h1>
          <p className="text-sm sm:text-base font-bold text-emerald-800 mt-1 max-w-md mx-auto">
            Design fun multiple-choice questions for friends, classmates, and family
          </p>
        </div>

        {success && (
          <div className="mb-6 p-4 bg-emerald-100 border-2 border-emerald-500 rounded-2xl text-emerald-900 font-black text-center shadow-md animate-bounce">
            🎉 Quiz saved successfully! Launching your custom adventure...
          </div>
        )}

        <form onSubmit={handleSaveAndPlay} className="space-y-6">
          {/* Quiz Title Field */}
          <div className="bg-emerald-50/70 p-4 sm:p-5 rounded-2xl border-2 border-emerald-200 shadow-sm">
            <label className="block text-sm sm:text-base font-black text-emerald-950 mb-1.5 flex items-center gap-1.5">
              <span>🏷️</span>
              <span>Quiz Title:</span>
            </label>
            <Input
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="e.g. My Wild Rainforest Safari Quiz 🌴"
              className="bg-white"
              required
            />
          </div>

          {/* Question List */}
          <div className="space-y-6">
            {questions.map((q, qIndex) => (
              <div
                key={qIndex}
                className="p-5 sm:p-6 rounded-3xl bg-emerald-50/80 border-3 border-emerald-300 shadow-md relative transition-all"
              >
                {/* Question Header & Remove Button */}
                <div className="flex items-center justify-between mb-4 pb-2 border-b border-emerald-200">
                  <div className="flex items-center gap-2">
                    <span className="w-8 h-8 rounded-xl bg-emerald-600 text-white font-black text-sm flex items-center justify-center shadow-sm">
                      {qIndex + 1}
                    </span>
                    <h3 className="font-black text-emerald-950 text-base sm:text-lg">
                      Question {qIndex + 1}
                    </h3>
                  </div>

                  {questions.length > 1 && (
                    <button
                      type="button"
                      onClick={() => handleRemoveQuestion(qIndex)}
                      className="inline-flex items-center gap-1 px-3 py-1 rounded-xl bg-rose-100 hover:bg-rose-200 text-rose-700 text-xs font-black border border-rose-300 shadow-sm transition-all active:scale-95 cursor-pointer"
                      title="Remove this question"
                    >
                      <span>🗑️</span>
                      <span>Remove</span>
                    </button>
                  )}
                </div>

                <div className="space-y-4">
                  {/* Emoji Icon & Question Input */}
                  <div>
                    <label className="block text-xs font-black text-emerald-900 mb-1">
                      Question Prompt:
                    </label>
                    <div className="flex gap-2.5">
                      <Input
                        value={q.image}
                        onChange={(e) => handleQuestionChange(qIndex, 'image', e.target.value)}
                        placeholder="Emoji"
                        title="Question Mascot Emoji"
                        className="w-20 sm:w-24 text-center text-2xl bg-white"
                      />
                      <Input
                        value={q.question}
                        onChange={(e) => handleQuestionChange(qIndex, 'question', e.target.value)}
                        placeholder="Type your question here (e.g. Which bird can mimic sounds?)..."
                        className="flex-1 bg-white"
                        required
                      />
                    </div>
                  </div>

                  {/* 4 Answer Options */}
                  <div>
                    <label className="block text-xs font-black text-emerald-900 mb-1.5">
                      Four Answer Options:
                    </label>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                      {q.options.map((opt, oIndex) => (
                        <div key={oIndex} className="flex items-center gap-2 bg-white/80 p-1.5 rounded-2xl border border-emerald-200">
                          <span className={`w-8 h-8 rounded-xl border flex items-center justify-center font-black text-xs flex-shrink-0 shadow-sm ${OPTION_BG_COLORS[oIndex]}`}>
                            {OPTION_LABELS[oIndex]}
                          </span>
                          <Input
                            value={opt}
                            onChange={(e) => handleOptionChange(qIndex, oIndex, e.target.value)}
                            placeholder={`Option ${OPTION_LABELS[oIndex]}`}
                            className="py-1 text-sm bg-white border-emerald-200"
                            required
                          />
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Correct Answer Dropdown */}
                  <div className="flex flex-col sm:flex-row sm:items-center gap-2 pt-1 bg-emerald-100/60 p-3 rounded-2xl border border-emerald-200">
                    <label className="text-xs sm:text-sm font-black text-emerald-950 flex items-center gap-1.5">
                      <span>✅</span>
                      <span>Correct Answer:</span>
                    </label>
                    <select
                      value={q.correctIndex}
                      onChange={(e) => handleQuestionChange(qIndex, 'correctIndex', Number(e.target.value))}
                      className="px-3 py-2 rounded-xl border-2 border-emerald-400 font-black text-sm bg-white text-emerald-950 focus:outline-none focus:ring-2 focus:ring-emerald-300 cursor-pointer shadow-sm"
                    >
                      <option value={0}>Option A {q.options[0] ? `(${q.options[0]})` : ''}</option>
                      <option value={1}>Option B {q.options[1] ? `(${q.options[1]})` : ''}</option>
                      <option value={2}>Option C {q.options[2] ? `(${q.options[2]})` : ''}</option>
                      <option value={3}>Option D {q.options[3] ? `(${q.options[3]})` : ''}</option>
                    </select>
                  </div>

                  {/* Explanation Field */}
                  <div>
                    <label className="block text-xs font-black text-emerald-900 mb-1 flex items-center gap-1">
                      <span>💡</span>
                      <span>Explanation:</span>
                    </label>
                    <Input
                      value={q.explanation}
                      onChange={(e) => handleQuestionChange(qIndex, 'explanation', e.target.value)}
                      placeholder="Why is this answer correct? (Fun educational fact)"
                      className="text-sm py-2 bg-white"
                    />
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Add Question Button */}
          <div className="flex justify-center pt-2">
            <Button
              type="button"
              variant="outline"
              size="md"
              onClick={handleAddQuestion}
              icon="➕"
              className="text-sm font-black border-2 border-dashed border-emerald-400 hover:border-emerald-600 bg-emerald-50/50 hover:bg-emerald-100"
            >
              Add Another Question
            </Button>
          </div>

          {/* Action Buttons: Cancel and Save & Play */}
          <div className="flex items-center justify-between gap-3 pt-6 border-t-2 border-emerald-200">
            <Button
              type="button"
              variant="secondary"
              onClick={() => navigate('/')}
              className="font-black text-sm sm:text-base"
            >
              ← Cancel
            </Button>

            <Button
              type="submit"
              variant="accent"
              size="lg"
              icon="🚀"
              className="font-black text-base sm:text-xl shadow-xl px-6 sm:px-8 py-3.5"
            >
              Save & Create Quiz!
            </Button>
          </div>
        </form>

        {/* Saved Quizzes Section */}
        {savedQuizzes.length > 0 && (
          <div className="mt-8 pt-6 border-t-2 border-emerald-200">
            <h3 className="text-base sm:text-lg font-black text-emerald-950 mb-3 flex items-center gap-2">
              <span>📚</span>
              <span>Your Saved Custom Quizzes ({savedQuizzes.length})</span>
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {savedQuizzes.map((sq) => (
                <div
                  key={sq.id}
                  className="p-3.5 rounded-2xl bg-emerald-50 border-2 border-emerald-200 flex items-center justify-between shadow-sm"
                >
                  <div>
                    <h4 className="font-black text-sm text-emerald-950 line-clamp-1">
                      {sq.title}
                    </h4>
                    <p className="text-xs text-emerald-700 font-bold">
                      {sq.questions?.length || 0} Questions
                    </p>
                  </div>
                  <Button
                    variant="primary"
                    size="sm"
                    onClick={() => handlePlaySavedQuiz(sq)}
                    icon="▶"
                    className="text-xs font-black shadow-sm"
                  >
                    Play
                  </Button>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default QuizCreator;
