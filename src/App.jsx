import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import confetti from 'canvas-confetti';
import { Heart, Gift, Sparkles, Clock, Calendar, Camera, User } from 'lucide-react';

const FloatingHearts = () => {
  const [hearts, setHearts] = useState([]);

  useEffect(() => {
    const generatedHearts = Array.from({ length: 25 }).map((_, i) => ({
      id: i,
      left: `${Math.random() * 100}vw`,
      animationDuration: 10 + Math.random() * 20,
      delay: Math.random() * 10,
      size: 10 + Math.random() * 30,
      opacity: 0.1 + Math.random() * 0.3,
    }));
    setHearts(generatedHearts);
  }, []);

  return (
    <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden bg-gradient-to-br from-rose-50 via-rose-100 to-rose-50">
      {/* Mesh Gradients */}
      <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-rose-200/30 blur-[120px] rounded-full animate-pulse" />
      <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-pink-200/30 blur-[120px] rounded-full animate-pulse" style={{ animationDelay: '2s' }} />
      
      {hearts.map((heart) => (
        <motion.div
          key={heart.id}
          className="absolute bottom-[-10%]"
          style={{ left: heart.left }}
          animate={{
            y: ["0vh", "-120vh"],
            opacity: [0, heart.opacity, 0],
            rotate: [-20, 20, -20],
          }}
          transition={{
            duration: heart.animationDuration,
            delay: heart.delay,
            repeat: Infinity,
            ease: "linear"
          }}
        >
          <Heart 
            size={heart.size} 
            fill="currentColor" 
            className="text-rose-300 drop-shadow-sm" 
          />
        </motion.div>
      ))}
    </div>
  );
};

// --- RELATIONSHIP COUNTER COMPONENT ---
const RelationshipCounter = () => {
  const [timeLeft, setTimeLeft] = useState({
    days: 0, hours: 0, minutes: 0, seconds: 0
  });

  useEffect(() => {
    const startDate = new Date('2023-08-12T00:00:00');
    
    const updateCounter = () => {
      const now = new Date();
      const diff = now - startDate;
      
      const days = Math.floor(diff / (1000 * 60 * 60 * 24));
      const hours = Math.floor((diff / (1000 * 60 * 60)) % 24);
      const minutes = Math.floor((diff / 1000 / 60) % 60);
      const seconds = Math.floor((diff / 1000) % 60);
      
      setTimeLeft({ days, hours, minutes, seconds });
    };

    const timer = setInterval(updateCounter, 1000);
    updateCounter();
    return () => clearInterval(timer);
  }, []);

  const CounterItem = ({ label, value }) => (
    <div className="flex flex-col items-center p-3 bg-white/60 backdrop-blur-md rounded-2xl border border-rose-100 shadow-sm min-w-[80px]">
      <span className="text-3xl font-bold text-rose-500 font-outfit">{value}</span>
      <span className="text-[10px] uppercase tracking-wider text-rose-400 font-semibold">{label}</span>
    </div>
  );

  return (
    <div className="flex flex-wrap justify-center gap-4 mt-8">
      <CounterItem label="Days" value={timeLeft.days} />
      <CounterItem label="Hours" value={timeLeft.hours} />
      <CounterItem label="Minutes" value={timeLeft.minutes} />
      <CounterItem label="Seconds" value={timeLeft.seconds} />
    </div>
  );
};

