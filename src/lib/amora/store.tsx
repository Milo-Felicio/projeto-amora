import { createContext, useContext, useEffect, useMemo, useState, type ReactNode } from "react";
import {
  ACTIVITIES,
  DEFAULT_ROUTINE,
  type MoodValue,
  type Period,
  type RoutineItem,
} from "@/lib/amora/data";

const STORAGE_KEY = "projeto-amora-v1";

export type CustomRoutine = RoutineItem;

type AmoraState = {
  moods: Record<string, MoodValue>;
  activities: Record<string, string[]>;
  routineDone: Record<string, string[]>;
  customRoutine: CustomRoutine[];
  hiddenRoutine: string[];
};

const MOOD_VALUES = new Set<number>([1, 2, 3, 4, 5]);

export function dateKey(date = new Date()) {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
}

function emptyState(): AmoraState {
  return {
    moods: {},
    activities: {},
    routineDone: {},
    customRoutine: [],
    hiddenRoutine: [],
  };
}

function isRecord(value: unknown): value is Record<string, unknown> {
  return !!value && typeof value === "object" && !Array.isArray(value);
}

function dateMap(value: unknown): Record<string, string[]> {
  if (!isRecord(value)) return {};
  const next: Record<string, string[]> = {};
  for (const [key, entry] of Object.entries(value)) {
    if (!/^\d{4}-\d{2}-\d{2}$/.test(key) || !Array.isArray(entry)) continue;
    next[key] = entry.filter((item): item is string => typeof item === "string").slice(0, 40);
  }
  return next;
}

export function loadState(raw: string | null): AmoraState {
  if (!raw) return emptyState();
  try {
    const data = JSON.parse(raw) as unknown;
    if (!isRecord(data)) return emptyState();
    const moods: Record<string, MoodValue> = {};
    if (isRecord(data.moods)) {
      for (const [key, value] of Object.entries(data.moods)) {
        if (/^\d{4}-\d{2}-\d{2}$/.test(key) && typeof value === "number" && MOOD_VALUES.has(value)) {
          moods[key] = value as MoodValue;
        }
      }
    }
    const customRoutine: CustomRoutine[] = [];
    if (Array.isArray(data.customRoutine)) {
      for (const item of data.customRoutine) {
        if (!isRecord(item)) continue;
        const period = item.period;
        if (period !== "manha" && period !== "tarde" && period !== "noite") continue;
        if (typeof item.id !== "string" || typeof item.title !== "string") continue;
        const title = item.title.trim().slice(0, 60);
        if (!title) continue;
        customRoutine.push({ id: item.id.slice(0, 80), title, period });
      }
    }
    const hiddenRoutine = Array.isArray(data.hiddenRoutine)
      ? data.hiddenRoutine.filter((item): item is string => typeof item === "string").slice(0, 80)
      : [];
    return {
      moods,
      activities: dateMap(data.activities),
      routineDone: dateMap(data.routineDone),
      customRoutine: customRoutine.slice(0, 24),
      hiddenRoutine,
    };
  } catch {
    return emptyState();
  }
}

function toggleId(map: Record<string, string[]>, day: string, id: string) {
  const current = map[day] ?? [];
  const next = current.includes(id) ? current.filter((item) => item !== id) : [...current, id];
  return { ...map, [day]: next };
}

type AmoraContextValue = {
  ready: boolean;
  today: string;
  mood: MoodValue | null;
  setMood: (value: MoodValue) => void;
  activityDone: (id: string) => boolean;
  toggleActivity: (id: string) => void;
  doneActivityCount: number;
  routineItems: (period: Period) => RoutineItem[];
  routineDone: (id: string) => boolean;
  toggleRoutine: (id: string) => void;
  addRoutine: (title: string, period: Period) => void;
  removeRoutine: (id: string) => void;
  routineProgress: { done: number; total: number };
  moods: Record<string, MoodValue>;
  activitiesByDay: Record<string, string[]>;
};

const AmoraContext = createContext<AmoraContextValue | null>(null);

export function AmoraProvider({ children }: { children: ReactNode }) {
  const [state, setState] = useState<AmoraState>(emptyState);
  const [ready, setReady] = useState(false);
  const [today, setToday] = useState("");

  useEffect(() => {
    setToday(dateKey());
    setState(loadState(localStorage.getItem(STORAGE_KEY)));
    setReady(true);
  }, []);

  useEffect(() => {
    if (!ready) return;
    localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
  }, [ready, state]);

  const value = useMemo<AmoraContextValue>(() => {
    const day = today;
    const visible = (period: Period) => [
      ...DEFAULT_ROUTINE.filter((item) => item.period === period && !state.hiddenRoutine.includes(item.id)),
      ...state.customRoutine.filter((item) => item.period === period),
    ];
    const allVisible = (["manha", "tarde", "noite"] as Period[]).flatMap(visible);
    const doneToday = state.routineDone[day] ?? [];
    return {
      ready,
      today: day,
      mood: state.moods[day] ?? null,
      setMood: (mood) => {
        if (!ready || !day) return;
        setState((current) => ({ ...current, moods: { ...current.moods, [day]: mood } }));
      },
      activityDone: (id) => (state.activities[day] ?? []).includes(id),
      toggleActivity: (id) => {
        if (!ready || !day) return;
        setState((current) => ({ ...current, activities: toggleId(current.activities, day, id) }));
      },
      doneActivityCount: (state.activities[day] ?? []).filter((id) => ACTIVITIES.some((item) => item.id === id))
        .length,
      routineItems: visible,
      routineDone: (id) => doneToday.includes(id),
      toggleRoutine: (id) => {
        if (!ready || !day) return;
        setState((current) => ({ ...current, routineDone: toggleId(current.routineDone, day, id) }));
      },
      addRoutine: (title, period) => {
        if (!ready) return;
        const clean = title.trim().replace(/\s+/g, " ").slice(0, 60);
        if (!clean) return;
        setState((current) => ({
          ...current,
          customRoutine: [
            ...current.customRoutine,
            { id: `c-${crypto.randomUUID()}`, title: clean, period },
          ].slice(0, 24),
        }));
      },
      removeRoutine: (id) => {
        if (!ready) return;
        setState((current) => ({
          ...current,
          customRoutine: current.customRoutine.filter((item) => item.id !== id),
          hiddenRoutine: current.hiddenRoutine.includes(id)
            ? current.hiddenRoutine
            : [...current.hiddenRoutine, id],
        }));
      },
      routineProgress: {
        done: allVisible.filter((item) => doneToday.includes(item.id)).length,
        total: allVisible.length,
      },
      moods: state.moods,
      activitiesByDay: state.activities,
    };
  }, [ready, state, today]);

  return <AmoraContext.Provider value={value}>{children}</AmoraContext.Provider>;
}

export function useAmora() {
  const value = useContext(AmoraContext);
  if (!value) throw new Error("useAmora precisa do AmoraProvider");
  return value;
}
