import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { supabase } from './supabaseClient';

const languagesDatabase = {
  English: { label: "🌐 English", title: "🎯 My Daily Badges", task1: "🌞 Rise & Shine (Brush)", task2: "📚 Brain Power (Homework)", task3: "🥛 Strong Bones (Milk time)", story: "The Clever Fox. Once upon a time, a clever fox saw a crow with a piece of cheese. The fox praised the crow's voice, and when the crow opened its beak to sing, the cheese fell down, and the fox happily ate it.", appreciation: "Superstar performance today! 🏆", langCode: 'en-US', milestone: "Genius! Perfect score!" },
  Hindi: { label: "🇮🇳 हिन्दी (Hindi)", title: "🎯 मेरे रोज़ के बैज", task1: "🌞 सुबह उठो aur brush karo", task2: "📚 दिमागी कसरत (होमवर्क)", task3: "🥛 मजबूत हड्डियां (दूध का समय)", story: "चतुर लोमड़ी की कहानी। एक बार एक लोमड़ी ने कौवे के पास पनीर देखा। उसने कौवे की मीठी आवाज़ की तारीफ की। जैसे ही कौवे ने गाने के लिए चोंच खोली, पनीर नीचे गिर गया और लोमड़ी उसे लेकर भाग गई।", appreciation: "आज आप सुपरस्टार बन गए! 🏆", langCode: 'hi-IN', milestone: "वाह! आप जीनियस हो!" },
  Vajjika: { label: "🇮🇳 बज्जिका (Vajjika)", title: "🎯 हम्मर रोज़ क बैज", task1: "🌞 सवेरे उठू आ मंजन करू", task2: "📚 दिमाग क कसरत (होमवर्क)", task3: "🥛 ताकतवर देह (दूध पीउ)", story: "चतुर सियार क कहानी। एक बेर एक सियार कौआ के पास पनीर देखलक। ऊ कौआ के बोली के बड़ाई करलक। जैसे ही कौआ गावे लेल चोंच खोललक, पनीर नीचे गिर गेल आ सियार ओकरा लेके भाग गेल।", appreciation: "आज तूं कमाल क देलऽ, बाबू! 🏆", langCode: 'hi-IN', milestone: "वाह! तूं कमाल क देलऽ!" },
  Maithili: { label: "🇮🇳 मैथिली (Maithili)", title: "🎯 हमर दैनिक बैज", task1: "🌞 भोर में उठू आ ब्रश करू", task2: "📚 स्कूलक काज (होमवर्क)", task3: "🥛 पोषण (दूध पीबाक समय)", story: "चतुर लोमड़ीक कथा। एक बेर एकटा लोमड़ी कौआक पास पनीर देखलक। ऊ कौआक सुंदर आवाज़क प्रशंसा कएलक। जेना ही कौआ गाबय लेल चोंच खोललक, पनीर नीचा खसि पड़ल आ लोमड़ी ओकरा ल क भागि गेल।", appreciation: "बड्ड सुंदर काज कएलह, बौआ! 🏆", langCode: 'hi-IN', milestone: "बड्ड नीक, अहां तऽ होशियार छी!" },
  Bengali: { label: "🇮🇳 বাংলা (Bengali)", title: "🎯 আমার দৈনিক ব্যাজ", task1: "🌞 সকালের ম্যাজিক (ব্রাশ)", task2: "📚 মগজ ধোলাই (হোমওয়ার্ক)", task3: "🥛 শক্তিশালী হাড় (দুধের সময়)", story: "চতুর শেয়ালের গল্প। এক সময় এক চতুর শেয়াল একটা কাকের মুখে পনিরের টুকরো দেখল। শেয়ালটি কাকের গানের গলার প্রশংসা করল। কাকটি গান গাওয়ার জন্য মুখ খুলতেই পনিরটি নিচে পড়ে গেল এবং শেয়ালটি তা খেয়ে নিল।", appreciation: "আজ তুমি সত্যিকারের সুপারস্টার! 🏆", langCode: 'bn-IN', milestone: "সাবাশ! তুমি সেরা!" }
};

const taskColors = ['bg-amber-100 border-amber-300', 'bg-indigo-100 border-indigo-300', 'bg-emerald-100 border-emerald-300', 'bg-rose-100 border-rose-300', 'bg-cyan-100 border-cyan-300'];
const staticRewardsList = [{ id: 'r1', title: "📺 15 Mins Cartoon", cost: 1 }, { id: 'r2', title: "🍦 Ice Cream", cost: 2 }, { id: 'r3', title: "🧸 Extra Playtime", cost: 3 }];

export default function App() {
  const [user, setUser] = useState(null);
  const [selectedLang, setSelectedLang] = useState('English');
  const [activeKid, setActiveKid] = useState('Kid 1');
  const [tasks, setTasks] = useState([]);
  const [isPlaying, setIsPlaying] = useState(false);
  const [showConfetti, setShowConfetti] = useState(false);
  const content = languagesDatabase[selectedLang];

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => setUser(session?.user ?? null));
    supabase.auth.onAuthStateChange((_, session) => setUser(session?.user ?? null));
  }, []);

  const triggerMilestone = () => {
    setShowConfetti(true);
    const u = new SpeechSynthesisUtterance(content.milestone);
    u.lang = content.langCode;
    window.speechSynthesis.speak(u);
    setTimeout(() => setShowConfetti(false), 3000);
  };

  const toggleTask = async (taskId, currentStatus) => {
    if (!user) return;
    const newStatus = !currentStatus;
    const updated = tasks.map(t => t.id === taskId ? { ...t, done: newStatus } : t);
    setTasks(updated);
    if (updated.every(t => t.done)) triggerMilestone();
    await supabase.from('tasks_progress').upsert({ user_id: user.id, kid_name: activeKid, task_num: isNaN(taskId) ? 0 : parseInt(taskId), done: newStatus });
  };

  return (
    <Router>
      {showConfetti && <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/20 text-9xl">🌟</div>}
      <Routes>
        <Route path="/" element={
            <div className="h-screen bg-[#FFFDF9] flex overflow-hidden">
                {/* Simplified Sidebar/Main logic combined for pasting ease */}
                <aside className="w-64 bg-[#F7F4EB] p-4 flex flex-col">
                    <h1 className="font-black text-xl text-[#FF6B6B]">LittleBlocks</h1>
                    <select onChange={(e) => setSelectedLang(e.target.value)} className="mt-4 p-2 rounded-lg bg-white border-2">
                        {Object.keys(languagesDatabase).map(k => <option key={k} value={k}>{languagesDatabase[k].label}</option>)}
                    </select>
                </aside>
                <main className="flex-1 p-10 overflow-y-auto">
                    <h2 className="text-3xl font-black">{content.title}</h2>
                    <div className="grid grid-cols-2 gap-4 mt-6">
                        {tasks.map(t => (
                            <div key={t.id} onClick={() => toggleTask(t.id, t.done)} className={`p-4 border-2 rounded-2xl cursor-pointer ${t.done ? 'opacity-50' : t.color}`}>
                                {t.text}
                            </div>
                        ))}
                    </div>
                </main>
            </div>
        } />
        <Route path="*" element={<Navigate to="/" />} />
      </Routes>
    </Router>
  );
}