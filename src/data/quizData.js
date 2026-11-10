// QuizCraft Master Educational Question Bank & 8 Themes
// Clean, friendly, engaging questions specifically designed for kids.

export const QUIZ_CONFIG = {
  appName: "QuizCraft Kids",
  tagline: "Learn. Play. Explore.",
  defaultTimerSeconds: 20,
  warningSeconds: 5,
  defaultQuestionCount: 5,
  pointsPerCorrectAnswer: 1,
  starThresholds: {
    perfect: 5,
    great: 3,
    good: 0,
  }
};

export const TEMPLATES = [
  {
    id: "jungle",
    name: "Jungle Quest",
    icon: "🌿",
    badge: "🌴",
    color: "from-emerald-500 to-green-600",
    bgGradient: "from-emerald-950 via-teal-950 to-emerald-900",
    glowColor1: "bg-emerald-500/20",
    glowColor2: "bg-amber-500/15",
    ambientEmojis: ["🌿", "🍃", "🌴", "🍄"],
    cardBorder: "border-emerald-300",
    description: "Venture deep into the lush tropical jungle and meet vibrant rainforest wildlife!"
  },
  {
    id: "space",
    name: "Space Explorer",
    icon: "🚀",
    badge: "🪐",
    color: "from-indigo-500 to-purple-600",
    bgGradient: "from-slate-950 via-indigo-950 to-purple-950",
    glowColor1: "bg-indigo-500/25",
    glowColor2: "bg-fuchsia-500/20",
    ambientEmojis: ["🚀", "🪐", "✨", "🛸"],
    cardBorder: "border-indigo-400",
    description: "Blast off to discover planets, shimmering stars, alien galaxies, and cosmic wonders!"
  },
  {
    id: "dinosaur",
    name: "Dinosaur Valley",
    icon: "🦕",
    badge: "🦖",
    color: "from-amber-600 to-lime-700",
    bgGradient: "from-amber-950 via-stone-900 to-emerald-950",
    glowColor1: "bg-amber-600/20",
    glowColor2: "bg-emerald-600/15",
    ambientEmojis: ["🦕", "🦖", "🌋", "🦴"],
    cardBorder: "border-amber-400",
    description: "Travel back in prehistoric time to encounter mighty T-Rexes and giant gentle herbivores!"
  },
  {
    id: "ocean",
    name: "Ocean Depths",
    icon: "🌊",
    badge: "🐬",
    color: "from-cyan-500 to-blue-600",
    bgGradient: "from-cyan-950 via-blue-950 to-sky-950",
    glowColor1: "bg-cyan-500/20",
    glowColor2: "bg-blue-500/20",
    ambientEmojis: ["🌊", "🐬", "🐠", "🐙"],
    cardBorder: "border-cyan-300",
    description: "Dive below sparkling ocean waves to explore coral reefs and mysterious sea creatures!"
  },
  {
    id: "fantasy",
    name: "Fantasy Kingdom",
    icon: "🏰",
    badge: "✨",
    color: "from-fuchsia-500 to-purple-600",
    bgGradient: "from-purple-950 via-fuchsia-950 to-slate-950",
    glowColor1: "bg-fuchsia-500/20",
    glowColor2: "bg-purple-500/20",
    ambientEmojis: ["🏰", "✨", "🦄", "🪄"],
    cardBorder: "border-fuchsia-300",
    description: "Enter a magical enchanted kingdom with mythical dragons, wizards, and sparkling castles!"
  },
  {
    id: "robot",
    name: "Robot Lab",
    icon: "🤖",
    badge: "⚡",
    color: "from-sky-500 to-cyan-600",
    bgGradient: "from-slate-950 via-zinc-900 to-cyan-950",
    glowColor1: "bg-cyan-400/20",
    glowColor2: "bg-teal-500/20",
    ambientEmojis: ["🤖", "⚡", "⚙️", "🔋"],
    cardBorder: "border-cyan-400",
    description: "Step into the futuristic high-tech science lab to power up androids and cool inventions!"
  },
  {
    id: "rainbow",
    name: "Rainbow World",
    icon: "🌈",
    badge: "☀️",
    color: "from-rose-400 via-amber-400 to-sky-400",
    bgGradient: "from-pink-950 via-purple-950 to-sky-950",
    glowColor1: "bg-pink-500/20",
    glowColor2: "bg-yellow-400/20",
    ambientEmojis: ["🌈", "☀️", "🎨", "🦋"],
    cardBorder: "border-pink-300",
    description: "A bright, joyful spectrum of colorful questions, light prisms, and cheerful nature wonders!"
  },
  {
    id: "safari",
    name: "Safari Adventure",
    icon: "🐾",
    badge: "🦁",
    color: "from-amber-500 to-orange-600",
    bgGradient: "from-amber-950 via-orange-950 to-yellow-950",
    glowColor1: "bg-amber-500/20",
    glowColor2: "bg-orange-500/20",
    ambientEmojis: ["🐾", "🦁", "🦒", "🦓"],
    cardBorder: "border-amber-300",
    description: "Ride across the vast golden savanna plains and track wild cheetahs, elephants, and lions!"
  }
];

