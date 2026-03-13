import { useNavigate } from 'react-router-dom'

const mockExams = [
  { id: 1, name: 'Python Final Exam', subject: 'Computer Science', topic: 'OOP', difficulty: 'Medium', questions: 10, date: 'Mar 10, 2026' },
  { id: 2, name: 'Math Test', subject: 'Mathematics', topic: 'Calculus', difficulty: 'Hard', questions: 5, date: 'Mar 9, 2026' },
  { id: 3, name: 'History Quiz', subject: 'History', topic: 'World War II', difficulty: 'Easy', questions: 8, date: 'Mar 8, 2026' },
]

const difficultyColor = {
  Easy: 'text-green-400 bg-green-400/10',
  Medium: 'text-yellow-400 bg-yellow-400/10',
  Hard: 'text-red-400 bg-red-400/10',
}

export default function Dashboard() {
  const navigate = useNavigate()

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-950 via-blue-900 to-indigo-900 text-white">

      {/* Navbar */}
      <nav className="flex justify-between items-center px-10 py-5 border-b border-white/10">
        <h1 className="text-2xl font-bold">Exam<span className="text-blue-400">Genie</span></h1>
        <div className="flex items-center gap-4">
          <span className="text-blue-200 text-sm">Hi, Charlie 👋</span>
          <button onClick={() => navigate('/')}
            className="px-4 py-2 text-sm bg-white/10 hover:bg-white/20 rounded-lg transition">
            Logout
          </button>
        </div>
      </nav>

      <div className="max-w-5xl mx-auto px-6 py-10">

        {/* Header */}
        <div className="flex justify-between items-center mb-8">
          <div>
            <h2 className="text-3xl font-bold">My Exams</h2>
            <p className="text-blue-200 text-sm mt-1">All your generated exams in one place</p>
          </div>
          <button onClick={() => navigate('/generate')}
            className="px-6 py-3 bg-blue-500 hover:bg-blue-400 rounded-xl font-semibold transition">
            + Generate New Exam
          </button>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-3 gap-4 mb-8">
          {[
            { label: 'Total Exams', value: '3' },
            { label: 'Exams Taken', value: '2' },
            { label: 'Avg Score', value: '74%' },
          ].map((s, i) => (
            <div key={i} className="bg-white/10 rounded-2xl p-5 text-center">
              <div className="text-3xl font-bold text-blue-400">{s.value}</div>
              <div className="text-blue-200 text-sm mt-1">{s.label}</div>
            </div>
          ))}
        </div>

        {/* Exam List */}
        <div className="flex flex-col gap-4">
          {mockExams.map((exam) => (
            <div key={exam.id} className="bg-white/10 rounded-2xl p-5 flex items-center justify-between hover:bg-white/15 transition">
              <div>
                <h3 className="font-semibold text-lg">{exam.name}</h3>
                <p className="text-blue-200 text-sm mt-0.5">{exam.subject} · {exam.topic} · {exam.questions} questions · {exam.date}</p>
              </div>
              <div className="flex items-center gap-3">
                <span className={`text-xs font-medium px-3 py-1 rounded-full ${difficultyColor[exam.difficulty]}`}>
                  {exam.difficulty}
                </span>
                <button onClick={() => navigate(`/exam/${exam.id}`)}
                  className="px-4 py-2 bg-blue-500 hover:bg-blue-400 rounded-lg text-sm font-medium transition">
                  Take Exam
                </button>
                <button className="px-4 py-2 bg-white/10 hover:bg-white/20 rounded-lg text-sm font-medium transition">
                  📄 PDF
                </button>
              </div>
            </div>
          ))}
        </div>

      </div>
    </div>
  )
}