import React, { useState } from 'react';

// Enhanced Database with Kids Icons & Playful Language Text
const languagesDatabase = {
  English: { label: "🌐 English", title: "🎯 My Daily Badges", task1: "🌞 Rise & Shine (Brush)", task2: "📚 Brain Power (Homework)", task3: "🥛 Strong Bones (Milk time)", story: "🦊 The Clever Fox", appreciation: "Superstar performance today! 🏆" },
  Hindi: { label: "🇮🇳 हिन्दी (Hindi)", title: "🎯 मेरे रोज़ के बैज", task1: "🌞 सुबह उठो और ब्रश करो", task2: "📚 दिमागी कसरत (होमवर्क)", task3: "🥛 मजबूत हड्डियां (दूध का समय)", story: "🦊 चतुर लोमड़ी की कहानी", appreciation: "आज आप सुपरस्टार बन गए! 🏆" },
  Vajjika: { label: "🇮🇳 बज्जিকা (Vajjika)", title: "🎯 हम्मर रोज़ क बैज", task1: "🌞 सवेरे उठू आ मंजन करू", task2: "📚 दिमाग क कसरत (होमवर्क)", task3: "🥛 ताकतवर देह (दूध पीउ)", story: "🦊 चतुर सियार क कहानी", appreciation: "आज तूं कमाल क देलऽ, बाबू! 🏆" },
  Maithili: { label: "🇮🇳 मैथिली (Maithili)", title: "🎯 हमर दैनिक बैज", task1: "🌞 भोर में उठू आ ब्रश करू", task2: "📚 स्कूलक काज (होमवर्क)", task3: "🥛 पोषाहार (दूध पीबाक समय)", story: "🦊 चतुर लोमड़ीक कथा", appreciation: "बड्ड सुंदर काज कएलह, बौआ! 🏆" },
  Bengali: { label: "🇮🇳 বাংলা (Bengali)", title: "🎯 আমার দৈনিক ব্যাজ", task1: "🌞 সকালের ম্যাজিক (ব্রাশ)", task2: "📚 মগজ ধোলাই (হোমওয়ার্ক)", task3: "🥛 শক্তিশালী হাড় (দুধের সময়)", story: "🦊 চতুর শেয়ালের গল্প", appreciation: "আজ তুমি সত্যিকারের সুপারস্টার! 🏆" },
  Tamil: { label: "🇮🇳 தமிழ் (Tamil)", title: "🎯 எனது தினசரி பேட்ஜ்கள்", task1: "🌞 காலை மந்திரம் (பல் துலக்கு)", task2: "📚 மூளை ஆற்றல் (வீட்டுப்பாடம்)", task3: "🥛 வலுவான எலும்புகள் (பால் நேரம்)", story: "🦊 புத்திசாலி நரி கதை", appreciation: "இன்று நீ ஒரு சூப்பர் ஸ்டார்! 🏆" },
  Telugu: { label: "🇮🇳 తెలుగు (Telugu)", title: "🎯 నా రోజువారీ బ్యాడ్జీలు", task1: "🌞 ఉదయపు మ్యాజిక్ (బ్రష్)", task2: "📚 బ్రెయిన్ పవర్ (హోంవర్క్)", task3: "🥛 గట్టి ఎముకలు (పాలు తాగే సమయం)", story: "🦊 తెలివైన నక్క కథ", appreciation: "ఈరోజు నువ్వు సూపర్ స్టార్ వి! 🏆" },
  Marathi: { label: "🇮🇳 मराठी (Marathi)", title: "🎯 माझे रोजचे बॅजेस", task1: "🌞 सकाळची जादू (ब्रश करा)", task2: "📚 मेंदूची कसरत (अभ्यास)", task3: "🥛 मजबूत हाडे (दूध पिण्याची वेळ)", story: "🦊 हुशार कोल्ह्याची गोष्ट", appreciation: "आज तू खूप छान केलंस, बाळा! 🏆" },
  Gujarati: { label: "🇮🇳 ગુજરાતી (Gujarati)", title: "🎯 મારા દૈনিক બેજ", task1: "🌞 સવારનો જાદુ (બ્રશ)", task2: "📚 મગજ શક્તિ (હોમવર્ક)", task3: "🥛 મજબૂત હાડકાં (દૂધનો સમય)", story: "🦊 હોશિયાર શિયાળની વાર્તા", appreciation: "આજે તું સુપરસ્ટાર છે, બેટા! 🏆" },
  Punjabi: { label: "🇮🇳 ਪੰਜਾਬੀ (Punjabi)", title: "🎯 ਮੇਰੇ ਰੋਜ਼ਾਨਾ ਬੈਜ", task1: "🌞 ਸਵੇਰ ਦਾ ਜਾਦੂ (ਬੁਰਸ਼)", task2: "📚 ਦਿਮਾਗੀ ਤਾਕਤ (ਹੋਮਵর্ক)", task3: "🥛 ਮਜ਼ਬੂਤ ਹੱਡੀਆਂ (ਦੁੱಧ ਦਾ ਸਮਾਂ)", story: "🦊 ਚਲਾਕ ਲੂੰਬੜੀ ਦੀ ਕਹਾਣੀ", appreciation: "ਅੱਜ ਤੂੰ ਕਮਾਲ ਕਰ ਦਿੱਤੀ, ਪੁੱਤਰ! 🏆" },
  Malayalam: { label: "🇮🇳 മലയാളം (Malayalam)", title: "🎯 എന്റെ ദിവസേനയുള്ള ബാഡ്ജുകൾ", task1: "🌞 പ്രഭാത മാജിക് (പല്ല് തേക്കുക)", task2: "📚 ബുദ്ധിശക്തി (ഹോംവർക്ക്)", task3: "🥛 കരുത്തുള്ള അസ്ഥികൾ (പാൽ സമയം)", story: "🦊 ബുദ്ധിമാനായ കുറുക്കൻ്റെ കഥ", appreciation: "ഇന്ന് നീ ഒരു സൂப்பர் സ്റ്റാർ ആണ്! 🏆" },
  Kannada: { label: "🇮🇳 ಕನ್ನಡ (Kannada)", title: "🎯 ನನ್ನ ದಿನಚರಿ ಬ್ಯಾಡ್ಜ್‌ಗಳು", task1: "🌞 ಮುಂಜಾನೆ ಮ್ಯಾಜಿಕ್ (ಬ್ರಷ್)", task2: "📚 ಮೆದುಳಿನ ಶಕ್ತಿ (ಹೋಂವರ್ಕ್)", task3: "🥛 ಬಲಿಷ್ಠ ಮೂಳೆಗಳು (ಹಾಲಿನ ಸಮಯ)", story: "🦊 ಜಾಣ ನರಿಯ ಕಥೆ", appreciation: "ಇಂದು ನೀನು ಸೂಪರ್ ಸ್ಟಾರ್, ಕಂದಾ! 🏆" }
};

