import { useState } from 'react'
import { useNavigate } from 'react-router-dom'

const mockQuestions = [
  {
    id: 1,
    question: 'What is encapsulation in OOP?',
    options: { A: 'Hiding internal data and exposing only necessary parts', B: 'Creating multiple objects', C: 'Inheriting from a parent class', D: 'Overloading functions' },
  },
  {
    id: 2,
    question: 'Which keyword is used to create a class in Python?',
    options: { A: 'def', B: 'object', C: 'class', D: 'new' },
  },
  {
    id: 3,
    question: 'What does inheritance allow in OOP?',
    options: { A: 'A class to use methods of another class', B: 'A function to return multiple values', C: 'Variables to change type', D: 'Loops to run faster' },
  },
]

export default function Exam() {
  const navigate = useNavigate()
  const [current, setCurrent] = useState(0)
  const [answers, setAnswers] = useState({})
  const [submitted, setSubmitted] = useState(false)

  const question = mockQuestions[current]
  const total = mockQuestions.length
  const progress = ((current + 1) / total) * 100

  const handleAnswer = (option) => {
    setAnswers({ ...answers, [question.id]: option })
  }

  const handleNext = () => {
    if (current < total - 1) setCurrent(current + 1)
  }

  const handlePrev = () => {
    if (current > 0) setCurrent(current - 1)
  }

  const handleSubmit = () => {
    setSubmitted(true)
    setTimeout(() => navigate('/results/1'), 1000)
  }

  const isAnswered = (id) => answers[id] !== undefined
  const allAnswered = mockQuestions.every(q => isAnswered(q.id))

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-950 via-blue-900 to-indigo-900 text-white">

      {/* Navbar */}
      <nav className="flex justify-between items-center px-10 py-5 border-b border-white/10">
        <h1 className="text-2xl font-bold">Exam<span className="text-blue-400">Genie</span></h1>
        <span className="text-blue-200 text-sm">Python Final Exam</span>
      </nav>

      <div className="max-w-2xl mx-auto px-6 py-10">

        {/* Progress */}
        <div className="mb-8">
          <div className="flex justify-between text-sm text-blue-200 mb-2">
            <span>Question {current + 1} of {total}</span>
            <span>{Object.keys(answers).length} answered</span>
          </div>
          <div className="w-full bg-white/10 rounded-full h-2">
            <div
              className="bg-blue-400 h-2 rounded-full transition-all duration-300"
              style={{ width: `${progress}%` }}
            />
          </div>
        </div>

        {/* Question Card */}
        <div className="bg-white/10 backdrop-blur rounded-2xl p-8 mb-6">
          <p className="text-sm text-blue-300 mb-3">Question {current + 1}</p>
          <h2 className="text-xl font-semibold mb-6">{question.question}</h2>

          {/* Options */}
          <div className="flex flex-col gap-3">
            {Object.entries(question.options).map(([key, value]) => (
              <button
                key={key}
                onClick={() => handleAnswer(key)}
                className={`flex items-center gap-4 px-5 py-4 rounded-xl border text-left transition
                  ${answers[question.id] === key
                    ? 'border-blue-400 bg-blue-500/30 text-white'
                    : 'border-white/20 bg-white/5 hover:bg-white/10 text-blue-100'
                  }`}
              >
                <span className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold shrink-0
                  ${answers[question.id] === key ? 'bg-blue-500 text-white' : 'bg-white/10'}`}>
                  {key}
                </span>
                {value}
              </button>
            ))}
          </div>
        </div>

        {/* Navigation */}
        <div className="flex justify-between items-center">
          <button
            onClick={handlePrev}
            disabled={current === 0}
            className="px-6 py-3 bg-white/10 hover:bg-white/20 disabled:opacity-30 rounded-xl font-medium transition">
            ← Previous
          </button>

          {/* Question dots */}
          <div className="flex gap-2">
            {mockQuestions.map((q, i) => (
              <button
                key={i}
                onClick={() => setCurrent(i)}
                className={`w-3 h-3 rounded-full transition
                  ${i === current ? 'bg-blue-400' : isAnswered(q.id) ? 'bg-green-400' : 'bg-white/20'}`}
              />
            ))}
          </div>

          {current < total - 1 ? (
            <button
              onClick={handleNext}
              className="px-6 py-3 bg-blue-500 hover:bg-blue-400 rounded-xl font-medium transition">
              Next →
            </button>
          ) : (
            <button
              onClick={handleSubmit}
              disabled={!allAnswered || submitted}
              className="px-6 py-3 bg-green-500 hover:bg-green-400 disabled:opacity-50 rounded-xl font-medium transition">
              {submitted ? 'Submitting...' : '✅ Submit Exam'}
            </button>
          )}
        </div>

      </div>
    </div>
  )
}