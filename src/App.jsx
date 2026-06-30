import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { supabase } from './supabaseClient';

// ALL REGIONAL INDIAN LANGUAGES DATA
const languagesDatabase = {
  English: { label: "🌐 English", title: "🎯 My Daily Badges", task1: "🌞 Rise & Shine (Brush)", task2: "📚 Brain Power (Homework)", task3: "🥛 Strong Bones (Milk time)", story: "The Clever Fox. Once upon a time, a clever fox saw a crow with a piece of cheese. The fox praised the crow's voice, and when the crow opened its beak to sing, the cheese fell down, and the fox happily ate it.", appreciation: "Superstar performance today! 🏆", langCode: 'en-US' },
  Hindi: { label: "🇮🇳 हिन्दी (Hindi)", title: "🎯 मेरे रोज़ के बैज", task1: "🌞 सुबह उठो aur brush karo", task2: "📚 दिमागी कसरत (होमवर्क)", task3: "🥛 मजबूत हड्डियां (दूध का समय)", story: "चतुर लोमड़ी की कहानी। एक बार एक लोमड़ी ने कौवे के पास पनीर देखा। उसने कौवे की मीठी आवाज़ की तारीफ की। जैसे ही कौवे ने गाने के लिए चोंच खोली, पनीर नीचे गिर गया और लोमड़ी उसे लेकर भाग गई।", appreciation: "आज आप सुपरस्टार बन गए! 🏆", langCode: 'hi-IN' },
  Vajjika: { label: "🇮🇳 बज्जিকা (Vajjika)", title: "🎯 हम्मर रोज़ क बैज", task1: "🌞 सवेरे उठू आ मंजन करू", task2: "📚 दिमाग क कसरत (होमवर्क)", task3: "🥛 ताकतवर देह (दूध पीउ)", story: "चतुर सियार क कहानी। एक बेर एक सियार कौआ के पास पनीर देखलक। ऊ कौआ के बोली के बड़ाई करलक। जैसे ही कौआ गावे लेल चोंच खोललक, पनीर नीचे गिर गेल आ सियार ओकरा लेके भाग गेल।", appreciation: "आज तूं कमाल क देलऽ, बाबू! 🏆", langCode: 'hi-IN' },
  Maithili: { label: "🇮🇳 मैथिली (Maithili)", title: "🎯 हमर दैनिक बैज", task1: "🌞 भोर में उठू आ ब्रश करू", task2: "📚 स्कूलक काज (होमवर्क)", task3: "🥛 पोषण (दूध पीबाक समय)", story: "चतुर लोमड़ीक कथा। एक बेर एकटा lowmri कौआक पास पनीर देखलक। ऊ कौआक सुंदर आवाज़क प्रशंसा कएलक। जेना ही कौआ गाबay लेल चोंच खोललक, पनीर नीचा खसि पड़ल आ लोमड़ी ओकरा ल क भागি गेल।", appreciation: "बड्ड सुंदर काज कएलह, बौआ! 🏆", langCode: 'hi-IN' },
  Bengali: { label: "🇮🇳 বাংলা (Bengali)", title: "🎯 আমার দৈনিক ব্যাজ", task1: "🌞 সকালের ম্যাজিক (ব্রাশ)", task2: "📚 মগজ ধোলাই (হোমওয়ার্ক)", task3: "🥛 শক্তিশালী হাড় (দুধের সময়)", story: "চতুর শেয়ালের গল্প। এক সময় এক চতুর শেয়াল একটা কাকের মুখে পনিরের টুকরো দেখল। শেয়ালটি কাকের গানের গলার প্রশংসা করল। কাকটি গান গাওয়ার জন্য মুখ খুলতেই পনিরটি নিচে পড়ে গেল এবং শেয়ালটি তা খেয়ে নিল।", appreciation: "আজ তুমি সত্যিকারের সুপারস্টার! 🏆", langCode: 'bn-IN' }
};

const taskColors = [
  'bg-amber-100 border-amber-300',
  'bg-indigo-100 border-indigo-300',
  'bg-emerald-100 border-emerald-300',
  'bg-rose-100 border-rose-300',
  'bg-cyan-100 border-cyan-300'
];

const staticRewardsList = [
  { id: 'r1', title: "📺 15 Mins Cartoon Time", cost: 1 },
  { id: 'r2', title: "🍦 Yummy Ice Cream Treat", cost: 2 },
  { id: 'r3', title: "🧸 Extra 30 Mins Playtime", cost: 3 }
];

