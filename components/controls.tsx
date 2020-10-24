import { useCallback, useEffect, useMemo } from 'react';
import { Vector3, Vector2, Spherical } from 'three';
import { useThree, useFrame } from 'react-three-fiber';

const target = new Vector3(0, 0, 0);
const basePosition = new Vector3(0, 3, -3);

export const Controls = (): null => {
  const { camera, gl } = useThree();

  const position = useMemo(() => new Vector3(), []);
  const offset = useMemo(() => new Vector2(), []);
  const spherical = useMemo(() => new Spherical(), []);

  const domElement = gl.domElement;

  useFrame(() => {
    position.copy(basePosition).sub(target);
    spherical.setFromVector3(position);
    spherical.theta +=
      2 *
      (offset.x / domElement.clientWidth - 0.5) *
      (offset.y / domElement.clientHeight - 0.5);
    spherical.phi += 0.3 * (offset.y / domElement.clientHeight - 0.5);
    position.setFromSpherical(spherical).add(target);
    camera.position.copy(position);
    camera.lookAt(target);
  });

  const onPointerMove = useCallback(
    (event) => {
      offset.set(event.clientX, event.clientY);
    },
    [offset],
  );

  useEffect(() => {
    domElement.ownerDocument.addEventListener(
      'pointermove',
      onPointerMove,
      false,
    );
    return () => {
      domElement.ownerDocument.removeEventListener(
        'pointermove',
        onPointerMove,
        false,
      );
    };
  }, [domElement.ownerDocument, onPointerMove]);

  return null;
};
