// A1 night depot: the fleet as 3D trucks parked in their bays (US-01, FR-01–FR-03).
// Models: Kenney Car Kit (CC0, www.kenney.nl), served locally from /public/models — no network (NFR-09).
// Colours come from the CSS tokens at runtime, so the 3D scene follows design.md like the rest of the app.
import { Grid, OrbitControls, useGLTF } from '@react-three/drei';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import { Bloom, EffectComposer, Vignette } from '@react-three/postprocessing';
import { Suspense, useEffect, useMemo, useRef, useState, type RefObject } from 'react';
import * as THREE from 'three';
import type { OrbitControls as OrbitControlsImpl } from 'three-stdlib';
import type { Truck } from '../types/domain';

const BASE = import.meta.env.BASE_URL;
const MODEL = {
  heavyEv: `${BASE}models/garbage-truck.glb`,
  mediumEv: `${BASE}models/delivery.glb`,
  heavyDiesel: `${BASE}models/delivery-flat.glb`,
  mediumDiesel: `${BASE}models/delivery-flat.glb`,
};
Object.values(MODEL).forEach((m) => useGLTF.preload(m, false));

function token(name: string): string {
  return getComputedStyle(document.documentElement).getPropertyValue(name).trim();
}
function useTokens() {
  return useMemo(() => ({
    bg: token('--color-bg'),
    surface: token('--color-surface'),
    raised: token('--color-surface-raised'),
    border: token('--color-border'),
    strong: token('--color-border-strong'),
    neon: token('--color-charge'),
    warning: token('--color-warning'),
    text: token('--color-text'),
  }), []);
}

const SPACING = 2.75;
const YAW = 0.42;
export function bayPosition(index: number, count: number): [number, number, number] {
  const x = (index - (count - 1) / 2) * SPACING;
  return [x, 0, -x * x * 0.06]; // shallow arc, like bays around a yard
}

const reducedMotion = typeof window !== 'undefined' && window.matchMedia?.('(prefers-reduced-motion: reduce)').matches;