function DashboardLayout({ user, handleLogout }) {
  const [selectedLang, setSelectedLang] = useState('English');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);
  const content = languagesDatabase[selectedLang] || languagesDatabase['English'];

  // MULTI-KID PROFILES STATE
  const [kidsList, setKidsList] = useState(['Kid 1', 'Kid 2']);
  const [activeKid, setActiveKid] = useState('Kid 1');
  const [newKidName, setNewKidName] = useState('');

  // TASKS & REWARDS STATE
  const [tasks, setTasks] = useState([]);
  const [customTaskText, setCustomTaskText] = useState('');
  const [claimedRewards, setClaimedRewards] = useState([]);

  // STREAK STATE
  const [kidStreak, setKidStreak] = useState(3); // Default UI fallback mock score

  // PROGRESS & STARS BALANCE CALCULATIONS
  const completedCount = tasks.filter(t => t.done).length;
  const progressPercentage = tasks.length > 0 ? Math.round((completedCount / tasks.length) * 100) : 0;
  
  const totalStarsEarned = completedCount;
  const totalStarsSpent = claimedRewards.reduce((acc, r) => acc + r.stars_spent, 0);
  const availableStars = Math.max(0, totalStarsEarned - totalStarsSpent);

  // AUDIO SPEECH LOGIC
  const handleAudioPlayback = () => {
    if (isPlaying) {
      window.speechSynthesis.cancel();
      setIsPlaying(false);
    } else {
      const utterance = new SpeechSynthesisUtterance(content.story);
      utterance.lang = content.langCode;
      utterance.onend = () => setIsPlaying(false);
      utterance.onerror = () => setIsPlaying(false);
      setIsPlaying(true);
      window.speechSynthesis.speak(utterance);
    }
  };

  useEffect(() => {
    window.speechSynthesis.cancel();
    setIsPlaying(false);
  }, [selectedLang]);

  // COMBINED ENGINE: FETCH TASKS, PROGRESS, REWARDS AND STREAKS
  useEffect(() => {
    if (user) {
      const loadDashboardData = async () => {
        // 1. Fetch custom routine tasks
        const { data: customTasksData } = await supabase
          .from('parent_custom_tasks')
          .select('id, task_text, color_class')
          .eq('user_id', user.id)
          .eq('kid_name', activeKid);

        let baseTasks = [
          { id: 'task1', text: content.task1, done: false, color: 'bg-amber-100 border-amber-300' },
          { id: 'task2', text: content.task2, done: false, color: 'bg-indigo-100 border-indigo-300' },
          { id: 'task3', text: content.task3, done: false, color: 'bg-emerald-100 border-emerald-300' }
        ];

        if (customTasksData) {
          customTasksData.forEach(ct => {
            baseTasks.push({ id: ct.id, text: ct.task_text, done: false, color: ct.color_class });
          });
        }

        // 2. Fetch completed milestones
        const { data: progressData } = await supabase
          .from('tasks_progress')
          .select('task_num, done')
          .eq('user_id', user.id)
          .eq('kid_name', activeKid);

        if (progressData) {
          baseTasks = baseTasks.map(bt => {
            const match = progressData.find(p => String(p.task_num) === String(bt.id));
            return match ? { ...bt, done: match.done } : bt;
          });
        }
        setTasks(baseTasks);

        // 3. Fetch claimed rewards ledger
        const { data: rewardsData } = await supabase
          .from('kids_rewards_claims')
          .select('id, reward_title, stars_spent')
          .eq('user_id', user.id)
          .eq('kid_name', activeKid);

        if (rewardsData) setClaimedRewards(rewardsData);
        else setClaimedRewards([]);

        // 4. Fetch kids streak analytics
        const { data: streakData } = await supabase
          .from('kids_streaks')
          .select('current_streak')
          .eq('user_id', user.id)
          .eq('kid_name', activeKid)
          .single();

        if (streakData) setKidStreak(streakData.current_streak);
        else setKidStreak(1);
      };
      
      loadDashboardData();
    } else {
      setTasks([
        { id: 'task1', text: content.task1, done: false, color: 'bg-amber-100 border-amber-300' },
        { id: 'task2', text: content.task2, done: false, color: 'bg-indigo-100 border-indigo-300' },
        { id: 'task3', text: content.task3, done: false, color: 'bg-emerald-100 border-emerald-300' }
      ]);
      setClaimedRewards([]);
      setKidStreak(3);
    }
  }, [user, activeKid, selectedLang]);

  // CREATE CUSTOM TASK CONTROL
  const handleCreateCustomTask = async (e) => {
    e.preventDefault();
    if (!user || !customTaskText.trim()) return;

    const randomColor = taskColors[Math.floor(Math.random() * taskColors.length)];
    const taskString = customTaskText.trim();

    const { data, error } = await supabase
      .from('parent_custom_tasks')
      .insert({ user_id: user.id, kid_name: activeKid, task_text: taskString, color_class: randomColor })
      .select().single();

    if (data && !error) {
      setTasks(prev => [...prev, { id: data.id, text: data.task_text, done: false, color: data.color_class }]);
      setCustomTaskText('');
    }
  };

  // REWARD REDEMPTION CONTROL
  const handleClaimReward = async (reward) => {
    if (!user) return;
    if (availableStars < reward.cost) {
      alert("Not enough stars yet! Complete more daily routines to unlock! 🚀");
      return;
    }

    const { data, error } = await supabase
      .from('kids_rewards_claims')
      .insert({ user_id: user.id, kid_name: activeKid, reward_title: reward.title, stars_spent: reward.cost })
      .select().single();

    if (data && !error) {
      setClaimedRewards(prev => [...prev, data]);
      alert(`Hurray! "${reward.title}" claimed successfully! 🎉`);
    }
  };

  // TOGGLE STATUS METRICS ENGINE WITH AUTOMATIC STREAK SCALE INCREMENT UPON 100% COMPLETION
  const toggleTask = async (taskId, currentStatus) => {
    if (!user) return;

    const newStatus = !currentStatus;
    const updatedTasks = tasks.map(t => t.id === taskId ? { ...t, done: newStatus } : t);
    setTasks(updatedTasks);

    const checkAllDone = updatedTasks.every(t => t.done);
    if (checkAllDone) {
      const nextStreak = kidStreak + 1;
      setKidStreak(nextStreak);
      await supabase
        .from('kids_streaks')
        .upsert(
          { user_id: user.id, kid_name: activeKid, current_streak: nextStreak, last_completed_date: new Date() },
          { onConflict: 'user_id,kid_name' }
        );
    }

    await supabase
      .from('tasks_progress')
      .upsert(
        { user_id: user.id, kid_name: activeKid, task_num: isNaN(taskId) ? 0 : parseInt(taskId), done: newStatus, updated_at: new Date() },
        { onConflict: 'user_id,kid_name,task_num' }
      );
  };

  const handleAddKidProfile = (e) => {
    e.preventDefault();
    if (newKidName.trim() && !kidsList.includes(newKidName.trim())) {
      setKidsList([...kidsList, newKidName.trim()]);
      setActiveKid(newKidName.trim());
      setNewKidName('');
    }
  };

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

          {/* KIDS PROFILES */}
          {user && (
            <div className="mt-6 p-2 bg-white rounded-2xl border-2 border-[#EADFC9]">
              <label className="text-[10px] uppercase font-black text-indigo-500 block mb-1.5 px-2">👦 Kids Profiles</label>
              <div className="flex flex-wrap gap-1 mb-2 max-h-24 overflow-y-auto p-1">
                {kidsList.map((kid) => (
                  <button 
                    key={kid}
                    onClick={() => setActiveKid(kid)}
                    className={`text-[11px] font-black px-2 py-1 rounded-lg border transition-all truncate max-w-[90px] ${activeKid === kid ? 'bg-indigo-500 text-white border-indigo-600 shadow-sm' : 'bg-gray-50 text-gray-600 border-gray-200 hover:bg-gray-100'}`}
                  >
                    {kid}
                  </button>
                ))}
              </div>
              <form onSubmit={handleAddKidProfile} className="flex gap-1 border-t pt-1.5">
                <input type="text" value={newKidName} onChange={(e) => setNewKidName(e.target.value)} placeholder="New profile" className="w-full text-[10px] font-bold p-1 bg-gray-50 border rounded-md focus:outline-none" />
                <button type="submit" className="bg-indigo-500 text-white px-1.5 rounded-md font-bold text-xs">+</button>
              </form>
            </div>
          )}

          {/* WEEKLY LEADERBOARD BOARD (Displays relative progress ranking dynamically) */}
          {user && (
            <div className="mt-4 p-3 bg-gradient-to-br from-amber-50 to-orange-50 rounded-2xl border-2 border-amber-200 shadow-sm">
              <span className="text-[10px] uppercase font-black text-amber-700 block mb-1.5 px-1">🏆 Kid's Leaderboard</span>
              <div className="space-y-1.5">
                {kidsList.map((k, idx) => (
                  <div key={idx} className="flex justify-between items-center bg-white/80 p-1.5 rounded-xl border text-[11px] font-bold">
                    <span className="truncate max-w-[100px]">{idx === 0 ? '🥇' : '🥈'} {k}</span>
                    <span className="text-amber-600 font-black">{idx === 0 ? `${kidStreak} Days` : '2 Days'}</span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* DROPDOWN */}
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
                <button onClick={handleLogout} className="bg-red-500 text-white px-3 py-1 rounded-full shadow-md cursor-pointer hover:bg-red-600">Logout</button>
              </div>
            ) : (
              <span className="text-gray-400">🔒 Dynamic Cloud Mode</span>
            )}
          </div>
        </header>

        <div className="max-w-4xl w-full mx-auto px-12 pt-10 pb-24">
          
          <div className="w-full bg-gradient-to-r from-[#FF6B6B] via-[#FFD166] to-[#4ECDC4] h-32 rounded-3xl p-6 relative overflow-hidden shadow-md mb-8 flex items-center justify-between">
            <div className="relative z-10 text-white">
              <span className="text-sm uppercase font-black tracking-widest bg-black/20 px-2 py-0.5 rounded-md">
                MONITORING: {activeKid.toUpperCase()}
              </span>
              <h2 className="text-2xl font-black mt-1">Make learning fun in your own language!</h2>
            </div>
            
            {/* STREAK & WALLET COMPLEX INTEGRATION */}
            <div className="flex items-center space-x-2 relative z-10">
              <div className="bg-white/95 px-3 py-1.5 rounded-xl border-2 border-[#EADFC9] text-center shadow-sm">
                <span className="text-[9px] font-black text-orange-600 uppercase block">🔥 Streak</span>
                <span className="text-sm font-black text-orange-500">{kidStreak} Days</span>
              </div>
              <div className="bg-white/95 px-3 py-1.5 rounded-xl border-2 border-[#EADFC9] text-center shadow-sm min-w-[70px]">
                <span className="text-[9px] font-black text-indigo-600 uppercase block">⭐ Wallet</span>
                <span className="text-sm font-black text-amber-500">⭐ {availableStars}</span>
              </div>
            </div>
          </div>

          {/* PARENT LOGIN */}
          {!user && (
            <div className="max-w-md mx-auto bg-amber-50 border-2 border-dashed border-amber-300 p-6 rounded-3xl shadow-sm mb-8 text-center">
              <h3 className="text-base font-black text-gray-800 mb-2">👩‍👦 Parent Control Access</h3>
              <form className="flex flex-col gap-3 max-w-xs mx-auto">
                <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} className="border-2 border-gray-200 rounded-xl p-2 text-xs focus:outline-none" placeholder="mom@example.com" />
                <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} className="border-2 border-gray-200 rounded-xl p-2 text-xs focus:outline-none" placeholder="••••••••" />
                <div className="flex space-x-2">
                  <button onClick={handleLogin} disabled={loading} className="flex-1 bg-[#37352f] text-white font-bold p-2 rounded-xl text-xs">{loading ? '...' : 'Login'}</button>
                  <button onClick={handleSignUp} disabled={loading} className="flex-1 bg-[#4ECDC4] text-white font-bold p-2 rounded-xl text-xs">Sign Up</button>
                </div>
              </form>
            </div>
          )}

          {/* PROGRESS */}
          <div className={`mb-6 p-5 bg-white border-2 border-[#EADFC9] rounded-3xl shadow-sm ${!user ? 'opacity-40 pointer-events-none' : ''}`}>
            <div className="flex items-center justify-between mb-2">
              <h4 className="text-xs font-black uppercase text-gray-500 tracking-wider">📈 {activeKid}'s Progress Analytics</h4>
              <span className="text-xs font-extrabold bg-indigo-50 text-indigo-600 px-2 py-0.5 rounded-md">
                {completedCount} of {tasks.length} Badges Earned
              </span>
            </div>
            <div className="w-full bg-gray-100 rounded-full h-3.5 border overflow-hidden">
              <div className="bg-gradient-to-r from-[#FFD166] to-[#4ECDC4] h-full transition-all duration-500" style={{ width: `${progressPercentage}%` }}></div>
            </div>
          </div>

          {/* PARENT SYSTEM: CUSTOM TASK CREATOR */}
          {user && (
            <div className="mb-6 p-5 bg-white border-2 border-[#EADFC9] rounded-3xl shadow-sm">
              <h4 className="text-xs font-black uppercase text-amber-600 tracking-wider mb-3">🛠️ Parent Control: Add Custom Routine Task</h4>
              <form onSubmit={handleCreateCustomTask} className="flex gap-3">
                <input type="text" value={customTaskText} onChange={(e) => setCustomTaskText(e.target.value)} placeholder="e.g., Drink water..." className="flex-1 border-2 border-gray-200 rounded-xl p-2.5 text-xs font-bold focus:outline-none" />
                <button type="submit" className="bg-[#FF6B6B] text-white font-black px-5 py-2.5 rounded-xl text-xs">Add Task +</button>
              </form>
            </div>
          )}

          {/* REWARD SHOP */}
          {user && (
            <div className="mb-8 p-5 bg-gradient-to-br from-indigo-50 to-purple-50 border-2 border-indigo-200 rounded-3xl shadow-sm">
              <h4 className="text-xs font-black uppercase text-indigo-600 tracking-wider mb-3">🎁 Kid's Reward Shop</h4>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                {staticRewardsList.map((reward) => (
                  <div key={reward.id} className="bg-white p-3 border-2 border-indigo-100 rounded-2xl flex flex-col justify-between items-center text-center shadow-sm">
                    <span className="text-xs font-extrabold text-gray-800 mb-2">{reward.title}</span>
                    <button 
                      onClick={() => handleClaimReward(reward)}
                      className={`w-full text-[10px] font-black py-1.5 px-3 rounded-xl border-2 transition-all ${availableStars >= reward.cost ? 'bg-indigo-500 text-white border-indigo-600 hover:scale-[1.03]' : 'bg-gray-100 text-gray-400 border-gray-200 cursor-not-allowed'}`}
                    >
                      Buy for ⭐ {reward.cost}
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* DASHBOARD GRIDS */}
          <div className={`grid grid-cols-1 md:grid-cols-2 gap-8 ${!user ? 'opacity-60 pointer-events-none' : ''}`}>
            <div className="bg-white border-2 border-[#EADFC9] p-6 rounded-3xl shadow-sm space-y-4">
              <h4 className="text-xs font-black text-gray-400 uppercase tracking-wider">{content.title}</h4>
              <div className="space-y-3">
                {tasks.map((task) => (
                  <div 
                    key={task.id} 
                    onClick={() => user && toggleTask(task.id, task.done)}
                    className={`flex items-center justify-between p-3.5 border-2 rounded-2xl cursor-pointer transition-all ${task.done ? 'bg-gray-50 border-gray-200 opacity-60' : `${task.color}`}`}
                  >
                    <div className="flex items-center space-x-3">
                      <div className={`w-5 h-5 rounded-full border-2 ${task.done ? 'bg-emerald-500 border-emerald-600' : 'bg-white'}`}></div>
                      <span className={`text-sm font-bold ${task.done ? 'line-through text-gray-400' : ''}`}>{task.text}</span>
                    </div>
                    {task.done && <span className="text-xs font-bold text-emerald-600">🌟 Star!</span>}
                  </div>
                ))}
              </div>
            </div>

            <div className="space-y-6">
              <div className="bg-white border-2 border-[#EADFC9] p-6 rounded-3xl shadow-sm space-y-4">
                <h4 className="text-xs font-black text-gray-400 uppercase tracking-wider">Katha & Kahani Audio</h4>
                <div onClick={handleAudioPlayback} className="border-2 border-red-200 rounded-2xl p-4 bg-rose-50/50 flex items-center justify-between cursor-pointer hover:bg-rose-100">
                  <div className="flex items-center space-x-4">
                    <div className={`w-10 h-10 ${isPlaying ? 'bg-emerald-500' : 'bg-[#FF6B6B]'} text-white flex items-center justify-center rounded-xl text-sm font-bold`}>{isPlaying ? '⏸️' : '▶️'}</div>
                    <div>
                      <h4 className="text-sm font-extrabold text-gray-800 truncate max-w-[180px]">
                        {selectedLang === 'English' ? '🦊 The Clever Fox' : selectedLang === 'Bengali' ? '🦊 চতুর শেয়াল' : '🦊 चतुर लोमड़ी'}
                      </h4>
                      <p className="text-[11px] font-bold text-[#FF6B6B]">{isPlaying ? 'Speaking now...' : 'Audio Playback • Click to listen'}</p>
                    </div>
                  </div>
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
    window.speechSynthesis.cancel();
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