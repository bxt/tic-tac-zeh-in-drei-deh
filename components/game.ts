import { useCallback, useMemo, useState } from 'react';

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

const at = (grid: Grid, cellCoords: CellCoords): Cell =>
  grid[cellCoords[0]][cellCoords[1]];

type GameControls = {
  claimCell: (cellCoords: CellCoords) => void;
  grid: Grid;
  isDraft: boolean;
  isInWinningArea: (cellCoords: CellCoords) => boolean;
  restartGame: () => void;
  winner: Cell;
};

export const useGameControls = (): GameControls => {
  const [makeGrid, areas] = defaultGame();
  const [grid, setGrid] = useState<Grid>(makeGrid());
  const [currentPlayer, setCurrentPlayer] = useState<Player>('X');

  const winningArea = useMemo(() => {
    return areas.find((area) => {
      const first = at(grid, area[0]);
      return (
        first && area.every((cellCoords) => at(grid, cellCoords) === first)
      );
    });
  }, [grid, areas]);

  const winner = winningArea ? at(grid, winningArea[0]) : null;
  const full = grid.every((row) => row.every((cell) => cell));
  const isDraft = full && !winner;

  const isInWinningArea = useCallback(
    ([rowNumber, cellNumber]) =>
      Boolean(
        winningArea &&
          winningArea.find(([rN, cN]) => rN === rowNumber && cN === cellNumber),
      ),
    [winningArea],
  );

  const restartGame = useCallback(() => {
    setGrid(makeGrid());
    setCurrentPlayer('X');
  }, [makeGrid]);

  const claimCell = useCallback(
    ([rowNumber, cellNumber]) => {
      setGrid((grid) =>
        grid.map((row, rN) =>
          row.map((cell, cN) =>
            rN === rowNumber && cN === cellNumber ? currentPlayer : cell,
          ),
        ),
      );
      setCurrentPlayer((player) => (player === 'X' ? 'O' : 'X'));
    },
    [currentPlayer],
  );

  return {
    claimCell,
    grid,
    isDraft,
    isInWinningArea,
    restartGame,
    winner,
  };
};
