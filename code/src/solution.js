import * as THREE from 'three';
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js';

// Game variables
let renderer, scene, camera;
const numRocks = 7;
let remainingRocks = numRocks;
let gameOver = false;
const audioLoader = new THREE.AudioLoader();
const listener = new THREE.AudioListener();
let beepSound;
let startTime;
const gameTime = 120; // 1 minute in seconds
let timerDisplay;

audioLoader.load('./assets/BeepSound.mp3', function (buffer) {
  // Create the Audio object
  beepSound = new THREE.PositionalAudio(listener);

  // Configure the Audio object
  beepSound.setBuffer(buffer);
  beepSound.setRefDistance(20);
  beepSound.setVolume(20);
});

function startTimer() {
  startTime = Date.now();
}

function updateTimer() {
  const elapsedTime = Math.floor((Date.now() - startTime) / 1000); // Convert to seconds
  const remainingTime = Math.max(gameTime - elapsedTime, 0);
  const minutes = Math.floor(remainingTime / 60);
  const seconds = remainingTime % 60;
  const timerText = `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
  timerDisplay.textContent = `Time: ${timerText}`;

  if (remainingTime === 0) {
    gameOver = true;
    TimerMessage();
  }
}

// Utility to load GLTF models
const load = (url) => new Promise((resolve, reject) => {
  const loader = new GLTFLoader();
  loader.load(url, (gltf) => resolve(gltf.scene), undefined, reject);
});

// Create a message overlay when the game is over
function showGameOverMessage() {
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

function TimerMessage() {
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
    <p>You Did not Complete in the given Time Limit!!!</p>
  `;
  document.body.appendChild(gameOverDiv);
}


function ShowLossMessage() {
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
    <p>You Hit a Human You Loss!!</p>
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

  startTimer();

  // Display timer at the top of the screen
  timerDisplay = document.createElement("div");
  timerDisplay.id = "timer";
  timerDisplay.style.position = "absolute";
  timerDisplay.style.top = "20px";
  timerDisplay.style.left = "20px";
  timerDisplay.style.color = "white";
  timerDisplay.style.fontSize = "24px";
  timerDisplay.style.backgroundColor="black"
  document.body.appendChild(timerDisplay);

  // Main rock object
  const rock = await load('./assets/Rock/scene.gltf');
  rock.name = 'rock';
  rock.position.set(1, 1, 1);
  rock.scale.set(1, 1, 1);
  scene.add(rock);

  // Small rocks
  const smallRockModel = await load('./assets/squarerocks/scene.gltf');
   const range = 100;

  // Place small rocks at random locations
  for (let i = 0; i < numRocks; i++) {
    const smallRock = smallRockModel.clone();
    smallRock.castShadow=true;
    const randomX = Math.random() * range - range / 2;
    const randomZ = Math.random() * range - range / 2;
    smallRock.position.set(randomX, 0, randomZ);
    smallRock.name = `smallrock_${i}`;
    smallRock.collide=false;
    scene.add(smallRock);
  }

  const treemodel= await load('./assets/tree/scene.gltf');
  for (let i = 0; i < 20; i++) {
    const tree = treemodel.clone();
    tree.castShadow=true;
    const randomX = Math.random() * 500 - 500 / 2;
    const randomZ = Math.random() * 500 - 500 / 2;
    tree.position.set(randomX, 0, randomZ);
    tree.scale.set(0.05,0.05,0.05);
    tree.name = `tree_${i}`;
    scene.add(tree);
  }
  const PersonModel = await load('./assets/People/scene.gltf');

 // Place small rocks at random locations
 for (let i = 0; i < numRocks; i++) {
   const people = PersonModel.clone();
   people.castShadow=true;
   const randomX = Math.random() * 600 - 600 / 2;
   const randomZ = Math.random() * 600 - 600 / 2;
   people.position.set(randomX, 0, randomZ);
   people.name = `people_${i}`;
   people.scale.set(5,5,5);
   people.collide=false;
   scene.add(people);
 }

 const BigRockModel = await load('./assets/smallrock/scene.gltf');

 // Place small rocks at random locations
 for (let i = 0; i < numRocks; i++) {
   const BigRock = BigRockModel.clone();
   BigRock.castShadow=true;
   const randomX = Math.random() * 600 - 600 / 2;
   const randomZ = Math.random() * 600 - 600 / 2;
   BigRock.position.set(randomX, 0, randomZ);
   BigRock.name = `BigRock_${i}`;
   BigRock.scale.set(5,5,5);
   BigRock.collide=false;
   scene.add(BigRock);
 }
 scene.add(listener);

 


};

