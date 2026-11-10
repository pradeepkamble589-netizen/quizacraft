import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { CATEGORIES, DIFFICULTIES } from '../data/quizData';
import { Button } from '../components/ui/Button';

export const CategorySelect = () => {
  const navigate = useNavigate();
  const [selectedCategory, setSelectedCategory] = useState('animals');
  const [selectedDifficulty, setSelectedDifficulty] = useState('medium');
  const [questionCount, setQuestionCount] = useState(5);

  const handleStart = () => {
    navigate('/play', {
      state: {
        category: selectedCategory,
        difficulty: selectedDifficulty,
        count: questionCount
      }
    });
  };

  return (
    <div className="flex-1 max-w-5xl mx-auto w-full p-4 sm:p-6 flex flex-col justify-center">
      {/* Title */}
      <div className="text-center mb-6">
        <span className="inline-block bg-emerald-800 text-emerald-200 border border-emerald-600 text-xs sm:text-sm font-black px-3 py-1 rounded-full uppercase tracking-wider mb-2">
          🗺️ Choose Your Path
        </span>
        <h1 className="text-3xl sm:text-4xl font-black text-white drop-shadow-md">
          Pick Your Quiz Adventure!
        </h1>
        <p className="text-emerald-200 font-bold text-sm sm:text-base mt-1">
          Select a fun topic and challenge level to get started
        </p>
      </div>

      {/* Category Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mb-6">
        {CATEGORIES.map((cat) => {
          const isSelected = selectedCategory === cat.id;

          return (
            <button
              key={cat.id}
              type="button"
              onClick={() => setSelectedCategory(cat.id)}
              className={`p-4 rounded-3xl text-left border-3 transition-all duration-200 relative select-none cursor-pointer flex flex-col justify-between ${
                isSelected
                  ? 'bg-white shadow-2xl border-emerald-500 ring-4 ring-emerald-300/60 scale-[1.03]'
                  : 'bg-white/90 hover:bg-white border-emerald-200 hover:border-emerald-300 shadow-md hover:-translate-y-1'
              }`}
            >
              <div>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-3xl sm:text-4xl p-2 rounded-2xl bg-emerald-100/80 border border-emerald-200">
                    {cat.icon}
                  </span>
                  {isSelected && (
                    <span className="bg-emerald-500 text-white text-xs font-black px-2.5 py-1 rounded-full shadow-sm">
                      Selected ✓
                    </span>
                  )}
                </div>

                <h3 className="text-xl font-black text-emerald-950 mb-1">
                  {cat.name}
                </h3>
                <p className="text-xs font-bold text-slate-600 leading-relaxed">
                  {cat.description}
                </p>
              </div>

              <div className="mt-3 pt-2 border-t border-emerald-100 flex items-center justify-between text-xs font-extrabold text-emerald-800">
                <span>Play Quest</span>
                <span>→</span>
              </div>
            </button>
          );
        })}
      </div>

      {/* Settings Options Box */}
      <div className="bg-white/95 backdrop-blur-md rounded-3xl p-5 sm:p-6 border-4 border-emerald-300 shadow-xl mb-6 max-w-3xl mx-auto w-full">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Difficulty Selection */}
          <div>
            <label className="block text-sm font-black text-emerald-950 mb-2">
              ⚡ Select Difficulty
            </label>
            <div className="grid grid-cols-3 gap-2">
              {DIFFICULTIES.map((diff) => (
                <button
                  key={diff.id}
                  type="button"
                  onClick={() => setSelectedDifficulty(diff.id)}
                  className={`py-2 px-1 rounded-2xl text-center border-2 transition-all cursor-pointer font-black text-xs sm:text-sm ${
                    selectedDifficulty === diff.id
                      ? 'bg-emerald-600 text-white border-emerald-700 shadow-md ring-2 ring-emerald-300'
                      : 'bg-emerald-50 text-emerald-900 border-emerald-200 hover:bg-emerald-100'
                  }`}
                >
                  <p>{diff.label.split(' ')[0]}</p>
                  <p className="text-[10px] font-bold opacity-80">{diff.time}s</p>
                </button>
              ))}
            </div>
          </div>

          {/* Question Count Selection */}
          <div>
            <label className="block text-sm font-black text-emerald-950 mb-2">
              🎯 Number of Questions
            </label>
            <div className="grid grid-cols-2 gap-2">
              {[5, 10].map((count) => (
                <button
                  key={count}
                  type="button"
                  onClick={() => setQuestionCount(count)}
                  className={`py-2 px-3 rounded-2xl text-center border-2 transition-all cursor-pointer font-black text-xs sm:text-sm ${
                    questionCount === count
                      ? 'bg-amber-400 text-amber-950 border-amber-500 shadow-md ring-2 ring-amber-200'
                      : 'bg-amber-50 text-amber-900 border-amber-200 hover:bg-amber-100'
                  }`}
                >
                  <p className="text-base">{count} Questions</p>
                  <p className="text-[10px] opacity-80">{count === 5 ? '⚡ Quick Play' : '🏆 Full Safari'}</p>
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Start Button */}
      <div className="flex items-center justify-center gap-4">
        <Button
          variant="secondary"
          size="lg"
          onClick={() => navigate('/')}
          className="font-black"
        >
          ← Back
        </Button>

        <Button
          variant="accent"
          size="xl"
          onClick={handleStart}
          className="font-black text-xl shadow-2xl px-10"
          icon="🚀"
        >
          Begin Adventure!
        </Button>
      </div>
    </div>
  );
};

export default CategorySelect;