function TruckModel({ truck, index, count, selected, onSelect, colors }: {
  truck: Truck; index: number; count: number; selected: boolean;
  onSelect: (id: string) => void; colors: ReturnType<typeof useTokens>;
}) {
  const ev = truck.powertrain === 'electric';
  const url = truck.weightClass === 'heavy' ? (ev ? MODEL.heavyEv : MODEL.heavyDiesel) : (ev ? MODEL.mediumEv : MODEL.mediumDiesel);
  const { scene } = useGLTF(url, false);
  const [hover, setHover] = useState(false);
  const pos = bayPosition(index, count);

  // Own copy of the model with night-depot materials and neon outlines.
  const { object, wheels, edgeMat } = useMemo(() => {
    const obj = scene.clone(true);
    const body = new THREE.MeshStandardMaterial({ color: colors.raised, metalness: 0.55, roughness: 0.38 });
    const tyre = new THREE.MeshStandardMaterial({ color: colors.bg, metalness: 0.2, roughness: 0.8 });
    const edge = new THREE.LineBasicMaterial({ color: ev ? colors.neon : colors.strong, toneMapped: false, transparent: true, opacity: ev ? 0.9 : 0.7 });
    const wheelNodes: THREE.Object3D[] = [];
    obj.traverse((o) => {
      if (o.name.startsWith('wheel')) wheelNodes.push(o);
      if ((o as THREE.Mesh).isMesh) {
        const mesh = o as THREE.Mesh;
        const isWheel = mesh.name.startsWith('wheel') || mesh.parent?.name.startsWith('wheel');
        mesh.material = isWheel ? tyre : body;
        mesh.castShadow = true;
        mesh.add(new THREE.LineSegments(new THREE.EdgesGeometry(mesh.geometry, 28), edge));
      }
    });
    // normalise size: heavy trucks 3.3 long, medium 2.6
    const box = new THREE.Box3().setFromObject(obj);
    const size = box.getSize(new THREE.Vector3());
    const s = (truck.weightClass === 'heavy' ? 3.3 : 2.6) / Math.max(size.x, size.z);
    obj.scale.setScalar(s);
    const box2 = new THREE.Box3().setFromObject(obj);
    obj.position.y = -box2.min.y;
    return { object: obj, wheels: wheelNodes, edgeMat: edge };
  }, [scene, colors, ev, truck.weightClass]);

  const ring = useRef<THREE.Mesh>(null);
  useFrame((state, dt) => {
    const lit = selected || hover;
    edgeMat.opacity = THREE.MathUtils.lerp(edgeMat.opacity, lit ? 1 : ev ? 0.75 : 0.55, 0.15);
    edgeMat.color.set(ev ? colors.neon : lit ? colors.text : colors.strong);
    if (lit && ev) edgeMat.color.multiplyScalar(1.6); // pushes past the bloom threshold
    if (selected && !reducedMotion) wheels.forEach((w) => { w.rotation.x += dt * 5; });
    if (ring.current) {
      const pulse = selected ? 1 + Math.sin(state.clock.elapsedTime * 3) * (reducedMotion ? 0 : 0.04) : 0.001;
      ring.current.scale.setScalar(pulse);
    }
  });

  return (
    <group position={pos}>
      {/* bay markings: neon for e-truck bays with a charger, grey for diesel */}
      <mesh rotation-x={-Math.PI / 2} position={[-1.375, 0.005, 0]}>
        <planeGeometry args={[0.05, 4]} />
        <meshBasicMaterial color={ev ? colors.neon : colors.strong} toneMapped={false} transparent opacity={ev ? 0.55 : 0.35} />
      </mesh>
      {index === count - 1 && (
        <mesh rotation-x={-Math.PI / 2} position={[1.375, 0.005, 0]}>
          <planeGeometry args={[0.05, 4]} />
          <meshBasicMaterial color={colors.strong} toneMapped={false} transparent opacity={0.35} />
        </mesh>
      )}
      {ev && (
        <group position={[-1.05, 0, -1.7]}>
          <mesh position={[0, 0.7, 0]} castShadow>
            <boxGeometry args={[0.32, 1.4, 0.24]} />
            <meshStandardMaterial color={colors.surface} metalness={0.4} roughness={0.5} />
          </mesh>
          <mesh position={[0, 0.95, 0.125]}>
            <planeGeometry args={[0.16, 0.5]} />
            <meshBasicMaterial color={colors.neon} toneMapped={false} />
          </mesh>
        </group>
      )}
      <mesh ref={ring} rotation-x={-Math.PI / 2} position={[0, 0.01, 0]}>
        <ringGeometry args={[1.75, 1.85, 64]} />
        <meshBasicMaterial color={ev ? colors.neon : colors.text} toneMapped={false} transparent opacity={0.9} />
      </mesh>
      <group
        rotation-y={YAW}
        onClick={(e) => { e.stopPropagation(); onSelect(truck.id); }}
        onPointerOver={(e) => { e.stopPropagation(); setHover(true); document.body.style.cursor = 'pointer'; }}
        onPointerOut={() => { setHover(false); document.body.style.cursor = ''; }}
      >
        <primitive object={object} />
      </group>
    </group>
  );
}

// Projects each truck's label point to screen space every frame and moves the DOM tags (no drei Html needed).
function TagProjector({ trucks, tags }: { trucks: Truck[]; tags: RefObject<(HTMLButtonElement | null)[]> }) {
  const { camera, size } = useThree();
  const v = useMemo(() => new THREE.Vector3(), []);
  useFrame(() => {
    trucks.forEach((t, i) => {
      const el = tags.current[i];
      if (!el) return;
      const [x, , z] = bayPosition(i, trucks.length);
      v.set(x, t.weightClass === 'heavy' ? 2.6 : 2.2, z).project(camera);
      const visible = v.z < 1 && Math.abs(v.x) < 1.05 && Math.abs(v.y) < 1.05;
      el.style.opacity = visible ? '1' : '0';
      el.style.transform = `translate(-50%, -50%) translate(${((v.x + 1) / 2) * size.width}px, ${((1 - v.y) / 2) * size.height}px)`;
    });
  });
  return null;
}

const HOME_TARGET = new THREE.Vector3(0, 0.9, -1.6);
const HOME_CAM = new THREE.Vector3(0, 3.1, 14.2);

