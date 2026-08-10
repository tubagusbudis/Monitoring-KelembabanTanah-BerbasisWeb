import { Canvas } from "@react-three/fiber";
import { OrbitControls, ContactShadows, Float } from "@react-three/drei";

// Satu gerombolan daun kecil (bukan bola padat, tapi kumpulan bentuk pipih
// yang saling overlap dikit biar keliatan rimbun kayak daun beneran)
function LeafCluster({ position, scale = 1, color, rotation = [0, 0, 0] }) {
  return (
    <group position={position} scale={scale} rotation={rotation}>
      <mesh position={[0, 0, 0]} scale={[1, 0.6, 1]}>
        <icosahedronGeometry args={[0.55, 1]} />
        <meshStandardMaterial color={color} flatShading roughness={0.75} />
      </mesh>
      <mesh position={[0.35, 0.15, 0.15]} scale={[0.75, 0.5, 0.75]}>
        <icosahedronGeometry args={[0.5, 1]} />
        <meshStandardMaterial color={color} flatShading roughness={0.75} />
      </mesh>
      <mesh position={[-0.3, 0.1, -0.2]} scale={[0.7, 0.45, 0.7]}>
        <icosahedronGeometry args={[0.5, 1]} />
        <meshStandardMaterial color={color} flatShading roughness={0.75} />
      </mesh>
    </group>
  );
}

// Satu cabang: ranting tipis + gerombolan daun di ujungnya
function Branch({ start, end, leafColor, leafScale, leafRotation }) {
  const dx = end[0] - start[0];
  const dy = end[1] - start[1];
  const dz = end[2] - start[2];
  const length = Math.sqrt(dx * dx + dy * dy + dz * dz);
  const mid = [
    (start[0] + end[0]) / 2,
    (start[1] + end[1]) / 2,
    (start[2] + end[2]) / 2,
  ];

  // Sudut buat naruh silinder ranting supaya nyambung dari start ke end
  const pitch = Math.atan2(Math.sqrt(dx * dx + dz * dz), dy);
  const yaw = Math.atan2(dx, dz);

  return (
    <group>
      <mesh position={mid} rotation={[pitch, yaw, 0]}>
        <cylinderGeometry args={[0.035, 0.06, length, 8]} />
        <meshStandardMaterial color="#5b3a1f" roughness={0.9} />
      </mesh>
      <LeafCluster
        position={end}
        scale={leafScale}
        color={leafColor}
        rotation={leafRotation}
      />
    </group>
  );
}

export default function Plant3D({ moisture }) {
  const isDry = moisture < 40;

  // Warna daun natural: hijau segar kalau sehat, kuning-coklat pudar (bukan
  // coklat tua kayak batu) kalau kering
  const leafColor = isDry ? "#c9a227" : "#3f9142";
  const leafColorAlt = isDry ? "#a97d2a" : "#5cb85c";
  const soilColor = isDry ? "#4a3020" : "#2d1a11";
  const plantScale = isDry ? 0.85 : 1.05;

  return (
    <div className="w-full h-[350px] bg-white dark:bg-gray-800 border border-gray-100 dark:border-gray-700 shadow-xl rounded-2xl overflow-hidden relative transition-colors duration-300">
      <div className="absolute top-4 left-4 z-10 pointer-events-none bg-white/70 dark:bg-gray-900/70 backdrop-blur-md px-3 py-2 rounded-xl shadow-sm border border-gray-200/50 dark:border-gray-700/50 transition-colors">
        <h3 className="font-bold text-gray-800 dark:text-white flex items-center gap-2 text-sm">
          🌱 Visualisasi 3D
        </h3>
        <p
          className={`text-xs font-bold mt-1 ${isDry ? "text-amber-500" : "text-emerald-500"}`}
        >
          {isDry ? "Tanaman butuh air!" : "Tanaman tumbuh subur!"}
        </p>
      </div>

      <Canvas camera={{ position: [0, 2.5, 8], fov: 45 }}>
        <ambientLight intensity={0.75} />
        <directionalLight position={[10, 10, 5]} intensity={1.4} castShadow />
        <directionalLight
          position={[-10, -10, -5]}
          intensity={0.4}
          color={leafColor}
        />

        <Float speed={2.5} rotationIntensity={0.1} floatIntensity={0.25}>
          <group position={[0, -1.5, 0]}>
            {/* Pot */}
            <mesh position={[0, 0, 0]}>
              <cylinderGeometry args={[1, 0.7, 1.2, 32]} />
              <meshStandardMaterial color="#e76f51" roughness={0.8} />
            </mesh>
            <mesh position={[0, 0.6, 0]}>
              <cylinderGeometry args={[1.1, 1.1, 0.2, 32]} />
              <meshStandardMaterial color="#d85a3a" roughness={0.9} />
            </mesh>
            <mesh position={[0, 0.55, 0]}>
              <cylinderGeometry args={[0.95, 0.95, 0.1, 32]} />
              <meshStandardMaterial color={soilColor} roughness={1} />
            </mesh>

            {/* Batang utama */}
            <mesh position={[0, 1.5, 0]}>
              <cylinderGeometry args={[0.13, 0.22, 1.8, 12]} />
              <meshStandardMaterial color="#5b3a1f" roughness={0.9} />
            </mesh>

            {/* Cabang-cabang dengan gerombolan daun di ujungnya, nyebar
                biar keliatan tumbuh alami bukan satu gumpalan */}
            <group scale={plantScale}>
              <Branch
                start={[0, 2.3, 0]}
                end={[0, 3.1, 0]}
                leafColor={leafColor}
                leafScale={1.05}
                leafRotation={[0, 0.3, 0]}
              />
              <Branch
                start={[0, 2.5, 0]}
                end={[0.85, 2.9, 0.35]}
                leafColor={leafColorAlt}
                leafScale={0.75}
                leafRotation={[0.1, 0.6, 0]}
              />
              <Branch
                start={[0, 2.5, 0]}
                end={[-0.8, 2.7, -0.4]}
                leafColor={leafColor}
                leafScale={0.7}
                leafRotation={[-0.1, -0.5, 0.1]}
              />
              <Branch
                start={[0, 2.35, 0]}
                end={[0.35, 2.6, -0.85]}
                leafColor={leafColorAlt}
                leafScale={0.65}
                leafRotation={[0.2, 1.2, 0]}
              />
              <Branch
                start={[0, 2.35, 0]}
                end={[-0.4, 2.5, 0.8]}
                leafColor={leafColor}
                leafScale={0.6}
                leafRotation={[-0.15, 2, 0]}
              />
            </group>
          </group>
        </Float>

        <ContactShadows
          position={[0, -1.5, 0]}
          opacity={0.6}
          scale={12}
          blur={2.5}
          far={4}
        />

        <OrbitControls
          enableZoom={false}
          autoRotate
          autoRotateSpeed={1}
          maxPolarAngle={Math.PI / 2}
          minPolarAngle={Math.PI / 4}
        />
      </Canvas>
    </div>
  );
}
