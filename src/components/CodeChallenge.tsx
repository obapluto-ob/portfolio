import React, { useState, useEffect } from 'react'
import { Check, X, RotateCcw, Code, Zap } from 'lucide-react'

interface Challenge {
  id: number
  title: string
  code: string
  bug: string
  fix: string
  difficulty: 'Easy' | 'Medium' | 'Hard'
  language: string
}

const challenges: Challenge[] = [
  {
    id: 1,
    title: "Array Index Bug",
    code: `function getLastItem(arr) {
  return arr[arr.length];
}`,
    bug: "Off-by-one error",
    fix: "arr[arr.length - 1]",
    difficulty: "Easy",
    language: "JavaScript"
  },
  {
    id: 2,
    title: "Memory Leak",
    code: `useEffect(() => {
  const timer = setInterval(() => {
    console.log('tick');
  }, 1000);
}, []);`,
    bug: "Missing cleanup",
    fix: "return () => clearInterval(timer);",
    difficulty: "Medium",
    language: "React"
  },
  {
    id: 3,
    title: "Race Condition",
    code: `async function fetchUser(id) {
  const user = await api.getUser(id);
  setUser(user);
  setLoading(false);
}`,
    bug: "No loading state management",
    fix: "setLoading(true) at start + error handling",
    difficulty: "Hard",
    language: "JavaScript"
  },
  {
    id: 4,
    title: "SQL Injection",
    code: `query = "SELECT * FROM users WHERE id = " + userId;`,
    bug: "Direct string concatenation",
    fix: "Use parameterized queries",
    difficulty: "Hard",
    language: "SQL"
  },
  {
    id: 5,
    title: "Infinite Loop",
    code: `let i = 0;
while (i < 10) {
  console.log(i);
}`,
    bug: "Missing increment",
    fix: "Add i++ inside loop",
    difficulty: "Easy",
    language: "JavaScript"
  }
]

const CodeChallenge: React.FC = () => {
  const [currentChallenge, setCurrentChallenge] = useState(0)
  const [userAnswer, setUserAnswer] = useState('')
  const [score, setScore] = useState(0)
  const [attempts, setAttempts] = useState(0)
  const [showResult, setShowResult] = useState(false)
  const [isCorrect, setIsCorrect] = useState(false)
  const [timeLeft, setTimeLeft] = useState(60)
  const [gameActive, setGameActive] = useState(false)

  useEffect(() => {
    if (gameActive && timeLeft > 0) {
      const timer = setTimeout(() => setTimeLeft(timeLeft - 1), 1000)
      return () => clearTimeout(timer)
    } else if (timeLeft === 0) {
      setGameActive(false)
    }
  }, [timeLeft, gameActive])

  const startGame = () => {
    setGameActive(true)
    setScore(0)
    setAttempts(0)
    setCurrentChallenge(0)
    setTimeLeft(60)
    setShowResult(false)
    setUserAnswer('')
  }

  const checkAnswer = () => {
    const challenge = challenges[currentChallenge]
    const correct = userAnswer.toLowerCase().includes(challenge.fix.toLowerCase().substring(0, 5))
    
    setIsCorrect(correct)
    setShowResult(true)
    setAttempts(attempts + 1)
    
    if (correct) {
      const points = challenge.difficulty === 'Easy' ? 10 : challenge.difficulty === 'Medium' ? 20 : 30
      setScore(score + points)
    }
  }

  const nextChallenge = () => {
    if (currentChallenge < challenges.length - 1) {
      setCurrentChallenge(currentChallenge + 1)
      setUserAnswer('')
      setShowResult(false)
    } else {
      setGameActive(false)
    }
  }

  const challenge = challenges[currentChallenge]

  return (
    <div className="max-w-2xl mx-auto p-4">
      <div className="bg-gray-900 rounded-lg border border-blue-500 overflow-hidden">
        <div className="bg-blue-600 p-4 text-center">
          <div className="flex items-center justify-center gap-2 mb-2">
            <Code className="w-6 h-6" />
            <h3 className="text-xl font-bold">Debug Challenge</h3>
          </div>
          <div className="flex justify-between text-sm">
            <span>Score: {score}</span>
            <span>Challenge: {currentChallenge + 1}/{challenges.length}</span>
            <span>Time: {timeLeft}s</span>
          </div>
        </div>

        {!gameActive ? (
          <div className="p-8 text-center">
            <Zap className="w-16 h-16 mx-auto mb-4 text-yellow-400" />
            <h4 className="text-xl mb-4">Find & Fix Code Bugs</h4>
            <p className="text-gray-400 mb-6">Identify bugs in real code snippets. You have 60 seconds!</p>
            <button
              onClick={startGame}
              className="bg-blue-600 hover:bg-blue-700 px-8 py-3 rounded-lg font-medium transition-colors"
            >
              Start Challenge
            </button>
            {attempts > 0 && (
              <div className="mt-4 text-sm text-gray-400">
                Last Score: {score} points in {attempts} attempts
              </div>
            )}
          </div>
        ) : (
          <div className="p-6">
            <div className="mb-4">
              <div className="flex justify-between items-center mb-2">
                <h4 className="font-bold text-lg">{challenge.title}</h4>
                <span className={`px-2 py-1 rounded text-xs ${
                  challenge.difficulty === 'Easy' ? 'bg-green-600' :
                  challenge.difficulty === 'Medium' ? 'bg-yellow-600' : 'bg-red-600'
                }`}>
                  {challenge.difficulty} • {challenge.language}
                </span>
              </div>
              
              <div className="bg-black p-4 rounded border font-mono text-sm overflow-x-auto">
                <pre className="text-green-400">{challenge.code}</pre>
              </div>
            </div>

            <div className="mb-4">
              <label className="block text-sm font-medium mb-2">
                What's the bug? How would you fix it?
              </label>
              <textarea
                value={userAnswer}
                onChange={(e) => setUserAnswer(e.target.value)}
                placeholder="Describe the bug and your fix..."
                className="w-full p-3 bg-gray-800 border border-gray-600 rounded resize-none"
                rows={3}
                disabled={showResult}
              />
            </div>

            {!showResult ? (
              <button
                onClick={checkAnswer}
                disabled={!userAnswer.trim()}
                className="w-full bg-green-600 hover:bg-green-700 disabled:bg-gray-600 py-2 rounded font-medium transition-colors"
              >
                Submit Answer
              </button>
            ) : (
              <div className="space-y-4">
                <div className={`p-4 rounded border-l-4 ${
                  isCorrect ? 'bg-green-900/50 border-green-500' : 'bg-red-900/50 border-red-500'
                }`}>
                  <div className="flex items-center gap-2 mb-2">
                    {isCorrect ? <Check className="w-5 h-5 text-green-400" /> : <X className="w-5 h-5 text-red-400" />}
                    <span className="font-medium">
                      {isCorrect ? 'Correct!' : 'Not quite right'}
                    </span>
                  </div>
                  <div className="text-sm">
                    <div className="font-medium mb-1">Bug: {challenge.bug}</div>
                    <div>Fix: {challenge.fix}</div>
                  </div>
                </div>

                <button
                  onClick={nextChallenge}
                  className="w-full bg-blue-600 hover:bg-blue-700 py-2 rounded font-medium transition-colors"
                >
                  {currentChallenge < challenges.length - 1 ? 'Next Challenge' : 'Finish Game'}
                </button>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  )
}

export default CodeChallenge