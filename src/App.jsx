import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AudioProvider } from './context/AudioContext';
import { RecorderProvider } from './context/RecorderContext';
import JungleBackground from './components/JungleBackground';
import Navbar from './components/ui/Navbar';
import MusicController from './components/MusicController';
import LandingPage from './pages/LandingPage';
import CategorySelect from './pages/CategorySelect';
import QuizPlayer from './pages/QuizPlayer';
import ResultPage from './pages/ResultPage';
import QuizCreator from './pages/QuizCreator';
import QuizPreview from './pages/QuizPreview';

export const App = () => {
  return (
    <AudioProvider>
      <RecorderProvider>
        <Router>
          <JungleBackground>
            <Navbar />
            <MusicController variant="floating" />
            <Routes>
              <Route path="/" element={<LandingPage />} />
              <Route path="/categories" element={<CategorySelect />} />
              <Route path="/play" element={<QuizPlayer />} />
              <Route path="/result" element={<ResultPage />} />
              <Route path="/create" element={<QuizCreator />} />
              <Route path="/preview" element={<QuizPreview />} />
              {/* Catch-all route redirecting to home */}
              <Route path="*" element={<LandingPage />} />
            </Routes>
          </JungleBackground>
        </Router>
      </RecorderProvider>
    </AudioProvider>
  );
};

export default App;