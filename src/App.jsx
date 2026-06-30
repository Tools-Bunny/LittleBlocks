import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Link, useNavigate, Navigate } from 'react-router-dom';
import { supabase } from './supabaseClient';

const languagesDatabase = {
  English: { label: "🌐 English", title: "🎯 My Daily Badges", task1: "🌞 Rise & Shine (Brush)", task2: "📚 Brain Power (Homework)", task3: "🥛 Strong Bones (Milk time)", story: "🦊 The Clever Fox", appreciation: "Superstar performance today! 🏆" },
  Hindi: { label: "🇮🇳 हिन्दी (Hindi)", title: "🎯 मेरे रोज़ के बैज", task1: "🌞 सुबह उठो aur brush karo", task2: "📚 दिमागी कसरत (होमवर्क)", task3: "🥛 मजबूत हड्डियां (दूध का समय)", story: "🦊 चतुर लोमड़ी की कहानी", appreciation: "आज आप सुपरस्टार बन गए! 🏆" },
  Vajjika: { label: "🇮🇳 बज्जিকা (Vajjika)", title: "🎯 हम्मर रोज़ क बैज", task1: "🌞 सवेरे उठू आ मंजन करू", task2: "📚 दिमाग क कसरत (होमवर्क)", task3: "🥛 ताकतवर देह (दूध पीउ)", story: "🦊 चतुर सियार क कहानी", appreciation: "आज तूं कमाल क देलऽ, बाबू! 🏆" },
  Maithili: { label: "🇮🇳 मैथिली (Maithili)", title: "🎯 हमर दैनिक बैज", task1: "🌞 भोर में उठू आ ब्रश करू", task2: "📚 स्कूलक काज (होमवर्क)", task3: "🥛 पोषाहार (दूध पीबाक समय)", story: "🦊 चतुर लोमड़ीक कथा", appreciation: "बड्ड सुंदर काज कएलह, बौआ! 🏆" }
};

// 1. PUBLIC LANDING PAGE (Home Route: /)
function HomePage() {
  return (
    <div className="min-h-screen bg-[#FFFDF9] flex flex-col items-center justify-center p-6 text-center">
      <span className="text-6xl animate-bounce mb-4">🧱</span>
      <h1 className="text-4xl font-black text-gray-800 tracking-tight mb-2">Welcome to LittleBlocks</h1>
      <p className="text-base text-gray-500 font-bold max-w-sm mb-6">Make learning and daily routines fun for kids in your own regional language!</p>
      <Link to="/dashboard" className="bg-[#FF6B6B] text-white font-black px-6 py-3 rounded-2xl shadow-md hover:bg-opacity-90 transition">
        Go to Dashboard 🚀
      </Link>
    </div>
  );
}

// 2. PARENT LOGIN PAGE Route: /login
function LoginPage({ setUser }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    const { data, error } = await supabase.auth.signInWithPassword({ email, password });
    if (error) alert(error.message);
    else {
      setUser(data.user);
      navigate('/dashboard');
    }
    setLoading(false);
  };

  const handleSignUp = async (e) => {
    e.preventDefault();
    setLoading(true);
    const { error } = await supabase.auth.signUp({ email, password });
    if (error) alert(error.message);
    else alert('Signup successful! Login now.');
    setLoading(false);
  };

  return (
    <div className="min-h-screen bg-[#FFFDF9] flex items-center justify-center p-6">
      <div className="max-w-sm w-full bg-white border-2 border-[#EADFC9] p-8 rounded-3xl shadow-sm">
        <h3 className="text-xl font-black text-center mb-6 text-gray-800">👩‍👦 Parent Control Access</h3>
        <form className="space-y-4">
          <div>
            <label className="text-xs font-bold block text-gray-500 mb-1">Email Address</label>
            <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} className="w-full border-2 border-gray-200 rounded-xl p-2 text-sm focus:outline-none focus:border-[#FF6B6B]" placeholder="mom@example.com" />
          </div>
          <div>
            <label className="text-xs font-bold block text-gray-500 mb-1">Password</label>
            <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} className="w-full border-2 border-gray-200 rounded-xl p-2 text-sm focus:outline-none focus:border-[#FF6B6B]" placeholder="••••••••" />
          </div>
          <div className="flex space-x-3 pt-2">
            <button onClick={handleLogin} disabled={loading} className="flex-1 bg-[#37352f] text-white font-bold p-2.5 rounded-xl text-sm shadow-md hover:bg-opacity-90">{loading ? 'Loading...' : 'Login'}</button>
            <button onClick={handleSignUp} disabled={loading} className="flex-1 bg-[#4ECDC4] text-white font-bold p-2.5 rounded-xl text-sm shadow-md hover:bg-opacity-90">Sign Up</button>
          </div>
        </form>
      </div>
    </div>
  );
}

