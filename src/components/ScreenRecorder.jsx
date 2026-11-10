import React, { useState } from 'react';
import { useRecorder } from '../context/RecorderContext';
import { Button } from './ui/Button';

export const ScreenRecorder = ({ variant = 'button', className = '' }) => {
  const {
    isRecording,
    recordingTime,
    recordedVideoUrl,
    errorMsg,
    isSupported,
    startRecording,
    stopRecording,
    downloadRecording,
    clearRecording,
  } = useRecorder();

  const [showInfoModal, setShowInfoModal] = useState(false);
  const [showResultModal, setShowResultModal] = useState(false);

  // Format seconds into MM:SS
  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const handleStartClick = () => {
    if (isRecording) {
      stopRecording();
      setShowResultModal(true);
    } else {
      setShowInfoModal(true);
    }
  };

  const handleConfirmStart = async () => {
    setShowInfoModal(false);
    const success = await startRecording();
    if (!success) {
      // Error is set in context
    }
  };

  // Compact Header / Nav icon button
  if (variant === 'compact') {
    return (
      <div className={`relative ${className}`}>
        {isRecording ? (
          <button
            onClick={() => {
              stopRecording();
              setShowResultModal(true);
            }}
            className="flex items-center gap-1.5 px-3 py-1 rounded-2xl bg-rose-600 hover:bg-rose-500 text-white font-extrabold text-xs sm:text-sm border-2 border-rose-300 shadow-lg animate-pulse cursor-pointer active:scale-95 transition-transform"
            title="Click to Stop Screen Recording"
            aria-label="Stop Recording"
          >
            <span className="w-2.5 h-2.5 rounded-full bg-white animate-ping" />
            <span>⏹ {formatTime(recordingTime)}</span>
          </button>
        ) : recordedVideoUrl ? (
          <button
            onClick={() => setShowResultModal(true)}
            className="flex items-center gap-1 px-2.5 py-1 rounded-2xl bg-amber-400 hover:bg-amber-300 text-amber-950 font-black text-xs sm:text-sm border border-amber-300 shadow-md cursor-pointer active:scale-95 transition-transform"
            title="Download your quiz recording"
          >
            <span>⬇️</span>
            <span className="hidden sm:inline">Save Video</span>
          </button>
        ) : (
          <button
            onClick={handleStartClick}
            className="flex items-center gap-1 px-2.5 py-1 rounded-2xl bg-emerald-800/80 hover:bg-emerald-700 text-emerald-100 font-bold text-xs sm:text-sm border border-emerald-600/70 shadow-sm cursor-pointer active:scale-95 transition-transform"
            title="Record Quiz Session"
            aria-label="Record Screen"
          >
            <span>🎥</span>
            <span className="hidden sm:inline">Record</span>
          </button>
        )}

        {/* Informational Modal */}
        {showInfoModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fadeIn">
            <div className="bg-white rounded-3xl p-6 max-w-sm w-full shadow-2xl border-4 border-emerald-300 text-center">
              <div className="text-4xl mb-2">🎥</div>
              <h3 className="text-xl font-black text-emerald-950 mb-2">Record Your Adventure!</h3>
              <p className="text-xs sm:text-sm text-slate-600 font-bold mb-4 leading-relaxed">
                Your browser will now prompt you to select the screen, window, or browser tab you would like to record.
              </p>
              <div className="bg-emerald-50 rounded-2xl p-3 border border-emerald-200 text-left text-xs text-emerald-900 font-semibold mb-5">
                <p>🔒 <strong>100% Private:</strong> The recording stays inside your browser and is never uploaded anywhere.</p>
              </div>
              <div className="flex gap-2">
                <Button variant="secondary" className="flex-1 text-xs" onClick={() => setShowInfoModal(false)}>
                  Cancel
                </Button>
                <Button variant="accent" className="flex-1 text-xs font-black" onClick={handleConfirmStart}>
                  Choose Screen 🚀
                </Button>
              </div>
            </div>
          </div>
        )}

        {/* Video Result / Download Modal */}
        {showResultModal && recordedVideoUrl && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fadeIn">
            <div className="bg-white rounded-3xl p-6 max-w-md w-full shadow-2xl border-4 border-emerald-300 text-center">
              <div className="text-4xl mb-2">🎉</div>
              <h3 className="text-2xl font-black text-emerald-950 mb-1">Recording Ready!</h3>
              <p className="text-xs font-bold text-slate-600 mb-4">
                Watch your quiz walkthrough or download it to keep forever.
              </p>

              <div className="rounded-2xl overflow-hidden border-2 border-emerald-300 shadow-inner bg-black mb-4">
                <video src={recordedVideoUrl} controls className="w-full max-h-48 object-contain" />
              </div>

              <div className="flex flex-col gap-2">
                <Button
                  variant="accent"
                  size="md"
                  onClick={() => downloadRecording('QuizCraft-Quiz-Recording.webm')}
                  icon="⬇️"
                  className="w-full font-black text-base shadow-lg"
                >
                  Download Recording (.webm)
                </Button>

                <div className="flex gap-2 mt-1">
                  <Button
                    variant="outline"
                    className="flex-1 text-xs"
                    onClick={() => {
                      clearRecording();
                      setShowResultModal(false);
                      setShowInfoModal(true);
                    }}
                  >
                    Record Again 🔄
                  </Button>
                  <Button
                    variant="secondary"
                    className="flex-1 text-xs"
                    onClick={() => setShowResultModal(false)}
                  >
                    Close
                  </Button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    );
  }

  // Full Button / Card variant
  return (
    <div className={`inline-block ${className}`}>
      {isRecording ? (
        <Button
          variant="danger"
          size="md"
          onClick={() => {
            stopRecording();
            setShowResultModal(true);
          }}
          className="font-black animate-pulse"
          icon="⏹"
        >
          Stop Recording ({formatTime(recordingTime)})
        </Button>
      ) : recordedVideoUrl ? (
        <div className="flex items-center gap-2">
          <Button
            variant="accent"
            size="md"
            onClick={() => downloadRecording('QuizCraft-Quiz-Recording.webm')}
            icon="⬇️"
            className="font-black"
          >
            Download Recording
          </Button>
          <Button
            variant="secondary"
            size="md"
            onClick={() => setShowResultModal(true)}
            icon="▶️"
          >
            Preview
          </Button>
        </div>
      ) : (
        <Button
          variant="secondary"
          size="md"
          onClick={handleStartClick}
          icon="🎥"
          className="font-black"
          disabled={!isSupported}
        >
          {isSupported ? 'Record Quiz' : 'Recording Unsupported'}
        </Button>
      )}

      {errorMsg && (
        <p className="text-xs text-rose-300 font-bold mt-1.5">{errorMsg}</p>
      )}

      {/* Info Modal */}
      {showInfoModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fadeIn">
          <div className="bg-white rounded-3xl p-6 sm:p-8 max-w-sm w-full shadow-2xl border-4 border-emerald-300 text-center">
            <div className="text-5xl mb-3">🎥</div>
            <h3 className="text-2xl font-black text-emerald-950 mb-2">Record Your Adventure!</h3>
            <p className="text-xs sm:text-sm text-slate-600 font-bold mb-4 leading-relaxed">
              Your browser will now prompt you to select the screen, window, or browser tab you would like to record.
            </p>
            <div className="bg-emerald-50 rounded-2xl p-3 border border-emerald-200 text-left text-xs text-emerald-900 font-semibold mb-5">
              <p>🔒 <strong>100% Private:</strong> Stays on your computer and is never sent to a server.</p>
            </div>
            <div className="flex gap-3">
              <Button variant="secondary" className="flex-1" onClick={() => setShowInfoModal(false)}>
                Cancel
              </Button>
              <Button variant="accent" className="flex-1 font-black" onClick={handleConfirmStart}>
                Share Screen 🚀
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* Result Modal */}
      {showResultModal && recordedVideoUrl && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fadeIn">
          <div className="bg-white rounded-3xl p-6 sm:p-8 max-w-md w-full shadow-2xl border-4 border-emerald-300 text-center">
            <div className="text-4xl mb-2">🎉</div>
            <h3 className="text-2xl font-black text-emerald-950 mb-1">Recording Ready!</h3>
            <p className="text-xs font-bold text-slate-600 mb-4">
              Watch your quiz walkthrough or download it.
            </p>

            <div className="rounded-2xl overflow-hidden border-2 border-emerald-300 shadow-inner bg-black mb-4">
              <video src={recordedVideoUrl} controls className="w-full max-h-56 object-contain" />
            </div>

            <div className="flex flex-col gap-2.5">
              <Button
                variant="accent"
                size="lg"
                onClick={() => downloadRecording('QuizCraft-Quiz-Recording.webm')}
                icon="⬇️"
                className="w-full font-black text-lg shadow-lg"
              >
                Download Video (.webm)
              </Button>

              <div className="flex gap-2 mt-1">
                <Button
                  variant="outline"
                  className="flex-1 text-xs"
                  onClick={() => {
                    clearRecording();
                    setShowResultModal(false);
                    setShowInfoModal(true);
                  }}
                >
                  Record Again 🔄
                </Button>
                <Button
                  variant="secondary"
                  className="flex-1 text-xs"
                  onClick={() => setShowResultModal(false)}
                >
                  Done
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ScreenRecorder;