function CameraRig({ focus }: { focus: [number, number, number] | null }) {
  const { camera, controls } = useThree();
  const flying = useRef(true);
  const goal = useMemo(() => {
    if (!focus) return { target: HOME_TARGET, cam: HOME_CAM };
    const t = new THREE.Vector3(focus[0], 0.9, focus[2]);
    return { target: t, cam: new THREE.Vector3(focus[0] + 2.8, 2.7, focus[2] + 5.4) };
  }, [focus]);

  useEffect(() => { flying.current = true; }, [goal]);
  useEffect(() => {
    const c = controls as unknown as OrbitControlsImpl | null;
    if (!c) return;
    const stop = () => { flying.current = false; };
    c.addEventListener('start', stop);
    return () => c.removeEventListener('start', stop);
  }, [controls]);

  useFrame(() => {
    const c = controls as unknown as OrbitControlsImpl | null;
    if (!c || !flying.current) return;
    const k = reducedMotion ? 1 : 0.06;
    camera.position.lerp(goal.cam, k);
    c.target.lerp(goal.target, k);
    c.update();
    if (camera.position.distanceTo(goal.cam) < 0.01) flying.current = false;
  });
  return null;
}

export default function DepotYard3D({ trucks, selectedId, onSelect }: {
  trucks: Truck[]; selectedId: string | null; onSelect: (id: string | null) => void;
}) {
  const colors = useTokens();
  const index = trucks.findIndex((t) => t.id === selectedId);
  const focus = index >= 0 ? bayPosition(index, trucks.length) : null;

  const tags = useRef<(HTMLButtonElement | null)[]>([]);

  return (
    <div className="yard-canvas">
    <Canvas
      shadows
      dpr={[1, 2]}
      camera={{ position: HOME_CAM.toArray(), fov: 40, near: 0.1, far: 120 }}
      onPointerMissed={() => onSelect(null)}
      gl={{ antialias: true }}
    >
      <color attach="background" args={[colors.bg]} />
      <fog attach="fog" args={[colors.bg, 16, 34]} />
      <ambientLight intensity={0.25} />
      <hemisphereLight args={[colors.text, colors.bg, 0.35]} />
      <directionalLight position={[6, 12, 8]} intensity={1.6} castShadow shadow-mapSize={[1024, 1024]}>
        <orthographicCamera attach="shadow-camera" args={[-14, 14, 8, -8, 0.1, 40]} />
      </directionalLight>
      <directionalLight position={[-8, 4, -6]} intensity={1.2} color={colors.neon} />
      <pointLight position={[0, 5, 4]} intensity={18} distance={20} color={colors.text} />

      <mesh rotation-x={-Math.PI / 2} receiveShadow>
        <planeGeometry args={[80, 80]} />
        <meshStandardMaterial color={colors.bg} metalness={0.6} roughness={0.55} />
      </mesh>
      <Grid
        position={[0, 0.002, 0]}
        args={[80, 80]}
        cellSize={0.5}
        cellThickness={0.5}
        cellColor={colors.border}
        sectionSize={2.75}
        sectionThickness={1}
        sectionColor={colors.raised}
        fadeDistance={34}
        fadeStrength={1.5}
        infiniteGrid
      />

      <Suspense fallback={null}>
      {trucks.map((t, i) => (
        <TruckModel
          key={t.id}
          truck={t}
          index={i}
          count={trucks.length}
          selected={t.id === selectedId}
          onSelect={onSelect}
          colors={colors}
        />
      ))}
      </Suspense>

      <TagProjector trucks={trucks} tags={tags} />

      <OrbitControls
        makeDefault
        enablePan={false}
        minDistance={5}
        maxDistance={26}
        minPolarAngle={0.35}
        maxPolarAngle={1.38}
        enableDamping
      />
      <CameraRig focus={focus} />
      <EffectComposer multisampling={4}>
        <Bloom mipmapBlur intensity={1.1} luminanceThreshold={0.55} luminanceSmoothing={0.2} />
        <Vignette eskil={false} offset={0.25} darkness={0.75} />
      </EffectComposer>
    </Canvas>
    {trucks.map((t, i) => {
      const ev = t.powertrain === 'electric';
      return (
        <button
          key={t.id}
          ref={(el) => { tags.current[i] = el; }}
          type="button"
          tabIndex={-1}
          aria-hidden="true"
          className={`yard-tag${t.id === selectedId ? ' on' : ''}${ev ? ' ev' : ''}`}
          onClick={() => onSelect(t.id)}
        >
          <b>{t.id}</b>
          <span>{t.status === 'maintenance' ? 'workshop' : ev ? `${t.socPercent}%` : 'diesel'}</span>
        </button>
      );
    })}
    </div>
  );
}
