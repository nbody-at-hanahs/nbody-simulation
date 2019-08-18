import * as THREE from 'three'
import image from '../assets/ball.png';

const geometry = new THREE.SphereGeometry(5, 32, 32)
const material = new THREE.MeshPhysicalMaterial({
  color: 0x00ff00, reflectivity: 0.5, roughness: 0.5, emissive: 0x0,
})

export function generateBodies(n, size, boundX, boundY, boundZ) {
  let geometry = new THREE.BufferGeometry
  // let material = new THREE.PointsMaterial({ size: size, vertexColors: THREE.VertexColors })
  let positions = new Float32Array(n * 3)
  let colors = new Float32Array(n * 3)
  let sizes = new Float32Array(n)

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

  console.log(texture)

  for (let i = 0; i < n; i++) {
    positions[3 * i] = (Math.random() - 0.5) * boundX
    positions[3 * i + 1] = (Math.random() - 0.5) * boundY
    positions[3 * i + 2] = (Math.random() - 0.5) * boundZ

    colors[3 * i] = 0x00
    colors[3 * i + 1] = 0x1
    colors[3 * i + 2] = 0x00

    sizes[i] = size
  }

  geometry.addAttribute('position', new THREE.BufferAttribute(positions, 3))
  geometry.addAttribute('ca', new THREE.BufferAttribute(colors, 3))
  geometry.addAttribute('size', new THREE.BufferAttribute(sizes, 1))
  geometry.computeBoundingBox()

  return new THREE.Points(geometry, material)
}
