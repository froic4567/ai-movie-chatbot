import { useState } from "react";
import { supabase } from "./supabase";

const posterCards = [
    {
      title: "Top Gun",
      accent: "from-sky-500 to-blue-700",
      poster: "/posters/top-gun.jpg",
    },
    {
      title: "Avatar",
      accent: "from-cyan-400 to-slate-900",
      poster: "/posters/avatar.jpg",
    },
    {
      title: "Oppenheimer",
      accent: "from-amber-500 to-orange-700",
      poster: "/posters/oppenheimer.jpg",
    },
    {
      title: "Day Watch",
      accent: "from-indigo-500 to-violet-700",
      poster: "/posters/day-watch.jpg",
    },
    {
      title: "Another Earth",
      accent: "from-emerald-400 to-teal-700",
      poster: "/posters/another-earth.jpg",
    },
    {
      title: "Argo",
      accent: "from-red-500 to-rose-700",
      poster: "/posters/argo.jpg",
    },
  ];

export default function Auth() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const signUp = async () => {
    const { error } = await supabase.auth.signUp({
      email,
      password,
    });

    if (error) alert(error.message);
    else alert("Check your email to confirm!");
  };

  const signIn = async () => {
    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) alert(error.message);
  };

  return (
    <div className="min-h-screen bg-[#0b1120] text-slate-100 px-4 py-8">
      <div className="mx-auto grid w-full max-w-6xl gap-8 lg:grid-cols-[1.2fr_1fr]">
        <div className="rounded-[2rem] bg-slate-950/95 border border-white/10 shadow-2xl shadow-slate-900/40 overflow-hidden backdrop-blur-lg">
          <div className="p-10 lg:p-14">
            <div className="mb-8 flex items-center gap-4">
              <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-violet-500/10 text-violet-300 ring-1 ring-violet-500/30">
                <span className="text-2xl">??</span>
              </div>
              <div>
                <p className="text-sm uppercase tracking-[0.32em] text-violet-300/80">
                  MovieHut Insights
                </p>
                <h1 className="mt-2 text-3xl font-semibold text-white">
                  Welcome back
                </h1>
              </div>
            </div>

            <p className="max-w-xl text-slate-400 leading-7">
              Discover movie recommendations fast with AI-powered chat history and personalized suggestions. Log in to continue your film discovery journey.
            </p>

            <div className="mt-10 space-y-6">
              <label className="block text-sm text-slate-300">
                Email
                <input
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="mt-2 w-full rounded-3xl border border-slate-700 bg-slate-950/90 px-4 py-3 text-white outline-none transition focus:border-violet-400 focus:ring-2 focus:ring-violet-500/20"
                  placeholder="yourmail@gmail.com"
                />
              </label>

              <label className="block text-sm text-slate-300">
                Password
                <input
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  type="password"
                  className="mt-2 w-full rounded-3xl border border-slate-700 bg-slate-950/90 px-4 py-3 text-white outline-none transition focus:border-violet-400 focus:ring-2 focus:ring-violet-500/20"
                  placeholder="Enter your password"
                />
              </label>

              <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                <button
                  onClick={signIn}
                  className="flex-1 rounded-3xl bg-violet-500 px-5 py-3 text-sm font-semibold text-white shadow-lg shadow-violet-500/20 transition hover:bg-violet-400"
                >
                  Sign in
                </button>

                <button
                  onClick={signUp}
                  className="flex-1 rounded-3xl border border-slate-700 bg-transparent px-5 py-3 text-sm font-semibold text-slate-100 transition hover:border-violet-400 hover:text-violet-300"
                >
                  Create account
                </button>
              </div>

              <div className="rounded-3xl bg-slate-900/80 p-4 text-sm text-slate-400 ring-1 ring-white/5">
                <p className="font-medium text-slate-200">Quick access</p>
                <p className="mt-2 leading-6">
                  Use any email and password to sign in or register. Your chat history will be stored automatically after login.
                </p>
              </div>
            </div>
          </div>
        </div>

        <div className="hidden lg:block rounded-[2rem] overflow-hidden bg-slate-900/95 shadow-2xl shadow-slate-900/40 ring-1 ring-white/5">
          <div className="relative h-full min-h-[520px] bg-[radial-gradient(circle_at_top_left,_rgba(99,102,241,0.24),transparent_30%),radial-gradient(circle_at_bottom_right,_rgba(236,72,153,0.18),transparent_30%)] p-6">
            <div className="grid h-full grid-cols-2 gap-4">
              {posterCards.map((card, i) => (
                <div
                  key={i}
                  className={`group overflow-hidden rounded-[1.75rem] border border-white/10 bg-gradient-to-br ${card.accent} p-4 shadow-lg shadow-slate-950/20 transition hover:-translate-y-1 hover:shadow-xl`}
                >
                  <div
                className="mb-4 h-36 overflow-hidden rounded-3xl bg-slate-900/60 shadow-inner shadow-slate-950/30"
                style={{
                  backgroundImage: `url(${card.poster})`,
                  backgroundSize: "cover",
                  backgroundPosition: "center",
                }}
              />
                  <div className="text-sm uppercase tracking-[0.2em] text-slate-200/80">Movie</div>
                  <h2 className="mt-2 text-lg font-semibold text-white">{card.title}</h2>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
