// src/utils/storage.ts

const SESSIONS_KEY = "chatbot_sessions";
const ACTIVE_SESSION_KEY = "active_session";
const MAX_SESSIONS = 50; // Limit to prevent localStorage bloat

export function getSessions(): string[] {
  try {
    return JSON.parse(localStorage.getItem(SESSIONS_KEY) || "[]");
  } catch (error) {
    console.error("Error reading sessions from localStorage:", error);
    return [];
  }
}

export function addSession(id: string) {
  try {
    const sessions = getSessions();
    if (!sessions.includes(id)) {
      sessions.unshift(id); // newest first
      
      // Limit the number of stored sessions
      const limitedSessions = sessions.slice(0, MAX_SESSIONS);
      
      localStorage.setItem(SESSIONS_KEY, JSON.stringify(limitedSessions));
    }
  } catch (error) {
    console.error("Error adding session to localStorage:", error);
  }
}

export function removeSession(id: string) {
  try {
    const sessions = getSessions();
    const filtered = sessions.filter(sessionId => sessionId !== id);
    localStorage.setItem(SESSIONS_KEY, JSON.stringify(filtered));
  } catch (error) {
    console.error("Error removing session from localStorage:", error);
  }
}

export function setActiveSession(id: string) {
  try {
    sessionStorage.setItem(ACTIVE_SESSION_KEY, id);
    addSession(id);
  } catch (error) {
    console.error("Error setting active session:", error);
  }
}

export function getActiveSession(): string | null {
  try {
    return sessionStorage.getItem(ACTIVE_SESSION_KEY);
  } catch (error) {
    console.error("Error getting active session:", error);
    return null;
  }
}

export function clearActiveSession() {
  try {
    sessionStorage.removeItem(ACTIVE_SESSION_KEY);
  } catch (error) {
    console.error("Error clearing active session:", error);
  }
}

// Utility to check localStorage availability and space
export function getStorageInfo() {
  try {
    const sessions = getSessions();
    const storageUsed = JSON.stringify(sessions).length;
    
    return {
      sessionCount: sessions.length,
      storageUsed: `${(storageUsed / 1024).toFixed(2)} KB`,
      maxSessions: MAX_SESSIONS
    };
  } catch (error) {
    return null;
  }
}

// Clean up old sessions if needed
export function cleanupOldSessions(keepCount: number = MAX_SESSIONS) {
  try {
    const sessions = getSessions();
    if (sessions.length > keepCount) {
      const trimmed = sessions.slice(0, keepCount);
      localStorage.setItem(SESSIONS_KEY, JSON.stringify(trimmed));
      return sessions.length - trimmed.length; // return number of cleaned sessions
    }
    return 0;
  } catch (error) {
    console.error("Error cleaning up sessions:", error);
    return 0;
  }
}