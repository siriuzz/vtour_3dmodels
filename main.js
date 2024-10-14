import * as THREE from 'three';
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';

let mixer;
let clock = new THREE.Clock();

const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
camera.position.set(5, 10, 5);

const renderer = new THREE.WebGLRenderer({ antialias: true });
renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);

const ambientLight = new THREE.AmbientLight(0xffffff, 1);
scene.add(ambientLight);

const directionalLight = new THREE.DirectionalLight(0xffffff, 0.8);
directionalLight.position.set(1, 1, 1);
scene.add(directionalLight);

const controls = new OrbitControls(camera, renderer.domElement);
controls.enableDamping = true;
controls.dampingFactor = 0.1;
controls.maxPolarAngle = Math.PI / 2;

// Get model name from the URL
const urlParams = new URLSearchParams(window.location.search);
const modelName = urlParams.get('model');

const loader = new GLTFLoader();
let modelPath = '';
let camPosition;

// Determine model path based on URL

modelPath = `./models/${modelName}.gltf`;
if (modelName == "crab") {

    camPosition = new THREE.Vector3(0, 0, 0)
}


if (modelPath) {
    loader.load(modelPath, function (gltf) {
        const model = gltf.scene;

        if (modelName == "carp") {
            model.scale.set(30, 30, 30);

        } else {
            model.scale.set(1, 1, 1);

        }
        scene.add(model);

        mixer = new THREE.AnimationMixer(model);

        const modelPosition = new THREE.Vector3();
        model.getWorldPosition(modelPosition);
        controls.target.copy(camPosition);

    }, undefined, function (error) {
        console.error('An error occurred while loading the model:', error);
    });
}

window.addEventListener('resize', function () {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
});

function animate() {
    requestAnimationFrame(animate);

    const delta = clock.getDelta();
    if (mixer) mixer.update(delta);

    controls.update();
    renderer.render(scene, camera);
}

animate();