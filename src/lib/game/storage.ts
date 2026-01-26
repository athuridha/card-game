const KEY = "kartu-deep-talk:v1";

export type GameMode = "Santai" | "Bertahap";

export type GameState = {
  mode: GameMode;
  playerCount: number;
  players: string[]; // length = playerCount, may include empty strings
  currentPlayerIndex: number;
  deck: string[]; // array of card ids in draw order
  deckIndex: number; // next draw index
  history: string[]; // drawn card ids in order
  todTruthDeck: string[];
  todTruthIndex: number;
  todDareDeck: string[];
  todDareIndex: number;
  todHistory: string[];
  todActiveCardId: string | null;
  favorites: Record<string, true>;
  activeCardId: string | null;
};

export function defaultState(): GameState {
  return {
    mode: "Santai",
    playerCount: 4,
    players: ["", "", "", ""],
    currentPlayerIndex: 0,
    deck: [],
    deckIndex: 0,
    history: [],
    todTruthDeck: [],
    todTruthIndex: 0,
    todDareDeck: [],
    todDareIndex: 0,
    todHistory: [],
    todActiveCardId: null,
    favorites: {},
    activeCardId: null,
  };
}

export function loadState(): GameState {
  if (typeof window === "undefined") return defaultState();
  try {
    const raw = window.localStorage.getItem(KEY);
    if (!raw) return defaultState();
    const parsed = JSON.parse(raw) as GameState;
    return { ...defaultState(), ...parsed };
  } catch {
    return defaultState();
  }
}

export function saveState(state: GameState) {
  if (typeof window === "undefined") return;
  window.localStorage.setItem(KEY, JSON.stringify(state));
}

export function clearState() {
  if (typeof window === "undefined") return;
  window.localStorage.removeItem(KEY);
}
