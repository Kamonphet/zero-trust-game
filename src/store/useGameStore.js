import { create } from "zustand";
import { GAME_PHASES } from "../constants/gameData";

const initialState = {
  phase: GAME_PHASES.MENU,
  isLoading: false,
  soundEnabled: true,
  bgmEnabled: true,
  sfxEnabled: true,
  players: [], // { id: string, name: string, role: string, hasVoted: boolean }
  rolesDistributed: false,
  scammerChoices: { victimId: null, evidenceCards: [], attackMethodCard: null },
  boardCards: { evidence: [], attackMethods: [] },
  clues: [], // { clueCardId: string, selectedOptionIndex: number }
  votes: [], // { playerId: string, suspectedScammerId: string, evidenceCards: [], attackMethodCard: null }
  turnIndex: 0,
  voteTimer: 0, // In seconds. 0 = unlimited. Options: 0, 30, 60, 180, 300
  quizQuestionCount: 10, // Options: 5, 10, 20
  quizDifficulty: "MEDIUM", // Options: "EASY", "MEDIUM", "HARD"
};

const useGameStore = create((set) => ({
  ...initialState,

  // Phase Transitions
  setPhase: (phase) => {
    set({ isLoading: true });
    setTimeout(() => {
      set({ phase, isLoading: false });
    }, 1500); // 1.5s loading screen
  },

  // Player Setup
  setPlayers: (players) => set({ players }),

  setRolesDistributed: (status) => set({ rolesDistributed: status }),

  // Sound Toggles
  toggleSound: () => set((state) => ({ soundEnabled: !state.soundEnabled })),
  toggleBgm: () => set((state) => ({ bgmEnabled: !state.bgmEnabled })),
  toggleSfx: () => set((state) => ({ sfxEnabled: !state.sfxEnabled })),

  // Game Settings
  setVoteTimer: (amount) => set({ voteTimer: amount }),
  setQuizQuestionCount: (count) => set({ quizQuestionCount: count }),
  setQuizDifficulty: (difficulty) => set({ quizDifficulty: difficulty }),

  // Turn Management
  nextTurn: () => set((state) => ({ turnIndex: state.turnIndex + 1 })),
  resetTurn: () => set({ turnIndex: 0 }),

  // Night Phase Setters
  setBoardCards: (evidence, attackMethods) =>
    set({ boardCards: { evidence, attackMethods } }),
  setScammerChoices: (choices) => set({ scammerChoices: choices }),

  // Day Phase Setters
  addClue: (clue) => set((state) => ({ clues: [...state.clues, clue] })),

  // Voting
  addVote: (vote) =>
    set((state) => {
      const updatedPlayers = state.players.map((p) =>
        p.id === vote.playerId ? { ...p, hasVoted: true } : p,
      );
      return { votes: [...state.votes, vote], players: updatedPlayers };
    }),

  // Reset Game
  resetGame: () => set(initialState),
}));

export default useGameStore;