// 3. SECURE KIDS DASHBOARD Route: /dashboard
function DashboardPage({ user, handleLogout }) {
  const [selectedLang, setSelectedLang] = useState('English');
  const content = languagesDatabase[selectedLang] || languagesDatabase['English'];
  const [tasks, setTasks] = useState([
    { id: 1, textKey: 'task1', done: false, color: 'bg-amber-100 border-amber-300' },
    { id: 2, textKey: 'task2', done: false, color: 'bg-indigo-100 border-indigo-300' },
    { id: 3, textKey: 'task3', done: false, color: 'bg-emerald-100 border-emerald-300' }
  ]);

  if (!user) return <Navigate to="/login" replace />;

  return (
    <div className="flex h-screen bg-[#FFFDF9] text-[#37352f] overflow-hidden">
      <aside className="w-64 bg-[#F7F4EB] border-r-2 border-[#EADFC9] flex flex-col justify-between p-4 select-none">
        <div>
          <div className="flex items-center space-x-3 p-2 bg-white rounded-2xl border-2 border-[#EADFC9] shadow-sm">
            <span className="text-3xl">🧱</span>
            <div><span className="font-extrabold text-base text-[#FF6B6B]">LittleBlocks</span></div>
          </div>
        </div>
        <div className="p-3 bg-white border-2 border-[#EADFC9] rounded-2xl shadow-sm">
          <label className="text-[10px] uppercase font-black text-amber-600 block mb-1.5">👩‍👦 Mother's Tongue</label>
          <select value={selectedLang} onChange={(e) => setSelectedLang(e.target.value)} className="w-full bg-amber-50 border-2 border-[#EADFC9] text-xs font-bold rounded-lg p-2 focus:outline-none">
            {Object.keys(languagesDatabase).map((k) => <option key={k} value={k}>{languagesDatabase[k].label}</option>)}
          </select>
        </div>
      </aside>

      <main className="flex-1 flex flex-col overflow-y-auto">
        <header className="h-14 border-b-2 border-[#EADFC9] px-8 bg-white/80 flex items-center justify-between text-xs font-bold">
          <div>Workspace / <span className="text-[#FF6B6B] font-extrabold">🚀 Kid's Galaxy</span></div>
          <div className="flex items-center space-x-3">
            <span>👤 {user.email}</span>
            <button onClick={handleLogout} className="bg-red-500 text-white px-3 py-1 rounded-full shadow-md">Logout</button>
          </div>
        </header>

        <div className="max-w-4xl w-full mx-auto px-12 pt-10 pb-24">
          <div className="w-full bg-gradient-to-r from-[#FF6B6B] via-[#FFD166] to-[#4ECDC4] h-32 rounded-3xl p-6 relative overflow-hidden shadow-md mb-8 flex items-center">
            <h2 className="text-2xl font-black text-white z-10">Cloud Synced Playroom! 🦖</h2>
          </div>
          <h1 className="text-3xl font-black text-gray-800 mb-4">{content.title}</h1>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mt-10">
            <div className="bg-white border-2 border-[#EADFC9] p-6 rounded-3xl space-y-3">
              {tasks.map((t) => (
                <div key={t.id} onClick={() => setTasks(tasks.map(tk => tk.id === t.id ? { ...tk, done: !t.done } : tk))} className={`flex items-center justify-between p-3.5 border-2 rounded-2xl cursor-pointer ${t.done ? 'bg-gray-50 opacity-60' : t.color}`}>
                  <span className="text-sm font-bold">{content[t.textKey]}</span>
                  {t.done && <span>🌟 Star!</span>}
                </div>
              ))}
            </div>
            <div className="space-y-6">
              <div className="bg-white border-2 border-[#EADFC9] p-6 rounded-3xl">
                <h4 className="text-base font-extrabold">{content.story}</h4>
              </div>
              <div className="bg-amber-50 border-2 border-dashed border-amber-300 p-5 rounded-3xl">
                <p className="text-base italic font-extrabold">"{content.appreciation}"</p>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}

// ROUTER STRUCTURE CORE
export default function App() {
  const [user, setUser] = useState(null);

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setUser(session?.user ?? null);
    });
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null);
    });
    return () => subscription.unsubscribe();
  }, []);

  const handleLogout = async () => {
    await supabase.auth.signOut();
    setUser(null);
  };

  return (
    <Router>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/login" element={<LoginPage setUser={setUser} />} />
        <Route path="/dashboard" element={<DashboardPage user={user} handleLogout={handleLogout} />} />
      </Routes>
    </Router>
  );
}