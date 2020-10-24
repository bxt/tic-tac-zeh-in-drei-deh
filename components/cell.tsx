import { FC, useRef, useState } from 'react';

import { Cell as CellType, Player } from './game';

type CellProps = {
  contents: CellType;
  currentPlayer: Player;
  disabled: boolean;
  isInWinningArea: boolean;
  onClick: () => void;
  position: [number, number, number];
};

export const Cell: FC<CellProps> = ({
  contents,
  currentPlayer,
  disabled,
  isInWinningArea,
  onClick,
  position,
}) => {
  // This reference will give us direct access to the mesh
  const mesh = useRef();

  // Set up state for the hovered and active state
  const [hovered, setHover] = useState(false);

  const color = isInWinningArea
    ? 'hotpink'
    : contents === 'X'
    ? 'red'
    : contents === 'O'
    ? 'blue'
    : hovered
    ? currentPlayer === 'X'
      ? '#f99'
      : '#99f'
    : 'grey';

  return (
    <mesh
      ref={mesh}
      position={position}
      onClick={disabled ? undefined : onClick}
      scale={hovered ? [1.1, 1.1, 1.1] : [1, 1, 1]}
      onPointerOver={() => setHover(true)}
      onPointerOut={() => setHover(false)}
    >
      <boxBufferGeometry args={[1, 1, 1]} />
      <meshStandardMaterial color={color} />
    </mesh>
  );
};
