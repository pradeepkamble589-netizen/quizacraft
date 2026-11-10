import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '../components/ui/Button';
import { ALL_QUESTIONS } from '../data/quizData';

export const QuizPreview = () => {
  const navigate = useNavigate();

  return (
    <div className="flex-1 max-w-4xl mx-auto w-full p-4 sm:p-6 flex flex-col justify-center">
      <div className="bg-white/95 backdrop-blur-md rounded-3xl p-6 sm:p-10 shadow-2xl border-4 border-emerald-300">
        <div className="text-center mb-6">
          <span className="inline-block bg-emerald-100 text-emerald-900 border border-emerald-300 text-xs sm:text-sm font-black px-3.5 py-1 rounded-full uppercase tracking-wider mb-2">
            👀 Question Vault
          </span>
          <h1 className="text-3xl sm:text-4xl font-black text-emerald-950">
            Jungle Question Preview
          </h1>
          <p className="text-sm sm:text-base font-bold text-emerald-800 mt-1">
            Browse through our verified educational questions and fun facts
          </p>
        </div>

        <div className="space-y-4 max-h-[60vh] overflow-y-auto pr-2">
          {ALL_QUESTIONS.slice(0, 8).map((q, idx) => (
            <div key={idx} className="p-4 rounded-2xl bg-emerald-50 border-2 border-emerald-200">
              <div className="flex items-center gap-2 mb-1">
                <span className="text-2xl">{q.image}</span>
                <h3 className="font-black text-emerald-950 text-base">
                  Q{idx + 1}: {q.question}
                </h3>
              </div>
              <div className="grid grid-cols-2 gap-2 mt-2">
                {q.options.map((opt, oIdx) => (
                  <div
                    key={oIdx}
                    className={`px-3 py-1.5 rounded-xl text-xs font-bold ${
                      oIdx === q.correctIndex
                        ? 'bg-emerald-500 text-white shadow-sm'
                        : 'bg-white text-slate-700 border'
                    }`}
                  >
                    {String.fromCharCode(65 + oIdx)}. {opt} {oIdx === q.correctIndex && '✓'}
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>

        <div className="mt-6 pt-4 border-t border-emerald-200 flex justify-between items-center">
          <Button variant="secondary" onClick={() => navigate('/')}>
            ← Back to Home
          </Button>
          <Button variant="accent" size="lg" onClick={() => navigate('/categories')} icon="🚀">
            Start a Quiz Now
          </Button>
        </div>
      </div>
    </div>
  );
};

export default QuizPreview;