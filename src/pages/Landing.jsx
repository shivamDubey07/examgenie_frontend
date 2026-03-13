import { useNavigate } from 'react-router-dom'

export default function Landing() {
  const navigate = useNavigate()

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-950 via-blue-900 to-indigo-900 text-white">
      
      <nav className="flex justify-between items-center px-10 py-5">
        <h1 className="text-2xl font-bold tracking-tight">Exam<span className="text-blue-400">Genie</span></h1>
        <div className="flex gap-4">
          <button onClick={() => navigate('/login')}
            className="px-5 py-2 rounded-lg text-sm font-medium hover:bg-white/10 transition">
            Login
          </button>
          <button onClick={() => navigate('/register')}
            className="px-5 py-2 bg-blue-500 hover:bg-blue-400 rounded-lg text-sm font-medium transition">
            Get Started
          </button>
        </div>
      </nav>

      <div className="flex flex-col items-center justify-center text-center px-6 py-32">
        <div className="bg-blue-500/20 text-blue-300 text-sm font-medium px-4 py-1.5 rounded-full mb-6">
          AI Powered Exam Generator
        </div>
        <h2 className="text-5xl font-extrabold leading-tight max-w-3xl mb-6">
          Generate Any Exam <br />
          <span className="text-blue-400">In Seconds</span>
        </h2>
        <p className="text-blue-200 text-lg max-w-xl mb-10">
          Enter your subject, topic and difficulty. Our AI instantly creates 
          a professional exam. Download as PDF or take it online.
        </p>
        <div className="flex gap-4">
          <button onClick={() => navigate('/register')}
            className="px-8 py-3 bg-blue-500 hover:bg-blue-400 rounded-xl font-semibold text-lg transition">
            Generate Free Exam →
          </button>
          <button onClick={() => navigate('/login')}
            className="px-8 py-3 bg-white/10 hover:bg-white/20 rounded-xl font-semibold text-lg transition">
            Login
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 px-16 pb-24">
        {[
          { icon: "🤖", title: "AI Generated", desc: "Claude AI creates unique, high quality questions on any topic instantly." },
          { icon: "📄", title: "PDF Export", desc: "Download a clean printable exam paper to use offline or distribute." },
          { icon: "🎯", title: "Online Exam", desc: "Take the exam on platform, get instant score and answer explanations." },
        ].map((f, i) => (
          <div key={i} className="bg-white/10 rounded-2xl p-6 backdrop-blur">
            <div className="text-4xl mb-3">{f.icon}</div>
            <h3 className="text-lg font-semibold mb-2">{f.title}</h3>
            <p className="text-blue-200 text-sm">{f.desc}</p>
          </div>
        ))}
      </div>

    </div>
  )
}