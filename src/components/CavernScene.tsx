"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import * as THREE from "three";
import type { StageCard } from "@/data/portfolio";

type Props = {
  left: StageCard[];
  right: StageCard[];
  turn: { x: number; y: number };
  moving: boolean;
  direction: "forward" | "backward";
  chamber: number;
  stage: number;
};

type Exhibit = {
  group: THREE.Group;
  materials: THREE.Material[];
  targetZ: number;
  side: "left" | "right";
};

function wrapText(ctx: CanvasRenderingContext2D, text: string, x: number, y: number, maxWidth: number, lineHeight: number, maxLines: number) {
  const paragraphs = (text || "").split("\n");
  let lineCount = 0;
  for (const paragraph of paragraphs) {
    const words = paragraph.split(/\s+/).filter(Boolean);
    let line = "";
    for (const word of words) {
      const test = line ? `${line} ${word}` : word;
      if (ctx.measureText(test).width > maxWidth && line) {
        ctx.fillText(line, x, y);
        y += lineHeight;
        lineCount++;
        line = word;
        if (lineCount >= maxLines) return;
      } else {
        line = test;
      }
    }
    if (line && lineCount < maxLines) {
      ctx.fillText(line, x, y);
      y += lineHeight;
      lineCount++;
    }
    if (lineCount >= maxLines) return;
  }
}

function makeExhibitTexture(card: StageCard, index: number) {
  const canvas = document.createElement("canvas");
  canvas.width = 1200;
  canvas.height = 700;
  const ctx = canvas.getContext("2d")!;
  const bg = ctx.createLinearGradient(0, 0, 1200, 700);
  bg.addColorStop(0, "rgba(54,39,17,.96)");
  bg.addColorStop(.58, "rgba(23,18,11,.96)");
  bg.addColorStop(1, "rgba(12,11,8,.97)");
  ctx.fillStyle = bg;
  ctx.fillRect(0, 0, 1200, 700);

  const glow = ctx.createRadialGradient(850, 100, 10, 850, 100, 700);
  glow.addColorStop(0, "rgba(238,190,93,.22)");
  glow.addColorStop(1, "rgba(94,206,242,0)");
  ctx.fillStyle = glow;
  ctx.fillRect(0, 0, 1200, 700);

  ctx.strokeStyle = "rgba(231,190,111,.95)";
  ctx.lineWidth = 3;
  ctx.strokeRect(8, 8, 1184, 684);
  ctx.strokeStyle = "rgba(231,190,111,.32)";
  ctx.lineWidth = 1;
  ctx.strokeRect(24, 24, 1152, 652);

  ctx.save();
  ctx.beginPath();
  ctx.rect(28, 28, 1144, 644);
  ctx.clip();
  ctx.strokeStyle = "rgba(231,190,111,.065)";
  ctx.lineWidth = 2;
  for (let y = 38; y < 680; y += 13) {
    ctx.beginPath();
    ctx.moveTo(30, y);
    ctx.lineTo(1170, y);
    ctx.stroke();
  }
  ctx.restore();

  ctx.fillStyle = "#f1d18c";
  ctx.font = "600 20px monospace";
  ctx.letterSpacing = "5px";
  ctx.fillText((card.eyebrow || "FIELD EXHIBIT").toUpperCase().slice(0, 54), 66, 92);

  if (card.kind === "image") {
    ctx.strokeStyle = "rgba(231,190,111,.58)";
    ctx.setLineDash([10, 9]);
    ctx.strokeRect(66, 125, 1068, 300);
    ctx.setLineDash([]);
    ctx.strokeStyle = "rgba(231,190,111,.92)";
    ctx.lineWidth = 5;
    ctx.strokeRect(560, 220, 80, 75);
    ctx.beginPath();
    ctx.arc(620, 242, 10, 0, Math.PI * 2);
    ctx.stroke();
    ctx.beginPath();
    ctx.moveTo(570, 282);
    ctx.lineTo(595, 258);
    ctx.lineTo(615, 275);
    ctx.lineTo(632, 256);
    ctx.lineTo(650, 282);
    ctx.stroke();
    ctx.fillStyle = "#f1d18c";
    ctx.font = "600 22px monospace";
    ctx.textAlign = "center";
    ctx.fillText(card.src ? "IMAGE ATTACHED" : "ADD IMAGE", 600, 345);
    ctx.textAlign = "left";
    ctx.fillStyle = "#fff1d2";
    ctx.font = "italic 43px Georgia";
    wrapText(ctx, card.title || "Visual evidence", 66, 510, 1060, 58, 2);
    ctx.fillStyle = "#e7d8b7";
    ctx.font = "23px Arial";
    wrapText(ctx, card.caption || "Add your own evidence in the portfolio data file.", 66, 565, 1050, 36, 2);
  } else {
    ctx.fillStyle = "#fff0cf";
    ctx.font = "56px Georgia";
    wrapText(ctx, card.title || "Untitled exhibit", 66, 205, 1060, 65, 2);
    ctx.fillStyle = "#eadfc9";
    ctx.font = "29px Arial";
    wrapText(ctx, card.body || (card.kind === "document" ? "ADD DOCUMENT" : card.kind === "video" ? "ADD VIDEO" : "Add your content in src/data/portfolio.ts."), 68, 340, 1050, 43, 7);
    if (card.kind === "document" || card.kind === "video") {
      ctx.strokeStyle = "rgba(231,190,111,.72)";
      ctx.lineWidth = 4;
      ctx.strokeRect(1010, 560, 95, 72);
      ctx.fillStyle = "#f1d18c";
      ctx.font = "16px monospace";
      ctx.fillText(card.kind === "document" ? "PDF" : "PLAY", 1027, 602);
    }
  }

  ctx.fillStyle = "rgba(241,209,140,.9)";
  ctx.font = "18px monospace";
  ctx.fillText(String(index + 1).padStart(2, "0"), 1100, 650);
  const texture = new THREE.CanvasTexture(canvas);
  texture.colorSpace = THREE.SRGBColorSpace;
  texture.anisotropy = 4;
  if (card.kind === "image" && card.src) {
    const image = new Image();
    image.onload = () => {
      const boxX = 66, boxY = 125, boxW = 1068, boxH = 300;
      const scale = Math.min(boxW / image.naturalWidth, boxH / image.naturalHeight);
      const drawW = image.naturalWidth * scale;
      const drawH = image.naturalHeight * scale;
      const drawX = boxX + (boxW - drawW) / 2;
      const drawY = boxY + (boxH - drawH) / 2;
      ctx.fillStyle = "rgba(0,5,10,.85)";
      ctx.fillRect(boxX, boxY, boxW, boxH);
      ctx.drawImage(image, drawX, drawY, drawW, drawH);
      ctx.strokeStyle = "rgba(241,209,140,.95)";
      ctx.lineWidth = 3;
      ctx.strokeRect(boxX, boxY, boxW, boxH);
      texture.needsUpdate = true;
    };
    image.src = card.src;
  }
  return texture;
}



