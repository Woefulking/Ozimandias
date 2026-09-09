import * as THREE from 'three';
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js';
import { EffectComposer } from 'three/examples/jsm/postprocessing/EffectComposer.js';
import { RenderPass } from 'three/examples/jsm/postprocessing/RenderPass.js';
import { UnrealBloomPass } from 'three/examples/jsm/postprocessing/UnrealBloomPass.js';
import { OutputPass } from 'three/examples/jsm/postprocessing/OutputPass.js';
import { BokehPass } from 'three/examples/jsm/postprocessing/BokehPass.js';
import { PointerLockControls } from 'three/addons/controls/PointerLockControls.js';

import { WALK_SPEED, RUN_SPEED, KEY_MAP, keys, POEM } from './consts/consts';

// DOM
const intro = document.querySelector('.intro');
const visual = document.querySelector('.visual');
const poemText = document.querySelector('#poem');

const audio = new Audio();

// ПЕРЕМЕННЫЕ
let currentLine = 0;
let poemStarted = false;
let poemFinished = false;

let camera;
let composer;
let controls;

// ДВИЖЕНИЕ
const timer = new THREE.Timer();

// СЦЕНА
const scene = new THREE.Scene();

scene.background = new THREE.Color(0x1f1f36);
scene.fog = new THREE.FogExp2(0x1f1f36, 0.02);

// RENDERER
const renderer = new THREE.WebGLRenderer({
  antialias: true,
});

renderer.shadowMap.enabled = true;
renderer.shadowMap.type = THREE.PCFShadowMap;

renderer.setSize(window.innerWidth, window.innerHeight);
renderer.setPixelRatio(window.devicePixelRatio);

renderer.outputColorSpace = THREE.SRGBColorSpace;
renderer.toneMapping = THREE.ACESFilmicToneMapping;

visual.appendChild(renderer.domElement);

// ТЕКСТУРЫ
const textureLoader = new THREE.TextureLoader();

function createBakedMaterial(path) {
  const texture = textureLoader.load(path);

  texture.colorSpace = THREE.SRGBColorSpace;
  texture.flipY = false;

  return new THREE.MeshBasicMaterial({
    map: texture,
  });
}

const headMaterial = createBakedMaterial('/assets/textures/headBaked.png');

const legsMaterial = createBakedMaterial('/assets/textures/legsBaked.jpg');

const cutMaterial = createBakedMaterial('/assets/textures/cutBaked.jpg');

const pedestalMaterial = createBakedMaterial('/assets/textures/pedestalBaked.jpg');

const normalTexture = textureLoader.load('/assets/textures/normal.jpg');

normalTexture.colorSpace = THREE.NoColorSpace;
normalTexture.flipY = false;
normalTexture.wrapS = THREE.RepeatWrapping;
normalTexture.wrapT = THREE.RepeatWrapping;
normalTexture.repeat.set(50, 50);
normalTexture.offset.set(0, -49);

// GLTF
const loader = new GLTFLoader();

loader.load(
  '/assets/desert.glb',
  (gltf) => {
    initializeScene(gltf);
  },
  undefined,
  (error) => {
    console.error('GLB loading error:', error);
  },
);

// ИНИЦИАЛИЗАЦИЯ
function initializeScene(gltf) {
  const model = gltf.scene;

  camera = gltf.cameras[0];

  setupControls();
  setupPostProcessing();

  setupStatue(model);
  setupDesert(model);
  setupLights(model);
  setupSun(model);

  scene.add(model);

  animate();
}

//УПРАВЛЕНИЕ
function setupControls() {
  controls = new PointerLockControls(camera, renderer.domElement);

  controls.pointerSpeed = 0.3;

  controls.addEventListener('unlock', () => {
    audio.pause();
  });
}

//ПОСТ ОБРАБОТКА
function setupPostProcessing() {
  composer = new EffectComposer(renderer);

  composer.setPixelRatio(window.devicePixelRatio);
  composer.setSize(window.innerWidth, window.innerHeight);

  const renderPass = new RenderPass(scene, camera);

  const bloomPass = new UnrealBloomPass(
    new THREE.Vector2(window.innerWidth, window.innerHeight),
    0.3,
    0.6,
    0.3,
  );

  const bokehPass = new BokehPass(scene, camera, {
    focus: 3,
    aperture: 0.00025,
    maxblur: 0.01,
  });

  const outputPass = new OutputPass();

  composer.addPass(renderPass);
  composer.addPass(bloomPass);
  composer.addPass(bokehPass);
  composer.addPass(outputPass);
}

// СЦЕНА
function setupStatue(model) {
  const head = model.getObjectByName('Head');
  const legs = model.getObjectByName('Legs');
  const cut = model.getObjectByName('Cut');
  const pedestal = model.getObjectByName('Pedestal');

  setupBakedObject(head, headMaterial);
  setupBakedObject(legs, legsMaterial);
  setupBakedObject(cut, cutMaterial);
  setupBakedObject(pedestal, pedestalMaterial);
}

