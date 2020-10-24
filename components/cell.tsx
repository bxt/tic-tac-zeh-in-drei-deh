import { FC, useCallback, useState } from 'react';

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

  // Set up state for the hovered and active state
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
    <mesh
      position={position}
      onClick={disabled ? undefined : handleClick}
      scale={hoveredYetNotDisabled ? [1.1, 1.1, 1.1] : [1, 1, 1]}
      onPointerOver={disabled ? undefined : handlePointerOver}
      onPointerOut={handlePointerOut}
    >
      <boxBufferGeometry args={[1, 1, 1]} />
      <meshStandardMaterial color={color} />
    </mesh>
  );
};
