import React, { useState, useEffect, useRef } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { StarDisplay } from '../components/StarDisplay';
import { Button } from '../components/ui/Button';
import { useRecorder } from '../context/RecorderContext';
import { voiceService } from '../services/voiceService';

export const ResultPage = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [showReview, setShowReview] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);

  const {
    isRecording,
    recordedVideoUrl,
    startRecording,
    stopRecording,
    downloadRecording,
    clearRecording,
  } = useRecorder();

  const score = location.state?.score ?? 5;
  const total = location.state?.total ?? 5;
  const stars = location.state?.stars ?? score;
  const categoryName = location.state?.categoryName ?? 'Jungle Adventure';
  const categoryId = location.state?.categoryId ?? 'mixed';
  const history = location.state?.history ?? [];

  const wrongAnswers = Math.max(0, total - score);
  const percentage = Math.round((score / total) * 100);

  // Determine dynamic congratulatory feedback message
  let feedbackMessage = '';
  let feedbackBadge = '🌟';
  let speechNarration = '';

  if (score === total) {
    feedbackMessage = 'Quiz Master! Amazing work! 🏆';
    feedbackBadge = '👑';
    speechNarration = total === 5
      ? 'Fantastic! You got all five questions correct. You are a Quiz Master!'
      : `Fantastic! You got all ${total} questions correct. You are a Quiz Master!`;
  } else if (score >= 3 || percentage >= 60) {
    feedbackMessage = 'Great Job! Keep exploring! 🌟';
    feedbackBadge = '🎉';
    speechNarration = "Great job! You did really well. Keep learning and you'll become a Quiz Master!";
  } else {
    feedbackMessage = 'Good effort! Keep learning and try again! 🌱';
    feedbackBadge = '💪';
    speechNarration = "Good effort! Every question is a chance to learn something new. Keep going!";
  }

  useEffect(() => {
    const unsubscribe = voiceService.subscribe((_settings, state) => {
      setIsSpeaking(state.isSpeaking);
    });

    const vSettings = voiceService.getNarratorSettings();
    if (vSettings.enabled && vSettings.autoPlay) {
      voiceService.speak(speechNarration);
    }

    return () => {
      unsubscribe();
      voiceService.stopSpeaking();
    };
  }, [speechNarration]);

  const handleReplayResultVoice = () => {
    voiceService.speak(speechNarration);
  };

  const handleRecordAgain = async () => {
    voiceService.stopSpeaking();
    clearRecording();
    const success = await startRecording();
    if (success) {
      navigate('/play', { state: { category: categoryId, count: total } });
    }
  };

  const handleTryAgain = () => {
    voiceService.stopSpeaking();
    navigate('/play', { state: { category: categoryId, count: total } });
  };

  const handleGoHome = () => {
    voiceService.stopSpeaking();
    navigate('/');
  };

  return (
    <div className="flex-1 max-w-3xl mx-auto w-full p-4 sm:p-6 flex flex-col justify-center animate-fadeIn">
      {/* Celebration Header Card */}
      <div className="bg-white/95 backdrop-blur-md rounded-3xl p-6 sm:p-10 shadow-2xl border-4 border-emerald-300 text-center relative overflow-hidden">
        {/* Floating Trophy & Emojis */}
        <div className="inline-flex items-center justify-center w-24 h-24 sm:w-28 sm:h-28 rounded-3xl bg-gradient-to-tr from-amber-300 to-yellow-200 border-4 border-amber-400 shadow-xl mb-3 text-5xl sm:text-6xl animate-bounce-slow">
          {score === total ? '🏆' : feedbackBadge}
        </div>

        <div className="mb-4">
          <div className="flex items-center justify-center gap-2 mb-2">
            <span className="inline-block bg-emerald-100 text-emerald-900 border border-emerald-300 text-xs sm:text-sm font-black px-3.5 py-1 rounded-full uppercase tracking-wider">
              🌴 {categoryName} Quest Complete!
            </span>

            {/* Replay Voice button */}
            <button
              type="button"
              onClick={handleReplayResultVoice}
              className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-black border transition-all cursor-pointer active:scale-95 shadow-sm ${
                isSpeaking
                  ? 'bg-amber-400 text-amber-950 border-amber-500 animate-pulse ring-2 ring-amber-300'
                  : 'bg-white hover:bg-emerald-50 text-emerald-800 border-emerald-300'
              }`}
              title="Click to replay narrator result feedback"
            >
              <span>{isSpeaking ? '🗣️' : '▶'}</span>
              <span>{isSpeaking ? 'Narrating...' : 'Replay Voice'}</span>
            </button>
          </div>

          <h1 className="text-3xl sm:text-4xl md:text-5xl font-black text-emerald-950 tracking-tight">
            🎉 Quiz Complete!
          </h1>
          <p className="text-lg sm:text-xl font-black text-emerald-700 mt-1">
            {feedbackMessage}
          </p>
        </div>

        {/* Score & Stars Display Box */}
        <div className="my-6 p-5 sm:p-6 bg-gradient-to-r from-emerald-50 via-amber-50 to-emerald-50 rounded-3xl border-2 border-emerald-200 shadow-inner">
          <div className="flex flex-col sm:flex-row items-center justify-around gap-4">
            {/* Score */}
            <div>
              <p className="text-xs font-black uppercase text-emerald-700 tracking-wider">Your Score</p>
              <p className="text-4xl sm:text-5xl font-black text-emerald-950">
                {score} <span className="text-2xl text-emerald-600 font-bold">/ {total}</span>
              </p>
              <p className="text-xs font-bold text-emerald-700 mt-0.5">({percentage}% Accuracy)</p>
            </div>

            <div className="h-10 w-px bg-emerald-200 hidden sm:block" />

            {/* Stars */}
            <div>
              <p className="text-xs font-black uppercase text-amber-700 tracking-wider mb-1">Total Stars</p>
              <StarDisplay stars={stars} maxStars={total} size="lg" />
              <p className="text-xs font-black text-amber-900 mt-1">
                +{stars} Golden Stars ⭐
              </p>
            </div>
          </div>
        </div>

        {/* Video Recording Download Section */}
        {recordedVideoUrl && (
          <div className="mb-6 p-4 rounded-2xl bg-amber-50 border-2 border-amber-300 shadow-sm flex flex-col sm:flex-row items-center justify-between gap-3 text-left">
            <div className="flex items-center gap-3">
              <span className="text-3xl">🎥</span>
              <div>
                <p className="font-extrabold text-amber-950 text-sm">Quiz Recording Saved!</p>
                <p className="text-xs text-amber-800">Visuals, questions, voice narration & music recorded.</p>
              </div>
            </div>
            <Button
              variant="accent"
              size="md"
              onClick={() => downloadRecording('QuizCraft-Quiz-Recording.webm')}
              icon="⬇️"
              className="w-full sm:w-auto font-black text-sm whitespace-nowrap shadow-md"
            >
              Download Recording
            </Button>
          </div>
        )}

        {/* Breakdown Stats */}
        <div className="grid grid-cols-2 gap-3 max-w-md mx-auto mb-6">
          <div className="bg-emerald-50 border-2 border-emerald-200 rounded-2xl p-3 flex items-center gap-3">
            <span className="text-2xl">✅</span>
            <div className="text-left">
              <p className="text-xs font-extrabold text-emerald-950">Correct Answers</p>
              <p className="text-lg font-black text-emerald-600">{score}</p>
            </div>
          </div>

          <div className="bg-rose-50 border-2 border-rose-200 rounded-2xl p-3 flex items-center gap-3">
            <span className="text-2xl">❌</span>
            <div className="text-left">
              <p className="text-xs font-extrabold text-rose-950">Wrong Answers</p>
              <p className="text-lg font-black text-rose-600">{wrongAnswers}</p>
            </div>
          </div>
        </div>

        {/* Review Answers Toggle */}
        {history.length > 0 && (
          <div className="mb-6">
            <button
              onClick={() => setShowReview(!showReview)}
              className="text-xs sm:text-sm font-bold text-emerald-800 hover:text-emerald-950 underline cursor-pointer"
            >
              {showReview ? '▲ Hide Question Review' : '▼ Review Your Answers'}
            </button>

            {showReview && (
              <div className="mt-4 text-left space-y-2.5 max-h-60 overflow-y-auto p-3 bg-emerald-50/70 rounded-2xl border border-emerald-200">
                {history.map((item, idx) => (
                  <div
                    key={idx}
                    className={`p-3 rounded-xl border text-xs sm:text-sm ${
                      item.isCorrect
                        ? 'bg-white border-green-300 text-emerald-950'
                        : 'bg-white border-rose-300 text-rose-950'
                    }`}
                  >
                    <p className="font-extrabold flex items-center gap-1.5 mb-1">
                      <span>{item.isCorrect ? '✅' : '❌'}</span>
                      <span>Q{idx + 1}: {item.question}</span>
                    </p>
                    <p className="text-slate-600">
                      Your answer: <span className="font-bold">{item.selected}</span>
                    </p>
                    {!item.isCorrect && (
                      <p className="text-emerald-700 font-bold">
                        Correct: {item.correctAnswer}
                      </p>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* Primary Action Buttons */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-3 max-w-xl mx-auto">
          <Button
            variant="accent"
            size="lg"
            className="w-full sm:w-auto font-black shadow-lg"
            onClick={handleTryAgain}
            icon="🔄"
          >
            Try Again
          </Button>

          <Button
            variant="secondary"
            size="lg"
            className="w-full sm:w-auto font-black shadow-md"
            onClick={handleRecordAgain}
            icon="🎥"
          >
            Record Again
          </Button>

          <Button
            variant="secondary"
            size="lg"
            className="w-full sm:w-auto font-black"
            onClick={handleGoHome}
            icon="🏠"
          >
            Home
          </Button>
        </div>
      </div>
    </div>
  );
};

export default ResultPage;