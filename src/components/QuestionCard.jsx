import React from 'react';
import AnswerButton from './AnswerButton';

export const QuestionCard = ({
  question,
  questionNumber = 1,
  totalQuestions = 5,
  selectedAnswer,
  isAnswered,
  onSelectOption,
  onReplayVoice,
  isSpeaking = false,
  disabled
}) => {
  if (!question) return null;

  return (
    <div className="w-full">
      {/* Question Header & Emoji */}
      <div className="text-center mb-5">
        <div className="flex items-center justify-center gap-2 mb-2">
          <span className="inline-block bg-emerald-100 text-emerald-900 border border-emerald-300 text-xs font-black px-3 py-0.5 rounded-full uppercase tracking-wider">
            Question {questionNumber} of {totalQuestions}
          </span>

          {/* Replay Voice button */}
          {onReplayVoice && (
            <button
              type="button"
              onClick={onReplayVoice}
              className={`inline-flex items-center gap-1.5 px-3 py-0.5 rounded-full text-xs font-black border transition-all cursor-pointer active:scale-95 shadow-sm ${
                isSpeaking
                  ? 'bg-amber-400 text-amber-950 border-amber-500 animate-pulse ring-2 ring-amber-300'
                  : 'bg-white hover:bg-emerald-50 text-emerald-800 border-emerald-300'
              }`}
              title="Click to replay narrator reading the question"
            >
              <span>{isSpeaking ? '🗣️' : '▶'}</span>
              <span>{isSpeaking ? 'Narrating...' : 'Replay Voice'}</span>
            </button>
          )}
        </div>

        <div className="inline-flex items-center justify-center w-20 h-20 sm:w-24 sm:h-24 rounded-3xl bg-gradient-to-tr from-amber-200 via-yellow-100 to-emerald-100 border-4 border-amber-300 shadow-xl mb-3 text-4xl sm:text-5xl animate-bounce-slow">
          {question.image || '🌟'}
        </div>

        <h2 className="text-xl sm:text-2xl md:text-3xl font-black text-emerald-950 leading-snug max-w-2xl mx-auto drop-shadow-sm px-2">
          {question.question}
        </h2>
      </div>

      {/* 4 Answer Options in Responsive Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5 sm:gap-4 max-w-3xl mx-auto">
        {question.options.map((option, idx) => {
          const isSelected = selectedAnswer === idx;
          const isRight = idx === question.correctIndex;

          return (
            <AnswerButton
              key={idx}
              index={idx}
              optionText={option}
              isSelected={isSelected}
              isCorrect={isSelected && isRight}
              isAnswered={isAnswered}
              isRightAnswer={isRight}
              onClick={() => onSelectOption(idx)}
              disabled={disabled}
            />
          );
        })}
      </div>
    </div>
  );
};

export default QuestionCard;
