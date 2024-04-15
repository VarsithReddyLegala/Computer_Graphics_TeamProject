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
  // const helper = new THREE.DirectionalLightHelper( directionalLight, 5 );
  // scene.add( helper );

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
  

  const porsche = await load('./assets/porsche/scene.gltf');
  porsche.name = 'porsche';
  porsche.position.set(0, 0, 0);
  scene.add(porsche);
  scene.add( plane );
  console.log('made a scene', porsche);
};

window.loop = (dt, input) => {
  // Move the Porsche based on user input
  const p = scene.getObjectByName('porsche');
  const speed = 0.05 * dt; // Adjust the speed as needed
  
  const planeSizeX = 900;
  const planeSizeZ = 900;
  const minX = -planeSizeX / 2;
  const maxX = planeSizeX / 2;
  const minZ = -planeSizeZ / 2;
  const maxZ = planeSizeZ / 2;

  if (input.keys.has('ArrowUp') && p.position.z - speed >= minZ) {
    p.position.z -= speed;
     p.rotation.z -= 0.05;
    console.log(p.rotation);
    camera.position.copy(p.position);
    camera.position.add(new THREE.Vector3(5, 5, 5)); // Offset the camera position if needed
    camera.lookAt(p.position); // Make the camera look at the Porsche
  
  }

  if (input.keys.has('ArrowDown') && p.position.z + speed <= maxZ) {
    p.position.z += speed;
    camera.position.copy(p.position);
    camera.position.add(new THREE.Vector3(5, 5, 5)); // Offset the camera position if needed
    camera.lookAt(p.position); // Make the camera look at the Porsche
    
  }

  if (input.keys.has('ArrowLeft') && p.position.x - speed >= minX) {
    p.position.x -= speed;
    camera.position.copy(p.position);
    camera.position.add(new THREE.Vector3(5, 5, 5)); // Offset the camera position if needed
    camera.lookAt(p.position); // Make the camera look at the Porsche
  }

  if (input.keys.has('ArrowRight')&& p.position.x + speed <= maxX) {
    p.position.x += speed;
    camera.position.copy(p.position);
    camera.position.add(new THREE.Vector3(5, 5, 5)); // Offset the camera position if needed
    camera.lookAt(p.position); // Make the camera look at the Porsche
  }
  
  // Render the scene
  renderer.render(scene, camera);
};
