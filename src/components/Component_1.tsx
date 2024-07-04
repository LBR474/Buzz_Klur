import { useRef, useEffect } from "react";
import { Canvas, useFrame, useThree, useLoader } from "@react-three/fiber";
import { OrbitControls, Plane, useHelper } from "@react-three/drei";
import * as THREE from "three";
import TWEEN from "@tweenjs/tween.js";
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader.js";
import {  SpotLightHelper } from "three";
import { RectAreaLightHelper } from "three/addons/helpers/RectAreaLightHelper.js";
import { RectAreaLightUniformsLib } from "three/addons/lights/RectAreaLightUniformsLib.js";

const Model = () => {
  const gltf = useLoader(GLTFLoader, "Klur_brown_bottle_only1.glb");
  const modelRef = useRef(gltf.scene);
  console.log(modelRef)

  useEffect(() => {
    if (modelRef.current) {
      const light1 = modelRef.current.children[0];
      const light2 = modelRef.current.children[1];
      
      if (light1 && light1.isObject3D) {
        //@ts-ignore
        light1.intensity = 0;

        light1.position.set(5, 10, 5); // Change the position as needed
      }

      if (light2 && light2.isObject3D) {
        //@ts-ignore
        light2.intensity = 0;
        light2.position.set(5, 10, 5); // Change the position as needed
      }
    }
  }, [gltf]);

  return <primitive object={gltf.scene} scale={0.2} position={[0, 0.0, 0]} />;
};

const Sprite = ({ position }: { position: [number, number, number] }) => {
  const texture = useLoader(THREE.TextureLoader, "KLur_brown_bottle_1.png");

  // Calculate aspect ratio
  const aspect = texture.image.width / texture.image.height;

  return (
    <sprite position={position} scale={[aspect, 1, 1]}>
      <spriteMaterial attach="material" map={texture} />
    </sprite>
  );
};

type SpotlightProps = {
  color: number;
  position: [number, number, number];
  targetPosition: [number, number, number];
};


const Spotlight = ({ color, position, targetPosition }: SpotlightProps) => {
  const light = useRef<THREE.SpotLight>(null!);
  useHelper(light, SpotLightHelper, "black");
  // Set up the spotlight's position and target
  useEffect(() => {
    if (light.current) {
      light.current.position.set(position[0], position[1], position[2]);
      light.current.target.position.set(
        targetPosition[0],
        targetPosition[1],
        targetPosition[2]
      );
    }
  }, [position, targetPosition]);

  return (
    <spotLight
      ref={light}
      color={color}
      intensity={250}
      angle={Math.PI / 192}
      penumbra={0.9}
      castShadow
    />
  );
};

let RectAreaLight = ({
  color,
  intensity,
  width, height,
  position
  //lookAt,
}: {
  color: string;
  intensity: number;
  width: number;
  height: number;
  position: [number, number, number];
  //lookAt: [number, number, number];
}) => {
  const light = useRef<THREE.RectAreaLight>(null!);
  useHelper(light, RectAreaLightHelper, "red");


  // useEffect(() => {
  //   if (light.current) {
  //     light.current.lookAt(new THREE.Vector3(...lookAt));
  //   }
  // }, [lookAt]);

  return (
    <rectAreaLight ref={light} args={[color, intensity, width, height]} position={position} />
    
  );
};

const Scene = () => {
  const { scene, camera } = useThree();

  RectAreaLightUniformsLib.init();

  useEffect(() => {
    camera.position.set(0, 1.0, 3.1);
    camera.lookAt(0, 0, 0);
    scene.background = new THREE.Color(0x87ceeb);
  }, [camera, scene]);

  useFrame(() => {
    TWEEN.update();
  });

  return (
    <>
      <ambientLight intensity={0.5} />

      {/* Adding RectAreaLight */}
      {/* <RectAreaLight
        color={"#ffffff"}
        intensity={2.9}
        width={1.5}
        height={1.8}
        position={[1.9, 0.1, 0.5]}
        // lookAt={[0, 0, 0]}
      />

      <RectAreaLight
        color={"#ffffff"}
        intensity={2.9}
        width={1.5}
        height={1.8}
        position={[-1.9, 0.1, 0.5]}
        // lookAt={[0, 0, 0]}
      /> */}

      <RectAreaLight
        color={"#ffffff"}
        intensity={1.9}
        width={40.5}
        height={20.8}
        position={[0.0, 0.1, 3.5]}
        // lookAt={[0, 0, 0]}
      />

      {/* <Spotlight
        color={0xffffff}
        position={[0, 1, -10]}
        targetPosition={[0, 0.5, 0]}
      /> */}

      <Spotlight
        color={0xffffff}
        position={[15, -0.1, 5]}
        targetPosition={[0, 0.2, 0]}
      />
      <Spotlight
        color={0xffffff}
        position={[-15, -0.1, 5]}
        targetPosition={[0, 0.3, 0]}
      />

      {/* <Plane
        args={[3, 3]}
        rotation-x={-Math.PI / 2}
        position={[0, -0.05, 0]}
        receiveShadow
      >
        <meshPhongMaterial attach="material" color="#404040" />
        {""}
      </Plane> */}
      <Plane
        args={[100, 100]} // Adjusted size for larger ground plane
        rotation-x={-Math.PI / 2}
        position={[0, -0.15, 0]} // Lower position to avoid z-fighting
        receiveShadow
      >
        <meshPhongMaterial attach="material" color="#ffffff" />
        {""}
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
