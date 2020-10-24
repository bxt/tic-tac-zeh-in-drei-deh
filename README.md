Tic-Tac-Zeh – in 3D! [![CI](https://github.com/bxt/tic-tac-zeh-in-drei-deh/workflows/CI/badge.svg)](https://github.com/bxt/tic-tac-zeh-in-drei-deh/actions?query=workflow%3ACI)
====================

This is a small web app that allows you to play tic-tac-toe.

[You can find the game running here](https://bxt.github.io/tic-tac-zeh-in-drei-deh/).

Developing
----------

This is a web site that uses web technologies like [React](https://reactjs.org/), [TypeScript](https://www.typescriptlang.org/), [three.js](https://threejs.org/), [react-three-fiber](https://github.com/pmndrs/react-three-fiber), [Next.js](https://nextjs.org/), [Prettier](https://prettier.io/) and [ESLint](https://eslint.org/).

To get started run

```shell
npm install
```

Developing works best if you use an IDE with TypeScript and ESLint support built in. Then just start the dev server:

```shell
npm run dev
```

The server will preview your changes at <http://localhost:3000/tic-tac-zeh-in-drei-deh> and refresh the components as you do changes.

Before committing, you should run the linters, just in case you missed something:

```shell
npm run lint
```

In the end you can build and export all the required files to the `out` directory using:

```shell
npm run build
```

That's it!

There are some GitHub actions to lint and build the app, as well as deploy the `main` branch to GitHub pages at <https://bxt.github.io/tic-tac-zeh-in-drei-deh/>.