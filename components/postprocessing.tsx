import { EffectComposer, Bloom } from '@react-three/postprocessing';

const Postprocessing = (): JSX.Element => {
  return (
    <EffectComposer>
      <Bloom luminanceThreshold={0.3} luminanceSmoothing={0.9} height={300} />
      <Bloom
        luminanceThreshold={0}
        luminanceSmoothing={0.9}
        height={100}
        intensity={0.1}
      />
    </EffectComposer>
  );
};

export default Postprocessing;
