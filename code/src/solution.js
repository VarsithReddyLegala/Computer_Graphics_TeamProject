import * as THREE from 'three';
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js';

let renderer, scene, camera;

const load = (url) => new Promise((resolve, reject) => {
  const loader = new GLTFLoader();
  loader.load(url, (gltf) => resolve(gltf.scene), undefined, reject);
});

window.init = async () => {
  renderer = new THREE.WebGLRenderer();
  renderer.setSize( window.innerWidth, window.innerHeight );
  document.body.appendChild( renderer.domElement );

  scene = new THREE.Scene();
  camera = new THREE.PerspectiveCamera( 75, window.innerWidth / window.innerHeight, 0.1, 1000 );
  camera.position.set(5, 5, 5);
  camera.lookAt(0, 0, 0);

  const directionalLight = new THREE.DirectionalLight(0xffffff, 10);
  scene.add(directionalLight);
 

  const geometry = new THREE.PlaneGeometry( 10, 10 );
  const texture = new THREE.TextureLoader().load('./assets/grass.jpg' ); 
  texture.wrapS = THREE.RepeatWrapping;
  texture.wrapT = THREE.RepeatWrapping;
  texture.repeat.set( 50, 50 );
  const material = new THREE.MeshBasicMaterial({
    map: texture,
  });
  const plane = new THREE.Mesh( geometry, material );
  plane.rotateX(-Math.PI / 2);
  plane.scale.set(100, 100, 100);
  

  const rock = await load('./assets/Rock/scene.gltf');
  rock.name = 'rock';
  rock.position.set(1, 1, 1);
  rock.scale.set(2,2,2);
  scene.add(rock);
  scene.add( plane );
};

window.loop = (dt, input) => {
  
  const p = scene.getObjectByName('rock');
  const speed = 0.04 * dt; 
  
  const planeSizeX = 990;
  const planeSizeZ = 990;
  const minX = -planeSizeX / 2;
  const maxX = planeSizeX / 2;
  const minZ = -planeSizeZ / 2;
  const maxZ = planeSizeZ / 2;

  if (input.keys.has('ArrowUp') && p.position.z - speed >= minZ) {
    p.position.z -= speed;
    p.rotation.x += 0.01 * dt;
    camera.position.copy(p.position);
    camera.position.add(new THREE.Vector3(5, 5, 5)); 
    camera.lookAt(p.position);
  }

  if (input.keys.has('ArrowDown') && p.position.z + speed <= maxZ) {
    p.position.z += speed;
    p.rotation.x += 0.01 * dt; 
    camera.position.copy(p.position);
    camera.position.add(new THREE.Vector3(5, 5, 5)); 
    camera.lookAt(p.position);
  }

  if (input.keys.has('ArrowLeft') && p.position.x - speed >= minX) {
    p.position.x -= speed;
    p.rotation.z += 0.01 * dt;
    camera.position.copy(p.position);
    camera.position.add(new THREE.Vector3(5, 5, 5)); 
    camera.lookAt(p.position); 
  }

  if (input.keys.has('ArrowRight') && p.position.x + speed <= maxX) {
    p.position.x += speed;
    p.rotation.z += 0.01 * dt;
    camera.position.copy(p.position);
    camera.position.add(new THREE.Vector3(5, 5, 5)); 
    camera.lookAt(p.position);
  }
  
  renderer.render(scene, camera);
};