// Collision check and end game logic
function check() {
  const mainRock = scene.getObjectByName('rock');
  const mainRockBox = new THREE.Box3().setFromObject(mainRock);

  scene.children.forEach((obj) => {
    if (obj.name.startsWith('smallrock') && !obj.collide) {
      const smallRockBox = new THREE.Box3().setFromObject(obj);
      if (mainRockBox.intersectsBox(smallRockBox)) {
        const c = mainRock.worldToLocal(obj.position);
        console.log("Before:", obj.position);
        obj.parent = mainRock;

        obj.position.x=c.x;
        obj.position.y=c.y;
        obj.position.z=c.z;

        remainingRocks--;
        obj.collide=true;
        if (beepSound) {
          beepSound.play();
        }
        if (remainingRocks === 0) {
          gameOver = true;
          showGameOverMessage(); // Show game over message
        }
      }
     
    }
  });
}

function Check1() {
  const mainRock = scene.getObjectByName('rock');
  const mainRockBox = new THREE.Box3().setFromObject(mainRock);
  scene.children.forEach((obj) => {
    if (obj.name.startsWith('people')) {
      const person = new THREE.Box3().setFromObject(obj);
      if (mainRockBox.intersectsBox(person)) {
          gameOver = true;
          ShowLossMessage();
        }
      }
    });
  }

let acceleration=0;
window.loop = (dt, input) => {
  if (gameOver) {
    return; // Don't proceed if the game is over
  }

  updateTimer();

  const p = scene.getObjectByName('rock');
  const speed = acceleration * dt;

  const planeSizeX = 950;
  const planeSizeZ = 950;
  const minX = -planeSizeX / 2;
  const maxX = planeSizeX / 2;
  const minZ = -planeSizeZ / 2;
  const maxZ = planeSizeZ / 2;
  if (input.keys.has('ArrowUp') && p.position.z - speed >= minZ) {
    if (acceleration < 0.1) {
      acceleration += 0.001;
    }
    p.position.z -= speed;
    p.rotation.x -=  acceleration * 10;
    camera.position.copy(p.position);
    camera.position.add(new THREE.Vector3(5, 5, 5)); 
    camera.lookAt(p.position);
    Check1();
    check();
  }

  if (input.keys.has('ArrowDown') && p.position.z + speed <= maxZ) {
    if (acceleration < 0.1) {
      acceleration += 0.001;
    }
    p.position.z += speed;
    p.rotation.x += acceleration * dt;
    camera.position.copy(p.position);
    camera.position.add(new THREE.Vector3(5, 5, 5));
    camera.lookAt(p.position);
    Check1();
    check();
  }

  if (input.keys.has('ArrowLeft') && p.position.x - speed >= minX) {
    if (acceleration < 0.1) {
      acceleration += 0.001;
    }
    p.rotation.x = 0;
    p.position.x -= speed;
    p.rotation.z += acceleration* dt;
    camera.position.copy(p.position);
    camera.position.add(new THREE.Vector3(5, 5, 5)); 
    camera.lookAt(p.position); 
    Check1();
    check();
  }

  if (input.keys.has('ArrowRight') && p.position.x + speed <= maxX) {
    if (acceleration < 0.1) {
      acceleration += 0.001;
    }
    p.rotation.x = 0;
    p.position.x += speed;
    p.rotation.z -= acceleration * dt;
    camera.position.copy(p.position);
    camera.position.add(new THREE.Vector3(5, 5, 5)); 
    camera.lookAt(p.position); 
    Check1();
    check();
  }
  renderer.render(scene, camera);
};