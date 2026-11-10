import React, { createContext, useContext, useState, useRef, useEffect } from 'react';

const RecorderContext = createContext(null);

export const RecorderProvider = ({ children }) => {
  const [isRecording, setIsRecording] = useState(false);
  const [recordingTime, setRecordingTime] = useState(0);
  const [recordedVideoUrl, setRecordedVideoUrl] = useState(null);
  const [recordedBlob, setRecordedBlob] = useState(null);
  const [errorMsg, setErrorMsg] = useState(null);
  const [isSupported, setIsSupported] = useState(true);

  const mediaRecorderRef = useRef(null);
  const streamRef = useRef(null);
  const timerIntervalRef = useRef(null);
  const chunksRef = useRef([]);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const supported = !!(
        navigator.mediaDevices &&
        typeof navigator.mediaDevices.getDisplayMedia === 'function' &&
        typeof window.MediaRecorder === 'function'
      );
      setIsSupported(supported);
    }
  }, []);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (timerIntervalRef.current) clearInterval(timerIntervalRef.current);
      if (streamRef.current) {
        streamRef.current.getTracks().forEach((track) => track.stop());
      }
      if (recordedVideoUrl) {
        URL.revokeObjectURL(recordedVideoUrl);
      }
    };
  }, [recordedVideoUrl]);

  const startRecording = async () => {
    setErrorMsg(null);
    if (!isSupported) {
      setErrorMsg('Screen recording is not supported on this browser or device.');
      return false;
    }

    try {
      // Request screen sharing stream from user
      const stream = await navigator.mediaDevices.getDisplayMedia({
        video: {
          cursor: 'always',
          displaySurface: 'browser',
        },
        audio: true,
      });

      streamRef.current = stream;

      // Listen for user stopping sharing via browser bar
      const videoTrack = stream.getVideoTracks()[0];
      if (videoTrack) {
        videoTrack.onended = () => {
          stopRecording();
        };
      }

      // Determine supported mime type
      const mimeTypes = [
        'video/webm;codecs=vp9,opus',
        'video/webm;codecs=vp8,opus',
        'video/webm',
        'video/mp4',
      ];
      const selectedMime = mimeTypes.find((type) => MediaRecorder.isTypeSupported(type)) || '';

      const mediaRecorder = new MediaRecorder(stream, selectedMime ? { mimeType: selectedMime } : undefined);
      mediaRecorderRef.current = mediaRecorder;
      chunksRef.current = [];

      mediaRecorder.ondataavailable = (event) => {
        if (event.data && event.data.size > 0) {
          chunksRef.current.push(event.data);
        }
      };

      mediaRecorder.onstop = () => {
        if (chunksRef.current.length > 0) {
          const blob = new Blob(chunksRef.current, { type: selectedMime || 'video/webm' });
          const url = URL.createObjectURL(blob);
          setRecordedBlob(blob);
          setRecordedVideoUrl(url);
        }

        // Stop all tracks
        if (streamRef.current) {
          streamRef.current.getTracks().forEach((track) => track.stop());
          streamRef.current = null;
        }

        if (timerIntervalRef.current) {
          clearInterval(timerIntervalRef.current);
          timerIntervalRef.current = null;
        }

        setIsRecording(false);
      };

      mediaRecorder.start(1000); // chunk every second
      setIsRecording(true);
      setRecordingTime(0);

      // Start duration timer
      timerIntervalRef.current = setInterval(() => {
        setRecordingTime((prev) => prev + 1);
      }, 1000);

      return true;
    } catch (err) {
      if (err.name === 'NotAllowedError') {
        setErrorMsg('Screen sharing permission was cancelled or denied.');
      } else {
        setErrorMsg('Could not start screen recording: ' + (err.message || 'Unknown error'));
      }
      setIsRecording(false);
      return false;
    }
  };

  const stopRecording = () => {
    if (mediaRecorderRef.current && mediaRecorderRef.current.state !== 'inactive') {
      mediaRecorderRef.current.stop();
    }
    if (timerIntervalRef.current) {
      clearInterval(timerIntervalRef.current);
      timerIntervalRef.current = null;
    }
    setIsRecording(false);
  };

  const downloadRecording = (filename = 'QuizCraft-Quiz-Recording.webm') => {
    if (!recordedVideoUrl) return;
    const a = document.createElement('a');
    a.style.display = 'none';
    a.href = recordedVideoUrl;
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    setTimeout(() => {
      document.body.removeChild(a);
    }, 100);
  };

  const clearRecording = () => {
    if (recordedVideoUrl) {
      URL.revokeObjectURL(recordedVideoUrl);
    }
    setRecordedVideoUrl(null);
    setRecordedBlob(null);
    setRecordingTime(0);
    setErrorMsg(null);
  };

  return (
    <RecorderContext.Provider
      value={{
        isRecording,
        recordingTime,
        recordedVideoUrl,
        recordedBlob,
        errorMsg,
        isSupported,
        startRecording,
        stopRecording,
        downloadRecording,
        clearRecording,
      }}
    >
      {children}
    </RecorderContext.Provider>
  );
};

export const useRecorder = () => {
  const context = useContext(RecorderContext);
  if (!context) {
    throw new Error('useRecorder must be used within a RecorderProvider');
  }
  return context;
};

export default RecorderContext;