export const CATEGORIES = [
  ...TEMPLATES,
  {
    id: "mixed",
    name: "Mixed Adventure",
    icon: "🎲",
    badge: "⭐",
    color: "from-yellow-400 to-emerald-500",
    bgGradient: "from-emerald-950 via-teal-950 to-emerald-900",
    glowColor1: "bg-emerald-500/20",
    glowColor2: "bg-amber-500/15",
    ambientEmojis: ["🌟", "🎲", "🎯", "🏆"],
    cardBorder: "border-amber-300",
    description: "The ultimate challenge featuring questions and adventures across all 8 fun worlds!"
  }
];

export const DIFFICULTIES = [
  { id: "easy", label: "Easy Safari", time: 25, starsMultiplier: 1, desc: "Gentle 25s timer with straightforward questions" },
  { id: "medium", label: "Medium Explorer", time: 20, starsMultiplier: 1, desc: "Standard 20s challenge for curious minds" },
  { id: "hard", label: "Jungle Master", time: 15, starsMultiplier: 1, desc: "Speedy 15s timer for quick thinkers" }
];

export const ALL_QUESTIONS = [
  // ---------------- 1. JUNGLE / ANIMALS ----------------
  {
    id: "jungle-1",
    category: "jungle",
    template: "jungle",
    difficulty: "easy",
    image: "🦁",
    question: "What animal is known as the king of the jungle?",
    options: ["Lion", "Horse", "Elephant", "Rabbit"],
    answer: "Lion",
    correctIndex: 0,
    explanation: "Lions are large wild cats that live mainly in grasslands and savannas, famous for their mighty roar and strength.",
    funFact: "A lion's roar can be heard from up to 5 miles away!"
  },
  {
    id: "jungle-2",
    category: "jungle",
    template: "jungle",
    difficulty: "easy",
    image: "🦒",
    question: "Which is the tallest living animal on Earth?",
    options: ["Hippopotamus", "Giraffe", "Ostrich", "Camel"],
    answer: "Giraffe",
    correctIndex: 1,
    explanation: "Giraffes can grow up to 19 feet tall, helping them reach leaves at the very top of trees.",
    funFact: "Giraffes have blue-purple tongues that can be up to 18 inches long!"
  },
  {
    id: "jungle-3",
    category: "jungle",
    template: "jungle",
    difficulty: "medium",
    image: "🐸",
    question: "How do red-eyed tree frogs in the rainforest climb smooth wet leaves without slipping?",
    options: ["Sticky suction-cup toe pads", "Tiny claws", "Magnetism", "Glue on their backs"],
    answer: "Sticky suction-cup toe pads",
    correctIndex: 0,
    explanation: "Tree frogs have specialized circular toe pads with microscopic grooves that stick to damp jungle leaves.",
    funFact: "Red-eyed tree frogs flash their bright red eyes to startle predators while they leap away!"
  },
  {
    id: "jungle-4",
    category: "jungle",
    template: "jungle",
    difficulty: "hard",
    image: "🦜",
    question: "What is the topmost, highest layer of trees in a rainforest called?",
    options: ["Understory", "Forest Floor", "Emergent Layer", "Canopy"],
    answer: "Emergent Layer",
    correctIndex: 2,
    explanation: "The emergent layer consists of giant trees that punch through the canopy to reach maximum sunlight.",
    funFact: "Emergent trees can stand over 200 feet tall high above the jungle canopy!"
  },

  // ---------------- 2. SPACE ----------------
  {
    id: "space-1",
    category: "space",
    template: "space",
    difficulty: "easy",
    image: "🪐",
    question: "Which giant gas planet is famous for having dazzling, huge rings of ice and rock orbiting it?",
    options: ["Mars", "Saturn", "Mercury", "Venus"],
    answer: "Saturn",
    correctIndex: 1,
    explanation: "Saturn is surrounded by thousands of shimmering ringlets made of chunks of sparkling ice and cosmic dust.",
    funFact: "Saturn is so light that if you placed it in a giant cosmic bathtub, it would float!"
  },
  {
    id: "space-2",
    category: "space",
    template: "space",
    difficulty: "easy",
    image: "☀️",
    question: "What giant glowing ball of hot plasma sits at the very center of our Solar System?",
    options: ["The Moon", "The Sun", "Jupiter", "The North Star"],
    answer: "The Sun",
    correctIndex: 1,
    explanation: "The Sun is a huge star whose gravity keeps all the planets orbiting smoothly around it.",
    funFact: "Light from the Sun travels so fast it reaches Earth in just 8 minutes and 20 seconds!"
  },
  {
    id: "space-3",
    category: "space",
    template: "space",
    difficulty: "medium",
    image: "🔴",
    question: "Which planet is known as the 'Red Planet' because of rusty iron dust on its surface?",
    options: ["Mars", "Venus", "Neptune", "Jupiter"],
    answer: "Mars",
    correctIndex: 0,
    explanation: "Mars looks reddish-orange in the night sky because its rocks and soil are full of iron oxide, which is rust.",
    funFact: "Mars has the largest volcano in the entire solar system, Olympus Mons!"
  },
  {
    id: "space-4",
    category: "space",
    template: "space",
    difficulty: "hard",
    image: "🌕",
    question: "How long does it take for the Moon to complete one orbit around planet Earth?",
    options: ["About 24 Hours", "About 27 to 29 Days", "About 365 Days", "About 100 Days"],
    answer: "About 27 to 29 Days",
    correctIndex: 1,
    explanation: "The Moon takes about 27 to 29 days, or roughly one month, to orbit Earth and show all its moon phases.",
    funFact: "Because the moon's rotation matches its orbit, we always see the exact same face of the Moon!"
  },

  // ---------------- 3. DINOSAUR ----------------
  {
    id: "dino-1",
    category: "dinosaur",
    template: "dinosaur",
    difficulty: "easy",
    image: "🦖",
    question: "Which fierce prehistoric dinosaur had tiny two-fingered arms and powerful crushing jaws?",
    options: ["Tyrannosaurus Rex", "Triceratops", "Brachiosaurus", "Stegosaurus"],
    answer: "Tyrannosaurus Rex",
    correctIndex: 0,
    explanation: "Tyrannosaurus Rex had massive teeth the size of bananas and could bite with thousands of pounds of force.",
    funFact: "T-Rex had keen eyesight and a sense of smell sharper than a modern bloodhound!"
  },
  {
    id: "dino-2",
    category: "dinosaur",
    template: "dinosaur",
    difficulty: "easy",
    image: "🦕",
    question: "What type of food did long-necked sauropods like Brachiosaurus eat?",
    options: ["Fish and crabs", "Leaves and tree plants", "Other dinosaurs", "Insects"],
    answer: "Leaves and tree plants",
    correctIndex: 1,
    explanation: "Brachiosaurus was an enormous gentle herbivore that used its sky-high neck to graze on tall pine and fern trees.",
    funFact: "Brachiosaurus swallowed smooth stones called gastroliths to help grind up tough leaves in its stomach!"
  },
  {
    id: "dino-3",
    category: "dinosaur",
    template: "dinosaur",
    difficulty: "medium",
    image: "🛡️",
    question: "Which dinosaur had three prominent horns on its face and a giant bony shield behind its head?",
    options: ["Velociraptor", "Triceratops", "Ankylosaurus", "Spinosaurus"],
    answer: "Triceratops",
    correctIndex: 1,
    explanation: "Triceratops means 'three-horned face', featuring two long brow horns and a shorter nose horn for defense.",
    funFact: "A Triceratops skull could grow up to 8 feet long, one of the largest heads of any land animal ever!"
  },
  {
    id: "dino-4",
    category: "dinosaur",
    template: "dinosaur",
    difficulty: "hard",
    image: "🪶",
    question: "What modern-day animals are direct living descendants of feathered theropod dinosaurs?",
    options: ["Birds", "Lizards", "Crocodiles", "Turtles"],
    answer: "Birds",
    correctIndex: 0,
    explanation: "Scientists discovered that modern birds evolved directly from small two-legged feathered theropod dinosaurs.",
    funFact: "Every time you see a robin, sparrow, or chicken, you are looking at a living dinosaur relative!"
  },

  // ---------------- 4. OCEAN ----------------
  {
    id: "ocean-1",
    category: "ocean",
    template: "ocean",
    difficulty: "easy",
    image: "🐬",
    question: "Dolphins breathe fresh air! What special opening on top of their head do they use?",
    options: ["Blowhole", "Snorkel", "Gills", "Beak"],
    answer: "Blowhole",
    correctIndex: 0,
    explanation: "Dolphins are marine mammals that surface and open their muscular blowhole to take deep breaths of air.",
    funFact: "Dolphins sleep by letting only one hemisphere of their brain rest while keeping the other half alert!"
  },
  {
    id: "ocean-2",
    category: "ocean",
    template: "ocean",
    difficulty: "easy",
    image: "🐙",
    question: "How many beating hearts does an octopus have inside its flexible body?",
    options: ["1 Heart", "2 Hearts", "3 Hearts", "8 Hearts"],
    answer: "3 Hearts",
    correctIndex: 2,
    explanation: "An octopus has 3 hearts: two pump blood to the gills while the central heart pumps blue blood through the body.",
    funFact: "Octopus blood is naturally blue because it uses copper instead of iron to carry oxygen!"
  },
  {
    id: "ocean-3",
    category: "ocean",
    template: "ocean",
    difficulty: "medium",
    image: "🐋",
    question: "Which creature is the largest animal ever known to have lived on Earth?",
    options: ["Blue Whale", "Megalodon", "Great White Shark", "Giant Squid"],
    answer: "Blue Whale",
    correctIndex: 0,
    explanation: "The magnificent Blue Whale can grow up to 100 feet long and weigh as much as 33 elephants combined.",
    funFact: "A blue whale's heart is the size of a small car and beats only 2 to 8 times a minute when diving!"
  },
  {
    id: "ocean-4",
    category: "ocean",
    template: "ocean",
    difficulty: "hard",
    image: "🪸",
    question: "What living colony structure forms colorful underwater coral reefs in warm tropical seas?",
    options: ["Tiny coral polyps", "Seaweed roots", "Hard rocks", "Frozen shells"],
    answer: "Tiny coral polyps",
    correctIndex: 0,
    explanation: "Coral reefs are built by millions of tiny soft creatures called polyps that secrete hard calcium limestone shells.",
    funFact: "The Great Barrier Reef is so vast that it can be seen from astronauts in outer space!"
  },

  // ---------------- 5. FANTASY ----------------
  {
    id: "fantasy-1",
    category: "fantasy",
    template: "fantasy",
    difficulty: "easy",
    image: "🦄",
    question: "Which magical mythical creature looks like a majestic white horse with a glowing spiral horn?",
    options: ["Unicorn", "Pegasus", "Griffin", "Dragon"],
    answer: "Unicorn",
    correctIndex: 0,
    explanation: "In fantasy folklore, unicorns are gentle, magical woodland creatures famed for their sparkling single horn.",
    funFact: "Scotland adopted the unicorn as its official national animal hundreds of years ago!"
  },
  {
    id: "fantasy-2",
    category: "fantasy",
    template: "fantasy",
    difficulty: "easy",
    image: "🐉",
    question: "What mythical legendary reptile breathes fire and guards glittering treasures in mountain caverns?",
    options: ["Dragon", "Phoenix", "Centaur", "Golem"],
    answer: "Dragon",
    correctIndex: 0,
    explanation: "Dragons are legendary winged beasts known across ancient fairy tales and mythologies for their fiery breath.",
    funFact: "In Asian legends, dragons are friendly celestial water spirits that bring rainfall and good luck!"
  },
  {
    id: "fantasy-3",
    category: "fantasy",
    template: "fantasy",
    difficulty: "medium",
    image: "🦅",
    question: "What mythical creature has the body of a brave lion and the head and wings of a majestic eagle?",
    options: ["Griffin", "Chimera", "Sphinx", "Hydra"],
    answer: "Griffin",
    correctIndex: 0,
    explanation: "The griffin combines the king of beasts (the lion) with the king of birds (the eagle) as a symbol of nobility.",
    funFact: "Griffins were believed to build nests lined with gold nuggets high in mountain crags!"
  },
  {
    id: "fantasy-4",
    category: "fantasy",
    template: "fantasy",
    difficulty: "hard",
    image: "🔥",
    question: "Which legendary mythical bird is said to burst into flame and be reborn from its own ashes?",
    options: ["Phoenix", "Thunderbird", "Harpy", "Roc"],
    answer: "Phoenix",
    correctIndex: 0,
    explanation: "The phoenix represents renewal and immortality, rising afresh with vibrant golden-red feathers.",
    funFact: "Ancient Greek and Egyptian mythologies described the phoenix singing enchanting melodies at sunrise!"
  },

  // ---------------- 6. ROBOT ----------------
  {
    id: "robot-1",
    category: "robot",
    template: "robot",
    difficulty: "easy",
    image: "🤖",
    question: "What is the computerized 'brain' of a robot that calculates instructions and runs code?",
    options: ["Microprocessor (CPU)", "Battery", "Metal casing", "Wheel gear"],
    answer: "Microprocessor (CPU)",
    correctIndex: 0,
    explanation: "The Central Processing Unit (CPU) processes sensor inputs and tells the robot's motors how to move.",
    funFact: "Modern microchips contain billions of microscopic transistors smaller than a strand of DNA!"
  },
  {
    id: "robot-2",
    category: "robot",
    template: "robot",
    difficulty: "easy",
    image: "🔋",
    question: "What clean source of energy powers autonomous robots and electric rovers on Mars?",
    options: ["Solar Panels and Batteries", "Wood fires", "Windmills only", "Steam kettles"],
    answer: "Solar Panels and Batteries",
    correctIndex: 0,
    explanation: "Robots use rechargeable batteries and solar cells to convert bright sunlight directly into electricity.",
    funFact: "NASA's Opportunity rover on Mars explored the red planet for over 14 years powered by solar panels!"
  },
  {
    id: "robot-3",
    category: "robot",
    template: "robot",
    difficulty: "medium",
    image: "👀",
    question: "What components act like robot 'eyes' to detect obstacles and measure distances?",
    options: ["Sensors and Cameras", "Speakers", "Magnets", "Screws"],
    answer: "Sensors and Cameras",
    correctIndex: 0,
    explanation: "Robots use ultrasonic sensors, LiDAR lasers, and camera vision to map surrounding rooms and avoid bumping walls.",
    funFact: "Self-driving robotic cars bounce millions of invisible laser pulses per second to create 3D maps!"
  },
  {
    id: "robot-4",
    category: "robot",
    template: "robot",
    difficulty: "hard",
    image: "🦾",
    question: "What robotic actuators act like artificial muscles to bend joints and lift objects?",
    options: ["Electric Servomotors", "Spring clips", "Rubber bands", "Plastic wires"],
    answer: "Electric Servomotors",
    correctIndex: 0,
    explanation: "Servomotors provide precise rotational control, allowing robotic arms to pick up fragile eggs without cracking them.",
    funFact: "Advanced humanoid robot hands can play piano notes with millisecond precision!"
  },

  // ---------------- 7. RAINBOW ----------------
  {
    id: "rainbow-1",
    category: "rainbow",
    template: "rainbow",
    difficulty: "easy",
    image: "🌈",
    question: "What two things are needed together in the sky to create a colorful rainbow?",
    options: ["Sunlight and Raindrops", "Snow and Wind", "Thunder and Lightning", "Dark Clouds only"],
    answer: "Sunlight and Raindrops",
    correctIndex: 0,
    explanation: "When sunlight strikes airborne raindrops, the water bends the light into its constituent rainbow colors.",
    funFact: "From an airplane high in the sky, you can sometimes see a full 360-degree circular rainbow!"
  },
  {
    id: "rainbow-2",
    category: "rainbow",
    template: "rainbow",
    difficulty: "easy",
    image: "🎨",
    question: "Which color is the very first, outermost stripe on the arc of a standard primary rainbow?",
    options: ["Red", "Violet", "Green", "Yellow"],
    answer: "Red",
    correctIndex: 0,
    explanation: "Red light bends the least because of its longer wavelength, placing it on the top outer rim of the rainbow arc.",
    funFact: "The handy acronym 'ROYGBIV' helps you remember: Red, Orange, Yellow, Green, Blue, Indigo, and Violet!"
  },
  {
    id: "rainbow-3",
    category: "rainbow",
    template: "rainbow",
    difficulty: "medium",
    image: "💎",
    question: "What transparent triangular glass tool bends clear white light into a rainbow beam on a table?",
    options: ["Prism", "Mirror", "Magnifying glass", "Lens cap"],
    answer: "Prism",
    correctIndex: 0,
    explanation: "A glass prism refracts different colors at varying angles, proving white light contains all the colors of the rainbow!",
    funFact: "Sir Isaac Newton was the first scientist to use a prism to discover the spectrum of white light in 1666!"
  },
  {
    id: "rainbow-4",
    category: "rainbow",
    template: "rainbow",
    difficulty: "hard",
    image: "🦚",
    question: "What causes peacock feathers and butterfly wings to shimmer with iridescent rainbow colors?",
    options: ["Microscopic light-reflecting nanostructures", "Liquid dye paint", "Hot sunlight", "Salt crystals"],
    answer: "Microscopic light-reflecting nanostructures",
    correctIndex: 0,
    explanation: "Peacock feathers do not contain blue or green paint; microscopic nanostructures reflect specific wavelengths of light!",
    funFact: "This optical trick is called structural coloration and never fades over time like ordinary dyes do!"
  },

  // ---------------- 8. SAFARI ----------------
  {
    id: "safari-1",
    category: "safari",
    template: "safari",
    difficulty: "easy",
    image: "🐆",
    question: "Which spotted wild cat on the African savanna is the fastest land animal in the entire world?",
    options: ["Cheetah", "Leopard", "Lion", "Hyena"],
    answer: "Cheetah",
    correctIndex: 0,
    explanation: "Cheetahs can sprint from 0 to 60 miles per hour in just 3 seconds across open savanna grasslands.",
    funFact: "Cheetahs have non-retractable claws that work like athletic cleats for incredible ground grip!"
  },
  {
    id: "safari-2",
    category: "safari",
    template: "safari",
    difficulty: "easy",
    image: "🐘",
    question: "What versatile body part does a safari elephant use to drink water, breathe, and trumpet loudly?",
    options: ["Trunk", "Tusk", "Ears", "Tail"],
    answer: "Trunk",
    correctIndex: 0,
    explanation: "An elephant's trunk is a fusion of its nose and upper lip, containing over 40,000 flexible muscles!",
    funFact: "Elephants can use the delicate tip of their trunk to pick up a single peanut off the ground!"
  },
  {
    id: "safari-3",
    category: "safari",
    template: "safari",
    difficulty: "medium",
    image: "🦓",
    question: "Why do African zebras have distinctive black and white striped coats?",
    options: ["To confuse biting flies and camouflage in herds", "To keep warm at night", "To swim faster", "To signal birds"],
    answer: "To confuse biting flies and camouflage in herds",
    correctIndex: 0,
    explanation: "Zebra stripes create an optical illusion that discourages biting flies and makes it hard for predators to single one out.",
    funFact: "Just like human fingerprints, no two zebras have the exact same stripe pattern!"
  },
  {
    id: "safari-4",
    category: "safari",
    template: "safari",
    difficulty: "hard",
    image: "🦩",
    question: "Why are safari flamingos wading in shallow soda lakes famous for their bright pink feathers?",
    options: ["Carotenoid pigments in the algae and shrimp they eat", "Pink mud baths", "Sunburn", "Special pink milk"],
    answer: "Carotenoid pigments in the algae and shrimp they eat",
    correctIndex: 0,
    explanation: "Flamingos are born with grey feathers; their diet of carotenoid-rich microscopic brine shrimp turns them bright pink!",
    funFact: "Flamingos frequently stand on one leg to conserve body heat and rest their muscles!"
  }
];

// Helper to get questions filtered by category/template and difficulty, randomized
export const getFilteredQuestions = (categoryId = "mixed", difficulty = "medium", count = 5) => {
  let pool = [];

  if (categoryId === "mixed" || !categoryId) {
    pool = [...ALL_QUESTIONS];
  } else {
    pool = ALL_QUESTIONS.filter(q => q.category === categoryId || q.template === categoryId);
    if (pool.length < count) {
      // Fallback: pad with other questions if needed
      const remaining = ALL_QUESTIONS.filter(q => q.category !== categoryId && q.template !== categoryId);
      pool = [...pool, ...remaining];
    }
  }

  // Shuffle array using Fisher-Yates algorithm
  const shuffled = [...pool];
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }

  return shuffled.slice(0, Math.min(count, shuffled.length));
};

// Export legacy quizData format for backwards compatibility
export const quizData = ALL_QUESTIONS.slice(0, 5).map((q, idx) => ({
  id: idx + 1,
  question: q.question,
  options: q.options,
  correctAnswer: q.correctIndex,
  answer: q.answer,
  explanation: q.explanation,
  image: q.image,
  category: q.category
}));