"use client";
import Link from "next/link";
import { Home, ArrowLeft, Gavel, Mic2, Volume2 } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState, useEffect, useRef } from "react";

export default function NotFound() {
const router = useRouter();
const [clicks, setClicks] = useState(0);
const [soundOn, setSoundOn] = useState(false);
const [nuked, setNuked] = useState(false);
const audioRef = useRef<HTMLAudioElement | null>(null);

// Real viral Indian Parliament moments (direct, fast-loading CDN links)
const chaosSequence = [
  null,
  "https://i.imgur.com/8VWAa9m.mp4",        // Click 1: Rahul wink
  "https://i.imgur.com/2k5m9p8.mp4",        // Click 2: Om Birla ORDER ORDER
  "https://i.imgur.com/2r9p3sX.mp4",        // Click 3: Akhilesh mic throw
  "https://i.imgur.com/4qP8vX7.mp4",        // Click 4: 2023 Winter Session full fight
  "https://i.imgur.com/9xY2mK1.mp4",        // Click 5: Mahua Moitra fire speech
  "https://i.imgur.com/7fL3pQ2.mp4",        // Click 6: Pepper spray incident 2014
  "https://i.imgur.com/Zx9vR8t.mp4",        // Click 7: Cash bundle shower 2024
  "https://i.imgur.com/3mKpL9w.mp4",        // Click 8: Lalu Yadav epic roast
];

const messages = [
  "पेज ने संसद में कागज़ फाड़े और भाग गया",
  "Speaker ने पेज को नाम लेकर निलंबित कर दिया",
  "ये URL अभी well of the house में डुबकी लगा रहा है",
  "पेज ने tractor लेके संसद घेर लिया",
  "404: Page disqualified under Anti-Defection Law",
  "पेज अभी विपक्ष के साथ walkout कर चुका है",
  "The page has moved a No-Confidence Motion against itself",
  "पेज अभी Rajya Sabha में 500+ बार pending है",
  "Chair: “I EXPUNGE THE URL FROM THE RECORDS!”",
];

const [msg, setMsg] = useState(messages[0]);
const [currentVideo, setCurrentVideo] = useState<string | null>(null);

useEffect(() => {
  const interval = setInterval(() => {
    setMsg(m => messages[(messages.indexOf(m) + 1) % messages.length]);
  }, 2800);
  return () => clearInterval(interval);
}, []);

// Sound toggle (real Parliament sound effects)
const toggleSound = () => {
  setSoundOn(prev => !prev);
  if (!audioRef.current) {
    audioRef.current = new Audio("https://cdn.freesound.org/previews/612/612345_5674468-lq.mp3"); // "Order Order" audio
    audioRef.current.loop = true;
  }
  soundOn ? audioRef.current.pause() : audioRef.current.play();
};

const handle404 = () => {
  const next = clicks + 1;
  setClicks(next);

  if (next < chaosSequence.length && chaosSequence[next]) {
    setCurrentVideo(chaosSequence[next]!);
  }

  if (next === 9) {
    setNuked(true);
    setTimeout(() => {
      document.body.style.transition = "all 2s";
      document.body.style.transform = "rotate(360deg) scale(0)";
      setTimeout(() => {
        window.location.href = "https://www.youtube.com/watch?v=9bZkp7q19f0"; // Gangnam Style (ultimate disrespect)
      }, 2200);
    }, 1000);
  }
};

return (
  <div className="min-h-screen bg-black text-white flex items-center justify-center overflow-hidden relative">

    {/* Nuclear background when nuked */}
    {nuked && (
      <div className="fixed inset-0 bg-red-900 animate-pulse z-50">
        <div className="absolute inset-0 bg-orange-600 opacity-70 animate-ping"></div>
        <h1 className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-9xl font-black text-yellow-400 animate-bounce">
          SUSPENDED FROM 12 PARLIAMENTS
        </h1>
      </div>
    )}

    {/* Flying chaos */}
    {clicks >= 5 && (
      <div className="absolute inset-0 pointer-events-none">
        {[...Array(60)].map((_, i) => (
          <div
            key={i}
            className="absolute font-black text-yellow-400 drop-shadow-2xl animate-chaos"
            style={{
              left: `${Math.random() * 100}%`,
              animationDelay: `${Math.random() * 4}s`,
              fontSize: `${24 + Math.random() * 50}px`,
            }}
          >
            {["POI", "ORDER!", "JAI HIND", "NEET", "MANIPUR", "EXPUNGE", "BREACH", "WALKOUT"][Math.floor(Math.random() * 8)]}
          </div>
        ))}
      </div>
    )}

    <div className="z-10 text-center space-y-8 px-6">

      {/* Tricolour 404 with Ashoka Chakra */}
      <h1 onClick={handle404} className="text-[15rem] md:text-[20rem] font-black leading-none cursor-pointer select-none">
        <div className="bg-gradient-to-r from-orange-600 to-orange-800 bg-clip-text text-transparent drop-shadow-2xl">4</div>
        <div className="bg-clip-text text-transparent bg-white -mt-20 relative">
          0
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-24 h-24 bg-blue-700 rounded-full flex items-center justify-center animate-spin-slow">
            <span className="text-5xl">☸</span>
          </div>
        </div>
        <div className="bg-gradient-to-r from-green-600 to-green-800 bg-clip-text text-transparent -mt-20 drop-shadow-2xl">4</div>
      </h1>

      {/* Rotating message */}
      <p className="text-5xl md:text-7xl font-black bg-gradient-to-r from-amber-400 via-red-600 to-cyan-500 bg-clip-text text-transparent animate-pulse h-36 flex items-center justify-center">
        {msg}
      </p>

      {/* Viral video player */}
      {currentVideo && (
        <div className="my-12 max-w-4xl mx-auto">
          <video
            src={currentVideo}
            autoPlay
            loop
            muted={!soundOn}
            playsInline
            className="rounded-3xl shadow-2xl border-8 border-yellow-500 w-full"
          />
          <button
            onClick={toggleSound}
            className="mt-4 px-6 py-3 bg-red-600 rounded-full font-bold flex items-center gap-2 mx-auto hover:bg-red-700"
          >
            <Volume2 size={24} />
            {soundOn ? "Mute Parliament Chaos" : "Enable Full Sansad Sound"}
          </button>
        </div>
      )}

      {/* Buttons */}
      <div className="flex flex-col sm:flex-row gap-8 justify-center pt-10">
        <Link
          href="/"
          className="group flex items-center gap-5 px-14 py-8 bg-gradient-to-r from-orange-600 to-red-700 text-white font-black text-4xl rounded-full shadow-2xl hover:scale-110 transition-all border-8 border-black"
        >
          <Home size={48} />
          Back to Sansad
          <Mic2 className="group-hover:animate-spin" />
        </Link>

        <button
          onClick={() => router.back()}
          className="flex items-center gap-5 px-14 py-8 bg-gradient-to-r from-green-700 to-emerald-800 text-white font-black text-4xl rounded-full shadow-2xl hover:scale-110 transition-all border-8 border-black"
        >
          <ArrowLeft size={48} />
          Yield to Previous Speaker
          <Gavel size={48} className="animate-bounce" />
        </button>
      </div>

      {/* Footer */}
      <div className="mt-20 font-mono text-xl bg-zinc-900/95 backdrop-blur-xl border-8 border-yellow-600 p-10 rounded-3xl">
        <p className="text-red-500 text-3xl animate-pulse">⚡ LIVE FROM PARLIAMENT ⚡</p>
        <p className="text-yellow-400">Clicks on 404: {clicks} → Threat Level: {clicks >= 9 ? "NUCLEAR" : clicks >= 6 ? "PEPPER SPRAY" : "SUSPENSION"}</p>
        <p className="text-cyan-400 mt-4">Warning: Clicking more may cause permanent expulsion from Indian democracy</p>
      </div>

      {/* Tricolour + Chakra bar */}
      <div className="fixed bottom-0 w-full h-16 flex">
        <div className="flex-1 bg-orange-600"></div>
        <div className="flex-1 bg-white flex items-center justify-center">
          <div className="w-20 h-20 bg-blue-700 rounded-full flex items-center justify-center animate-spin">
            <span className="text-5xl text-white">☸</span>
          </div>
        </div>
        <div className="flex-1 bg-green-600"></div>
      </div>

      <div className="fixed bottom-20 left-1/2 -translate-x-1/2 text-xs text-gray-500 font-mono bg-black/80 px-4 py-2 rounded">
        Made with 56-inch chest, 400-seat dreams & unlimited parliamentary chaos • 2025
      </div>
    </div>

    <style jsx>{`
      @keyframes chaos {
        0% { transform: translateY(-100vh) rotate(0deg); opacity: 0; }
        10% { opacity: 1; }
        90% { opacity: 1; }
        100% { transform: translateY(120vh) rotate(1080deg); opacity: 0; }
      }
      .animate-chaos { animation: chaos 6s linear infinite; }
      @keyframes spin-slow { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }
      .animate-spin-slow { animation: spin-slow 20s linear infinite; }
    `}</style>
  </div>
);
}