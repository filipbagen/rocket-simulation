import * as THREE from 'three'
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls'


// functions
import { rk4 } from './js/rk4'
import { rocketEquation } from './js/rocketEquation'
import { setupKeyControls, setupKeyLogger } from './setupKey'

// styles
import './style.css'

let scene, camera, fieldOfView, aspectRatio, nearPlane, farPlane, renderer, canvas
let loader = new GLTFLoader();

const createScene = () => {

    // Scene
    scene = new THREE.Scene()

    // Sizes
    const sizes = {
        width: window.innerWidth,
        height: window.innerHeight
    }

    aspectRatio = sizes.width / sizes.height
    fieldOfView = 45
    nearPlane = 1
    farPlane = 10000

    // Camera
    camera = new THREE.PerspectiveCamera(fieldOfView, aspectRatio, nearPlane, farPlane)
    camera.position.z = 20
    scene.add(camera)

    // Resize
    window.addEventListener('resize', () => {
        // Update sizes
        sizes.width = window.innerWidth
        sizes.height = window.innerHeight

        // Update camera
        camera.aspect = sizes.width / sizes.height
        camera.updateProjectionMatrix()
        renderer.setSize(sizes.width, sizes.height)
    })

    // Renderer
    canvas = document.querySelector(".webgl")
    renderer = new THREE.WebGL1Renderer({ canvas })
    renderer.setSize(sizes.width, sizes.height)
    document.body.appendChild(renderer.domElement)

    // Orbit controls
    // const controls = new OrbitControls(camera, renderer.domElement)
    // controls.enableDamping = true
}

// Light
const createLight = () => {
    let light = new THREE.PointLight(0xffffff, 1, 100)
    light.position.z = 30
    scene.add(light)
}


// 3D models
let ball, rocket

const createBall = () => {
    // Create our sphere
    const geometry = new THREE.SphereGeometry(3, 64, 64)
    const material = new THREE.MeshStandardMaterial({
        color: '#00ff83'
    })
    ball = new THREE.Mesh(geometry, material)
    scene.add(ball)
}

const createRocket = () => {
    loader.load('rocket.glb', function (gltf) {

        rocket = gltf.scene;  // sword 3D object is loaded
        rocket.position.x = 0;
        rocket.position.y = 0;
        rocket.position.z = 0;
        rocket.rotation.x = -90
        rocket.scale.set(.005, .005, .005)

        scene.add(rocket);
    })
}

// _________________________________________

// Define initial conditions
let x0 = 0; // Initial x position
let y0 = 0; // Initial y position
let z0 = 0; // Initial z position
let vx0 = 0; // Initial x velocity
let vy0 = 0; // Initial y velocity
let vz0 = 0; // Initial z velocity

// Initial conditions
y0 = [x0, y0, z0, vx0, vy0, vz0]


let dz = rk4(rocketEquation, [0, 1], y0, 1)
// console.log(dz)

let clock = new THREE.Clock()
let delta = 0

let i = 0
const updateRocket = () => {
    if (i < 3) {
        dz = rk4(rocketEquation, [0, 1], dz[i], 10)
        console.log(dz[i][2])
        // mesh.position.y = dz[i][2]
        i++

    } else {
        return
    }


}



const loop = () => {
    // setupKeyLogger()
    // setupKeyControls(ball)

    renderer.render(scene, camera)
    window.requestAnimationFrame(loop)
}

const init = () => {
    createScene()
    createLight()
    // createBall()
    createRocket()
    // updateRocket()
    loop()
}

window.addEventListener('load', init, false);