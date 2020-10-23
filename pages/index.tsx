import Head from 'next/head';
import { useMemo, useState } from 'react';
import css from 'styled-jsx/css';

const basePath = (process.env.__NEXT_ROUTER_BASEPATH as string) || '';

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

export default function Home(): JSX.Element {
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
  const draft = full && !winner;

  return (
    <div className="container">
      <Head>
        <title>Tic-Tac-Zeh – in 3D!</title>
        <link rel="icon" href={`${basePath}/favicon.ico`} />
      </Head>

      <main>
        <h1>Tic-Tac-Zeh – in 3D!</h1>

        {(winner || draft) && (
          <div className="endscreen">
            <div>
              {winner && <div className="winner">{winner} wins!</div>}
              {draft && <div className="draft">Draft!</div>}
              <button
                onClick={() => {
                  setGrid(makeGrid());
                }}
              >
                Try again
              </button>
            </div>
          </div>
        )}

        <div className="grid">
          {grid.map((row, rowNumber) => (
            <div className="row" key={rowNumber}>
              {row.map((cell, cellNumber) => (
                <div className="cell" key={cellNumber}>
                  <button
                    className={
                      winningArea &&
                      winningArea.find(
                        ([rN, cN]) => rN === rowNumber && cN === cellNumber,
                      )
                        ? 'hightlighted'
                        : undefined
                    }
                    disabled={Boolean(cell || winner)}
                    onClick={() => {
                      setGrid((grid) =>
                        grid.map((row, rN) =>
                          row.map((cell, cN) =>
                            rN === rowNumber && cN === cellNumber
                              ? currentPlayer
                              : cell,
                          ),
                        ),
                      );
                      setCurrentPlayer((player) =>
                        player === 'X' ? 'O' : 'X',
                      );
                    }}
                  >
                    {cell || '-'}
                  </button>
                </div>
              ))}
            </div>
          ))}
        </div>
        <footer>
          Created 2020 by Bernhard Häussner – Code on{' '}
          <a href="https://github.com/bxt/tic-tac-zeh-in-drei-deh">GitHub</a>
        </footer>
      </main>

      <style jsx>{`
        .container {
          align-items: center;
          display: flex;
          justify-content: center;
          max-width: 100%;
          min-height: 100vh;
        }
        main {
          background: papayawhip;
          border-radius: 5px;
          margin: 7rem 0.5rem;
          padding: 1rem 2rem 2rem 2rem;
          position: relative;
        }
        @media (min-width: 768px) {
          main {
            padding: 2rem 4rem 4rem 4rem;
          }
        }
        h1 {
          font-size: 20px;
          margin-bottom: 0.5rem;
          text-align: center;
        }
        @media (min-width: 768px) {
          h1 {
            font-size: 48px;
            margin-bottom: 1rem;
          }
        }
        .endscreen {
          position: absolute;
          top: 0;
          right: 0;
          left: 0;
          bottom: 0;
          background: rgba(0, 0, 0, 0.5);
          align-items: center;
          display: flex;
          justify-content: center;
        }
        .endscreen > div {
          padding: 1rem;
          background: white;
          text-align: center;
        }
        .row {
          text-align: center;
        }
        .cell {
          display: inline-block;
        }
        button {
          width: 50px;
          height: 50px;
          margin: 0.5rem;
        }
        button.hightlighted {
          background-color: hotpink;
        }
        footer {
          color: #999;
          font-size: 0.7em;
          text-align: center;
          margin-top: 2rem;
        }
      `}</style>

      <style jsx global>
        {globalStyles}
      </style>
    </div>
  );
}

export const globalStyles = css.global`
  html,
  body {
    font-family: -apple-system, BlinkMacSystemFont, Segoe UI, Roboto, Oxygen,
      Ubuntu, Cantarell, Fira Sans, Droid Sans, Helvetica Neue, sans-serif;
    line-height: 1.6;
  }
  * {
    margin: 0;
    padding: 0;
  }
`;