// --- INTERACTIVE CAKE COMPONENT ---
const InteractiveCake = () => {
  const [litCandles, setLitCandles] = useState([false, false, false]);
  const [blownOut, setBlownOut] = useState(false);

  const toggleCandle = (index) => {
    if (blownOut) return;
    const newCandles = [...litCandles];
    newCandles[index] = !newCandles[index];
    setLitCandles(newCandles);
    
    if (newCandles[index]) {
      confetti({
        particleCount: 15,
        spread: 20,
        origin: { y: 0.7 },
        colors: ['#fb7185', '#fda4af']
      });
    }
  };

  const handleBlowOut = () => {
    if (litCandles.every(c => c) && !blownOut) {
      setBlownOut(true);
      confetti({
        particleCount: 200,
        spread: 100,
        origin: { y: 0.6 },
        colors: ['#f43f5e', '#fb7185', '#fda4af', '#ffffff', '#fbbf24']
      });
    }
  };

  return (
    <div className="relative flex flex-col items-center py-10">
      <div className="relative w-48 h-32 bg-rose-200 rounded-t-3xl border-b-8 border-rose-300 shadow-lg mb-4">
        {/* Cake Layers */}
        <div className="absolute top-[-20px] left-1/2 -translate-x-1/2 w-40 h-8 bg-rose-100 rounded-full border-b-4 border-rose-200" />
        
        {/* Candles */}
        <div className="absolute top-[-40px] left-0 right-0 flex justify-center gap-8">
          {litCandles.map((isLit, i) => (
            <motion.div 
              key={i}
              onClick={() => toggleCandle(i)}
              className="relative w-3 h-12 bg-blue-300 rounded-full cursor-pointer transition-all duration-300"
              whileHover={{ scale: 1.1 }}
            >
              {isLit && !blownOut && (
                <motion.div 
                  animate={{ 
                    scale: [1, 1.2, 1],
                    y: [0, -2, 0],
                    opacity: [0.8, 1, 0.8] 
                  }}
                  transition={{ repeat: Infinity, duration: 0.6 }}
                  className="absolute top-[-15px] left-1/2 -translate-x-1/2 w-4 h-6 bg-orange-400 rounded-full blur-[1px] shadow-[0_0_10px_#fbbf24]"
                />
              )}
            </motion.div>
          ))}
        </div>
      </div>
      
      <div className="w-64 h-8 bg-white/40 rounded-full blur-xl" />

      <AnimatePresence>
        {litCandles.every(c => c) && !blownOut && (
          <motion.button
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.8 }}
            onClick={handleBlowOut}
            className="mt-6 bg-rose-500 hover:bg-rose-600 text-white font-bold py-3 px-8 rounded-full shadow-lg transition-all animate-bounce"
          >
            Make a Wish & Blow! 🌬️
          </motion.button>
        )}
      </AnimatePresence>

      {blownOut && (
        <motion.div
          initial={{ opacity: 0, scale: 0.5 }}
          animate={{ opacity: 1, scale: 1 }}
          className="mt-6 text-center"
        >
          <h3 className="text-3xl font-bold text-rose-600 font-dancing">Wish granted! ✨</h3>
          <p className="text-rose-400 font-medium">May all your dreams come true, my love.</p>
        </motion.div>
      )}
    </div>
  );
};




