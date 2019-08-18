import * as THREE from 'three';
import { generateBodies } from './bodies'
import { naiveNBody } from './naive-nbody'

let scene = new THREE.Scene();
let camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
let renderer = new THREE.WebGLRenderer();

renderer.setSize(window.innerWidth, window.innerHeight);
renderer.setPixelRatio(window.devicePixelRatio);
document.body.appendChild(renderer.domElement);

var light = new THREE.PointLight(0xffffff, 4, 100);
light.position.set(10, 10, 50);
scene.add(light);

let geometry = new THREE.SphereGeometry(1, 20, 20);
let material = new THREE.MeshStandardMaterial({
  color: 0xffff00, emissive: 0.5, roughness: 0.5, metalness: 0.5
});
let sphere = new THREE.Mesh(geometry, material);
// scene.add(sphere);


let points = generateBodies(20, 1, 10000000000, 5, 5, 5)
points.geometry.attributes.position.needsUpdate = true

scene.add(points)

camera.position.z = 5;
points.geometry.attributes.position.needsUpdate = true

function animate() {
  requestAnimationFrame(animate);
  renderer.render(scene, camera);

  points.rotateX(-0.001)
  points.rotateY(0.001)
  points.rotateZ(0.001)

  let newPos = naiveNBody(
    points.geometry.attributes.mass.array,
    points.geometry.attributes.position.array,
    points.geometry.attributes.velocity.array,
    points.geometry.attributes.acceleration.array
  )[0]

  for (let i = 0; i < points.geometry.attributes.position.count; i++) {
    points.geometry.attributes.position.array[i] = newPos[i]
  }

  // console.log(points.geometry.attributes.position);
  points.geometry.attributes.position.needsUpdate = true
  points.geometry.attributes.velocity.needsUpdate = true
  points.geometry.attributes.acceleration.needsUpdate = true
  points.geometry.attributes.mass.needsUpdate = true
  points.geometry.attributes.size.needsUpdate = true

  // for (let i = 0; i < points.geometry.attributes.mass.count; i++) {
  //   for (let j = 0; j < points.geometry.attributes.mass.count; j++) {
  //     if (i != j) {
  //       if ((points.geometry.attributes.position[3 * i] - points.geometry.attributes.position[3 * j]) ** 2 + (points.geometry.attributes.position[3 * i + 1] - points.geometry.attributes.position[3 * j + 1]) ** 2 + (points.geometry.attributes.position[3 * i + 2] - points.geometry.attributes.position[3 * j + 2]) ** 2 < 100) {
  //         points.geometry.attributes.size.array[i] = 0
  //         points.geometry.attributes.mass.array[j] += points.geometry.attributes.mass.array[i]
  //         points.geometry.attributes.mass.array[i] = 0
  //       }
  //     }
  //   }
  // }
}


animate();