function setupBakedObject(object, material) {
  if (!object) return;

  object.material = material;

  object.traverse((obj) => {
    if (obj.isMesh) {
      obj.castShadow = true;
    }
  });
}

function setupDesert(model) {
  const desert = model.getObjectByName('Desert');

  if (!desert) return;

  desert.traverse((obj) => {
    if (!obj.isMesh || !obj.material) return;

    obj.receiveShadow = true;

    const oldMaterial = obj.material;

    const newMaterial = new THREE.MeshPhysicalMaterial({
      map: oldMaterial.map,
      normalMap: normalTexture,
      roughness: 1.0,
      metalness: 0.0,
    });

    newMaterial.normalScale.set(1, 1);

    obj.material = newMaterial;
  });
}

function setupLights(model) {
  const backLightNode = model.getObjectByName('BackLight');

  if (backLightNode) {
    const backLight = new THREE.RectAreaLight(0x9dbcff, 500, 1, 1);

    backLightNode.add(backLight);
  }

  const sunLightNode = model.getObjectByName('Sun');

  if (!sunLightNode) return;

  const sunLight = new THREE.DirectionalLight(0xffffff, 0.3);

  sunLightNode.getWorldPosition(sunLight.position);

  const direction = new THREE.Vector3(0, 0, -1);

  direction.applyQuaternion(sunLightNode.getWorldQuaternion(new THREE.Quaternion()));

  sunLight.target.position.copy(sunLight.position).add(direction.multiplyScalar(100));

  sunLight.castShadow = true;

  scene.add(sunLight);
  scene.add(sunLight.target);
}

function setupSun(model) {
  const whitesun = model.getObjectByName('whitesun');

  if (!whitesun) return;

  whitesun.material = new THREE.MeshStandardMaterial({
    color: 0xdce8ff,
    emissive: 0xdce8ff,
    emissiveIntensity: 2.0,
    roughness: 0.2,
    metalness: 0.0,
  });
}

// СТИХ
function playLine(index) {
  const line = POEM[index];

  poemText.textContent = line.translation;

  audio.src = line.audio;
  audio.play();
}

function startPoem() {
  if (poemStarted) return;

  poemStarted = true;
  currentLine = 0;

  playLine(currentLine);
}

function replayPoem() {
  currentLine = 0;
  poemFinished = false;

  playLine(currentLine);
}

intro.addEventListener('click', () => {
  intro.style.display = 'none';

  controls.lock();

  startPoem();
});

renderer.domElement.addEventListener('click', () => {
  controls.lock();

  if (poemFinished) {
    replayPoem();
    return;
  }

  if (audio.paused) {
    audio.play();
  }
});

audio.addEventListener('ended', () => {
  currentLine++;

  if (currentLine < POEM.length) {
    playLine(currentLine);
  } else {
    poemText.textContent = '';
    poemFinished = true;
  }
});

window.addEventListener('keydown', handleKeyEvent);
window.addEventListener('keyup', handleKeyEvent);

window.addEventListener('resize', handleResize);

// ОБРАБОТЧИКИ
function handleKeyEvent(event) {
  const direction = KEY_MAP[event.code];

  if (direction !== undefined) {
    keys[direction] = event.type === 'keydown';
  }
}

function handleResize() {
  if (!camera) return;

  camera.aspect = window.innerWidth / window.innerHeight;

  camera.updateProjectionMatrix();

  renderer.setSize(window.innerWidth, window.innerHeight);

  if (composer) {
    composer.setSize(window.innerWidth, window.innerHeight);
  }
}

function preventBrowserShortcuts(event) {
  if (event.ctrlKey && ['KeyS', 'KeyU', 'KeyP', 'KeyW'].includes(event.code)) {
    event.preventDefault();
  }

  if (event.ctrlKey && event.shiftKey && ['KeyI', 'KeyJ', 'KeyC'].includes(event.code)) {
    event.preventDefault();
  }
}

window.addEventListener('keydown', preventBrowserShortcuts);

// АНИМАЦИЯ
function animate(timestamp) {
  requestAnimationFrame(animate);

  timer.update(timestamp);

  const delta = timer.getDelta();

  if (controls && controls.isLocked) {
    const speed = (keys.sprint ? RUN_SPEED : WALK_SPEED) * delta;

    if (keys.forward) {
      controls.moveForward(speed);
    }

    if (keys.backward) {
      controls.moveForward(-speed);
    }

    if (keys.left) {
      controls.moveRight(-speed);
    }

    if (keys.right) {
      controls.moveRight(speed);
    }

    if (keys.up) {
      camera.position.y += speed;
    }

    if (keys.down) {
      camera.position.y -= speed;
    }
  }

  if (composer) {
    composer.render();
  }
}
