export async function createSession(): Promise<string> {
  const URL = import.meta.env.VITE_BACKEND_URL || "http://localhost:4000";
  if (!URL) {
    throw new Error("No backend URL");
  }
  const res = await fetch(`${URL}/api/session`, {
    method: "POST",
  });
  const data = await res.json();
  return data.sessionId;
}

export async function getHistory(sessionId: string) {
  const URL = import.meta.env.VITE_BACKEND_URL || "http://localhost:4000";
  if (!URL) {
    throw new Error("No backend URL");
  }
  const res = await fetch(`${URL}/api/history/${sessionId}`);
  return res.json();
}

export async function sendMessageStream(
  sessionId: string,
  message: string,
  onToken: (token: string) => void
): Promise<void> {
  const URL = import.meta.env.VITE_BACKEND_URL || "http://localhost:4000";
  if (!URL) {
    throw new Error("No backend URL");
  }
  const res = await fetch(`${URL}/api/chat/stream`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ sessionId, message }),
  });

  if (!res.body) throw new Error("No stream body");

  const reader = res.body.getReader();
  const decoder = new TextDecoder();

  while (true) {
    const { done, value } = await reader.read();
    if (done) break;

    const chunk = decoder.decode(value, { stream: true });
    const lines = chunk.split("\n").filter((l) => l.startsWith("data: "));

    for (const line of lines) {
      const data = JSON.parse(line.replace("data: ", ""));
      if (data.token) onToken(data.token);
    }
  }
}

// In your api/api.ts file, add:
export async function resetSession(sessionId: string): Promise<void> {
  const URL = import.meta.env.VITE_BACKEND_URL || "http://localhost:4000";
  if (!URL) {
    throw new Error("No backend URL");
  }
  const response = await fetch(`${URL}/api/session/${sessionId}`, {
    method: "DELETE",
  });
  if (!response.ok) {
    throw new Error("Failed to reset session");
  }
}
