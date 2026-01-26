"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import type { Card } from "@/lib/cards/schema";
import { loadState, saveState, type GameMode, type GameState, defaultState } from "@/lib/game/storage";
import { shuffleInPlace } from "@/lib/game/random";

function buildDeck(cards: Card[]): string[] {
  const ids = cards.map((c) => c.id);
  return shuffleInPlace(ids);
}

export function useGame(cards: Card[]) {
  const [state, setState] = useState<GameState>(() => {
    if (typeof window === "undefined") return defaultState();
    return loadState();
  });

  useEffect(() => {
    saveState(state);
  }, [state]);

  const cardMap = useMemo(() => {
    const map = new Map<string, Card>();
    for (const c of cards) map.set(c.id, c);
    return map;
  }, [cards]);

  const activeCard = state.activeCardId ? cardMap.get(state.activeCardId) ?? null : null;

  const startNewGame = useCallback(
    (params: { mode: GameMode; playerCount: number; players: string[] }) => {
      const deck = buildDeck(cards);
      setState({
        mode: params.mode,
        playerCount: params.playerCount,
        players: params.players,
        currentPlayerIndex: 0,
        deck,
        deckIndex: 0,
        history: [],
        favorites: {},
        activeCardId: null,
      });
    },
    [cards]
  );

  const drawNext = useCallback(() => {
    setState((prev) => {
      if (prev.deck.length === 0) {
        const deck = buildDeck(cards);
        return { ...prev, deck, deckIndex: 0, history: [], activeCardId: null };
      }

      const isDeckFinished = prev.deckIndex >= prev.deck.length;
      const deck = isDeckFinished ? buildDeck(cards) : prev.deck;
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
  }, [cards]);

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
      deck: buildDeck(cards),
      deckIndex: 0,
      history: [],
      activeCardId: null,
      currentPlayerIndex: 0,
    }));
  }, [cards]);

  const isFavorite = state.activeCardId ? Boolean(state.favorites[state.activeCardId]) : false;
  const remaining = Math.max(0, (state.deck?.length ?? 0) - (state.deckIndex ?? 0));

  return {
    state,
    activeCard,
    isFavorite,
    remaining,
    actions: {
      startNewGame,
      drawNext,
      skip,
      toggleFavorite,
      resetDeck,
      setState,
    },
  };
}
