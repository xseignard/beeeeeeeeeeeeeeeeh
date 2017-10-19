import * as THREE from 'three';
import 'three/examples/js/controls/OrbitControls';
import 'three/examples/js/loaders/OBJLoader';
import 'three/examples/js/postprocessing/EffectComposer';
import 'three/examples/js/postprocessing/RenderPass';
import 'three/examples/js/postprocessing/ShaderPass';
import 'three/examples/js/shaders/CopyShader';
import 'three/examples/js/shaders/FilmShader';
import TweenMax from 'gsap';
import Stats from 'stats.js';
import Sheep from './sheep';
import Particles from './particles';
import './main.css';
import paperBoatOBJ from './models/test.obj';
import paperTexture from './img/paper.jpg';

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
// scene.background = new THREE.Color(0xf8ebb8);
const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
camera.position.set(0, 40, 100);
// controls
const controls = new THREE.OrbitControls(camera, renderer.domElement);
// axis helper
const axisHelper = new THREE.AxisHelper(100);
scene.add(axisHelper);

// lights
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
sheep.group.position.y = 11.5;
sheep.group.rotation.y = -Math.PI / 3;
scene.add(sheep.group);

//
const textureLoader = new THREE.TextureLoader();
textureLoader.load(paperTexture, texture => {
	texture.wrapS = THREE.RepeatWrapping;
	texture.wrapT = THREE.RepeatWrapping;
	texture.needsUpdate = true;
	const m = new THREE.MeshPhongMaterial({
		// color: 0xee0000,
		side: THREE.DoubleSide,
		emissive: 0x000000,
		specular: 0xffffff,
		flatShading: true,
		bumpMap: texture,
		map: texture,
	});
	const objLoader = new THREE.OBJLoader();
	objLoader.load(paperBoatOBJ, object => {
		object.traverse(node => {
			if (node.material) node.material = m;
		});
		object.rotateX(-90 * THREE.Math.DEG2RAD);
		object.rotateZ(90 * THREE.Math.DEG2RAD);
		object.position.set(30, 10, 0);
		object.scale.set(5, 5, 5);
		object.castShadow = true;
		scene.add(object);
	});
});

// particles
const particles = Particles();
particles.group.position.set(-5, 15, -10);
scene.add(particles.group);

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

const handleResize = () => {
	camera.aspect = window.innerWidth / window.innerHeight;
	camera.updateProjectionMatrix();
	renderer.setSize(window.innerWidth, window.innerHeight);
	composer.setSize(window.innerWidth, window.innerHeight);
};
addEventListener('resize', handleResize);

const raycaster = new THREE.Raycaster();
const mouse = new THREE.Vector2();
const handleClick = e => {
	e.preventDefault();
	mouse.x = e.clientX / window.innerWidth * 2 - 1;
	mouse.y = -(e.clientY / window.innerHeight) * 2 + 1;
	raycaster.setFromCamera(mouse, camera);
	const intersects = raycaster.intersectObjects(sheep.group.children);
	if (intersects.length > 0 && intersects[0].object.uuid === sheep.nose.uuid) {
		let i = 0;
		const interval = setInterval(() => {
			if (i <= 100) {
				particles.particles[i].fart();
				i++;
			} else clearInterval(interval);
		}, 10);
		TweenMax.to(sheep.nose.scale, 0.3, {
			x: '+=2',
			y: '+=2',
			z: '+=2',
			ease: Power2.easeInOut,
			repeat: 1,
			yoyo: true,
		});
	}
};
addEventListener('click', handleClick);

// post processing
const composer = new THREE.EffectComposer(renderer);

const renderPass = new THREE.RenderPass(scene, camera);
const grainPass = new THREE.ShaderPass(THREE.FilmShader);
grainPass.renderToScreen = true;
grainPass.uniforms['grayscale'] = false;

composer.addPass(renderPass);
composer.addPass(grainPass);

const animate = timestamp => {
	requestAnimationFrame(animate);
	stats.begin();
	// renderer.render(scene, camera);
	composer.render();
	stats.end();
};
animate();
