import * as THREE from 'https://cdn.skypack.dev/three@0.129.0/build/three.module.js';
import { GLTFLoader } from 'https://cdn.skypack.dev/three@0.129.0/examples/jsm/loaders/GLTFLoader.js';
import { gsap } from 'https://cdn.skypack.dev/gsap';

// import { OrbitControls } from 'three/addons/controls/OrbitControls.js';

// 1. CAMERA
const camera = new THREE.PerspectiveCamera(
    10, // viewing angle -> see more or less things
    window.innerWidth / window.innerHeight, // aspect
    0.1, // closest distance the camera can see
    1000 // furthest
);
camera.position.z = 13; // position behind the screen (similar to the eye)

// 2. SCENE
const scene = new THREE.Scene();
let cameraman;
let mixer;

// library to load the glb file
const loader = new GLTFLoader();

// 3 callback func
loader.load('/---cameraman---.glb',
    // run when loading process is complete
    function (gltf) {
        cameraman = gltf.scene;
        cameraman.position.y = -1;
        cameraman.position.x = -0.8

        scene.add(cameraman);

        mixer = new THREE.AnimationMixer(cameraman);

        // slow down animation
        mixer.timeScale = 1/5

        // choose animations to play
        mixer.clipAction(gltf.animations[0]).play();
        modelMove();
    },
    // continously run during the loading process
    function (xhr) {},
    // error catching
    function (error) {}
);

// basically use HTML canvas
const renderer = new THREE.WebGLRenderer({alpha: true}); // background transparent - default black
renderer.setSize(window.innerWidth, window.innerHeight); // same size as browser
document.getElementById('container3D').appendChild(renderer.domElement);

// const controls = new OrbitControls( camera, renderer.domElement );
// 			controls.target.set( 0, 0.5, 0 );
			
// 			controls.enablePan = false;
// 			controls.enableDamping = true;
//             controls.update();

// light
const ambientLight = new THREE.AmbientLight(0xffffff, 1.3);
scene.add(ambientLight);

const topLight = new THREE.DirectionalLight(0xffffff, 1);
topLight.position.set(500, 500, 500);
scene.add(topLight);

const reRender3D = () => {
    requestAnimationFrame(reRender3D); // continously repeat the function if the scene is not loaded yet

    // controls.update();

    renderer.render(scene, camera); // -> render scene and camera
    if(mixer) mixer.update(0.02); // update scene continously -> like video playing
};
reRender3D();

let arrPositionModel = [
    {
        id: 'banner',
        position: {x: -0.8, y: -1, z: 0},
        rotation: {x: 0, y: 0, z: 0}
    },
    {
        id: "intro",
        position: { x: 2, y: -0.8, z: -5 },
        rotation: { x: 0, y: -0.5, z: 0 },
    },
    {
        id: "description",
        position: { x: 0.2, y: -1, z: -5 },
        rotation: { x: 0, y: -0.5, z: 0 },
    },
    {
        id: "contact",
        position: { x: 0.8, y: -1, z: 0 },
        rotation: { x: 0.3, y: -0.5, z: 0 },
    },
];
const modelMove = () => {
    const sections = document.querySelectorAll('.section');
    let currentSection;
    sections.forEach((section) => {
        const rect = section.getBoundingClientRect();
        if (rect.top <= window.innerHeight / 3) {
            currentSection = section.id;
        }
    });
    let position_active = arrPositionModel.findIndex(
        (val) => val.id == currentSection
    );
    if (position_active >= 0) {
        let new_coordinates = arrPositionModel[position_active];
        gsap.to(cameraman.position, {
            x: new_coordinates.position.x,
            y: new_coordinates.position.y,
            z: new_coordinates.position.z,
            duration: 2,
            ease: "power1.out"
        });
        gsap.to(cameraman.rotation, {
            x: new_coordinates.rotation.x,
            y: new_coordinates.rotation.y,
            z: new_coordinates.rotation.z,
            duration: 2,
            ease: "power1.out"
        })
    }
}
window.addEventListener('scroll', () => {
    if (cameraman) {
        modelMove();
    }
})

// when resize happens
window.addEventListener('resize', () => {
    renderer.setSize(window.innerWidth, window.innerHeight); // update HTML canvas height + width
    camera.aspect = window.innerWidth / window.innerHeight;
    
    camera.updateProjectionMatrix(); // take effect 
})