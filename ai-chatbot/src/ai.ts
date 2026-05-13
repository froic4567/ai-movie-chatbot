
export async function askAI(message: string) {
  try {
    const res = await fetch(
      `https://api.popcat.xyz/chatbot?msg=${encodeURIComponent(message)}&owner=User&botname=AI`
    );

    const data = await res.json();

    return data.response;
  } catch (error) {
    return "AI not responding 😅";
  }
}
``
