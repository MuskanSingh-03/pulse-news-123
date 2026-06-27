
"use client";

export default function WelcomeScreen({
  onEnter,
}: {
  onEnter: () => void;
}) {

  const hour = new Date().getHours();

  let greeting = "";
  let subtext = "";
  let emoji = "";

  if (hour >= 5 && hour < 12) {
    greeting = "Good Morning";
    subtext = "Start your day with the world's latest stories.";
    emoji = "🌅";
  }

  else if (hour >= 12 && hour < 17) {
    greeting = "Good Afternoon";
    subtext = "Catch up with important global updates.";
    emoji = "☀️";
  }

  else if (hour >= 17 && hour < 21) {
    greeting = "Good Evening";
    subtext = "Explore today's trending conversations.";
    emoji = "🌆";
  }

  else {
    greeting = "Good Night";
    subtext = "Stay informed before the world sleeps.";
    emoji = "🌙";
  }

  return (
    <div className="fixed inset-0 overflow-hidden bg-gradient-to-br from-black via-purple-950 to-pink-950 flex items-center justify-center">

      {/* Background Glow */}
      <div className="absolute top-0 left-0 w-[500px] h-[500px] bg-pink-500/20 rounded-full blur-3xl"></div>

      <div className="absolute bottom-0 right-0 w-[500px] h-[500px] bg-purple-500/20 rounded-full blur-3xl"></div>

      {/* Content */}
      <div className="relative z-10 text-center px-6 max-w-4xl">

        <p className="text-pink-400 text-xl uppercase tracking-[0.3em] mb-6">
          AI Powered News Intelligence
        </p>

        <div className="flex justify-center items-center gap-4 mb-6">

          <span className="text-5xl">
            {emoji}
          </span>

          <h2 className="text-5xl md:text-7xl font-black bg-gradient-to-r from-pink-400 via-purple-300 to-blue-400 bg-clip-text text-transparent">
            {greeting}
          </h2>

        </div>

        <h1 className="text-6xl md:text-8xl font-black text-white mb-6">
          PulseX
        </h1>

        <p className="text-gray-300 text-xl mb-10">
          {subtext}
        </p>

        <button
          onClick={onEnter}
          className="bg-gradient-to-r from-pink-600 via-purple-600 to-blue-500 px-12 py-6 rounded-4xl font-semibold text-white hover:scale-115 transition-all shadow-xl"
        >
           Enter Dashboard  →
        </button>

      </div>

    </div>
  );
}

