import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { supabase } from './supabaseClient';

// ALL REGIONAL INDIAN LANGUAGES RESTORED
const languagesDatabase = {
  English: { label: "🌐 English", title: "🎯 My Daily Badges", task1: "🌞 Rise & Shine (Brush)", task2: "📚 Brain Power (Homework)", task3: "🥛 Strong Bones (Milk time)", story: "🦊 The Clever Fox", appreciation: "Superstar performance today! 🏆" },
  Hindi: { label: "🇮🇳 हिन्दी (Hindi)", title: "🎯 मेरे रोज़ के बैज", task1: "🌞 सुबह उठो aur brush karo", task2: "📚 दिमागी कसरत (होमवर्क)", task3: "🥛 मजबूत हड्डियां (दूध का समय)", story: "🦊 चतुर लोमड़ी की कहानी", appreciation: "आज आप सुपरस्टार बन गए! 🏆" },
  Vajjika: { label: "🇮🇳 बज्जिका (Vajjika)", title: "🎯 हम्मर रोज़ क बैज", task1: "🌞 सवेरे उठू आ मंजन करू", task2: "📚 दिमाग क कसरत (होमवर्क)", task3: "🥛 ताकतवर देह (दूध पीउ)", story: "🦊 चतुर सियार क कहानी", appreciation: "आज तूं कमाल क देलऽ, बाबू! 🏆" },
  Maithili: { label: "🇮🇳 मैथिली (Maithili)", title: "🎯 हमर दैनिक बैज", task1: "🌞 भोर में उठू आ ब्रश करू", task2: "📚 स्कूलक काज (होमवर्क)", task3: "🥛 पोषण (दूध पीबाक समय)", story: "🦊 चतुर लोमड़ीक कथा", appreciation: "बड्ड सुंदर काज कएलह, बौआ! 🏆" },
  Bengali: { label: "🇮🇳 বাংলা (Bengali)", title: "🎯 আমার দৈনিক ব্যাজ", task1: "🌞 সকালের ম্যাজিক (ব্রাশ)", task2: "📚 মগজ ধোলাই (হোমওয়ার্ক)", task3: "🥛 শক্তিশালী হাড় (দুধের সময়)", story: "🦊 চতুর শেয়ালের গল্প", appreciation: "আজ তুমি সত্যিকারের সুপারস্টার! 🏆" }
};

