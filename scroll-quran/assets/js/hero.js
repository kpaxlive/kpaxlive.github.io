// The hero: the splash's Qur'an (tool/splash_3d/scene.js) brought to the
// page. The book opens once, then stays open with its light alive: rays
// breathing, motes rising for ever. The camera leans after the pointer; as
// the page scrolls through the hero the book comes to the middle and the
// camera goes into its light, brighter and brighter, as the splash ends.

import * as THREE from "three";
import { RoomEnvironment } from "three/addons/environments/RoomEnvironment.js";
import { EffectComposer } from "three/addons/postprocessing/EffectComposer.js";
import { RenderPass } from "three/addons/postprocessing/RenderPass.js";
import { UnrealBloomPass } from "three/addons/postprocessing/UnrealBloomPass.js";
import { OutputPass } from "three/addons/postprocessing/OutputPass.js";
import { ShaderPass } from "three/addons/postprocessing/ShaderPass.js";

const canvas = document.querySelector("[data-hero-canvas]");
const hero = document.querySelector("[data-hero]");
const reduceMotion = matchMedia("(prefers-reduced-motion: reduce)").matches;

// The splash's timeline is written in story seconds played SLOW times
// slower; the book is fully open, its light up, at OPENED.
const SLOW = 1.4;
const OPENED = 1.85;

// ---------------------------------------------------------------- helpers

const clamp01 = (v) => Math.min(1, Math.max(0, v));
const span = (t, a, b) => {
  const x = clamp01((t - a) / (b - a));
  return x * x * (3 - 2 * x);
};
const easeInOutCubic = (x) => (x < 0.5 ? 4 * x * x * x : 1 - Math.pow(-2 * x + 2, 3) / 2);
const lerp = (a, b, t) => a + (b - a) * t;

function random(seed) {
  let s = seed >>> 0;
  return () => {
    s = (s * 1664525 + 1013904223) >>> 0;
    return s / 4294967296;
  };
}

function canvasTexture(width, height, draw) {
  const c = document.createElement("canvas");
  c.width = width;
  c.height = height;
  draw(c.getContext("2d"), width, height);
  const texture = new THREE.CanvasTexture(c);
  texture.colorSpace = THREE.SRGBColorSpace;
  return texture;
}

// ---------------------------------------------------------------- renderer

let renderer;
try {
  renderer = new THREE.WebGLRenderer({ canvas, antialias: true, powerPreference: "high-performance" });
} catch (_) {
  renderer = null; // no WebGL: the hero keeps its CSS gradient
}

if (renderer) start();

