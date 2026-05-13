import { useEffect, useState } from "react";
import { supabase } from "./supabase";
import Chat from "./Chat";
import Auth from "./Auth";

export default function App() {
  const [session, setSession] = useState<any>(null);

  useEffect(() => {
    supabase.auth.getSession().then(({ data }) => {
      setSession(data.session);
    });

    supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
    });
  }, []);

  return session ? <Chat key={session.user.id} /> : <Auth />;
}