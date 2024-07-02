import { useRef, useEffect } from "react";
import { Canvas, useFrame, useThree, useLoader } from "@react-three/fiber";
import { OrbitControls, Plane } from "@react-three/drei";
import * as THREE from "three";
import TWEEN from "@tweenjs/tween.js";
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader.js";

const Spotlight = ({
  color,
  position,
}: {
  color: number;
  position: [number, number, number];
}) => {
  const light = useRef<THREE.SpotLight>(null!);

  return (
    <spotLight
      ref={light}
      color={color}
      intensity={1}
      distance={50}
      angle={0.5} // Increased angle for larger lighted area
      penumbra={0.2}
      decay={1} // Reduced decay for larger lighted area
      castShadow
      position={position}
    />
  );
};

const DirectionalLight = ({
  color,
  position,
  targetPosition,
  shadowSize = 10,
}: {
  color: number;
  position: [number, number, number];
  targetPosition: [number, number, number];
  shadowSize?: number;
}) => {
  const light = useRef<THREE.DirectionalLight>(null!);
  useEffect(() => {
    if (light.current) {
      light.current.target.position.set(...targetPosition);
      light.current.shadow.camera.left = -shadowSize;
      light.current.shadow.camera.right = shadowSize;
      light.current.shadow.camera.top = shadowSize;
      light.current.shadow.camera.bottom = -shadowSize;
      light.current.shadow.camera.near = 0.1;
      light.current.shadow.camera.far = 100;
      light.current.shadow.mapSize.width = 2048;
      light.current.shadow.mapSize.height = 2048;
    }
  }, [targetPosition, shadowSize]);

  return (
    <directionalLight
      ref={light}
      color={color}
      intensity={1}
      position={position}
      castShadow
    />
  );
};

const Model = () => {
  const gltf = useLoader(GLTFLoader, "Bathroom_scene_1.glb");
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

const Scene = () => {
  const { scene, camera } = useThree();

  useEffect(() => {
    camera.position.set(0, 2.0, 3.1);
    camera.lookAt(1, 1.5, 0);
    scene.background = new THREE.Color(0x87ceeb);
  }, [camera, scene]);

  useFrame(() => {
    TWEEN.update();
  });

  // const groundTexture = useLoader(
  //   THREE.TextureLoader,
  //   "Pavement_background_image.png"
  // );

  return (
    <>
      <ambientLight intensity={0.4} />
      <Spotlight color={0xffffff} position={[0, 14, 0]} />
      <DirectionalLight
        color={0xffffff}
        position={[12, 2, 3]}
        targetPosition={[0, 0, 0]}
        shadowSize={20}
      />
      <DirectionalLight
        color={0xffffff}
        position={[-12, 0, 5]}
        targetPosition={[0, 0, 0]}
        shadowSize={20}
      />
      {/* <hemisphereLight
        color={[0xffffff, 0x444444]}
        intensity={0.1}
        position={[0, 1, 2]}
      /> */}

      <Plane
        args={[3, 3]}
        rotation-x={-Math.PI / 2}
        position={[0, -0.05, 0]}
        receiveShadow
      >
        {/* <meshPhongMaterial attach="material" map={groundTexture} /> */}
      </Plane>
      <Plane
        args={[100, 100]} // Adjusted size for larger ground plane
        rotation-x={-Math.PI / 2}
        position={[0, -0.15, 0]} // Lower position to avoid z-fighting
        receiveShadow
      >
        {/* <meshPhongMaterial attach="material" color="#404040" />
        {""} */}
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
