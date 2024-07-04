import { useRef, useEffect } from "react";
import { Canvas, useFrame, useThree, useLoader } from "@react-three/fiber";
import { OrbitControls, Plane, useHelper } from "@react-three/drei";
import * as THREE from "three";
import TWEEN from "@tweenjs/tween.js";
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader.js";
import { RectAreaLightHelper } from "three/addons/helpers/RectAreaLightHelper.js";
import { RectAreaLightUniformsLib } from "three/addons/lights/RectAreaLightUniformsLib.js";

const Model = () => {
  const gltf = useLoader(GLTFLoader, "Klur_brown_bottle_only1.glb");
  const modelRef = useRef<THREE.Object3D>(gltf.scene);

  useEffect(() => {
    if (modelRef.current) {
      modelRef.current.traverse((child) => {
        if ((child as THREE.Mesh).isMesh) {
          (child as THREE.Mesh).castShadow = true;
          (child as THREE.Mesh).receiveShadow = true;
        }
      });
    }
  }, [gltf]);

  return <primitive object={gltf.scene} scale={0.2} position={[0, 0.0, 0]} />;
};

let RectAreaLight = ({
  color,
  intensity,
  width,
  height,
  position,
  lookAt,
}: {
  color: string;
  intensity: number;
  width: number;
  height: number;
  position: [number, number, number];
  lookAt: [number, number, number];
}) => {
  const light = useRef<THREE.RectAreaLight>(null!);
  useHelper(light, RectAreaLightHelper, "red");

  useEffect(() => {
    if (light.current) {
      light.current.lookAt(new THREE.Vector3(...lookAt));
    }
  }, [lookAt]);

  return (
    <rectAreaLight
      ref={light}
      args={[color, intensity, width, height]}
      position={position}
    />
  );
};


const Sprite = ({ position }: { position: [number, number, number] }) => {
  const texture = useLoader(THREE.TextureLoader, "KLur_brown_bottle_1.png");
  const aspect = texture.image.width / texture.image.height;

  return (
    <sprite position={position} scale={[aspect, 1, 1]}>
      <spriteMaterial attach="material" map={texture} />
    </sprite>
  );
};

// type SpotlightProps = {
//   color: number;
//   position: [number, number, number];
//   targetPosition: [number, number, number];
// };

// const Spotlight = ({ color, position, targetPosition }: SpotlightProps) => {
//   const light = useRef<THREE.SpotLight>(null!);
//   useEffect(() => {
//     if (light.current) {
//       light.current.position.set(position[0], position[1], position[2]);
//       light.current.target.position.set(
//         targetPosition[0],
//         targetPosition[1],
//         targetPosition[2]
//       );
//     }
//   }, [position, targetPosition]);

//   return (
//     <spotLight
//       ref={light}
//       color={color}
//       intensity={50}
//       angle={Math.PI / 48}
//       penumbra={0.9}
//       castShadow
//     />
//   );
// };

const Scene = () => {
  const { scene, camera } = useThree();
  const directionalLightRef1 = useRef<THREE.DirectionalLight>(null!);
  const directionalLightRef2 = useRef<THREE.DirectionalLight>(null!);

  RectAreaLightUniformsLib.init();

  useEffect(() => {
    camera.position.set(0, 1.0, 3.1);
    camera.lookAt(0, 0, 0);
    scene.background = new THREE.Color(0x87ceeb);
  }, [camera, scene]);

  useHelper(directionalLightRef1, THREE.DirectionalLightHelper, 5);
  useHelper(directionalLightRef2, THREE.DirectionalLightHelper, 5);

  useFrame(() => {
    TWEEN.update();
  });

  return (
    <>
      <ambientLight intensity={0.5} />
      <RectAreaLight
        color={"#ffffff"}
        intensity={0.9}
        width={5}
        height={20}
        position={[0.0, 2, 2]}
        lookAt={[0, 0.5, 2]}
      />

      <RectAreaLight
        color={"#ffffff"}
        intensity={0.9}
        width={5}
        height={20}
        position={[0.0, 2, -1]}
        lookAt={[0, 0, 0]}
      />

      {/* <Spotlight
        color={0xffffff}
        position={[0, 0.2, 5]}
        targetPosition={[0, 0.5, -2]}
      /> */}
      <directionalLight
        ref={directionalLightRef1}
        position={[5, 0.1, 2]}
        intensity={5}
        castShadow
        shadow-mapSize-width={2048}
        shadow-mapSize-height={2048}
        shadow-camera-far={10}
        shadow-camera-left={-10}
        shadow-camera-right={10}
        shadow-camera-top={10}
        shadow-camera-bottom={-10}
      />
      <directionalLight
        ref={directionalLightRef2}
        position={[-5, 0.1, 2]}
        intensity={5}
        castShadow
        shadow-mapSize-width={2048}
        shadow-mapSize-height={2048}
        shadow-camera-far={10}
        shadow-camera-left={-10}
        shadow-camera-right={10}
        shadow-camera-top={10}
        shadow-camera-bottom={-10}
      />
      <Plane
        args={[100, 100]}
        rotation-x={-Math.PI / 2}
        position={[0, -0.15, 0]}
        receiveShadow
      >
        <meshStandardMaterial attach="material" color="#ffffff" />
      </Plane>
      <Sprite position={[0, 0.4, -1.5]} />
      <Model />
    </>
  );
};

const App = () => {
  return (
    <Canvas shadows camera={{ position: [4.6, 2.2, 2.1], fov: 35 }}>
      <color attach="background" args={["#202020"]} />
      <OrbitControls
        maxPolarAngle={Math.PI / 2}
        minDistance={0.1}
        maxDistance={10}
      />
      <Scene />
    </Canvas>
  );
};

export default App;
