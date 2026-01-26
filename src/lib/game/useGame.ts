"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import type { Card } from "@/lib/cards/schema";
import { loadState, saveState, type GameMode, type GameState, defaultState } from "@/lib/game/storage";
import { randomInt, shuffleInPlace } from "@/lib/game/random";

function buildDeck(cards: Card[]): string[] {
  const ids = cards.map((c) => c.id);
  return shuffleInPlace(ids);
}

function buildDeckWhere(cards: Card[], predicate: (c: Card) => boolean): string[] {
  const ids = cards.filter(predicate).map((c) => c.id);
  return shuffleInPlace(ids);
}

export function useGame(deepCards: Card[], todCards: Card[] = []) {
  const allCards = useMemo(() => [...deepCards, ...todCards], [deepCards, todCards]);
  const [state, setState] = useState<GameState>(() => {
    if (typeof window === "undefined") return defaultState();
    return loadState();
  });

  useEffect(() => {
    saveState(state);
  }, [state]);

  const cardMap = useMemo(() => {
    const map = new Map<string, Card>();
    for (const c of allCards) map.set(c.id, c);
    return map;
  }, [allCards]);

  const activeCard = state.activeCardId ? cardMap.get(state.activeCardId) ?? null : null;
  const todActiveCard = state.todActiveCardId ? cardMap.get(state.todActiveCardId) ?? null : null;

  const startNewGame = useCallback(
    (params: { mode: GameMode; playerCount: number; players: string[] }) => {
      const deck = buildDeck(deepCards);
      const todTruthDeck = buildDeckWhere(todCards, (c) => c.kind === "truth");
      const todDareDeck = buildDeckWhere(todCards, (c) => c.kind === "dare");
      setState({
        mode: params.mode,
        playerCount: params.playerCount,
        players: params.players,
        currentPlayerIndex: 0,
        deck,
        deckIndex: 0,
        history: [],
        todTruthDeck,
        todTruthIndex: 0,
        todDareDeck,
        todDareIndex: 0,
        todHistory: [],
        todActiveCardId: null,
        favorites: {},
        activeCardId: null,
      });
    },
    [deepCards, todCards]
  );

  const drawNext = useCallback(() => {
    setState((prev) => {
      if (prev.deck.length === 0) {
        const deck = buildDeck(deepCards);
        return { ...prev, deck, deckIndex: 0, history: [], activeCardId: null };
      }

      const isDeckFinished = prev.deckIndex >= prev.deck.length;
      const deck = isDeckFinished ? buildDeck(deepCards) : prev.deck;
      const deckIndex = isDeckFinished ? 0 : prev.deckIndex;

      const nextId = deck[deckIndex] ?? null;
      if (!nextId) return { ...prev, deck, deckIndex, activeCardId: null };

      const nextHistory = [...prev.history, nextId];
      const nextPlayerIndex = prev.playerCount > 0 ? (prev.currentPlayerIndex + 1) % prev.playerCount : 0;

      return {
        ...prev,
        deck,
        deckIndex: deckIndex + 1,
        history: nextHistory,
        activeCardId: nextId,
        currentPlayerIndex: nextPlayerIndex,
      };
    });
  }, [deepCards]);

  const drawTod = useCallback(
    (kind: "truth" | "dare") => {
      setState((prev) => {
        const hasTod = todCards.length > 0;
        if (!hasTod) return prev;

        const isTruth = kind === "truth";
        const deckKey = isTruth ? "todTruthDeck" : "todDareDeck";
        const indexKey = isTruth ? "todTruthIndex" : "todDareIndex";
        const prevDeck = prev[deckKey];
        const prevIndex = prev[indexKey];

        const sourceCards = todCards.filter((c) => c.kind === kind);
        if (sourceCards.length === 0) return prev;

        const deckEmpty = !prevDeck || prevDeck.length === 0;
        const finished = prevIndex >= (prevDeck?.length ?? 0);
        const deck = deckEmpty || finished ? buildDeckWhere(todCards, (c) => c.kind === kind) : prevDeck;
        const index = deckEmpty || finished ? 0 : prevIndex;
        const nextId = deck[index] ?? null;
        if (!nextId) return prev;

        return {
          ...prev,
          [deckKey]: deck,
          [indexKey]: index + 1,
          todHistory: [...(prev.todHistory ?? []), nextId],
          todActiveCardId: nextId,
        };
      });
    },
    [todCards]
  );

  const drawTodRandom = useCallback(() => {
    const kind: "truth" | "dare" = randomInt(2) === 0 ? "truth" : "dare";
    drawTod(kind);
    return kind;
  }, [drawTod]);

  const skip = useCallback(() => {
    drawNext();
  }, [drawNext]);

  const toggleFavorite = useCallback(() => {
    setState((prev) => {
      const id = prev.activeCardId;
      if (!id) return prev;
      const favorites = { ...prev.favorites };
      if (favorites[id]) delete favorites[id];
      else favorites[id] = true;
      return { ...prev, favorites };
    });
  }, []);

  const resetDeck = useCallback(() => {
    setState((prev) => ({
      ...prev,
      deck: buildDeck(deepCards),
      deckIndex: 0,
      history: [],
      todTruthDeck: buildDeckWhere(todCards, (c) => c.kind === "truth"),
      todTruthIndex: 0,
      todDareDeck: buildDeckWhere(todCards, (c) => c.kind === "dare"),
      todDareIndex: 0,
      todHistory: [],
      todActiveCardId: null,
      activeCardId: null,
      currentPlayerIndex: 0,
    }));
  }, [deepCards, todCards]);

  const isFavorite = state.activeCardId ? Boolean(state.favorites[state.activeCardId]) : false;
  const remaining = Math.max(0, (state.deck?.length ?? 0) - (state.deckIndex ?? 0));

  return {
    state,
    activeCard,
    todActiveCard,
    isFavorite,
    remaining,
    actions: {
      startNewGame,
      drawNext,
      drawTod,
      drawTodRandom,
      skip,
      toggleFavorite,
      resetDeck,
      setState,
    },
  };
}