function App() {
  const [selectedLang, setSelectedLang] = useState('English');
  const content = languagesDatabase[selectedLang];

  const [tasks, setTasks] = useState([
    { id: 1, textKey: 'task1', done: false, color: 'bg-amber-100 border-amber-300' },
    { id: 2, textKey: 'task2', done: false, color: 'bg-indigo-100 border-indigo-300' },
    { id: 3, textKey: 'task3', done: false, color: 'bg-emerald-100 border-emerald-300' }
  ]);

  return (
    <div className="flex h-screen bg-[#FFFDF9] text-[#37352f] overflow-hidden">
      
      {/* 1. PLAYFUL KIDS SIDEBAR */}
      <aside className="w-64 bg-[#F7F4EB] border-r-2 border-[#EADFC9] flex flex-col justify-between select-none p-4">
        <div>
          {/* Brand Logo Header */}
          <div className="flex items-center space-x-3 p-2 bg-white rounded-2xl border-2 border-[#EADFC9] shadow-sm cursor-pointer hover:scale-105 transition-transform">
            <span className="text-3xl animate-bounce">🧱</span>
            <div>
              <span className="font-extrabold text-base tracking-tight text-[#FF6B6B]">LittleBlocks</span>
              <p className="text-[10px] text-gray-400 font-bold uppercase tracking-wider">Kids Space</p>
            </div>
          </div>

          {/* Nav Icons list */}
          <div className="mt-8 space-y-2">
            <div className="flex items-center space-x-3 px-4 py-2.5 bg-[#FFD166] text-amber-950 rounded-xl text-sm font-bold shadow-sm cursor-pointer">
              <span>🏡</span> <span>Fun Dashboard</span>
            </div>
            <div className="flex items-center space-x-3 px-4 py-2.5 text-gray-600 hover:bg-white hover:text-[#4ECDC4] rounded-xl text-sm font-bold cursor-pointer transition">
              <span>🚀</span> <span>Routine Rocket</span>
            </div>
            <div className="flex items-center space-x-3 px-4 py-2.5 text-gray-600 hover:bg-white hover:text-[#FF6B6B] rounded-xl text-sm font-bold cursor-pointer transition">
              <span>🍿</span> <span>Katha Station</span>
            </div>
            <div className="flex items-center space-x-3 px-4 py-2.5 text-gray-600 hover:bg-white hover:text-[#1A535C] rounded-xl text-sm font-bold cursor-pointer transition">
              <span>🎨</span> <span>Bhasha Playground</span>
            </div>
          </div>
        </div>

        {/* Language Selection Bar (Mothers' Control Panel) */}
        <div className="p-3 bg-white border-2 border-[#EADFC9] rounded-2xl shadow-sm">
          <label className="text-[10px] uppercase font-black tracking-widest text-amber-600 block mb-1.5">👩‍👦 Mother's Language Tongue</label>
          <select 
            value={selectedLang} 
            onChange={(e) => setSelectedLang(e.target.value)}
            className="w-full bg-amber-50 border-2 border-[#EADFC9] text-xs font-bold rounded-lg p-2 focus:outline-none focus:ring-2 focus:ring-[#FF6B6B] cursor-pointer"
          >
            {Object.keys(languagesDatabase).map((langKey) => (
              <option key={langKey} value={langKey}>{languagesDatabase[langKey].label}</option>
            ))}
          </select>
        </div>
      </aside>

      {/* 2. PLAYFUL MAIN CANVAS */}
      <main className="flex-1 flex flex-col overflow-y-auto">
        {/* Minimal header with modern twist */}
        <header className="h-14 border-b-2 border-[#EADFC9] px-8 bg-white/80 backdrop-blur-sm flex items-center justify-between text-xs font-bold text-gray-400">
          <div className="flex items-center space-x-2">
            <span>Playground</span> <span>/</span> <span className="text-[#FF6B6B] font-extrabold">🚀 Kid's Galaxy</span>
          </div>
          <div className="flex items-center space-x-3">
            <button className="bg-[#4ECDC4] text-white px-4 py-1.5 rounded-full font-bold shadow-md hover:bg-[#3dbdb4] transition">✨ Free Trial</button>
          </div>
        </header>

        {/* Dynamic Canvas Container */}
        <div className="max-w-4xl w-full mx-auto px-12 pt-10 pb-24">
          
          {/* Top Decorative Banner Illustration with HTML Vector shape */}
          <div className="w-full bg-gradient-to-r from-[#FF6B6B] via-[#FFD166] to-[#4ECDC4] h-32 rounded-3xl p-6 relative overflow-hidden shadow-md mb-8 flex items-center">
            {/* Playful vector background geometric circles */}
            <div className="absolute -right-10 -top-10 w-36 h-36 bg-white/20 rounded-full"></div>
            <div className="absolute right-20 -bottom-10 w-24 h-24 bg-white/10 rounded-full"></div>
            
            <div className="relative z-10 text-white">
              <span className="text-sm uppercase font-black tracking-widest bg-black/20 px-2 py-0.5 rounded-md">Welcome Kids & Super-Moms!</span>
              <h2 className="text-2xl font-black mt-1">Make learning fun in your own language!</h2>
            </div>
            <span className="text-6xl absolute right-6 animate-pulse">🦖</span>
          </div>

          {/* Dynamic Big Page Header */}
          <div className="flex items-center space-x-4 mb-4">
            <span className="text-5xl bg-white p-2 rounded-2xl border-2 border-gray-100 shadow-sm">🎯</span>
            <h1 className="text-3xl font-black text-gray-800 tracking-tight">
              {selectedLang === 'English' ? "My Daily Adventure Space" : `${content.label.split(' ')[1]} Playground`}
            </h1>
          </div>
          <p className="text-sm text-gray-400 ml-16 font-medium">Click on task badges to mark them complete and earn digital stars!</p>

          {/* Feature Layout Block columns */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mt-10">
            
            {/* Feature 1: The Dinacharya Tracker Block */}
            <div className="bg-white border-2 border-[#EADFC9] p-6 rounded-3xl shadow-sm space-y-4">
              <h3 className="text-lg font-black text-gray-800 flex items-center space-x-2 border-b-2 border-dashed pb-3 border-gray-100">
                <span>🎒</span> <span>{content.title}</span>
              </h3>
              
              <div className="space-y-3">
                {tasks.map((task) => (
                  <div 
                    key={task.id} 
                    onClick={() => setTasks(tasks.map(t => t.id === task.id ? { ...t, done: !t.done } : t))}
                    className={`flex items-center justify-between p-3.5 border-2 rounded-2xl cursor-pointer select-none transition-all duration-200 hover:scale-[1.02] ${task.done ? 'bg-gray-50 border-gray-200 opacity-60' : `${task.color} shadow-sm`}`}
                  >
                    <div className="flex items-center space-x-3">
                      <div className={`w-6 h-6 rounded-xl flex items-center justify-center border-2 transition-colors ${task.done ? 'bg-emerald-500 border-emerald-600' : 'bg-white border-gray-300'}`}>
                        {task.done && <span className="text-white text-xs font-black">✓</span>}
                      </div>
                      <span className={`text-sm font-bold ${task.done ? 'line-through text-gray-400' : 'text-gray-800'}`}>
                        {content[task.textKey]}
                      </span>
                    </div>
                    {task.done && <span className="text-sm">🌟 Star!</span>}
                  </div>
                ))}
              </div>
            </div>

            {/* Feature 2: Audio Stories & Mother Appreciation */}
            <div className="space-y-6">
              
              {/* Audio Box Container */}
              <div className="bg-white border-2 border-[#EADFC9] p-6 rounded-3xl shadow-sm space-y-4">
                <h3 className="text-lg font-black text-gray-800 flex items-center space-x-2 border-b-2 border-dashed pb-3 border-gray-100">
                  <span>🍿</span> <span>Katha & Kahani Audio</span>
                </h3>
                
                <div className="border-2 border-red-200 rounded-2xl p-4 bg-rose-50/50 hover:bg-rose-50 cursor-pointer shadow-sm transition flex items-center justify-between group">
                  <div className="flex items-center space-x-4">
                    <div className="w-12 h-12 bg-[#FF6B6B] text-white flex items-center justify-center rounded-2xl text-xl font-bold shadow-md group-hover:scale-110 transition-transform">▶️</div>
                    <div>
                      <h4 className="text-base font-extrabold text-gray-800">{content.story}</h4>
                      <p className="text-xs font-bold text-[#FF6B6B]">Audio Playback • Click to listen</p>
                    </div>
                  </div>
                  <span className="text-[10px] uppercase font-black tracking-wider bg-[#FFD166] text-amber-950 px-2 py-1 rounded-lg shadow-xs">Free</span>
                </div>
              </div>

              {/* Mother Appreciation Shoutout Board */}
              <div className="bg-amber-50 border-2 border-dashed border-amber-300 p-5 rounded-3xl relative overflow-hidden">
                <div className="absolute -right-4 -bottom-4 text-6xl opacity-20 select-none">👑</div>
                <h4 className="text-xs font-black uppercase tracking-widest text-amber-700 mb-1 flex items-center space-x-1">
                  <span>❤️</span> <span>Mamma's Shabaash Board</span>
                </h4>
                <p className="text-base italic text-amber-950 font-extrabold mt-2">
                  "{content.appreciation}"
                </p>
              </div>

            </div>
          </div>

        </div>
      </main>
    </div>
  );
}

export default App;