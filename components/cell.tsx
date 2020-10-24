import { FC, useCallback, useState } from 'react';
import { useLoader } from 'react-three-fiber';

import { Cell as CellType, Player } from './game';

type CellProps = {
  contents: CellType;
  currentPlayer: Player;
  disabled: boolean;
  isInWinningArea: boolean;
  onClick: () => void;
  position: [number, number, number];
};

const basePath = (process.env.__NEXT_ROUTER_BASEPATH as string) || '';

type ObjectsGLTF = {
  nodes: {
    Pad: { geometry: unknown };
    X: { geometry: unknown };
    O: { geometry: unknown };
  };
};

export const Cell: FC<CellProps> = ({
  contents,
  currentPlayer,
  disabled,
  isInWinningArea,
  onClick,
  position,
}) => {
  // eslint-disable-next-line @typescript-eslint/no-var-requires
  const GLTFLoader = require('three/examples/jsm/loaders/GLTFLoader')
    .GLTFLoader;
  const { nodes } = useLoader<ObjectsGLTF>(
    GLTFLoader,
    `${basePath}/objects.glb`,
  );

  const handleClick = useCallback(
    (event) => {
      event.stopPropagation();
      onClick();
    },
    [onClick],
  );

  const handlePointerOver = useCallback((event) => {
    event.stopPropagation();
    setHover(true);
  }, []);

  const handlePointerOut = useCallback(() => {
    setHover(false);
  }, []);

  const [hovered, setHover] = useState(false);
  const hoveredYetNotDisabled = hovered && !disabled;

  const color = isInWinningArea
    ? 'hotpink'
    : contents === 'X'
    ? 'red'
    : contents === 'O'
    ? 'blue'
    : hoveredYetNotDisabled
    ? currentPlayer === 'X'
      ? '#f99'
      : '#99f'
    : 'grey';

  return (
    <>
      <mesh
        onClick={disabled ? undefined : handleClick}
        onPointerOut={handlePointerOut}
        onPointerOver={disabled ? undefined : handlePointerOver}
        position={position}
      >
        <primitive attach="geometry" object={nodes.Pad.geometry} />
        <meshStandardMaterial color={color} />
      </mesh>
      {contents === 'X' && (
        <mesh position={position}>
          <primitive attach="geometry" object={nodes.X.geometry} />
          <meshStandardMaterial color="white" />
        </mesh>
      )}
      {contents === 'O' && (
        <mesh position={position}>
          <primitive attach="geometry" object={nodes.O.geometry} />
          <meshStandardMaterial color="white" />
        </mesh>
      )}
    </>
  );
};
