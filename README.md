# 🌟 QuizCraft - Jungle Quiz Adventure

> **"Learn. Play. Explore."**

QuizCraft is an interactive, colorful, jungle-themed educational quiz web application for kids. Players explore exciting categories, answer timed multiple-choice questions, earn golden stars, and read fun educational explanations!

---

## 🚀 Features

- 🌴 **Jungle Adventure Theme**: Vibrant greens, sunny yellows, playful cards, and floating ambient foliage.
- 🎯 **Rich Categories**:
  - 🐾 **Jungle Animals** (Lions, Giraffes, Dolphins, Kangaroos, Owls, Octopuses)
  - 🌱 **Wild Nature** (Chlorophyll, Sunflowers, Cacti, Rainbows, Fungi)
  - 🚀 **Space Explorer** (Saturn, Sun, Mars, Moon, Stars)
  - 🔬 **Fun Science** (Magnets, Ice & Water, Gravity, Human Skeleton, Lightning)
  - 🌎 **World & Earth** (Mount Everest, Pacific Ocean, Continents, Pyramids, Sahara)
  - 🎲 **Mixed Adventure** (Randomized quest from all topics)
- ⏱️ **Interactive Timer**: 20-second countdown with 5-second pulse warnings and auto-timeout handling.
- ⭐ **Star Reward System**: Earn golden stars for correct answers with celebratory pop animations.
- 💡 **Instant Feedback & Explanations**: "Why?" explanations and fun facts after every answer.
- 🎵 **Web Audio Sound Effects**: Synthesized audio for correct answers, wrong answers, timer alerts, and victory fanfare (with mute/unmute toggle).
- ⚙️ **Customizable Settings**: Toggle sound, turn off timer (untimed mode), or adjust question speed.
- 📱 **Fully Responsive**: Mobile, tablet, and desktop ready with big touch-friendly tactile buttons.
- 🏆 **High Score Tracking**: LocalStorage tracks best scores, total quizzes played, and stars collected.
- ✏️ **Custom Quiz Builder**: Add custom questions and play them instantly!

---

## 🛠️ How to Run Locally

### 1. Install dependencies
```bash
npm install
```

### 2. Start the development server
```bash
npm run dev
```

Open [http://localhost:5173](http://localhost:5173) in your browser.

### 3. Build for production
```bash
npm run build
```

---

## 📁 Project Structure

```text
quizacraft/
├── index.html                 # HTML shell with Google Fonts (Fredoka, Quicksand)
├── postcss.config.js          # Tailwind CSS PostCSS configuration
├── package.json               # Dependencies & scripts
└── src/
    ├── main.jsx               # Application entry point
    ├── App.jsx                # Main router & layout shell
    ├── index.css              # Custom styling, animations & theme tokens
    ├── data/
    │   └── quizData.js        # Educational question bank, categories, difficulties
    ├── utils/
    │   ├── audio.js           # Web Audio API sound synthesizer
    │   └── storage.js         # LocalStorage stats & settings helper
    ├── components/
    │   ├── Header.jsx         # Quiz header with stars, category, and sound toggle
    │   ├── ProgressBar.jsx    # Animated striped progress bar
    │   ├── Timer.jsx          # Circular/pill countdown with warning states
    │   ├── AnswerButton.jsx   # Tactile multiple-choice button (A, B, C, D)
    │   ├── QuestionCard.jsx   # Central question layout
    │   ├── ExplanationCard.jsx# "Why?" explanation banner & fun facts
    │   ├── StarDisplay.jsx    # Golden star rating meter
    │   ├── JungleBackground.jsx# Playful jungle ambient backdrop
    │   ├── SettingsModal.jsx  # Modal for sound, timer & reset preferences
    │   └── ui/
    │       ├── Button.jsx     # Reusable kid-friendly tactile button
    │       ├── Card.jsx       # Glassmorphism rounded card
    │       ├── Input.jsx      # Styled input component
    │       ├── Navbar.jsx     # Top navigation bar
    │       └── Typography.jsx # Typography helpers
    └── pages/
        ├── LandingPage.jsx    # Hero welcome screen with 3 feature badges
        ├── CategorySelect.jsx # Topic, difficulty & question count selector
        ├── QuizPlayer.jsx     # Interactive quiz game engine
        ├── ResultPage.jsx     # Final score, stars, accuracy & answer review
        ├── QuizCreator.jsx    # Custom quiz builder
        └── QuizPreview.jsx    # Question vault browser
```
