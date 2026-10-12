export type Side = "A" | "B";
export type GameMode = "singles" | "doubles";
export type BestOf = 3 | 5;

export const POINTS_TO_WIN = 21;
export const MUST_WIN_BY = 2;
export const POINT_CAP = 30;

export interface MatchState {
  a: number;
  b: number;
  gamesA: number;
  gamesB: number;
  server: Side;
  completedGames: Array<{ a: number; b: number; winner: Side }>;
}

export const initialMatch = (server: Side = "A"): MatchState => ({
  a: 0,
  b: 0,
  gamesA: 0,
  gamesB: 0,
  server,
  completedGames: [],
});

export function gameWinner(a: number, b: number): Side | null {
  if (a >= POINT_CAP) return "A";
  if (b >= POINT_CAP) return "B";
  if (a >= POINTS_TO_WIN && a - b >= MUST_WIN_BY) return "A";
  if (b >= POINTS_TO_WIN && b - a >= MUST_WIN_BY) return "B";
  return null;
}

export const gamesToWin = (bestOf: BestOf) => Math.ceil(bestOf / 2);

export function matchWinner(state: MatchState, bestOf: BestOf): Side | null {
  const need = gamesToWin(bestOf);
  if (state.gamesA >= need) return "A";
  if (state.gamesB >= need) return "B";
  return null;
}

export function isDeuce(a: number, b: number) {
  return a >= POINTS_TO_WIN - 1 && b >= POINTS_TO_WIN - 1 && gameWinner(a, b) === null;
}

/** The side that would win the game with the next rally, if any. */
export function gamePointFor(a: number, b: number): Side | null {
  if (gameWinner(a, b)) return null;
  if (gameWinner(a + 1, b) === "A") return "A";
  if (gameWinner(a, b + 1) === "B") return "B";
  return null;
}

export function isMatchPoint(state: MatchState, bestOf: BestOf): Side | null {
  const side = gamePointFor(state.a, state.b);
  if (!side) return null;
  const games = side === "A" ? state.gamesA : state.gamesB;
  return games + 1 >= gamesToWin(bestOf) ? side : null;
}

/** Service is from the right court on an even score, the left on an odd one. */
export function serviceCourt(state: MatchState): "right" | "left" {
  const score = state.server === "A" ? state.a : state.b;
  return score % 2 === 0 ? "right" : "left";
}

export function scoreRally(state: MatchState, side: Side, bestOf: BestOf): MatchState {
  if (matchWinner(state, bestOf)) return state;

  const a = state.a + (side === "A" ? 1 : 0);
  const b = state.b + (side === "B" ? 1 : 0);
  const winner = gameWinner(a, b);

  if (!winner) return { ...state, a, b, server: side };

  return {
    a: 0,
    b: 0,
    gamesA: state.gamesA + (winner === "A" ? 1 : 0),
    gamesB: state.gamesB + (winner === "B" ? 1 : 0),
    server: winner,
    completedGames: [...state.completedGames, { a, b, winner }],
  };
}

export function currentGameNumber(state: MatchState) {
  return state.completedGames.length + 1;
}
