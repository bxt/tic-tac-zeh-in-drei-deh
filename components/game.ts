import { useCallback, useMemo, useReducer } from 'react';

const players = ['X', 'O'] as const;
type Player = typeof players[number];
type Cell = Player | null;
type Grid = Cell[][];
type CellCoords = [number, number];
type Area = CellCoords[];
type Game = [() => Grid, Area[]];

const defaultGame = (): Game => {
  const makeGrid = () => [
    [null, null, null],
    [null, null, null],
    [null, null, null],
  ];

  const grid = makeGrid();

  const verticals = grid[0].map((cell, cellNumber) =>
    grid.map((row, rowNumber): CellCoords => [rowNumber, cellNumber]),
  );
  const horizontals = grid.map((row, rowNumber) =>
    row.map((cell, cellNumber): CellCoords => [rowNumber, cellNumber]),
  );
  const diagonals = [
    grid.map((row, rowNumber): CellCoords => [rowNumber, rowNumber]),
    grid.map(
      (row, rowNumber): CellCoords => [rowNumber, row.length - rowNumber - 1],
    ),
  ];

  const areas = [...verticals, ...horizontals, ...diagonals];

  return [makeGrid, areas];
};

const [makeGrid, areas] = defaultGame();

const at = (grid: Grid, cellCoords: CellCoords): Cell =>
  grid[cellCoords[0]][cellCoords[1]];

type State = {
  grid: Grid;
  currentPlayer: Player;
};

const makeInitialState = (): State => ({
  grid: makeGrid(),
  currentPlayer: 'X',
});

type Action =
  | { type: 'CLAIM_CELL'; rowNumber: number; cellNumber: number }
  | { type: 'RESTART' };

const reducer = ({ grid, currentPlayer }: State, action: Action): State => {
  switch (action.type) {
    case 'CLAIM_CELL':
      const { rowNumber, cellNumber } = action;
      return {
        grid: grid.map((row, rN) =>
          row.map((cell, cN) =>
            rN === rowNumber && cN === cellNumber ? currentPlayer : cell,
          ),
        ),
        currentPlayer: currentPlayer === 'X' ? 'O' : 'X',
      };
    case 'RESTART':
      return makeInitialState();
  }
};

type GameControls = {
  claimCell: (cellCoords: CellCoords) => void;
  grid: Grid;
  isDraft: boolean;
  isInWinningArea: (cellCoords: CellCoords) => boolean;
  restartGame: () => void;
  winner: Cell;
};

export const useGameControls = (): GameControls => {
  const [state, dispatch] = useReducer(reducer, makeInitialState());
  const { grid } = state;

  const winningArea = useMemo(() => {
    return areas.find((area) => {
      const first = at(grid, area[0]);
      return (
        first && area.every((cellCoords) => at(grid, cellCoords) === first)
      );
    });
  }, [grid]);

  const winner = winningArea ? at(grid, winningArea[0]) : null;
  const isFull = grid.every((row) => row.every((cell) => cell));
  const isDraft = isFull && !winner;

  const isInWinningArea = useCallback(
    ([rowNumber, cellNumber]) =>
      Boolean(
        winningArea &&
          winningArea.find(([rN, cN]) => rN === rowNumber && cN === cellNumber),
      ),
    [winningArea],
  );

  const restartGame = useCallback(() => {
    dispatch({ type: 'RESTART' });
  }, []);

  const claimCell = useCallback(([rowNumber, cellNumber]) => {
    dispatch({ type: 'CLAIM_CELL', rowNumber, cellNumber });
  }, []);

  return {
    claimCell,
    grid,
    isDraft,
    isInWinningArea,
    restartGame,
    winner,
  };
};
