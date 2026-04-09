import { create } from 'zustand';
import { Game, mockGames } from '../data/games';

interface GameStore {
  games: Game[];
  featuredGames: Game[];
  freeGames: Game[];
  topSellers: Game[];
  bestSellers: Game[];
  upcomingGames: Game[];
  selectedCategory: string | null;
  setCategory: (category: string | null) => void;
  getGameById: (id: string) => Game | undefined;
}

export const useGameStore = create<GameStore>((set, get) => ({
  games: mockGames,
  featuredGames: mockGames.filter(g => g.isFeatured),
  freeGames: mockGames.filter(g => g.isFree),
  topSellers: mockGames.filter(g => g.isTopSeller),
  bestSellers: mockGames.filter(g => g.isBestSeller),
  upcomingGames: mockGames.filter(g => g.isUpcoming),
  selectedCategory: null,
  setCategory: (category) => set({ selectedCategory: category }),
  getGameById: (id) => get().games.find(g => g.id === id),
}));
