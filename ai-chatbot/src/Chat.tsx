import { supabase } from "./supabase";
import { useState, useEffect } from "react";

export default function Chat() {
  
  const [messages, setMessages] = useState<any[]>([
    {
      type: "text",
      text: "Hi! 👋 I’m your Movie Recommendation AI 🤖\n\nType a movie you like (e.g. Avatar), and I’ll recommend similar genre of the movie you entered.🎬",
      bot: true,
    },
  ]);
  const [input, setInput] = useState("");

  useEffect(() => {
    const loadMessages = async () => {
      const {
        data: { user },
      } = await supabase.auth.getUser();

      if (!user) return; // ✅ wait for user

      const { data } = await supabase
        .from("messages")
        .select("*")
        .eq("user_id", user.id)
        .order("created_at", { ascending: true });

      // ✅ First time user: Hi! I’m your Movie Recommendation AI... stays there
      if (data && data.length > 0) {
        const formatted = await Promise.all(
          data.map(async (msg) => {
            if (msg.is_bot) {
              try {
                const parsed = JSON.parse(msg.text);

                if (parsed.type === "recommendation") {
                  const itemsWithPosters = await Promise.all(
                    parsed.items.map(async (t: string) => ({
                      title: t,
                      poster: await getMoviePoster(t),
                    }))
                  );

                  return {
                    type: "recommendation",
                    title: parsed.title,
                    items: itemsWithPosters,
                    bot: true,
                  };
                }
              } catch {
                return { type: "text", text: msg.text, bot: true };
              }
            }

            return { type: "text", text: msg.text, bot: false };
          })
        );

        setMessages(formatted);
      }
      // ✅ if no data → keep welcome message
    };

    loadMessages();
  }, []);

  // ✅ backend call
  const getRecommendations = async (movie: string) => {
    const res = await fetch("http://127.0.0.1:5000/recommend", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ movie }),
    });

    return await res.json();
  };

  // ✅ fetch poster
  const getMoviePoster = async (title: string) => {
    try {
      const res = await fetch(
        `https://www.omdbapi.com/?t=${encodeURIComponent(
          title
        )}&apikey=3f57b6d8`
      );

      const data = await res.json();
      return data.Poster !== "N/A" ? data.Poster : null;
    } catch {
      return null;
    }
  };

  const sendMessage = async () => {
    if (!input.trim()) return;

    const userMessage = input;
    setInput("");

    // ✅ USER MESSAGE
    setMessages((prev) => [
      ...prev,
      { type: "text", text: userMessage, bot: false },
    ]);

    await saveMessage(userMessage, false);

    // ✅ LOADING
    setMessages((prev) => [
      ...prev,
      { type: "text", text: "🤖 AI is thinking...", bot: true },
    ]);

    try {
      const data = await getRecommendations(userMessage);

        // ❌ no match at all
        if (data.error) {
          const text = "Movie not found 😢";
          await saveMessage(text, true);

          setMessages((prev) => [
            ...prev.slice(0, -1),
            { type: "text", text, bot: true },
          ]);
          return;
        }

        // ✅ suggestion case
        if (data.suggestion) {
          const text = `Did you mean "${data.suggestion}"?`;
          await saveMessage(text, true);

          setMessages((prev) => [
            ...prev.slice(0, -1),
            {
              type: "text",
              text,
              bot: true,
            },
          ]);
          return;
        }

        // ✅ normal result
        const results = data.results;

        await saveMessage(
          JSON.stringify({
            type: "recommendation",
            title: `If you like "${userMessage}", you might also like:`,
            items: results,
          }),
          true
        );

      // ✅ get posters
      const moviesWithPosters = await Promise.all(
        results.map(async (movie: string) => {
          const poster = await getMoviePoster(movie);
          return { title: movie, poster };
        })
      );

      // ✅ replace loading
      setMessages((prev) => {
        const updated = [...prev];
        updated.pop();
        return [
          ...updated,
          {
            type: "recommendation",
            title: `If you like "${userMessage}", you might also like:`,
            items: moviesWithPosters,
            bot: true,
          },
        ];
      });
    } catch {
      setMessages((prev) => [
        ...prev.slice(0, -1),
        { type: "text", text: "Error connecting to AI 😢", bot: true },
      ]);
    }
  };

  const saveMessage = async (text: string, isBot: boolean) => {
    const user = (await supabase.auth.getUser()).data.user;

    await supabase.from("messages").insert([
      {
        user_id: user?.id,
        text: text,
        is_bot: isBot,
      },
    ]);
  };

  return (
    <div className="min-h-screen bg-[#0b1120] text-slate-100 px-4 py-8">
      <div className="mx-auto max-w-4xl">
        <div className="mb-6 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-violet-500/10 text-violet-300 ring-1 ring-violet-500/30">
              <span className="text-2xl">🍿</span>
            </div>
            <div>
              <p className="text-sm uppercase tracking-[0.32em] text-violet-300/80">
                MovieHut Insights
              </p>
              <h1 className="text-2xl font-semibold text-white">AI Chat</h1>
            </div>
          </div>

          <button
            onClick={() => supabase.auth.signOut()}
            className="rounded-3xl border border-slate-700 bg-transparent px-4 py-2 text-sm font-semibold text-slate-100 transition hover:border-violet-400 hover:text-violet-300"
          >
            Logout
          </button>
        </div>

        <div className="rounded-[2rem] bg-slate-950/95 border border-white/10 shadow-2xl shadow-slate-900/40 overflow-hidden backdrop-blur-lg">
          <div className="flex flex-col h-[600px]">
            {/* ✅ CHAT */}
            <div className="flex-1 overflow-y-auto p-6 space-y-4">
              {messages.map((msg, i) => (
                <div
                  key={i}
                  className={`flex ${msg.bot ? "justify-start" : "justify-end"}`}
                >
                  <div
                    className={`max-w-md rounded-3xl px-4 py-3 shadow-lg ${
                      msg.bot
                        ? "bg-slate-900/80 border border-white/10 text-slate-100"
                        : "bg-violet-500/10 border border-violet-500/30 text-violet-100"
                    }`}
                  >
                    {/* ✅ TEXT MESSAGE */}
                    {msg.type === "text" && (
                      <pre className="whitespace-pre-wrap text-sm leading-6">{msg.text}</pre>
                    )}

                    {/* ✅ RECOMMENDATION MESSAGE */}
                    {msg.type === "recommendation" && (
                      <div>
                        {/* ✅ HEADER (NOT BULLETED) */}
                        <p className="font-semibold mb-3 text-slate-200">{msg.title}</p>

                        {/* ✅ MOVIE LIST */}
                        <ul className="space-y-3">
                          {msg.items.map((item: any, index: number) => (
                            <li
                              key={index}
                              className="flex items-center gap-3"
                            >
                              {item.poster && (
                                <img
                                  src={item.poster}
                                  alt={item.title}
                                  className="w-12 h-16 object-cover rounded-lg shadow-md"
                                />
                              )}
                              <span className="text-sm text-slate-300">{item.title}</span>
                            </li>
                          ))}
                        </ul>
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>

            {/* ✅ INPUT */}
            <div className="p-6 bg-slate-900/50 border-t border-white/10">
              <div className="flex gap-3">
                <input
                  className="flex-1 rounded-3xl border border-slate-700 bg-slate-950/90 px-4 py-3 text-white outline-none transition focus:border-violet-400 focus:ring-2 focus:ring-violet-500/20 placeholder-slate-400"
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === "Enter" && input.trim() !== "") {
                      sendMessage();
                    }
                  }}
                  placeholder="Type a movie..."
                />

                <button
                  onClick={sendMessage}
                  className="rounded-3xl bg-violet-500 px-6 py-3 text-sm font-semibold text-white shadow-lg shadow-violet-500/20 transition hover:bg-violet-400"
                >
                  Send
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
``