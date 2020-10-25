import { FC, useMemo, useRef } from 'react';
import { useFrame } from 'react-three-fiber';
import { InstancedMesh, Object3D, Vector3 } from 'three';

const count = 1000;

type ParticlesProps = {
  position: [number, number, number];
  color: string;
};

export const Particles: FC<ParticlesProps> = ({ position, color }) => {
  const mesh = useRef<InstancedMesh>();

  const dummy = useMemo(() => new Object3D(), []);

  const [x, y, z] = position;
  const positionVector = useMemo(() => new Vector3(x, y, z), [x, y, z]);

  const particles = useMemo(() => {
    const temp = [];
    for (let i = 0; i < count; i++) {
      temp.push({
        t: 0,
        mx: 0,
        my: 0,
        mz: 0,
        speed: Math.random(),
        radius: Math.random(),
        phi: Math.random(),
        phiSpeed: Math.random(),
      });
    }
    return temp;
  }, []);

  useFrame(() => {
    particles.forEach((particle, i) => {
      particle.t++;

      const { t, speed, radius, phi, phiSpeed } = particle;

      particle.mx = Math.sin(t * 0.01 * (phiSpeed - 0.5) + phi) * radius * 0.4;
      particle.my += 0.04 + 0.04 * speed - particle.my / 20;
      particle.mz = Math.cos(t * 0.01 * (phiSpeed - 0.5) + phi) * radius * 0.4;

      dummy.position
        .set(particle.mx, particle.my, particle.mz)
        .add(positionVector);
      dummy.updateMatrix();

      mesh.current?.setMatrixAt(i, dummy.matrix);
    });

    if (mesh.current) {
      mesh.current.instanceMatrix.needsUpdate = true;
    }
  });
  return (
    <>
      <instancedMesh
        ref={mesh}
        args={
          // @ts-expect-error All the demos pass nulls here as well...
          [null, null, count]
        }
      >
        <octahedronBufferGeometry attach="geometry" args={[0.02, 0]} />
        <meshStandardMaterial attach="material" color={color} />
      </instancedMesh>
    </>
  );
};
