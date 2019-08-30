import * as THREE from 'three'
import image from '../assets/ball.png';

const geometry = new THREE.SphereGeometry(5, 32, 32)
const material = new THREE.MeshPhysicalMaterial({
  color: 0x00ff00, reflectivity: 0.5, roughness: 0.5, emissive: 0x0,
})

export function generateBodies(n, size, mass, boundX, boundY, boundZ) {
  let geometry = new THREE.BufferGeometry
  // let material = new THREE.PointsMaterial({ size: size, vertexColors: THREE.VertexColors })
  let positions = new Float32Array(n * 3)
  let colors = new Float32Array(n * 3)
  let velocities = new Float32Array(n * 3)
  let accelerations = new Float32Array(n * 3)
  let sizes = new Float32Array(n)
  let masses = new Float32Array(n)

  let texture = new THREE.TextureLoader().load(image)
  texture.wrapS = THREE.RepeatWrapping
  texture.wrapT = THREE.RepeatWrapping

  let material = new THREE.ShaderMaterial({
    uniforms: {
      amplitude: { value: 1.0 },
      color: { value: new THREE.Color(0xffffff) },
      pointTexture: { value: texture }
    },
    vertexShader: document.getElementById('vertexshader').textContent,
    fragmentShader: document.getElementById('fragmentshader').textContent
  });

  for (let i = 0; i < n; i++) {
    positions[3 * i] = (Math.random() - 0.5) * boundX
    positions[3 * i + 1] = (Math.random() - 0.5) * boundY
    positions[3 * i + 2] = (Math.random() - 0.5) * boundZ

    colors[3 * i] = 1
    colors[3 * i + 1] = 1
    colors[3 * i + 2] = 0

    sizes[i] = size
    masses[i] = mass
    velocities[3 * i], velocities[3 * i + 1], velocities[3 * i + 2] = 0, 0, 0

    const velocityScale = 0.3
    velocities[3 * i] = (Math.random() - 0.5) * velocityScale
    velocities[3 * i + 1] = (Math.random() - 0.5) * velocityScale
    velocities[3 * i + 2] = (Math.random() - 0.5) * velocityScale

    accelerations[3 * i], accelerations[3 * i + 1], accelerations[3 * i + 2] = 0, 0, 0
  }

  geometry.dynamic = true
  geometry.addAttribute('position', new THREE.BufferAttribute(positions, 3))
  geometry.addAttribute('velocity', new THREE.BufferAttribute(velocities, 3))
  geometry.addAttribute('acceleration', new THREE.BufferAttribute(accelerations, 3))
  geometry.addAttribute('mass', new THREE.BufferAttribute(masses, 1))
  geometry.addAttribute('ca', new THREE.BufferAttribute(colors, 3))
  geometry.addAttribute('size', new THREE.BufferAttribute(sizes, 1))
  geometry.verticesNeedUpdate = true
  geometry.attributes.position.needsUpdate = true
  geometry.computeBoundingBox()

  return new THREE.Points(geometry, material)
}
