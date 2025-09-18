// src/hooks/useSession.ts
import { useEffect, useState } from "react";
import { createSession } from "../api/api";
import {
  getActiveSession,
  setActiveSession,
  getSessions,
  addSession,
  removeSession,
} from "../utils/storage";

export function useSession() {
  const [sessionId, setSessionId] = useState<string | null>(null);
  const [sessions, setSessions] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function init() {
      try {
        let id = getActiveSession();
        if (!id) {
          id = await createSession();
          setActiveSession(id);
        }
        setSessionId(id);
        setSessions(getSessions());
      } catch (error) {
        console.error("Failed to initialize session:", error);
        // Fallback: create new session
        const id = await createSession();
        setActiveSession(id);
        setSessionId(id);
        setSessions(getSessions());
      } finally {
        setIsLoading(false);
      }
    }
    init();
  }, []);

  const switchSession = (id: string) => {
    setActiveSession(id);
    setSessionId(id);
    setSessions(getSessions());
  };

  const newSession = async () => {
    try {
      const id = await createSession();
      setActiveSession(id);
      setSessionId(id);
      setSessions(getSessions());
      return id;
    } catch (error) {
      console.error("Failed to create new session:", error);
      throw error;
    }
  };

  const deleteSession = (id: string) => {
    removeSession(id);
    setSessions(getSessions());
    
    // If we're deleting the current session, create a new one
    if (sessionId === id) {
      newSession();
    }
  };

  return { 
    sessionId, 
    sessions, 
    switchSession, 
    newSession, 
    deleteSession,
    isLoading 
  };
}