function makeCard(card: StageCard, index: number, side: "left" | "right", far = false): Exhibit {
  const group = new THREE.Group();
  const texture = makeExhibitTexture(card, index);
  const material = new THREE.MeshBasicMaterial({ map: texture, transparent: true, opacity: far ? .14 : 1, side: THREE.DoubleSide, depthWrite: false, toneMapped: false });
  const compact = window.innerWidth < 700;
  const tablet = window.innerWidth >= 700 && window.innerWidth < 1100;
  const width = far ? 4.2 : compact ? 8.2 : tablet ? 11.8 : 14.2;
  const height = far ? 2.45 : compact ? 4.4 : tablet ? 5.7 : 6.8;
  const mesh = new THREE.Mesh(new THREE.PlaneGeometry(width, height), material);
  group.add(mesh);
  const edge = new THREE.LineSegments(new THREE.EdgesGeometry(new THREE.PlaneGeometry(width + .06, height + .06)), new THREE.LineBasicMaterial({ color: 0xe7c27e, transparent: true, opacity: far ? .18 : .82 }));
  edge.position.z = .018;
  group.add(edge);
  const sideSign = side === "left" ? -1 : 1;
  const wallAngle = THREE.MathUtils.degToRad(42);
  const depth = far ? 34 + index * 8 : 14 + index * 8.5;
  const x = Math.tan(wallAngle) * depth * sideSign;
  const yaw = side === "left" ? wallAngle : -wallAngle;
  group.rotation.y = yaw;
  group.rotation.z = (index % 2 === 0 ? 1 : -1) * (side === "left" ? 1 : -1) * .018;
  group.position.set(x, far ? 2.4 + (index % 2) * .8 : 1.25 + (index % 2) * .35, -depth);
  group.scale.setScalar(far ? .78 : 1);
  return { group, materials: [material, edge.material], targetZ: group.position.z, side };
}

