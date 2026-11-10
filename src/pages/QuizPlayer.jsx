import React, { useState, useEffect, useRef, useCallback } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { getFilteredQuestions, CATEGORIES, DIFFICULTIES } from '../data/quizData';
import { getStoredSettings, saveQuizScore } from '../utils/storage';
import { playCorrectSound, playWrongSound, playVictorySound } from '../utils/audio';
import { voiceService } from '../services/voiceService';
import Header from '../components/Header';
import ProgressBar from '../components/ProgressBar';
import Timer from '../components/Timer';
import QuestionCard from '../components/QuestionCard';
import ExplanationCard from '../components/ExplanationCard';

export const QuizPlayer = () => {
  const location = useLocation();
  const navigate = useNavigate();

  // Extract navigation parameters or use defaults
  const categoryId = location.state?.category || 'mixed';
  const difficultyId = location.state?.difficulty || 'medium';
  const questionCount = location.state?.count || 5;
  const customQuestions = location.state?.customQuestions || null;

  const currentCategory = CATEGORIES.find(c => c.id === categoryId) || CATEGORIES[5];
  const difficultyObj = DIFFICULTIES.find(d => d.id === difficultyId) || DIFFICULTIES[1];

  const settings = getStoredSettings();
  const isTimerEnabled = settings.timerEnabled ?? true;
  const initialTime = difficultyObj.time || settings.defaultDuration || 20;

  // Quiz State
  const [questions, setQuestions] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState(null);
  const [isAnswered, setIsAnswered] = useState(false);
  const [isTimeout, setIsTimeout] = useState(false);
  const [score, setScore] = useState(0);
  const [stars, setStars] = useState(0);
  const [timeLeft, setTimeLeft] = useState(initialTime);
  const [isPaused, setIsPaused] = useState(false);
  const [history, setHistory] = useState([]);
  const [isNarratorSpeaking, setIsNarratorSpeaking] = useState(false);

  const hasWelcomePlayedRef = useRef(false);

  // Subscribe to voiceService speaking state
  useEffect(() => {
    const unsubscribe = voiceService.subscribe((_settings, state) => {
      setIsNarratorSpeaking(state.isSpeaking);
    });
    return () => {
      unsubscribe();
      voiceService.stopSpeaking();
    };
  }, []);

  // Initialize questions on mount
  useEffect(() => {
    let loaded = [];
    if (customQuestions && customQuestions.length > 0) {
      loaded = customQuestions;
    } else {
      loaded = getFilteredQuestions(categoryId, difficultyId, questionCount);
    }

    setQuestions(loaded);
    setCurrentIndex(0);
    setScore(0);
    setStars(0);
    setSelectedAnswer(null);
    setIsAnswered(false);
    setIsTimeout(false);
    setTimeLeft(initialTime);
    setHistory([]);
    hasWelcomePlayedRef.current = false;
  }, [categoryId, difficultyId, questionCount, initialTime, customQuestions]);

  const currentQ = questions[currentIndex];

  // Narration helper for question
  const narrateQuestion = useCallback((qIndex, questionObj) => {
    if (!questionObj) return;
    const vSettings = voiceService.getNarratorSettings();
    if (!vSettings.enabled || !vSettings.autoPlay) return;

    let speechText = '';
    if (qIndex === 0 && !hasWelcomePlayedRef.current) {
      hasWelcomePlayedRef.current = true;
      speechText = `Welcome to QuizCraft! Let's begin our adventure! Question 1. ${questionObj.question}`;
    } else {
      speechText = `Question ${qIndex + 1}. ${questionObj.question}`;
    }

    voiceService.speak(speechText);
  }, []);

  // Trigger narration when current question changes
  useEffect(() => {
    if (!currentQ || isAnswered) return;
    narrateQuestion(currentIndex, currentQ);
  }, [currentIndex, currentQ, isAnswered, narrateQuestion]);

  // Handle Timeout Callback
  const handleTimeout = useCallback(() => {
    if (isAnswered || !currentQ) return;
    setIsAnswered(true);
    setIsTimeout(true);
    playWrongSound();

    const correctAnswerText = currentQ.answer || currentQ.options[currentQ.correctIndex];
    const explanationText = currentQ.explanation || '';

    setHistory(prev => [
      ...prev,
      {
        question: currentQ.question,
        image: currentQ.image,
        selected: 'Timed Out',
        correctAnswer: correctAnswerText,
        isCorrect: false
      }
    ]);

    // Narrate timeout / incorrect result & explanation
    const speechText = `Good try! The correct answer is ${correctAnswerText}. ${explanationText}`;
    voiceService.speak(speechText);
  }, [isAnswered, currentQ]);

  // Timer Countdown Effect
  useEffect(() => {
    if (!isTimerEnabled || isAnswered || isPaused || questions.length === 0) return;

    const interval = setInterval(() => {
      setTimeLeft(prev => {
        if (prev <= 1) {
          clearInterval(interval);
          handleTimeout();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(interval);
  }, [currentIndex, isAnswered, isPaused, isTimerEnabled, questions.length, handleTimeout]);

  // Handle Answer Selection
  const handleSelectOption = (index) => {
    if (isAnswered || !currentQ) return;

    setSelectedAnswer(index);
    setIsAnswered(true);

    const isCorrect = index === currentQ.correctIndex;
    const correctAnswerText = currentQ.answer || currentQ.options[currentQ.correctIndex];
    const explanationText = currentQ.explanation || '';

    if (isCorrect) {
      setScore(prev => prev + 1);
      setStars(prev => prev + 1);
      playCorrectSound();
    } else {
      playWrongSound();
    }

    setHistory(prev => [
      ...prev,
      {
        question: currentQ.question,
        image: currentQ.image,
        selected: currentQ.options[index],
        correctAnswer: correctAnswerText,
        isCorrect
      }
    ]);

    // Voice Narration:
    // If Correct: "Great job! That's correct. The answer is {answer}. {explanation}"
    // If Incorrect: "Good try! The correct answer is {answer}. {explanation}"
    let feedbackSpeech = '';
    if (isCorrect) {
      feedbackSpeech = `Great job! That's correct. The answer is ${correctAnswerText}. ${explanationText}`;
    } else {
      feedbackSpeech = `Good try! The correct answer is ${correctAnswerText}. ${explanationText}`;
    }

    voiceService.speak(feedbackSpeech);
  };

  // Replay question narration
  const handleReplayQuestion = () => {
    if (!currentQ) return;
    const speechText = `Question ${currentIndex + 1}. ${currentQ.question}`;
    voiceService.speak(speechText);
  };

  // Replay explanation narration
  const handleReplayExplanation = () => {
    if (!currentQ) return;
    const isCorrect = selectedAnswer === currentQ.correctIndex;
    const correctAnswerText = currentQ.answer || currentQ.options[currentQ.correctIndex];
    const explanationText = currentQ.explanation || '';

    let feedbackSpeech = '';
    if (isCorrect) {
      feedbackSpeech = `Great job! That's correct. The answer is ${correctAnswerText}. ${explanationText}`;
    } else {
      feedbackSpeech = `Good try! The correct answer is ${correctAnswerText}. ${explanationText}`;
    }

    voiceService.speak(feedbackSpeech);
  };

  // Handle Next Question or Completion
  const handleNext = () => {
    voiceService.stopSpeaking();

    if (currentIndex < questions.length - 1) {
      // Announce transition
      voiceService.speak("Let's move to the next question!", {
        onEnd: () => {
          // Proceed to next
        }
      });

      setCurrentIndex(prev => prev + 1);
      setSelectedAnswer(null);
      setIsAnswered(false);
      setIsTimeout(false);
      setTimeLeft(initialTime);
    } else {
      // Quiz Finished!
      const finalStars = stars;
      const finalScore = score;
      const total = questions.length;

      saveQuizScore({
        score: finalScore,
        total,
        stars: finalStars,
        categoryId
      });

      playVictorySound();

      navigate('/result', {
        state: {
          score: finalScore,
          total,
          stars: finalStars,
          categoryId,
          categoryName: currentCategory.name,
          categoryBadge: currentCategory.badge,
          history
        }
      });
    }
  };

  if (!questions || questions.length === 0) {
    return (
      <div className="flex-1 flex items-center justify-center p-6 text-white font-black text-xl">
        <div className="text-center">
          <span className="text-5xl animate-bounce inline-block mb-3">🌴</span>
          <p>Preparing your adventure...</p>
        </div>
      </div>
    );
  }

  const isLastQuestion = currentIndex === questions.length - 1;
  const isSelectedCorrect = selectedAnswer === currentQ.correctIndex;
  const correctAnswerString = currentQ.answer || currentQ.options[currentQ.correctIndex];

  return (
    <div className="flex-1 flex flex-col justify-between">
      {/* Quiz Top Header */}
      <Header
        stars={stars}
        categoryName={currentCategory.name}
        score={score}
        totalQuestions={questions.length}
      />

      {/* Main Quiz Body Container */}
      <main className="flex-1 max-w-4xl mx-auto w-full p-4 sm:p-6 flex flex-col justify-center">
        {/* Progress & Timer Bar */}
        <div className="w-full bg-emerald-900/60 backdrop-blur-md rounded-3xl p-4 sm:p-5 border-2 border-emerald-700/60 shadow-xl mb-4 sm:mb-6">
          <div className="flex items-center justify-between gap-4">
            <div className="flex-1">
              <ProgressBar
                current={currentIndex + 1}
                total={questions.length}
                categoryIcon={currentCategory.badge}
              />
            </div>
            <div className="flex-shrink-0">
              <Timer
                timeLeft={timeLeft}
                maxTime={initialTime}
                isPaused={isPaused}
                isEnabled={isTimerEnabled}
              />
            </div>
          </div>
        </div>

        {/* Central Question Card */}
        <div className={`bg-white/95 backdrop-blur-md rounded-3xl p-5 sm:p-8 shadow-2xl border-4 ${currentCategory.cardBorder || 'border-emerald-300'} relative overflow-hidden transition-all`}>
          <QuestionCard
            question={currentQ}
            questionNumber={currentIndex + 1}
            totalQuestions={questions.length}
            selectedAnswer={selectedAnswer}
            isAnswered={isAnswered}
            onSelectOption={handleSelectOption}
            onReplayVoice={handleReplayQuestion}
            isSpeaking={isNarratorSpeaking && !isAnswered}
            disabled={isAnswered}
          />

          {/* Explanation Banner & Next Action */}
          {isAnswered && (
            <ExplanationCard
              isCorrect={isSelectedCorrect}
              isTimeout={isTimeout}
              explanation={currentQ.explanation}
              funFact={currentQ.funFact}
              correctAnswerText={correctAnswerString}
              onReplayVoice={handleReplayExplanation}
              isSpeaking={isNarratorSpeaking && isAnswered}
              onNext={handleNext}
              isLastQuestion={isLastQuestion}
            />
          )}
        </div>
      </main>
    </div>
  );
};

export default QuizPlayer;