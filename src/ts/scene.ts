import * as THREE from 'three';
import { generateBodies } from './bodies'

let scene = new THREE.Scene();
let camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
let renderer = new THREE.WebGLRenderer();

renderer.setSize(window.innerWidth, window.innerHeight);
renderer.setPixelRatio( window.devicePixelRatio );
document.body.appendChild(renderer.domElement);

var light = new THREE.PointLight( 0xffffff, 4, 100 );
light.position.set( 10, 10, 50 );
scene.add( light );

let geometry = new THREE.SphereGeometry(1, 20, 20);
let material = new THREE.MeshStandardMaterial({
  color: 0xffff00, emissive: 0.5, roughness: 0.5, metalness: 0.5
});
let sphere = new THREE.Mesh(geometry, material);
scene.add(sphere);


let points = generateBodies(1000, 1, 5, 5, 5)
scene.add(points)

camera.position.z = 5;

function animate() {
  requestAnimationFrame(animate);
  renderer.render(scene, camera);

  points.rotateX(-0.001)
  points.rotateY(0.001)
  points.rotateZ(0.001)

}
animate();