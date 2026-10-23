import { Canvas } from "@react-three/fiber";
import { OrbitControls, ContactShadows, Float } from "@react-three/drei";
import { Sprout, ThermometerSun, Droplets } from "lucide-react";

// Satu gerombolan daun kecil (bentuk pipih saling overlap rimbun)
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

  const leafColor = isDry ? "#c9a227" : "#3f9142";
  const leafColorAlt = isDry ? "#a97d2a" : "#5cb85c";
  const soilColor = isDry ? "#4a3020" : "#2d1a11";
  const plantScale = isDry ? 0.85 : 1.05;

  return (
    // 5.1 Card Wrapper
    <div className="w-full h-full min-h-[420px] bg-white dark:bg-slate-900/65 dark:backdrop-blur-xl border border-slate-200/80 dark:border-white/[0.08] hover:border-emerald-500/30 shadow-sm dark:shadow-[0_20px_50px_rgba(0,0,0,0.5)] rounded-2xl flex flex-col justify-between overflow-hidden relative transition-all duration-300">
      {/* 5.1 Top Header Bar & Status Pill */}
      <div className="flex items-center justify-between px-5 pt-5 pb-2 z-10 relative">
        <div className="flex items-center gap-2.5">
          <div className="p-2 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-600 dark:text-emerald-400">
            <Sprout size={18} />
          </div>
          <div>
            <h3 className="font-bold text-sm md:text-base text-slate-800 dark:text-slate-100 tracking-tight">
              Visualisasi 3D
            </h3>
            <p className="text-[11px] text-slate-400 dark:text-slate-500 font-medium">
              Model Tanaman Digital
            </p>
          </div>
        </div>

        <span
          className={`px-3 py-1 rounded-full text-xs font-bold border transition-colors ${
            isDry
              ? "bg-amber-500/10 border-amber-500/20 text-amber-600 dark:text-amber-400"
              : "bg-emerald-500/10 border-emerald-500/20 text-emerald-600 dark:text-emerald-400"
          }`}
        >
          {isDry ? "Tanaman butuh air!" : "Tanaman tumbuh subur!"}
        </span>
      </div>

      {/* 5.3 Kanvas Objek 3D */}
      <div className="relative flex-1 w-full min-h-[220px]">
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

              {/* Cabang-cabang dengan gerombolan daun */}
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

      {/* 5.2 Bottom Status Bar */}
      <div className="mx-5 mb-5 p-2.5 rounded-xl bg-slate-50 dark:bg-slate-950/80 border border-slate-200/80 dark:border-white/10 flex items-center justify-center gap-2 text-xs font-semibold z-10 relative">
        {isDry ? (
          <ThermometerSun size={15} className="text-amber-500 shrink-0" />
        ) : (
          <Droplets size={15} className="text-emerald-500 shrink-0" />
        )}
        <span className="text-slate-600 dark:text-slate-400">Status:</span>
        <span
          className={
            isDry
              ? "text-amber-600 dark:text-amber-400 font-bold"
              : "text-emerald-600 dark:text-emerald-400 font-bold"
          }
        >
          {isDry ? "Defisit Air" : "Terhidrasi Optimal"}
        </span>
      </div>
    </div>
  );
}

