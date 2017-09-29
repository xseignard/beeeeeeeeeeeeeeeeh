import * as THREE from 'three';
import threeOrbitControls from './utils/OrbitControls';
import Stats from 'stats.js';
import Sheep from './sheep';
import './main.css';

// attach orbit controls to THREE
const OrbitControls = threeOrbitControls(THREE);

// stats
const stats = new Stats();
document.body.appendChild(stats.domElement);

// scene, renderer, camera, mesh (geometry + material)
const renderer = new THREE.WebGLRenderer({
	antialias: true,
});
renderer.setSize(window.innerWidth, window.innerHeight);
// enbale the drawing of shadows
renderer.shadowMap.enabled = true;

document.body.appendChild(renderer.domElement);

const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
camera.position.set(0, 40, 100);
// controls
const controls = new OrbitControls(camera, renderer.domElement);
// axis helper
const axisHelper = new THREE.AxisHelper(100);
scene.add(axisHelper);

const light = new THREE.AmbientLight(0x888888);
scene.add(light);

const spotLight = new THREE.SpotLight(0x88aa88);
spotLight.angle = 25 * (Math.PI / 180);
spotLight.position.set(80, 80, 0);
spotLight.castShadow = true;
spotLight.distance = 200;
spotLight.decay = 2;
spotLight.penumbra = 0.9;
scene.add(spotLight);
const spotLightHelper = new THREE.SpotLightHelper(spotLight);
scene.add(spotLightHelper);

const spotLight2 = new THREE.SpotLight(0xaa44aa);
spotLight2.angle = 25 * (Math.PI / 180);
spotLight2.position.set(80, 80, 50);
spotLight2.distance = 200;
spotLight2.decay = 2;
spotLight2.penumbra = 0.9;
scene.add(spotLight2);
const spotLightHelper2 = new THREE.SpotLightHelper(spotLight2);
scene.add(spotLightHelper2);

// beeeeeeeeeeeeeeeeh
const sheep = Sheep();
sheep.position.y = 11.5;
sheep.rotation.y = -Math.PI / 3;
scene.add(sheep);

const planeGeometry = new THREE.PlaneGeometry(150, 150, 32, 32);
planeGeometry.vertices.forEach(v => {
	if (Math.random() > 0.5) v.z -= Math.random() * 2;
});
planeGeometry.computeFaceNormals();
planeGeometry.computeVertexNormals();
const planeMaterial = new THREE.MeshPhongMaterial({
	emissive: 0x000000,
	specular: 0x888888,
	color: 0x42f4bc,
	side: THREE.DoubleSide,
});
const planeMesh = new THREE.Mesh(planeGeometry, planeMaterial);
planeMesh.rotation.x = Math.PI / 2;
planeMesh.receiveShadow = true;
scene.add(planeMesh);

const animate = timestamp => {
	stats.begin();
	renderer.render(scene, camera);
	stats.end();
	requestAnimationFrame(animate);
};
animate();