function DashboardLayout({ user, handleLogout }) {
  const [selectedLang, setSelectedLang] = useState('English');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const content = languagesDatabase[selectedLang] || languagesDatabase['English'];

  const [tasks, setTasks] = useState([
    { id: 1, textKey: 'task1', done: false, color: 'bg-amber-100 border-amber-300' },
    { id: 2, textKey: 'task2', done: false, color: 'bg-indigo-100 border-indigo-300' },
    { id: 3, textKey: 'task3', done: false, color: 'bg-emerald-100 border-emerald-300' }
  ]);

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    const { error } = await supabase.auth.signInWithPassword({ email, password });
    if (error) alert(error.message);
    setLoading(false);
  };

  const handleSignUp = async (e) => {
    e.preventDefault();
    setLoading(true);
    const { error } = await supabase.auth.signUp({ email, password });
    if (error) alert(error.message);
    else alert('Signup successful! Check email or login directly.');
    setLoading(false);
  };

  return (
    <div className="flex h-screen bg-[#FFFDF9] text-[#37352f] overflow-hidden">
      
      {/* SIDEBAR */}
      <aside className="w-64 bg-[#F7F4EB] border-r-2 border-[#EADFC9] flex flex-col justify-between p-4 select-none">
        <div>
          <div className="flex items-center space-x-3 p-2 bg-white rounded-2xl border-2 border-[#EADFC9] shadow-sm">
            <span className="text-3xl">🧱</span>
            <div>
              <span className="font-extrabold text-base tracking-tight text-[#FF6B6B]">LittleBlocks</span>
              <p className="text-[10px] text-gray-400 font-bold uppercase tracking-wider">Kids Space</p>
            </div>
          </div>

          <div className="mt-8 space-y-2">
            <div className="flex items-center space-x-3 px-4 py-2.5 bg-[#FFD166] text-amber-950 rounded-xl text-sm font-bold shadow-sm cursor-pointer">
              <span>🏡</span> <span>Fun Dashboard</span>
            </div>
            <div className="flex items-center space-x-3 px-4 py-2.5 text-gray-500 rounded-xl text-sm font-bold select-none">
              <span>🚀</span> <span>Routine Rocket</span>
            </div>
            <div className="flex items-center space-x-3 px-4 py-2.5 text-gray-500 rounded-xl text-sm font-bold select-none">
              <span>🍿</span> <span>Katha Station</span>
            </div>
            <div className="flex items-center space-x-3 px-4 py-2.5 text-gray-500 rounded-xl text-sm font-bold select-none">
              <span>🎨</span> <span>Bhasha Playground</span>
            </div>
          </div>
        </div>

        {/* MOTHER'S LANGUAGE TONGUE */}
        <div className="p-3 bg-white border-2 border-[#EADFC9] rounded-2xl shadow-sm">
          <label className="text-[10px] uppercase font-black tracking-widest text-amber-600 block mb-1.5">👩‍👦 MOTHER'S LANGUAGE TONGUE</label>
          <select 
            value={selectedLang} 
            onChange={(e) => setSelectedLang(e.target.value)}
            className="w-full bg-amber-50 border-2 border-[#EADFC9] text-xs font-bold rounded-lg p-2 focus:outline-none cursor-pointer"
          >
            {Object.keys(languagesDatabase).map((langKey) => (
              <option key={langKey} value={langKey}>{languagesDatabase[langKey].label}</option>
            ))}
          </select>
        </div>
      </aside>

      {/* MAIN CONTENT AREA */}
      <main className="flex-1 flex flex-col overflow-y-auto">
        <header className="h-14 border-b-2 border-[#EADFC9] px-8 bg-white/80 flex items-center justify-between text-xs font-bold">
          <div className="text-gray-400">Playground / <span className="text-[#FF6B6B] font-extrabold">🚀 Kid's Galaxy</span></div>
          <div>
            {user ? (
              <div className="flex items-center space-x-3">
                <span className="text-gray-600">👤 {user.email}</span>
                <button onClick={handleLogout} className="bg-red-500 text-white px-3 py-1 rounded-full shadow-md cursor-pointer hover:bg-red-600 transition">Logout</button>
              </div>
            ) : (
              <span className="text-gray-400">🔒 Dynamic Cloud Mode</span>
            )}
          </div>
        </header>

        <div className="max-w-4xl w-full mx-auto px-12 pt-10 pb-24">
          
          {/* TOP BANNER */}
          <div className="w-full bg-gradient-to-r from-[#FF6B6B] via-[#FFD166] to-[#4ECDC4] h-32 rounded-3xl p-6 relative overflow-hidden shadow-md mb-8 flex items-center">
            <div className="relative z-10 text-white">
              <span className="text-sm uppercase font-black tracking-widest bg-black/20 px-2 py-0.5 rounded-md">WELCOME KIDS & SUPER-MOMS!</span>
              <h2 className="text-2xl font-black mt-1">Make learning fun in your own language!</h2>
            </div>
            <span className="text-6xl absolute right-6 animate-pulse">🦖</span>
          </div>

          <div className="flex flex-col items-center justify-center text-center mb-8">
            <span className="text-5xl bg-white p-2 rounded-2xl border-2 border-gray-100 shadow-sm mb-2">🎯</span>
            <h1 className="text-3xl font-black text-gray-800 tracking-tight">My Daily Adventure Space</h1>
            <p className="text-xs text-gray-400 font-bold mt-1">Click on task badges to mark them complete and earn digital stars!</p>
          </div>

          {/* PARENT GATEWAY BOX */}
          {!user && (
            <div className="max-w-md mx-auto bg-amber-50 border-2 border-dashed border-amber-300 p-6 rounded-3xl shadow-sm mb-8 text-center">
              <h3 className="text-base font-black text-gray-800 mb-2">👩‍👦 Parent Control Access</h3>
              <p className="text-xs text-gray-500 font-bold mb-4">Please log in or sign up to save your kid's daily star badges to the cloud!</p>
              <form className="flex flex-col gap-3 max-w-xs mx-auto">
                <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} className="border-2 border-gray-200 rounded-xl p-2 text-xs focus:outline-none focus:border-[#FF6B6B]" placeholder="mom@example.com" />
                <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} className="border-2 border-gray-200 rounded-xl p-2 text-xs focus:outline-none focus:border-[#FF6B6B]" placeholder="••••••••" />
                <div className="flex space-x-2">
                  <button onClick={handleLogin} disabled={loading} className="flex-1 bg-[#37352f] text-white font-bold p-2 rounded-xl text-xs hover:bg-opacity-90">{loading ? '...' : 'Login'}</button>
                  <button onClick={handleSignUp} disabled={loading} className="flex-1 bg-[#4ECDC4] text-white font-bold p-2 rounded-xl text-xs hover:bg-opacity-90">Sign Up</button>
                </div>
              </form>
            </div>
          )}

          {/* DASHBOARD COMPONENT MATRIX */}
          <div className={`grid grid-cols-1 md:grid-cols-2 gap-8 mt-6 ${!user ? 'opacity-60 pointer-events-none select-none' : ''}`}>
            {/* Badges system */}
            <div className="bg-white border-2 border-[#EADFC9] p-6 rounded-3xl shadow-sm space-y-4">
              <h4 className="text-xs font-black text-gray-400 uppercase tracking-wider">{content.title}</h4>
              <div className="space-y-3">
                {tasks.map((task) => (
                  <div 
                    key={task.id} 
                    onClick={() => user && setTasks(tasks.map(t => t.id === task.id ? { ...t, done: !t.done } : t))}
                    className={`flex items-center justify-between p-3.5 border-2 rounded-2xl cursor-pointer ${task.done ? 'bg-gray-50 border-gray-200 opacity-60' : `${task.color}`}`}
                  >
                    <div className="flex items-center space-x-3">
                      <div className={`w-5 h-5 rounded-full border-2 ${task.done ? 'bg-emerald-500 border-emerald-600' : 'bg-white'}`}></div>
                      <span className={`text-sm font-bold ${task.done ? 'line-through text-gray-400' : ''}`}>{content[task.textKey]}</span>
                    </div>
                    {task.done && <span className="text-xs font-bold text-emerald-600">🌟 Star!</span>}
                  </div>
                ))}
              </div>
            </div>

            {/* Katha and Shabaash Block */}
            <div className="space-y-6">
              <div className="bg-white border-2 border-[#EADFC9] p-6 rounded-3xl shadow-sm space-y-4">
                <h4 className="text-xs font-black text-gray-400 uppercase tracking-wider">Katha & Kahani Audio</h4>
                <div className="border-2 border-red-200 rounded-2xl p-4 bg-rose-50/50 flex items-center justify-between">
                  <div className="flex items-center space-x-4">
                    <div className="w-10 h-10 bg-[#FF6B6B] text-white flex items-center justify-center rounded-xl text-sm font-bold">▶️</div>
                    <div>
                      <h4 className="text-sm font-extrabold text-gray-800">{content.story}</h4>
                      <p className="text-[11px] font-bold text-[#FF6B6B]">Audio Playback • Click to listen</p>
                    </div>
                  </div>
                  <span className="text-[10px] font-black bg-amber-400 text-amber-950 px-2 py-0.5 rounded-md shadow-sm">FREE</span>
                </div>
              </div>

              <div className="bg-amber-50 border-2 border-dashed border-amber-300 p-5 rounded-3xl">
                <h4 className="text-xs font-black text-amber-700">MAMMA'S SHABAASH BOARD</h4>
                <p className="text-base italic text-amber-950 font-extrabold mt-2">"{content.appreciation}"</p>
              </div>
            </div>
          </div>

        </div>
      </main>
    </div>
  );
}

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
        <Route path="/" element={<DashboardLayout user={user} handleLogout={handleLogout} />} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </Router>
  );
}