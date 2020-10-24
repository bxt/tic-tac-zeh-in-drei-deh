import Head from 'next/head';
import dynamic from 'next/dynamic';
import css from 'styled-jsx/css';
import { Canvas } from 'react-three-fiber';

import { useGameControls } from '../components/game';
import { Controls } from '../components/controls';
import { Suspense } from 'react';

const Cell = dynamic(() => import('../components/cell'), {
  ssr: false,
});
const Postprocessing = dynamic(() => import('../components/postprocessing'), {
  ssr: false,
});

const basePath = (process.env.__NEXT_ROUTER_BASEPATH as string) || '';

export default function Home(): JSX.Element {
  const {
    claimCell,
    currentPlayer,
    grid,
    isDraft,
    isInWinningArea,
    restartGame,
    winner,
  } = useGameControls();

  return (
    <>
      <Head>
        <title>Tic-Tac-Zeh – in 3D!</title>
        <link rel="icon" href={`${basePath}/favicon.ico`} />
      </Head>

      <Canvas>
        <ambientLight />
        <pointLight position={[10, 10, 10]} />
        <Suspense fallback={null}>
          {grid.map((row, rowNumber) =>
            row.map((cell, cellNumber) => (
              <Cell
                contents={cell}
                currentPlayer={currentPlayer}
                disabled={Boolean(cell || winner)}
                isInWinningArea={isInWinningArea([rowNumber, cellNumber])}
                key={rowNumber * row.length + cellNumber}
                onClick={() => {
                  claimCell([rowNumber, cellNumber]);
                }}
                position={[1.2 * (rowNumber - 1), 0, 1.2 * (cellNumber - 1)]}
              />
            )),
          )}
          <Postprocessing />
        </Suspense>
        <Controls />
      </Canvas>

      {(winner || isDraft) && (
        <div className="endscreen">
          <div>
            {winner && <div className="winner">{winner} wins!</div>}
            {isDraft && <div className="draft">Draft!</div>}
            <button onClick={restartGame}>Try again</button>
          </div>
        </div>
      )}

      <footer>
        Created 2020 by Bernhard Häussner – Code on{' '}
        <a href="https://github.com/bxt/tic-tac-zeh-in-drei-deh">GitHub</a>
      </footer>

      <style jsx>{`
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
          padding: 3rem;
          background: white;
          text-align: center;
        }
        footer {
          position: absolute;
          bottom: 1rem;
          right: 1rem;
          color: #999;
          font-size: 0.7em;
          filter: invert(1);
        }
      `}</style>

      <style jsx global>
        {globalStyles}
      </style>
    </>
  );
}

export const globalStyles = css.global`
  html,
  body {
    font-family: -apple-system, BlinkMacSystemFont, Segoe UI, Roboto, Oxygen,
      Ubuntu, Cantarell, Fira Sans, Droid Sans, Helvetica Neue, sans-serif;
    line-height: 1.6;
    height: 100%;
    background: #334;
    background: radial-gradient(#334, #112);
  }
  body > div {
    height: 100%;
  }
  * {
    margin: 0;
    padding: 0;
  }
`;
