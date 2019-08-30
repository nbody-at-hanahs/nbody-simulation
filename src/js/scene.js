import * as THREE from 'three';
const OrbitControls = require('three-orbitcontrols');

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


let points = generateBodies(300, 10, 1000000, 100, 100, 100)

var axesHelper = new THREE.AxesHelper( 100 );
scene.add( axesHelper );

points.geometry.attributes.position.needsUpdate = true

scene.add(points)

camera.position.z = 80;
points.geometry.attributes.position.needsUpdate = true


function conserveMomentum(m1, m2, v1, v2) {
  return (v1 * m1 + v2 * m2) / (m1 + m2)
}

let cnt = 0;
const controls = new OrbitControls(camera, renderer.domElement)
function animate() {
  requestAnimationFrame(animate);
  renderer.render(scene, camera);

  // points.rotateX(-0.001)
  // points.rotateY(0.001)
  // points.rotateZ(0.001)

  const attr = points.geometry.attributes
  for (let i = 0; i < points.geometry.attributes.mass.count; i++) {
    for (let j = 0; j < i; j++) {
      if (i != j) {
        let dist = (points.geometry.attributes.position.array[3 * i] - points.geometry.attributes.position.array[3 * j]) ** 2 + (points.geometry.attributes.position.array[3 * i + 1] - points.geometry.attributes.position.array[3 * j + 1]) ** 2 + (points.geometry.attributes.position.array[3 * i + 2] - points.geometry.attributes.position.array[3 * j + 2]) ** 2
        if (dist < (points.geometry.attributes.size.array[i] + points.geometry.attributes.size.array[j]) / 12) { // Crash
          points.geometry.attributes.size.array[j] = (points.geometry.attributes.size.array[i] ** 3 + points.geometry.attributes.size.array[j] ** 3) ** 0.33333333
          points.geometry.attributes.size.array[i] = 0
          points.geometry.attributes.acceleration.array[j * 3] = 0
          points.geometry.attributes.acceleration.array[j * 3 + 1] = 0
          points.geometry.attributes.acceleration.array[j * 3 + 2] = 0

          points.geometry.attributes.velocity.array[j * 3] =
            conserveMomentum(points.geometry.attributes.mass.array[i],
              points.geometry.attributes.mass.array[j],
              points.geometry.attributes.velocity.array[i * 3],
              points.geometry.attributes.velocity.array[j * 3]
            )

          points.geometry.attributes.velocity.array[j * 3 + 1] =
            conserveMomentum(points.geometry.attributes.mass.array[i],
              points.geometry.attributes.mass.array[j],
              points.geometry.attributes.velocity.array[i * 3 + 1],
              points.geometry.attributes.velocity.array[j * 3 + 1]
            )

          points.geometry.attributes.velocity.array[j * 3 + 2] =
            conserveMomentum(points.geometry.attributes.mass.array[i],
              points.geometry.attributes.mass.array[j],
              points.geometry.attributes.velocity.array[i * 3 + 2],
              points.geometry.attributes.velocity.array[j * 3 + 2]
            )

          points.geometry.attributes.mass.array[j] += points.geometry.attributes.mass.array[i]
          points.geometry.attributes.mass.array[i] = 0
        }
      }
    }
  }
  let newState = naiveNBody(
    points.geometry.attributes.mass.array,
    points.geometry.attributes.position.array,
    points.geometry.attributes.velocity.array,
    points.geometry.attributes.acceleration.array
  );

  for (let i = 0; i < points.geometry.attributes.position.count * 3; i++) {    
    points.geometry.attributes.position.array[i] = newState[0][i]
    points.geometry.attributes.velocity.array[i] = newState[1][i]
    points.geometry.attributes.acceleration.array[i] = newState[2][i]
  }

  // console.log(points.geometry.attributes.position);
  points.geometry.attributes.position.needsUpdate = true
  points.geometry.attributes.velocity.needsUpdate = true
  points.geometry.attributes.acceleration.needsUpdate = true
  points.geometry.attributes.mass.needsUpdate = true
  points.geometry.attributes.size.needsUpdate = true
}
animate();