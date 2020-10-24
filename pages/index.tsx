import Head from 'next/head';
import css from 'styled-jsx/css';

import { useGameControls } from '../components/game';

const basePath = (process.env.__NEXT_ROUTER_BASEPATH as string) || '';

export default function Home(): JSX.Element {
  const {
    claimCell,
    grid,
    isDraft,
    isInWinningArea,
    restartGame,
    winner,
  } = useGameControls();

  return (
    <div className="container">
      <Head>
        <title>Tic-Tac-Zeh – in 3D!</title>
        <link rel="icon" href={`${basePath}/favicon.ico`} />
      </Head>

      <main>
        <h1>Tic-Tac-Zeh – in 3D!</h1>

        {(winner || isDraft) && (
          <div className="endscreen">
            <div>
              {winner && <div className="winner">{winner} wins!</div>}
              {isDraft && <div className="draft">Draft!</div>}
              <button onClick={restartGame}>Try again</button>
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
                      isInWinningArea([rowNumber, cellNumber])
                        ? 'hightlighted'
                        : undefined
                    }
                    disabled={Boolean(cell || winner)}
                    onClick={() => {
                      claimCell([rowNumber, cellNumber]);
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
