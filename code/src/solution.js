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
  const p1 = scene.getObjectByName(""); // Assuming the ground plane is named 'plane'
  console.log(p1)

  if (input.keys.has('ArrowUp')) {
    if (!checkCollision(p.position.clone().add(new THREE.Vector3(0, 0, -0.01 * dt)), p1)) {
      p.position.z -= 0.01 * dt;
      p.rotation.x += 0.05; // Rotate the Porsche around the x-axis when moving forward
    }
  }

  if (input.keys.has('ArrowDown')) {
    if (!checkCollision(p.position.clone().add(new THREE.Vector3(0, 0, 0.01 * dt)), p1)) {
      p.position.z += 0.01 * dt;
      p.rotation.x -= 0.01; // Rotate the Porsche around the x-axis when moving backward
    }
  }

  if (input.keys.has('ArrowLeft')) {
    if (!checkCollision(p.position.clone().add(new THREE.Vector3(-0.01 * dt, 0, 0)), p1)) {
      p.position.x -= 0.01 * dt;
      p.rotation.y += 0.01; // Rotate the Porsche around the y-axis when moving left
    }
  }

  if (input.keys.has('ArrowRight')) {
    if (!checkCollision(p.position.clone().add(new THREE.Vector3(0.01 * dt, 0, 0)), p1)) {
      p.position.x += 0.01 * dt;
      p.rotation.y -= 0.01; // Rotate the Porsche around the y-axis when moving right
    }
  }

  // Render the scene
  renderer.render(scene, camera);
};

function checkCollision(position, object) {
  const raycaster = new THREE.Raycaster(position, new THREE.Vector3(0, -1, 0)); // Create a raycaster pointing downwards from the position
  const intersects = raycaster.intersectObject(object, true); // Check for intersections with the ground plane

  // Check if there are any intersections and if the intersection point is above the object's surface
  if (intersects.length > 0 && intersects[0].point.y <= position.y) {
    return true; // Return true if there is an intersection and it's below or at the same level as the position
  }

  return false; // Return false if there are no collisions or if the collision point is above the position
}