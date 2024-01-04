"use client";

import { useFrame } from "@react-three/fiber";
import { useMemo, useRef } from "react";
import { BufferGeometry, MathUtils } from "three";

export const UFOScene = () => {
  const count = 3000;
  const scalar = 2;
  const distance = 1.5;

  const particlesPos = useMemo(() => {
    const buffer = new Float32Array(count * 3);
    for (let i = 0; i < count; i++) {
      const theta = MathUtils.randFloatSpread(360);
      const phi = MathUtils.randFloatSpread(360);

      let x = distance * Math.sin(theta) * Math.cos(phi);
      let y = distance * Math.sin(theta) * Math.sin(phi);
      let z = distance * Math.cos(theta);

      buffer.set([x, y, z], i * 3);
    }
    return buffer;
  }, [count, distance]);

  const ref = useRef<BufferGeometry>(null);

  useFrame(({ clock }) => {
    // for (let i = 0; i < count; i++) {
    //   const i3 = i * 3;
    // //   ref.current!.attributes.position.array[i3] +=
    // //     Math.sin(clock.elapsedTime + Math.random() * 10) * 0.01;
    // //   ref.current!.attributes.position.array[i3 + 1] +=
    // //     Math.cos(clock.elapsedTime + Math.random() * 10) * 0.01;
    // //   //   ref.current!.attributes.position.array[i3 + 2] +=
    // //   //     Math.sin(clock.elapsedTime + Math.random() * 10) * 0.01;
    // //   ref.current!.attributes.position.needsUpdate = true;
    // }
  });
  return (
    <>
      <points>
        <bufferGeometry ref={ref}>
          <bufferAttribute
            attach={"attributes-position"}
            array={particlesPos}
            count={count}
            itemSize={3}
          />
        </bufferGeometry>
        <pointsMaterial color="#5786F5" size={0.015} sizeAttenuation />
      </points>
    </>
  );
};
