import * as THREE from 'three';
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js';

// Game variables
let renderer, scene, camera;
const numRocks = 10;
let remainingRocks = numRocks;
let gameOver = false;

// Utility to load GLTF models
const load = (url) => new Promise((resolve, reject) => {
  const loader = new GLTFLoader();
  loader.load(url, (gltf) => resolve(gltf.scene), undefined, reject);
});

// Create a message overlay when the game is over
function showGameOverMessage() {
  console.log("SHIVA");
  const gameOverDiv = document.createElement("div");
  gameOverDiv.id = "game-over";
  gameOverDiv.style.position = "absolute";
  gameOverDiv.style.top = "50%";
  gameOverDiv.style.left = "50%";
  gameOverDiv.style.transform = "translate(-50%, -50%)";
  gameOverDiv.style.backgroundColor = "rgba(0, 0, 0, 0.8)";
  gameOverDiv.style.color = "white";
  gameOverDiv.style.padding = "20px";
  gameOverDiv.style.border = "2px solid white";
  gameOverDiv.innerHTML = `
    <h1>Game Over!</h1>
    <p>Congratulations, you've collected all the rocks!</p>
  `;
  document.body.appendChild(gameOverDiv);
}

// Initialize the scene
window.init = async () => {
  renderer = new THREE.WebGLRenderer();
  renderer.setSize(window.innerWidth, window.innerHeight);
  document.body.appendChild(renderer.domElement);

  scene = new THREE.Scene();
  camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
  camera.position.set(5, 5, 5);
  camera.lookAt(0, 0, 0);

  const directionalLight = new THREE.DirectionalLight(0xffffff, 10);
  scene.add(directionalLight);

  const geometry = new THREE.PlaneGeometry(10, 10);
  const texture = new THREE.TextureLoader().load('./assets/grass.jpg');
  texture.wrapS = THREE.RepeatWrapping;
  texture.wrapT = THREE.RepeatWrapping;
  texture.repeat.set(50, 50);
  const material = new THREE.MeshBasicMaterial({ map: texture });
  const plane = new THREE.Mesh(geometry, material);
  plane.rotateX(-Math.PI / 2);
  plane.scale.set(100, 100, 100);

  scene.add(plane);

  // Main rock object
  const rock = await load('./assets/Rock/scene.gltf');
  rock.name = 'rock';
  rock.position.set(1, 1, 1);
  rock.scale.set(1, 1, 1);
  scene.add(rock);

  // Small rocks
  const smallRockModel = await load('./assets/smallrock/scene.gltf');
   const range = 100;

  // Place small rocks at random locations
  for (let i = 0; i < numRocks; i++) {
    const smallRock = smallRockModel.clone();
    smallRock.castShadow=true;
    const randomX = Math.random() * range - range / 2;
    const randomZ = Math.random() * range - range / 2;
    smallRock.position.set(randomX, 0, randomZ);
    smallRock.name = `smallrock_${i}`;
    scene.add(smallRock);
  }
  const redRockModel = await load('./assets/redrock/scene.gltf');
  // Place small rocks at random locations
  for (let i = 0; i < numRocks; i++) {
    const redrock = redRockModel.clone();
    redrock.position.set(20, 0,20+i);
    redrock.name = `redrock_${i}`;
    redrock.scale.set(30,30,30)
    scene.add(redrock);
  }

};

// Collision check and end game logic
function check() {
  const p = scene.getObjectByName('rock');
  const box = new THREE.Box3().setFromObject(p);

  scene.children.forEach((obj) => {
    if (obj.name.startsWith('smallrock')) {
      const smallRockBox = new THREE.Box3().setFromObject(obj);
      if (box.intersectsBox(smallRockBox)) {
        // Scale the rock and remove small rock
        p.scale.multiplyScalar(1.1);
        scene.remove(obj);
        remainingRocks--;

        if (remainingRocks === 0) {
          gameOver = true;
          showGameOverMessage(); // Show game over message
        }
      }
    }
  });
}

// Game loop with end game check
window.loop = (dt, input) => {
  if (gameOver) {
    return; // Don't proceed if the game is over
  }

  const p = scene.getObjectByName('rock');
  const speed = 0.04 * dt;

  const planeSizeX = 950;
  const planeSizeZ = 950;
  const minX = -planeSizeX / 2;
  const maxX = planeSizeX / 2;
  const minZ = -planeSizeZ / 2;
  const maxZ = planeSizeZ / 2;

 
  if (input.keys.has('ArrowUp') && p.position.z - speed >= minZ) {
    console.log(p.rotation.x);
    console.log(p.rotation.y);
    console.log(p.rotation.z);
    p.position.z -= speed;
    p.rotation.x -= 0.01 * dt;
    camera.position.copy(p.position);
    camera.position.add(new THREE.Vector3(5, 5, 5)); 
    camera.lookAt(p.position);
    check();
  }

  if (input.keys.has('ArrowDown') && p.position.z + speed <= maxZ) {
    p.position.z += speed;
    p.rotation.x += 0.01 * dt;
    camera.position.copy(p.position);
    camera.position.add(new THREE.Vector3(5, 5, 5));
    camera.lookAt(p.position);
    check();
  }

  if (input.keys.has('ArrowLeft') && p.position.x - speed >= minX) {
    p.rotation.x = 0;
    p.position.x -= speed;
    p.rotation.z += 0.01 * dt;
    camera.position.copy(p.position);
    camera.position.add(new THREE.Vector3(5, 5, 5)); 
    camera.lookAt(p.position); 
    check();
  }

  if (input.keys.has('ArrowRight') && p.position.x + speed <= maxX) {
    p.rotation.x = 0;
    p.position.x += speed;
    p.rotation.z -= 0.01 * dt;
    camera.position.copy(p.position);
    camera.position.add(new THREE.Vector3(5, 5, 5)); 
    camera.lookAt(p.position); 
    check();
  }

  renderer.render(scene, camera);
};