export default function BirthdayWebsite() {
  // --- STATE FOR THE LOCK SCREEN ---
  const [isUnlocked, setIsUnlocked] = useState(false);
  const [passwordGuess, setPasswordGuess] = useState("");
  const [errorMsg, setErrorMsg] = useState("");
  
  // --- STATE FOR THE RANDOM REASONS ---
  const [currentReason, setCurrentReason] = useState("Tap the button below!");

  // 👉 CHANGE THIS: Set your secret password
  const secretPassword = "Tanushka Tejas Naik"; 

  // 👉 CHANGE THIS: Add as many reasons as you want!
  const loveReasons = [
    "Your beautiful smile",
    "Your childish behaviour.",
    "You Scold me like a mother, yeh its masochistic but I like it.",
    "You always save me whenever Im in trouble like an angel.",
    "The way u talk on gossips (mann karta hai bas sunta jau) .",
    "You are my safe space.",
    "You are my HOME.",
    "You are a god's gift to me. Gave me a lot than I ever deserved.",
    "You are the best wife, girlfriend, bestfriend anyone could ever ask for.",
    "You are the hottest and sexiest woman on this planet."
  ];


  const handleUnlock = (e) => {
    e.preventDefault();
    if (passwordGuess.trim().toLowerCase() === secretPassword.toLowerCase()) {
      setIsUnlocked(true);
      confetti({
        particleCount: 150,
        spread: 80,
        origin: { y: 0.6 },
        colors: ['#f43f5e', '#fb7185', '#fda4af', '#ffffff']
      });
    } else {
      setErrorMsg("Nope! Try again, my love. ❤️");
    }
  };

  const generateRandomReason = () => {
    const randomIndex = Math.floor(Math.random() * loveReasons.length);
    setCurrentReason(loveReasons[randomIndex]);
    confetti({
      particleCount: 30,
      spread: 40,
      origin: { y: 0.8 },
      colors: ['#fda4af', '#ffffff'] 
    });
  };

  // --- THE LOCK SCREEN VIEW ---
  if (!isUnlocked) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-rose-100 to-rose-50 flex flex-col items-center justify-center p-4 font-outfit">
        <motion.div 
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="bg-white/80 backdrop-blur-xl p-8 rounded-[2rem] shadow-2xl max-w-md w-full text-center border border-white/50"
        >
          <div className="w-20 h-20 bg-rose-100 rounded-full flex items-center justify-center mx-auto mb-6">
            <Heart className="text-rose-500 fill-rose-500 animate-pulse" size={40} />
          </div>
          
          <h1 className="text-3xl font-bold text-gray-800 mb-2 font-dancing">Wait a minute!</h1>
          
          <p className="text-gray-600 mb-8 font-medium">
            To see your birthday surprise, please enter your FULL NAME:
          </p>

          <form onSubmit={handleUnlock} className="flex flex-col gap-4">
            <input 
              type="text" 
              value={passwordGuess}
              onChange={(e) => setPasswordGuess(e.target.value)}
              placeholder="Your name here..."
              className="px-6 py-4 rounded-2xl border-2 border-rose-100 focus:border-rose-400 focus:outline-none transition-all text-center text-lg font-semibold bg-white/50"
            />
            <button 
              type="submit"
              className="bg-rose-400 hover:bg-rose-500 text-white font-bold py-4 rounded-2xl transition duration-300 shadow-lg shadow-rose-200 active:scale-95 flex items-center justify-center gap-2"
            >
              <span>Unlock the Magic</span>
              <Sparkles size={20} />
            </button>
          </form>

          {errorMsg && (
            <motion.p 
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-rose-500 mt-6 font-bold flex items-center justify-center gap-2"
            >
              <Heart size={16} /> {errorMsg}
            </motion.p>
          )}
        </motion.div>
      </div>
    );
  }

  // --- THE MAIN WEBSITE VIEW ---
  return (
    <div className="min-h-screen bg-rose-50 text-gray-800 font-outfit overflow-x-hidden relative">
      
      {/* BACKGROUND ELEMENTS */}
      <FloatingHearts />

      {/* HERO SECTION */}
      <section className="flex flex-col items-center justify-center min-h-screen text-center p-6 relative z-10">
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 1 }}
          className="mb-8"
        >
          <div className="inline-flex items-center gap-2 bg-rose-100 text-rose-600 px-4 py-2 rounded-full text-sm font-bold mb-4 border border-rose-200">
            <Sparkles size={16} />
            <span>It's your special day!</span>
          </div>
          <h1 className="text-6xl md:text-8xl font-bold text-rose-500 mb-4 tracking-tighter leading-tight font-dancing">
            Happy Birthday,<br/>Tanushka!
          </h1>
          <p className="text-xl md:text-2xl text-rose-400 mb-10 italic font-medium">
            To the most beautiful girl in the world.
          </p>
        </motion.div>
        
        <div className="relative group">
          <motion.div 
            initial={{ opacity: 0, scale: 0.8, rotate: -5 }}
            animate={{ opacity: 1, scale: 1, rotate: 0 }}
            transition={{ duration: 1.2, delay: 0.8, type: "spring" }}
            className="w-64 h-64 md:w-80 md:h-80 rounded-[2.5rem] overflow-hidden shadow-2xl border-[12px] border-white relative z-20 group-hover:rotate-3 transition-transform duration-500"
          >
            <img
              src="/favourite-photo.jpg"
              alt="Tanushka"
              className="w-full h-full object-cover scale-110 group-hover:scale-100 transition-transform duration-700"
            />
          </motion.div>
          <div className="absolute -top-6 -right-6 w-24 h-24 bg-pink-200 rounded-full blur-2xl opacity-60 animate-pulse" />
          <div className="absolute -bottom-6 -left-6 w-24 h-24 bg-rose-200 rounded-full blur-2xl opacity-60 animate-pulse" />
        </div>

        {/* RELATIONSHIP COUNTER */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1.5 }}
          className="mt-16 w-full max-w-2xl"
        >
          <p className="text-rose-400 font-bold uppercase tracking-[0.2em] text-xs mb-4 text-center">Time we've spent together</p>
          <RelationshipCounter />
          <p className="text-gray-400 text-sm mt-6 flex items-center justify-center gap-2 font-medium">
            <Calendar size={14} /> Since August 12, 2023
          </p>
        </motion.div>

        <motion.div
          animate={{ y: [0, 10, 0] }}
          transition={{ repeat: Infinity, duration: 2 }}
          className="absolute bottom-10 left-1/2 -translate-x-1/2 text-rose-300"
        >
          <div className="flex flex-col items-center gap-2">
            <span className="text-[10px] font-bold uppercase tracking-widest">Scroll for more magic</span>
            <div className="w-[1px] h-12 bg-gradient-to-b from-rose-300 to-transparent" />
          </div>
        </motion.div>
      </section>

      {/* INTERACTIVE CAKE SECTION */}
      <section className="py-24 px-6 relative z-10 flex flex-col items-center justify-center bg-white/30 backdrop-blur-sm border-y border-rose-100/50">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-12"
        >
          <h2 className="text-4xl font-bold text-rose-500 mb-2 font-dancing">Time for a Wish!</h2>
          <p className="text-gray-600 font-medium">Light the candles and make your birthday wish come true...</p>
        </motion.div>
        
        <InteractiveCake />
      </section>

      {/* SWIPEABLE GALLERY SECTION (POLAROID STYLE) */}
      <section className="py-24 w-full relative z-10 overflow-hidden">
        {/* SECTION 1: US */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
          className="flex items-center gap-4 px-8 mb-12"
        >
          <div className="h-[2px] w-12 bg-rose-300" />
          <h2 className="text-4xl font-bold text-rose-500 font-dancing">Our Beautiful moments</h2>
          <Camera size={24} className="text-rose-400" />
        </motion.div>
        
        <div className="flex overflow-x-auto snap-x snap-mandatory gap-10 px-8 pb-12 hide-scrollbar mb-20">
          {[
            "memory1.jpg", "memory2.jpeg", "memory3.jpg", "memory4.jpg", "memory5.jpg", 
            "memory6.jpg", "memory7.jpg", "memory8.jpg", "memory9.jpg", "memory10.PNG",
            "memory11.jpg", "memory12.jpg", "memory13.jpg", "memory14.jpg", "memory15.jpg",
            "memory16.jpeg", "memory17.jpeg"
          ].map((img, index) => (
            <motion.div 
              key={index}
              initial={{ opacity: 0, y: 50 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8, delay: index * 0.1 }}
              style={{ rotate: `${(index % 2 === 0 ? 1 : -1) * (Math.random() * 3 + 1)}deg` }}
              className="bg-white p-4 pt-4 pb-12 rounded-sm shadow-2xl shrink-0 w-[300px] snap-center border border-gray-100 flex flex-col group hover:scale-105 transition-transform duration-500"
            >
              <div className="h-80 bg-gray-100 overflow-hidden relative border border-gray-100 shadow-inner">
                 <img 
                  src={`/memory/${img}`} 
                  alt="Our Memory" 
                  className="w-full h-full object-cover grayscale-[20%] group-hover:grayscale-0 transition-all duration-700" 
                 />
                 <div className="absolute inset-0 bg-gradient-to-b from-transparent to-black/10 opacity-0 group-hover:opacity-100 transition-opacity" />
              </div>
              <div className="absolute inset-0 pointer-events-none border-[12px] border-white/10 mix-blend-overlay" />
            </motion.div>
          ))}
        </div>

        {/* SECTION 2: ONLY HER */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
          className="flex items-center gap-4 px-8 mb-12"
        >
          <div className="h-[2px] w-12 bg-rose-300" />
          <h2 className="text-4xl font-bold text-rose-500 font-dancing">My Baby</h2>
          <User size={24} className="text-rose-400" />
        </motion.div>
        
        <div className="flex overflow-x-auto snap-x snap-mandatory gap-10 px-8 pb-12 hide-scrollbar">
          {[
            "her1.jpeg", "her2.jpeg", "her3.jpg", "her4.jpg", "her5.jpg", "her6.jpg",
            "her7.jpeg", "her8.jpeg", "her9.jpeg", "her10.jpeg", "her11.jpeg", "her12.jpeg"
          ].map((img, index) => (
            <motion.div 
              key={index}
              initial={{ opacity: 0, y: 50 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8, delay: index * 0.1 }}
              style={{ rotate: `${(index % 2 === 0 ? -1 : 1) * (Math.random() * 3 + 1)}deg` }}
              className="bg-white p-4 pt-4 pb-12 rounded-sm shadow-2xl shrink-0 w-[300px] snap-center border border-gray-100 flex flex-col group hover:scale-105 transition-transform duration-500"
            >
              <div className="h-80 bg-gray-100 overflow-hidden relative border border-gray-100 shadow-inner">
                 <img 
                  src={`/her/${img}`} 
                  alt="Tanushka" 
                  className="w-full h-full object-cover grayscale-[20%] group-hover:grayscale-0 transition-all duration-700" 
                 />
                 <div className="absolute inset-0 bg-gradient-to-b from-transparent to-black/10 opacity-0 group-hover:opacity-100 transition-opacity" />
              </div>
              <div className="absolute inset-0 pointer-events-none border-[12px] border-white/10 mix-blend-overlay" />
            </motion.div>
          ))}
        </div>
      </section>



      {/* REASONS I LOVE YOU SECTION */}
      <section className="py-24 px-6 relative z-10 overflow-hidden">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-rose-200/20 blur-[100px] rounded-full -z-10" />
        <motion.div 
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="max-w-xl mx-auto bg-white/60 backdrop-blur-xl p-10 rounded-[3rem] shadow-2xl text-center border border-white relative"
        >
          <Heart className="text-rose-400 mx-auto mb-6 fill-rose-100" size={32} />
          <h2 className="text-3xl font-bold text-rose-600 mb-8 font-dancing">Reasons, I Love You</h2>
          
          <div className="min-h-[140px] flex items-center justify-center mb-8">
            <AnimatePresence mode="wait">
              <motion.p 
                key={currentReason}
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 1.05 }}
                transition={{ duration: 0.4 }}
                className="text-2xl text-gray-700 italic font-medium leading-relaxed font-dancing"
              >
                "{currentReason}"
              </motion.p>
            </AnimatePresence>
          </div>

          <button 
            onClick={generateRandomReason}
            className="w-full bg-rose-500 hover:bg-rose-600 text-white font-bold py-5 px-8 rounded-2xl shadow-xl shadow-rose-200 active:scale-95 transition-all duration-300 relative z-20 flex items-center justify-center gap-2 group"
          >
            <span>Tell me another reason!</span>
            <Heart size={18} className="group-hover:scale-125 transition-transform" />
          </button>
        </motion.div>
      </section>

      {/* FINAL LETTER SECTION */}
      <section className="bg-rose-50 py-32 px-6 relative z-10">
        <motion.div 
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="max-w-3xl mx-auto"
        >
          <div className="bg-white p-10 md:p-20 rounded-[3rem] shadow-2xl relative overflow-hidden border border-rose-100">
            {/* Letter Texture */}
            <div className="absolute inset-0 opacity-[0.03] pointer-events-none bg-[url('https://www.transparenttextures.com/patterns/lined-paper.png')]" />
            
            <h2 className="text-5xl font-bold text-rose-500 mb-12 font-dancing text-center">My Promise to You</h2>
            
            <div className="text-xl leading-relaxed text-gray-700 mb-12 space-y-6 font-medium">
              <p>Happy Birthday to my favorite person. Every single day with you is a gift that I never take for granted.</p>
              
              <p>I built this small corner of the internet just for us, to remind you of how incredibly special you are to me. You make me laugh harder than anyone else, and I cherish every single memory we've made since that day in August.</p>
              
              <p>Here is to celebrating you today, and loving you always. Have the best birthday ever, Tanushka!</p>
            </div>

            <div className="border-t-2 border-rose-50 pt-12 mt-12 text-center md:text-left flex flex-col md:flex-row items-center justify-between gap-8">
              <div>
                <p className="text-gray-400 uppercase tracking-widest text-xs font-bold mb-2">With all my love,</p>
                <p className="text-5xl font-bold text-rose-500 font-dancing leading-tight">
                  Tejas
                </p>
              </div>
              <div className="flex gap-2">
                {[1, 2, 3].map(i => (
                  <Heart key={i} className="text-rose-200 fill-rose-200" size={24} />
                ))}
              </div>
            </div>
          </div>
        </motion.div>
      </section>
      
      <style dangerouslySetInnerHTML={{__html: `
        .hide-scrollbar::-webkit-scrollbar {
          display: none;
        }
        .hide-scrollbar {
          -ms-overflow-style: none;
          scrollbar-width: none;
        }
        .font-dancing { font-family: 'Dancing Script', cursive; }
        .font-outfit { font-family: 'Outfit', sans-serif; }
      `}} />
    </div>
  );
}