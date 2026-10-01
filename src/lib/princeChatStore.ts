import { supabase } from './supabase';
import type { ChatMessage } from './princeAiService';

/**
 * Prince AI chat persistence — anonymous, device-scoped.
 *
 * No login exists on the portfolio, so every browser gets a random
 * `device_id` (kept in localStorage) that scopes its saved chats in the
 * `prince_chats` Supabase table. See supabase/prince_chats.sql.
 *
 * All calls fail soft: if Supabase is unreachable or env vars are missing,
 * they log a warning and resolve to an empty/no-op result so the live chat
 * keeps working entirely in memory.
 */

const DEVICE_KEY = 'prince_ai_device_id';
const TABLE = 'prince_chats';

export interface ChatSession {
  id: string;
  title: string;
  messages: ChatMessage[];
  created_at: string;
  updated_at: string;
}

/** Stable per-browser id used to scope saved chats. */
export function getDeviceId(): string {
  try {
    let id = localStorage.getItem(DEVICE_KEY);
    if (!id) {
      id =
        typeof crypto !== 'undefined' && crypto.randomUUID
          ? crypto.randomUUID()
          : `dev-${Date.now()}-${Math.random().toString(36).slice(2)}`;
      localStorage.setItem(DEVICE_KEY, id);
    }
    return id;
  } catch {
    return 'anon';
  }
}

/** Short, human-readable title from the first real user turn. */
export function deriveTitle(messages: ChatMessage[]): string {
  const firstUser = messages.find((m) => m.role === 'user' && m.content.trim());
  const base = firstUser?.content.trim() || 'New chat';
  return base.length > 48 ? `${base.slice(0, 48)}…` : base;
}

/**
 * Drop transient image data URLs before persisting — pasted screenshots are
 * base64 and would bloat rows. Text/markdown is preserved.
 */
function sanitize(messages: ChatMessage[]): ChatMessage[] {
  return messages.map((m) => ({ role: m.role, content: m.content }));
}

export async function listSessions(): Promise<ChatSession[]> {
  try {
    const { data, error } = await supabase
      .from(TABLE)
      .select('id, title, messages, created_at, updated_at')
      .eq('device_id', getDeviceId())
      .order('updated_at', { ascending: false })
      .limit(50);
    if (error) throw error;
    return (data as ChatSession[]) ?? [];
  } catch (e) {
    console.warn('Prince AI: could not load chat history.', e);
    return [];
  }
}

export async function createSession(messages: ChatMessage[]): Promise<ChatSession | null> {
  try {
    const now = new Date().toISOString();
    const { data, error } = await supabase
      .from(TABLE)
      .insert({
        device_id: getDeviceId(),
        title: deriveTitle(messages),
        messages: sanitize(messages),
        created_at: now,
        updated_at: now,
      })
      .select('id, title, messages, created_at, updated_at')
      .single();
    if (error) throw error;
    return data as ChatSession;
  } catch (e) {
    console.warn('Prince AI: could not create chat session.', e);
    return null;
  }
}

export async function updateSession(id: string, messages: ChatMessage[]): Promise<void> {
  try {
    const { error } = await supabase
      .from(TABLE)
      .update({
        messages: sanitize(messages),
        title: deriveTitle(messages),
        updated_at: new Date().toISOString(),
      })
      .eq('id', id)
      .eq('device_id', getDeviceId());
    if (error) throw error;
  } catch (e) {
    console.warn('Prince AI: could not save chat.', e);
  }
}

export async function deleteSession(id: string): Promise<void> {
  try {
    const { error } = await supabase
      .from(TABLE)
      .delete()
      .eq('id', id)
      .eq('device_id', getDeviceId());
    if (error) throw error;
  } catch (e) {
    console.warn('Prince AI: could not delete chat.', e);
  }
}