function start() {
  const coarse = matchMedia("(pointer: coarse)").matches;
  const pixelRatio = Math.min(window.devicePixelRatio || 1, coarse ? 1.5 : 1.75);
  renderer.setPixelRatio(pixelRatio);
  renderer.toneMapping = THREE.ACESFilmicToneMapping;
  renderer.toneMappingExposure = 1.05;

  const scene = new THREE.Scene();

  // The hero's own background (site.css .hero), drawn to the canvas's
  // shape so the canvas fades in over it without a seam.
  function background(width, height) {
    const w = 640;
    const h = Math.max(64, Math.round((640 * height) / width));
    return canvasTexture(w, h, (g) => {
      const base = g.createLinearGradient(0, 0, 0, h);
      base.addColorStop(0, "#113021");
      base.addColorStop(0.7, "#071a12");
      base.addColorStop(1, "#050f0a");
      g.fillStyle = base;
      g.fillRect(0, 0, w, h);
      const glow = (x, y, rx, ry, color) => {
        g.save();
        g.translate(x, y);
        g.scale(1, ry / rx);
        const r = g.createRadialGradient(0, 0, 0, 0, 0, rx);
        r.addColorStop(0, color);
        r.addColorStop(1, color.replace(/[\d.]+\)$/, "0)"));
        g.fillStyle = r;
        g.fillRect(-rx, -rx, rx * 2, rx * 2);
        g.restore();
      };
      glow(w * 0.3, -h * 0.05, w * 0.7 * 0.6, h * 0.6 * 0.6, "rgba(212,176,106,0.2)");
      glow(w * 1.05, h * 0.9, w * 0.6 * 0.7, h * 0.5 * 0.7, "rgba(31,90,62,0.45)");
    });
  }

  const pmrem = new THREE.PMREMGenerator(renderer);
  scene.environment = pmrem.fromScene(new RoomEnvironment(), 0.04).texture;
  scene.environmentIntensity = 0.55;

  const camera = new THREE.PerspectiveCamera(32, 1, 0.1, 80);

  scene.add(new THREE.HemisphereLight("#fff4dc", "#0a1f17", 0.35));
  const key = new THREE.DirectionalLight("#ffe9c2", 2.2);
  key.position.set(-2.5, 5, 3);
  scene.add(key);
  const inner = new THREE.PointLight("#ffd27a", 0, 5, 2);
  scene.add(inner);

  // ---------------------------------------------------------------- the book

  const W = 1;
  const L = 889 / 640;
  const HALF = 0.08;
  const BOARD = 0.016;
  const OVERHANG = 0.022;

  const loader = new THREE.TextureLoader();
  const maxAniso = renderer.capabilities.getMaxAnisotropy();
  const art = (name) => {
    const texture = loader.load(`assets/textures/${name}.webp`);
    texture.colorSpace = THREE.SRGBColorSpace;
    texture.anisotropy = maxAniso;
    return texture;
  };
  const coverArt = art("book_cover");
  const leftPageArt = art("page_left");
  const rightPageArt = art("page_right");
  const spineArt = art("book_spine");
  spineArt.center.set(0.5, 0.5);
  spineArt.rotation = Math.PI / 2;

  const edgesArt = canvasTexture(16, 256, (g, w, h) => {
    for (let y = 0; y < h; y++) {
      const shade = 0.78 + 0.22 * Math.abs(Math.sin(y * 1.7));
      g.fillStyle = `rgb(${Math.round(236 * shade)},${Math.round(204 * shade)},${Math.round(132 * shade)})`;
      g.fillRect(0, y, w, 1);
    }
  });

  const boardMaterial = new THREE.MeshStandardMaterial({ color: "#103b29", metalness: 0.35, roughness: 0.55 });
  const coverMaterial = new THREE.MeshStandardMaterial({ map: coverArt, metalness: 0.55, roughness: 0.38 });
  const edgesMaterial = new THREE.MeshStandardMaterial({ map: edgesArt, metalness: 0.6, roughness: 0.35 });
  const spineMaterial = new THREE.MeshStandardMaterial({ map: spineArt, metalness: 0.45, roughness: 0.45 });
  const pageMaterial = (map) =>
    new THREE.MeshStandardMaterial({
      map,
      color: "#d6ccb8",
      roughness: 0.82,
      metalness: 0,
      emissive: new THREE.Color("#ffffff"),
      emissiveMap: map,
      emissiveIntensity: 0,
    });
  const rightPageMaterial = pageMaterial(rightPageArt);
  const leftPageMaterial = pageMaterial(leftPageArt);

  const box = (w, h, d, materials) => new THREE.Mesh(new THREE.BoxGeometry(w, h, d), materials);

  const book = new THREE.Group();
  scene.add(book);

  const pagesThickness = HALF - BOARD;
  const backBoard = box(W + OVERHANG, BOARD, L + OVERHANG * 2, boardMaterial);
  backBoard.position.set((W + OVERHANG) / 2, BOARD / 2, 0);
  const backPages = box(W, pagesThickness, L, [edgesMaterial, spineMaterial, rightPageMaterial, edgesMaterial, edgesMaterial, edgesMaterial]);
  backPages.position.set(W / 2, BOARD + pagesThickness / 2, 0);
  book.add(backBoard, backPages);

  const hinge = new THREE.Group();
  hinge.position.set(0, HALF, 0);
  book.add(hinge);
  const frontPages = box(W, pagesThickness, L, [edgesMaterial, spineMaterial, edgesMaterial, leftPageMaterial, edgesMaterial, edgesMaterial]);
  frontPages.position.set(W / 2, pagesThickness / 2, 0);
  const frontBoard = box(W + OVERHANG, BOARD, L + OVERHANG * 2, [boardMaterial, boardMaterial, coverMaterial, boardMaterial, boardMaterial, boardMaterial]);
  frontBoard.position.set((W + OVERHANG) / 2, pagesThickness + BOARD / 2, 0);
  hinge.add(frontPages, frontBoard);
  leftPageArt.wrapS = THREE.RepeatWrapping;
  leftPageArt.repeat.x = -1;

  // ---------------------------------------------------------------- the light

  const dot = canvasTexture(64, 64, (g, w) => {
    const r = g.createRadialGradient(w / 2, w / 2, 0, w / 2, w / 2, w / 2);
    r.addColorStop(0, "rgba(255,255,255,1)");
    r.addColorStop(0.35, "rgba(255,255,255,0.45)");
    r.addColorStop(1, "rgba(255,255,255,0)");
    g.fillStyle = r;
    g.fillRect(0, 0, w, w);
  });

  const rayMaterial = (color) =>
    new THREE.ShaderMaterial({
      transparent: true,
      depthWrite: false,
      blending: THREE.AdditiveBlending,
      side: THREE.DoubleSide,
      uniforms: { color: { value: color }, strength: { value: 0 } },
      vertexShader: /* glsl */ `
        varying vec2 vUv;
        varying float vFacing;
        void main() {
          vUv = uv;
          vec4 mv = modelViewMatrix * vec4(position, 1.0);
          vec3 n = normalize(normalMatrix * normal);
          vFacing = abs(dot(n, normalize(-mv.xyz)));
          gl_Position = projectionMatrix * mv;
        }`,
      fragmentShader: /* glsl */ `
        uniform vec3 color;
        uniform float strength;
        varying vec2 vUv;
        varying float vFacing;
        void main() {
          float along = pow(max(1.0 - vUv.y, 0.0), 1.6);
          float across = pow(clamp(vFacing, 0.0, 1.0), 2.5);
          gl_FragColor = vec4(color * along * across * strength, 1.0);
        }`,
    });

  const rays = new THREE.Group();
  scene.add(rays);
  const rayList = [];
  {
    const rand = random(11);
    for (let i = 0; i < 9; i++) {
      const height = 2.6 + rand() * 1.6;
      const geometry = new THREE.CylinderGeometry(0.12 + rand() * 0.22, 0.015, height, 32, 1, true);
      geometry.translate(0, height / 2, 0);
      const mesh = new THREE.Mesh(geometry, rayMaterial(i % 3 === 0 ? new THREE.Color("#bfe8c8") : new THREE.Color("#F1DBA4")));
      mesh.position.set((rand() - 0.5) * 0.12, 0, (rand() - 0.5) * 0.9);
      mesh.rotation.set((rand() - 0.5) * 0.35, 0, (rand() - 0.5) * 0.5);
      mesh.userData = { delay: rand() * 0.25, weight: 0.5 + rand() * 0.5, phase: rand() * Math.PI * 2 };
      rays.add(mesh);
      rayList.push(mesh);
    }
  }

  const pageGlow = new THREE.Sprite(
    new THREE.SpriteMaterial({ map: dot, color: "#ffe3a1", transparent: true, blending: THREE.AdditiveBlending, depthWrite: false, opacity: 0 }),
  );
  scene.add(pageGlow);

  const MOTES = 240;
  const moteGeometry = new THREE.BufferGeometry();
  const motePositions = new Float32Array(MOTES * 3);
  const moteColors = new Float32Array(MOTES * 3);
  moteGeometry.setAttribute("position", new THREE.BufferAttribute(motePositions, 3));
  moteGeometry.setAttribute("color", new THREE.BufferAttribute(moteColors, 3));
  const moteSeeds = [];
  {
    const rand = random(7);
    for (let i = 0; i < MOTES; i++) {
      moteSeeds.push({
        x: (rand() - 0.5) * 1.5 * Math.pow(rand(), 0.6),
        z: (rand() - 0.5) * 1.1,
        born: 0.75 + rand() * 1.4,
        speed: 0.35 + rand() * 0.9,
        drift: (rand() - 0.5) * 0.4,
        life: 1.2 + rand() * 1.6,
        rest: rand() * 1.2,
        warm: rand(),
      });
    }
  }
  const motes = new THREE.Points(
    moteGeometry,
    new THREE.PointsMaterial({ map: dot, size: 0.05, vertexColors: true, transparent: true, depthWrite: false, blending: THREE.AdditiveBlending }),
  );
  scene.add(motes);

  // ---------------------------------------------------------------- post

  const composer = new EffectComposer(renderer);
  composer.setPixelRatio(pixelRatio);
  composer.addPass(new RenderPass(scene, camera));
  const bloom = new UnrealBloomPass(new THREE.Vector2(256, 256), 0.5, 0.5, 0.9);
  composer.addPass(bloom);
  composer.addPass(new OutputPass());
  // About one shade of noise per pixel, so the dark glow doesn't band.
  const dither = new ShaderPass({
    uniforms: { tDiffuse: { value: null }, seed: { value: 0 } },
    vertexShader: /* glsl */ `
      varying vec2 vUv;
      void main() { vUv = uv; gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0); }`,
    fragmentShader: /* glsl */ `
      uniform sampler2D tDiffuse;
      uniform float seed;
      varying vec2 vUv;
      float hash(vec2 p) {
        p = fract(p * vec2(443.897, 441.423) + seed);
        p += dot(p, p.yx + 19.19);
        return fract((p.x + p.y) * p.x);
      }
      void main() {
        vec4 texel = texture2D(tDiffuse, vUv);
        float noise = hash(gl_FragCoord.xy) + hash(gl_FragCoord.xy + 17.31) - 1.0;
        gl_FragColor = vec4(texel.rgb + noise / 255.0, 1.0);
      }`,
  });
  composer.addPass(dither);

  // ---------------------------------------------------------------- framing

  // [target, distance, elevation, azimuth], as in the splash.
  const shots = {
    closed: { target: new THREE.Vector3(0.5, HALF + 0.2, 0), distance: 5.6, elevation: 0.7, azimuth: 0.26 },
    open: { target: new THREE.Vector3(0, HALF + 0.75, 0.05), distance: 7.4, elevation: 0.72, azimuth: 0 },
    into: { target: new THREE.Vector3(0, 1.25, -0.15), distance: 2.4, elevation: 0.5, azimuth: 0 },
  };

  // The hero's scroll (0 → 1, as main.js reads it): the book comes to the
  // middle over CENTER, the camera goes into the light over DIVE, and past
  // LIGHT_TO main.js's light covers the whole screen.
  const CENTER = [0.03, 0.32];
  const DIVE = [0.2, 0.9];
  const LIGHT_TO = 0.9;

  let width = 0;
  let height = 0;
  let wide = true;
  let distanceScale = 1;

  function resize() {
    const w = canvas.clientWidth || innerWidth;
    const h = canvas.clientHeight || innerHeight;
    // A hidden page has no size yet; the ResizeObserver below comes back.
    if (!w || !h || (w === width && h === height)) return;
    width = w;
    height = h;
    renderer.setSize(width, height, false);
    composer.setSize(width, height);
    camera.aspect = width / height;
    wide = width / height > 1.05 && width > 900;
    // Narrow screens: step back until the open spread fits the width.
    const visibleWidth = (d) => 2 * d * Math.tan(THREE.MathUtils.degToRad(16)) * camera.aspect;
    distanceScale = wide ? 1 : Math.max(1, 3.1 / visibleWidth(shots.open.distance));
    scene.background?.dispose?.();
    scene.background = background(width, height);
  }

  /** Where the book sits: right of the copy (wide) or under it (narrow),
   *  moving to the middle as [centered] goes to 1. */
  function frameView(centered) {
    const x = wide ? lerp(-0.2, 0, centered) : 0;
    const y = wide ? lerp(-0.02, 0, centered) : lerp(-0.2, 0, centered);
    camera.setViewOffset(width, height, width * x, height * y, width, height);
    camera.updateProjectionMatrix();
  }

  const pointer = { x: 0, y: 0, sx: 0, sy: 0 };
  if (!reduceMotion && matchMedia("(hover: hover)").matches) {
    addEventListener("pointermove", (event) => {
      pointer.x = event.clientX / innerWidth - 0.5;
      pointer.y = event.clientY / innerHeight - 0.5;
    });
  }

  function placeCamera(story, centered, dive, clock) {
    const a = easeInOutCubic(span(story, 0.15, 1.45));
    const pick = (key) => lerp(lerp(shots.closed[key], shots.open[key], a), shots.into[key], dive);
    const target = shots.closed.target.clone().lerp(shots.open.target, a).lerp(shots.into.target, dive);
    // A little closer once in the middle; all the way in on the dive.
    const distance = pick("distance") * lerp(distanceScale, 1, dive) * (1 - 0.08 * centered);
    const calm = 1 - dive;
    const elevation = pick("elevation") + (-pointer.sy * 0.12 + Math.sin(clock * 0.31) * 0.015) * calm;
    const azimuth = pick("azimuth") + (pointer.sx * 0.22 + Math.sin(clock * 0.23) * 0.05) * calm;
    camera.position.set(
      target.x + distance * Math.cos(elevation) * Math.sin(azimuth),
      target.y + distance * Math.sin(elevation),
      target.z + distance * Math.cos(elevation) * Math.cos(azimuth),
    );
    camera.lookAt(target);
  }

  /** [story] how far the opening has gone (0 closed … OPENED open; it runs
   *  both ways), [clock] seconds since the page opened (the light's own
   *  life), [scroll] the hero's scroll progress. */
  function update(story, clock, scroll) {
    pointer.sx += (pointer.x - pointer.sx) * 0.04;
    pointer.sy += (pointer.y - pointer.sy) * 0.04;
    const centered = easeInOutCubic(span(scroll, CENTER[0], CENTER[1]));
    const dive = Math.pow(clamp01((scroll - DIVE[0]) / (DIVE[1] - DIVE[0])), 1.3);

    const open = easeInOutCubic(span(story, 0.35, 1.3));
    hinge.rotation.z = Math.PI * open;
    frameView(centered);
    placeCamera(story, centered, dive, clock);

    const glimmer = span(story, 0.45, 0.9);
    const well = span(story, 0.85, 1.6);
    const alive = span(story, 1.4, OPENED);
    const breath = 1 + 0.08 * Math.sin(clock * 1.4) * alive;
    inner.position.set(0, HALF + 0.8, 0);
    inner.intensity = (0.5 * glimmer + 1.6 * well) * breath * (1 + dive);
    leftPageMaterial.emissiveIntensity = rightPageMaterial.emissiveIntensity = 0.06 * well + 0.25 * dive;

    pageGlow.position.set(0, HALF + 0.02, 0);
    const glowSize = (0.8 + 1.0 * well) * breath * (1 + dive);
    pageGlow.scale.set(glowSize, glowSize, 1);
    pageGlow.material.opacity = 0.18 * glimmer + 0.3 * well + 0.3 * dive;

    rays.position.set(0, HALF, 0);
    for (const ray of rayList) {
      const { delay, weight, phase } = ray.userData;
      const rise = span(story, 0.9 + delay * 0.6, 1.5 + delay * 0.6);
      const pulse = 1 + 0.18 * Math.sin(clock * 0.9 + phase) * alive;
      ray.scale.set(0.6 + 0.4 * rise, Math.max(0.001, rise), 0.6 + 0.4 * rise);
      ray.material.uniforms.strength.value = 0.55 * weight * rise * pulse * (1 + 1.4 * dive);
    }

    // Motes rise for as long as the book is open, and fade as it closes.
    const shown = span(story, 0.8, 1.6);
    for (let i = 0; i < MOTES; i++) {
      const m = moteSeeds[i];
      const local = (clock + m.born * 1.7) % (m.life + m.rest);
      const age = local / m.life;
      const rise = local * m.speed;
      const k = age < 1 ? Math.sin(age * Math.PI) * shown : 0;
      motePositions[i * 3] = m.x + m.drift * rise;
      motePositions[i * 3 + 1] = HALF + 0.02 + rise;
      motePositions[i * 3 + 2] = m.z;
      const warm = lerp(0.75, 1, m.warm);
      moteColors[i * 3] = k;
      moteColors[i * 3 + 1] = k * warm * 0.92;
      moteColors[i * 3 + 2] = k * warm * 0.62;
    }
    moteGeometry.attributes.position.needsUpdate = true;
    moteGeometry.attributes.color.needsUpdate = true;

    // As in the splash's last moments: brighter and brighter.
    bloom.strength = 0.5 + 1.4 * dive;
    renderer.toneMappingExposure = 1.05 + 2.0 * dive;
    dither.uniforms.seed.value = (clock * 61.7) % 1;
  }

  // ---------------------------------------------------------------- run

  let visible = true;
  let running = false;
  let started = false; // textures in
  let story = 0;
  let direction = 1; // +1 opening, -1 closing
  let leftTop = false; // scrolled away from the top since the page opened
  let clock = 0;
  let last = 0;

  const scrollProgress = () =>
    clamp01((window.scrollY - hero.offsetTop) / Math.max(1, hero.offsetHeight - innerHeight));

  function frame(now) {
    running = false;
    if (!visible || document.hidden || !width) {
      last = 0;
      return;
    }
    const dt = last ? Math.min(0.1, (now - last) / 1000) : 0;
    last = now;
    const scroll = scrollProgress();
    // The book opens when the page does. Back at the very top after
    // scrolling away, it closes again (the opening played backwards);
    // scrolling down opens it once more.
    if (window.scrollY > 6) {
      direction = 1;
      leftTop = true;
    } else if (leftTop) {
      direction = -1;
    }
    if (started) {
      if (reduceMotion) {
        story = direction > 0 ? OPENED : 0;
      } else {
        clock += dt;
        const speed = direction > 0 ? 1 : 1.2;
        story = Math.min(OPENED, Math.max(0, story + (direction * speed * dt) / SLOW));
      }
    }
    // Under the full light there is nothing to draw; scrolling back up
    // starts the drawing again.
    if (scroll > LIGHT_TO + 0.01) {
      last = 0;
      return;
    }
    update(story, clock, scroll);
    composer.render();
    if (!reduceMotion) schedule();
  }
  function schedule() {
    if (running) return;
    running = true;
    requestAnimationFrame(frame);
  }

  resize();
  new ResizeObserver(() => {
    resize();
    schedule();
  }).observe(canvas);
  addEventListener("scroll", schedule, { passive: true });

  new IntersectionObserver((entries) => {
    visible = entries[0].isIntersecting;
    if (visible) schedule();
  }).observe(hero);
  document.addEventListener("visibilitychange", () => {
    if (!document.hidden) schedule();
  });

  THREE.DefaultLoadingManager.onLoad = () => {
    if (width) {
      update(0, 0, scrollProgress());
      composer.render();
    }
    canvas.classList.add("is-ready");
    started = true;
    schedule();
  };
}
