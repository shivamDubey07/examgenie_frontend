import { useNavigate } from 'react-router-dom'

const mockResults = {
  examName: 'Python Final Exam',
  score: 7,
  total: 10,
  timeTaken: '8 mins',
  questions: [
    {
      id: 1,
      question: 'What is encapsulation in OOP?',
      options: { A: 'Hiding internal data and exposing only necessary parts', B: 'Creating multiple objects', C: 'Inheriting from a parent class', D: 'Overloading functions' },
      correct_answer: 'A',
      user_answer: 'A',
      explanation: 'Encapsulation means bundling data and methods together while hiding internal details from outside.',
    },
    {
      id: 2,
      question: 'Which keyword is used to create a class in Python?',
      options: { A: 'def', B: 'object', C: 'class', D: 'new' },
      correct_answer: 'C',
      user_answer: 'A',
      explanation: 'In Python the "class" keyword is used to define a class.',
    },
    {
      id: 3,
      question: 'What does inheritance allow in OOP?',
      options: { A: 'A class to use methods of another class', B: 'A function to return multiple values', C: 'Variables to change type', D: 'Loops to run faster' },
      correct_answer: 'A',
      user_answer: 'A',
      explanation: 'Inheritance allows a class to reuse and extend the properties and methods of another class.',
    },
  ]
}

export default function Results() {
  const navigate = useNavigate()
  const { examName, score, total, timeTaken, questions } = mockResults
  const percentage = Math.round((score / total) * 100)

  const getGrade = () => {
    if (percentage >= 90) return { label: 'Excellent!', color: 'text-green-400' }
    if (percentage >= 70) return { label: 'Good Job!', color: 'text-blue-400' }
    if (percentage >= 50) return { label: 'Keep Practicing!', color: 'text-yellow-400' }
    return { label: 'Needs Improvement', color: 'text-red-400' }
  }

  const grade = getGrade()

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-950 via-blue-900 to-indigo-900 text-white">

      {/* Navbar */}
      <nav className="flex justify-between items-center px-10 py-5 border-b border-white/10">
        <h1 className="text-2xl font-bold">Exam<span className="text-blue-400">Genie</span></h1>
        <button onClick={() => navigate('/dashboard')}
          className="px-4 py-2 text-sm bg-white/10 hover:bg-white/20 rounded-lg transition">
          ← Dashboard
        </button>
      </nav>

      <div className="max-w-2xl mx-auto px-6 py-10">

        {/* Score Card */}
        <div className="bg-white/10 backdrop-blur rounded-2xl p-8 text-center mb-8">
          <p className="text-blue-200 text-sm mb-1">{examName}</p>
          <div className="text-7xl font-extrabold text-blue-400 my-4">{percentage}%</div>
          <p className={`text-2xl font-bold mb-4 ${grade.color}`}>{grade.label}</p>

          <div className="grid grid-cols-3 gap-4 mt-6">
            {[
              { label: 'Correct', value: score, color: 'text-green-400' },
              { label: 'Wrong', value: total - score, color: 'text-red-400' },
              { label: 'Time Taken', value: timeTaken, color: 'text-blue-400' },
            ].map((s, i) => (
              <div key={i} className="bg-white/10 rounded-xl p-3">
                <div className={`text-2xl font-bold ${s.color}`}>{s.value}</div>
                <div className="text-blue-200 text-xs mt-1">{s.label}</div>
              </div>
            ))}
          </div>
        </div>

        {/* Actions */}
        <div className="flex gap-3 mb-8">
          <button onClick={() => navigate('/generate')}
            className="flex-1 py-3 bg-blue-500 hover:bg-blue-400 rounded-xl font-semibold transition">
            ✨ Generate New Exam
          </button>
          <button
            className="flex-1 py-3 bg-white/10 hover:bg-white/20 rounded-xl font-semibold transition">
            📄 Download PDF
          </button>
        </div>

        {/* Question Review */}
        <h3 className="text-lg font-semibold mb-4">Answer Review</h3>
        <div className="flex flex-col gap-4">
          {questions.map((q, i) => {
            const isCorrect = q.user_answer === q.correct_answer
            return (
              <div key={q.id} className={`rounded-2xl p-6 border ${isCorrect ? 'border-green-500/30 bg-green-500/10' : 'border-red-500/30 bg-red-500/10'}`}>
                
                <div className="flex items-start gap-3 mb-4">
                  <span className="text-lg">{isCorrect ? '✅' : '❌'}</span>
                  <p className="font-medium">{i + 1}. {q.question}</p>
                </div>

                <div className="flex flex-col gap-2 mb-4">
                  {Object.entries(q.options).map(([key, value]) => (
                    <div key={key}
                      className={`px-4 py-2 rounded-lg text-sm flex items-center gap-2
                        ${key === q.correct_answer ? 'bg-green-500/20 text-green-300' : ''}
                        ${key === q.user_answer && !isCorrect ? 'bg-red-500/20 text-red-300' : ''}
                        ${key !== q.correct_answer && key !== q.user_answer ? 'text-blue-200' : ''}
                      `}>
                      <span className="font-bold">{key}.</span> {value}
                      {key === q.correct_answer && <span className="ml-auto text-xs">✓ Correct</span>}
                      {key === q.user_answer && !isCorrect && <span className="ml-auto text-xs">✗ Your answer</span>}
                    </div>
                  ))}
                </div>

                <div className="bg-white/10 rounded-lg px-4 py-3 text-sm text-blue-200">
                  💡 {q.explanation}
                </div>

              </div>
            )
          })}
        </div>

      </div>
    </div>
  )
}