export default function CavernScene({ left, right, turn, moving, direction, chamber, stage }: Props) {
  const host = useRef<HTMLDivElement>(null);
  const [zoom,setZoom] = useState(50);
  const zoomRef = useRef(50);
  useEffect(()=>{zoomRef.current=zoom;const camera=state.current.camera;if(camera){camera.fov=90-zoom*.32;camera.updateProjectionMatrix();}},[zoom]);
  const state = useRef({
    camera: null as THREE.PerspectiveCamera | null,
    renderer: null as THREE.WebGLRenderer | null,
    scene: null as THREE.Scene | null,
    yaw: 0,
    pitch: 0,
    targetZ: 0,
    exhibits: [] as Exhibit[],
    dust: null as THREE.Points | null,
    destination: null as THREE.PointLight | null,
    mounted: false,
    lastTime: 0,
    cameraZ: 0,
    targetYaw: 0,
    targetPitch: 0,
    moving: false,
    travelStarted: 0,
    travelDuration: 1450,
    travelDirection: "forward" as "forward" | "backward",
  });

  const cards = useMemo(() => ({ left, right }), [left, right]);

  useEffect(() => {
    const root=host.current;
    if(!root)return;
    const onWheel=(event:WheelEvent)=>{
      event.preventDefault();
      setZoom(value=>Math.max(0,Math.min(100,value+(event.deltaY<0?5:-5))));
    };
    root.addEventListener("wheel",onWheel,{passive:false});
    return ()=>root.removeEventListener("wheel",onWheel);
  },[]);

  useEffect(() => {
    if (!host.current) return;
    const root = host.current;
    const scene = new THREE.Scene();
    scene.background = new THREE.Color(0x02060b);
    const camera = new THREE.PerspectiveCamera(74, root.clientWidth / Math.max(1, root.clientHeight), .1, 180);
    camera.position.set(0, .45, 0);
    camera.rotation.order = "YXZ";

    let renderer: THREE.WebGLRenderer;
    try {
      renderer = new THREE.WebGLRenderer({ antialias: true, alpha: false, powerPreference: "high-performance" });
    } catch {
      root.dataset.webgl = "unavailable";
      return;
    }
    renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 1.65));
    renderer.setSize(root.clientWidth, root.clientHeight);
    renderer.outputColorSpace = THREE.SRGBColorSpace;
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.08;
    renderer.domElement.className = "cavern-webgl";
    root.appendChild(renderer.domElement);

    const textureLoader = new THREE.TextureLoader();
    textureLoader.load("/assets/chambers/chamber-01.jpg", texture => {
      texture.colorSpace = THREE.SRGBColorSpace;
      texture.anisotropy = renderer.capabilities.getMaxAnisotropy();
      const geometry = new THREE.SphereGeometry(180, 144, 96);
      const material = new THREE.MeshBasicMaterial({
        map: texture,
        side: THREE.BackSide,
        toneMapped: false,
      });
      const cave = new THREE.Mesh(geometry, material);
      // Each activity uses its own cave panorama, progressing toward the daylight exit.
      cave.name = "cave-background";
      cave.rotation.y = Math.PI / 2;
      scene.add(cave);
      scene.userData.caveBackground = cave;
      const desired = Number(scene.userData.desiredChamber ?? 0);
      if (desired > 0) {
        textureLoader.load(`/assets/chambers/chamber-${String(desired + 1).padStart(2, "0")}.jpg`, nextTexture => {
          nextTexture.colorSpace = THREE.SRGBColorSpace;
          material.map?.dispose();
          material.map = nextTexture;
          material.needsUpdate = true;
        });
      }
    }, undefined, () => {
      root.dataset.webgl = "unavailable";
    });

    const ambient = new THREE.AmbientLight(0xb8d9eb, .5);
    scene.add(ambient);
    const destination = new THREE.PointLight(0x65baff, 3.2, 42, 2);
    destination.position.set(0, 2.2, -27);
    scene.add(destination);

    const dustCount = 240;
    const positions = new Float32Array(dustCount * 3);
    for (let i = 0; i < dustCount; i++) {
      positions[i * 3] = (Math.random() - .5) * 28;
      positions[i * 3 + 1] = (Math.random() - .5) * 13;
      positions[i * 3 + 2] = -Math.random() * 34;
    }
    const dustGeometry = new THREE.BufferGeometry();
    dustGeometry.setAttribute("position", new THREE.BufferAttribute(positions, 3));
    const dustMaterial = new THREE.PointsMaterial({ color: 0x9eddf7, size: .035, transparent: true, opacity: .42, depthWrite: false });
    const dust = new THREE.Points(dustGeometry, dustMaterial);
    scene.add(dust);


    state.current.camera = camera;
    state.current.renderer = renderer;
    state.current.scene = scene;
    state.current.dust = dust;
    state.current.destination = destination;

    const resize = () => {
      const width = Math.max(1, root.clientWidth);
      const height = Math.max(1, root.clientHeight);
      camera.aspect = width / height;
      camera.updateProjectionMatrix();
      renderer.setSize(width, height);
      renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 1.65));
    };
    const observer = new ResizeObserver(resize);
    observer.observe(root);

    let raf = 0;
    const clock = new THREE.Clock();
    const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const animate = () => {
      raf = requestAnimationFrame(animate);
      const delta = Math.min(clock.getDelta(), .04);
      const elapsed = clock.elapsedTime;
      const s = state.current;
      if (s.camera) {
        s.yaw += (s.targetYaw - s.yaw) * Math.min(1, delta * 7);
        s.pitch += (s.targetPitch - s.pitch) * Math.min(1, delta * 7);
        // Keep the cave panorama fixed. A short eased body-lunge, soft footfall bob
        // and tiny lateral sway create a running sensation without scaling the whole UI.
        s.camera.rotation.y = s.yaw;
        s.camera.rotation.x = s.pitch;
        const travelElapsed = s.moving ? Math.max(0, Math.min(1, (performance.now() - s.travelStarted) / s.travelDuration)) : 1;
        const travelEnvelope = s.moving ? Math.sin(Math.PI * travelElapsed) : 0;
        const travelSign = s.travelDirection === "forward" ? -1 : 1;
        const bob = reducedMotion ? 0 : s.moving
          ? Math.sin(elapsed * 15.5) * .012 * travelEnvelope
          : Math.sin(elapsed * 1.7) * .004;
        const sway = reducedMotion || !s.moving ? 0 : Math.sin(elapsed * 8.2) * .006 * travelEnvelope;
        const lunge = reducedMotion ? 0 : travelSign * .22 * travelEnvelope;
        s.camera.position.set(sway, .45 + bob, lunge);
        s.camera.fov = (90 - zoomRef.current * .5) - (reducedMotion ? 0 : 1.15 * travelEnvelope);
        s.camera.updateProjectionMatrix();
      }
      if (s.dust) {
        s.dust.rotation.y = Math.sin(elapsed * .08) * .025;
        s.dust.position.z = s.cameraZ - 10;
      }
      destination.position.z = s.cameraZ - 27;
      destination.intensity = 2.8 + Math.sin(elapsed * 1.3) * .35;
      scene.children.forEach(object => {
        if (object instanceof THREE.Group && object.userData.queueHologram) {
          const pulse = 0.92 + Math.sin(elapsed * 0.8 + object.position.z * 0.035) * 0.08;
          object.scale.setScalar(Math.max(0.38, (1 - Math.abs(object.position.z) / 170)) * pulse);
        }
      });
      renderer.render(scene, camera);
    };
    animate();

    return () => {
      cancelAnimationFrame(raf);
      observer.disconnect();
      scene.traverse(object => {
        if (object instanceof THREE.Mesh || object instanceof THREE.Points || object instanceof THREE.LineSegments) {
          object.geometry.dispose();
          const mat = (object as THREE.Mesh).material;
          if (Array.isArray(mat)) mat.forEach(m => m.dispose());
          else if (mat) mat.dispose();
        }
      });
      renderer.dispose();
      renderer.domElement.remove();
      state.current = { camera: null, renderer: null, scene: null, yaw: 0, pitch: 0, targetZ: 0, exhibits: [], dust: null, destination: null, mounted: false, lastTime: 0, cameraZ: 0, targetYaw: 0, targetPitch: 0, moving: false, travelStarted: 0, travelDuration: 1450, travelDirection: "forward" };
    };
  }, []);

  useEffect(() => {
    const scene = state.current.scene;
    if (!scene) return;
    scene.userData.desiredChamber = chamber;
    const cave = scene.userData.caveBackground as THREE.Mesh | undefined;
    if (!cave) return;
    const material = cave.material as THREE.MeshBasicMaterial;
    const loader = new THREE.TextureLoader();
    let frame = 0;
    let cancelled = false;
    loader.load(`/assets/chambers/chamber-${String(chamber + 1).padStart(2, "0")}.jpg`, texture => {
      if (cancelled) {
        texture.dispose();
        return;
      }
      texture.colorSpace = THREE.SRGBColorSpace;
      texture.anisotropy = state.current.renderer?.capabilities.getMaxAnisotropy() || 4;
      const oldTexture = material.map;
      material.map = texture;
      material.transparent = true;
      material.opacity = 0;
      material.needsUpdate = true;
      const started = performance.now();
      const fade = (now: number) => {
        if (cancelled) return;
        const t = Math.min(1, (now - started) / 760);
        material.opacity = t * t * (3 - 2 * t);
        if (t < 1) frame = requestAnimationFrame(fade);
        else {
          material.transparent = false;
          material.opacity = 1;
          material.needsUpdate = true;
          oldTexture?.dispose();
        }
      };
      frame = requestAnimationFrame(fade);
    });
    return () => {
      cancelled = true;
      cancelAnimationFrame(frame);
    };
  }, [chamber]);

  useEffect(() => {
    const s = state.current;
    if (!s.camera || !s.scene) return;
    s.targetYaw = THREE.MathUtils.degToRad(THREE.MathUtils.clamp(-turn.x, -110, 110));
    s.targetPitch = THREE.MathUtils.degToRad(THREE.MathUtils.clamp(turn.y, -25, 25));
  }, [turn.x, turn.y]);

  useEffect(() => {
    const s = state.current;
    s.moving = moving;
    s.travelDirection = direction;
    if (moving) {
      s.travelStarted = performance.now();
      s.travelDuration = 1450;
    }
  }, [moving, direction]);

  useEffect(() => {
    const s = state.current;
    if (!s.camera || !s.scene) return;

    const first = !s.mounted;
    const previous = [...s.exhibits];
    const next: Exhibit[] = [];
    const wallAngle = THREE.MathUtils.degToRad(42);
    const duration = first ? 0 : 1550;
    const started = performance.now();
    let raf = 0;
    let disposed = false;

    const addSide = (items: StageCard[], side: "left" | "right") => {
      items.forEach((card, i) => {
        const exhibit = makeCard(card, i, side, false);
        const depth = 14 + i * 8.5;
        const finalZ = -depth;
        const sign = side === "left" ? -1 : 1;
        const finalX = sign * Math.tan(wallAngle) * depth;
        const finalY = 1.25 + (i % 2) * .35;
        const spawnDepth = depth + 10;
        const spawnX = sign * Math.tan(wallAngle) * spawnDepth;

        exhibit.group.position.set(
          first ? finalX : spawnX,
          first ? finalY : finalY + .12,
          first ? finalZ : -spawnDepth
        );
        exhibit.group.scale.setScalar(first ? 1 : .84);
        exhibit.materials.forEach(material => {
          material.userData.baseOpacity = 1;
          if ("opacity" in material) material.opacity = first ? 1 : 0;
        });
        s.scene!.add(exhibit.group);
        next.push(exhibit);
      });
    };

    addSide(cards.left, "left");
    addSide(cards.right, "right");

    // Keep the existing four stage-related distant previews; no extra decorative queue.
    const distantCards = [
      ...cards.left.slice(0, 2).map((card, i) => ({ card, side: "left" as const, index: i })),
      ...cards.right.slice(0, 2).map((card, i) => ({ card, side: "right" as const, index: i })),
    ];
    distantCards.forEach(({ card, side, index: i }) => {
      const exhibit = makeCard(card, i, side, true);
      const depth = 46 + i * 13;
      const sign = side === "left" ? -1 : 1;
      exhibit.group.position.set(sign * Math.tan(wallAngle) * depth, 2.25 + (i % 2) * .55, -depth);
      exhibit.group.rotation.y = side === "left" ? wallAngle : -wallAngle;
      exhibit.group.userData.isDistant = true;
      exhibit.materials.forEach(material => {
        material.userData.baseOpacity = .12;
        if ("opacity" in material) material.opacity = first ? .12 : 0;
      });
      s.scene!.add(exhibit.group);
      next.push(exhibit);
    });

    const disposeExhibit = (exhibit: Exhibit) => {
      s.scene?.remove(exhibit.group);
      exhibit.group.traverse(object => {
        if (object instanceof THREE.Mesh || object instanceof THREE.LineSegments) {
          object.geometry.dispose();
          const material = (object as THREE.Mesh).material;
          if (Array.isArray(material)) material.forEach(item => {
            const basic = item as THREE.MeshBasicMaterial;
            basic.map?.dispose();
            item.dispose();
          });
          else if (material) {
            const basic = material as THREE.MeshBasicMaterial;
            basic.map?.dispose();
            material.dispose();
          }
        }
      });
    };

    const smooth = (t: number) => t * t * (3 - 2 * t);
    const animateTransition = (now: number) => {
      if (disposed) return;
      const raw = duration === 0 ? 1 : Math.min(1, (now - started) / duration);
      const t = smooth(raw);
      const oldT = smooth(Math.min(1, Math.max(0, raw * 1.04)));

      next.forEach(exhibit => {
        const distant = Boolean(exhibit.group.userData.isDistant);
        const baseOpacity = distant ? .12 : 1;
        if (distant) {
          exhibit.materials.forEach(material => {
            if ("opacity" in material) material.opacity = baseOpacity * (first ? 1 : t);
          });
          return;
        }
        const depth = Math.abs(exhibit.targetZ);
        const sign = exhibit.side === "left" ? -1 : 1;
        const spawnDepth = depth + 10;
        const spawnX = sign * Math.tan(wallAngle) * spawnDepth;
        const finalX = sign * Math.tan(wallAngle) * depth;
        const finalY = 1.25 + (next.indexOf(exhibit) % 2) * .35;
        exhibit.group.position.set(
          THREE.MathUtils.lerp(spawnX, finalX, t),
          THREE.MathUtils.lerp(finalY + .12, finalY, t),
          THREE.MathUtils.lerp(-spawnDepth, exhibit.targetZ, t)
        );
        exhibit.group.scale.setScalar(THREE.MathUtils.lerp(.84, 1, t));
        exhibit.materials.forEach(material => {
          if ("opacity" in material) material.opacity = baseOpacity * (first ? 1 : t);
        });
      });

      previous.forEach(exhibit => {
        const sign = exhibit.side === "left" ? -1 : 1;
        const from = exhibit.group.userData.transitionFrom as THREE.Vector3 | undefined;
        const origin = from || (exhibit.group.userData.transitionFrom = exhibit.group.position.clone());
        exhibit.group.position.set(
          origin.x + sign * 3.2 * oldT,
          origin.y - .08 * oldT,
          origin.z + 4.5 * oldT
        );
        exhibit.group.scale.setScalar(1 + .12 * oldT);
        exhibit.materials.forEach(material => {
          if ("opacity" in material) material.opacity = (material.userData.baseOpacity ?? 1) * (1 - oldT);
        });
      });

      if (raw < 1) {
        raf = requestAnimationFrame(animateTransition);
      } else {
        previous.forEach(disposeExhibit);
      }
    };

    s.exhibits = next;
    s.mounted = true;
    raf = requestAnimationFrame(animateTransition);

    return () => {
      disposed = true;
      cancelAnimationFrame(raf);
    };
  }, [cards, chamber, stage, direction]);

  return <div className={`cavern-scene ${moving ? `travel-${direction}` : ""}`} ref={host} aria-label="Interactive first-person crystal cavern">
    <div className="travel-fade" aria-hidden="true" />
    <div className="cave-zoom-control" onWheel={e=>e.stopPropagation()}>
      <span>ZOOM</span>
      <input aria-label="Cavern zoom" type="range" min="0" max="100" value={zoom} onChange={e=>setZoom(Number(e.target.value))} />
      <small>{Math.round(90-zoom*.5)}°</small>
    </div>
    <div className="webgl-fallback">Your browser could not start the 3D scene. Please enable WebGL to explore the cavern.</div>
  </div>;
}
