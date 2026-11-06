"use client";
import { useMemo, useRef } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import * as THREE from "three";

// A living network: nodes on a sphere, edges to near neighbours, packets racing along edges.
// Primary = packets, secondary = edge shimmer, ambient = slow rotation + drifting dust.
const ACID = new THREE.Color("#c8ff2e");

// Seeded PRNG so the network layout is pure and identical on every render.
function rng(seed: number) {
  return () => {
    seed |= 0; seed = (seed + 0x6d2b79f5) | 0;
    let t = Math.imul(seed ^ (seed >>> 15), 1 | seed);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

function dotTexture() {
  const c = document.createElement("canvas"); c.width = c.height = 64;
  const g = c.getContext("2d")!;
  const grd = g.createRadialGradient(32, 32, 0, 32, 32, 32);
  grd.addColorStop(0, "rgba(255,255,255,1)"); grd.addColorStop(0.25, "rgba(255,255,255,0.8)"); grd.addColorStop(1, "rgba(255,255,255,0)");
  g.fillStyle = grd; g.fillRect(0, 0, 64, 64);
  return new THREE.CanvasTexture(c);
}

function Network({ count, scrollRef, mouse }: { count: number; scrollRef: React.RefObject<number>; mouse: React.RefObject<{ x: number; y: number }> }) {
  const group = useRef<THREE.Group>(null);
  const packetsRef = useRef<THREE.Points>(null);
  const nodesRef = useRef<THREE.Points>(null);
  const tex = useMemo(() => dotTexture(), []);

  const { nodes, nodeGeo, edgeGeo, edges } = useMemo(() => {
    const rand = rng(count);
    const pts: THREE.Vector3[] = [];
    const golden = Math.PI * (3 - Math.sqrt(5));
    for (let i = 0; i < count; i++) {
      const y = 1 - (i / (count - 1)) * 2;
      const r = Math.sqrt(1 - y * y);
      const th = golden * i;
      const jitter = 1 + (rand() - 0.5) * 0.18;
      pts.push(new THREE.Vector3(Math.cos(th) * r * 2.2 * jitter, y * 2.2 * jitter, Math.sin(th) * r * 2.2 * jitter));
    }
    const pos = new Float32Array(count * 3);
    pts.forEach((p, i) => p.toArray(pos, i * 3));
    const nodeGeo = new THREE.BufferGeometry();
    nodeGeo.setAttribute("position", new THREE.BufferAttribute(pos, 3));
    nodeGeo.setAttribute("basePos", new THREE.BufferAttribute(pos.slice(), 3));

    const edges: [number, number][] = [];
    for (let i = 0; i < count; i++) {
      let linked = 0;
      for (let j = i + 1; j < count && linked < 3; j++) {
        if (pts[i].distanceTo(pts[j]) < 0.42 && rand() < 0.7) { edges.push([i, j]); linked++; }
      }
    }
    const epos = new Float32Array(edges.length * 6);
    edges.forEach(([a, b], k) => { pts[a].toArray(epos, k * 6); pts[b].toArray(epos, k * 6 + 3); });
    const edgeGeo = new THREE.BufferGeometry();
    edgeGeo.setAttribute("position", new THREE.BufferAttribute(epos, 3));
    return { nodes: pts, nodeGeo, edgeGeo, edges };
  }, [count]);

  const P = Math.min(160, edges.length);
  const packetGeo = useMemo(() => {
    const geo = new THREE.BufferGeometry();
    geo.setAttribute("position", new THREE.BufferAttribute(new Float32Array(P * 3), 3));
    return geo;
  }, [P]);
  // per packet motion state lives in a ref: it changes every frame, never during render
  const packetState = useRef<{ e: number; t: number; s: number }[] | null>(null);

  const tmpRef = useRef(new THREE.Vector3());
  useFrame((_, dt) => {
    const g = group.current; if (!g) return;
    const s = scrollRef.current ?? 0;
    const m = mouse.current ?? { x: 0, y: 0 };
    // ambient spin + mouse tilt with lag (follow through)
    g.rotation.y += dt * (0.06 + s * 0.4);
    g.rotation.x += ((m.y * 0.35) - g.rotation.x) * 0.04;
    g.rotation.z += ((m.x * -0.15) - g.rotation.z) * 0.04;
    const scale = 1 + s * 1.4;
    g.scale.setScalar(scale);
    g.position.y = s * 1.2;

    // packets travel along edges, then hop to a random edge
    if (!packetState.current) {
      const r = rng(7);
      packetState.current = Array.from({ length: P }, () => ({ e: Math.floor(r() * edges.length), t: r(), s: 0.4 + r() * 1.1 }));
    }
    const pg = packetsRef.current?.geometry; if (!pg) return;
    const tmp = tmpRef.current;
    const arr = pg.attributes.position.array as Float32Array;
    packetState.current.forEach((p, i) => {
      p.t += dt * p.s;
      if (p.t >= 1) { p.t = 0; p.e = Math.floor(Math.random() * edges.length); }
      const [a, b] = edges[p.e];
      tmp.copy(nodes[a]).lerp(nodes[b], p.t);
      tmp.toArray(arr, i * 3);
    });
    pg.attributes.position.needsUpdate = true;
    if (nodesRef.current) (nodesRef.current.material as THREE.PointsMaterial).opacity = 0.55 - s * 0.3;
  });

  return (
    <group ref={group}>
      <points ref={nodesRef} geometry={nodeGeo}>
        <pointsMaterial map={tex} size={0.05} transparent opacity={0.55} depthWrite={false} color="#f2f2ee" blending={THREE.AdditiveBlending} sizeAttenuation />
      </points>
      <lineSegments geometry={edgeGeo}>
        <lineBasicMaterial color={ACID} transparent opacity={0.12} blending={THREE.AdditiveBlending} depthWrite={false} />
      </lineSegments>
      <points ref={packetsRef} geometry={packetGeo}>
        <pointsMaterial map={tex} size={0.11} transparent depthWrite={false} color={ACID} blending={THREE.AdditiveBlending} sizeAttenuation />
      </points>
    </group>
  );
}

function Dust() {
  const ref = useRef<THREE.Points>(null);
  const geo = useMemo(() => {
    const n = 500, a = new Float32Array(n * 3), r = rng(42);
    for (let i = 0; i < n * 3; i++) a[i] = (r() - 0.5) * 18;
    const g = new THREE.BufferGeometry(); g.setAttribute("position", new THREE.BufferAttribute(a, 3)); return g;
  }, []);
  useFrame((_, dt) => { if (ref.current) ref.current.rotation.y -= dt * 0.015; }); // counter motion, slower
  return <points ref={ref} geometry={geo}><pointsMaterial size={0.015} color="#8a8a8a" transparent opacity={0.6} depthWrite={false} /></points>;
}

export default function HeroScene({ scrollRef, mouse }: { scrollRef: React.RefObject<number>; mouse: React.RefObject<{ x: number; y: number }> }) {
  const mobile = typeof window !== "undefined" && window.innerWidth < 768;
  return (
    <Canvas camera={{ position: [0, 0, 6.2], fov: 50 }} dpr={[1, 1.75]} gl={{ antialias: true, alpha: true, powerPreference: "high-performance" }}>
      <Network count={mobile ? 520 : 1100} scrollRef={scrollRef} mouse={mouse} />
      <Dust />
    </Canvas>
  );
}
