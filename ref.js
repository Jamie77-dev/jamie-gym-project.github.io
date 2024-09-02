import { GUI } from "./libs/dat.gui.module.js";
import { OrbitControls } from "./libs/OrbitControls.js";
import { Sky } from "./libs/Sky.js";
import * as THREE from "./libs/three.module.js";
import Stats from './libs/stats.module.js'
import { TransformControls } from "./libs/TransformControls.js";
import * as TWEEN from './libs/tween.module.js'
import loadAssets from "./libs/XController.js";
import { RGBELoader } from './libs/RGBELoader.js';
import { GroundedSkybox} from './libs/GroundedSkybox.js'
import { 
    AddObjectCommand, 
    MoveObjectCommand, 
    executeCommand, 
    undo, 
    redo,
    setRenderFunction 
} from "./libs/Command.js"

let container, stats;
let camera, scene, renderer, control;
let orbit, sun, mesh;
const clickMouse = new THREE.Vector2(); // create once
const raycaster = new THREE.Raycaster(); // create once
var draggable;

// Scene Background
const hdrEquirect = new RGBELoader()
	.setPath("assets/textures/")
	.load("hab.hdr", function () {
		hdrEquirect.mapping = THREE.EquirectangularReflectionMapping;

		init();
		render();
	});
//

function init() {
	container = document.getElementById("container");

	//

	renderer = new THREE.WebGLRenderer();
	renderer.setPixelRatio(window.devicePixelRatio);
	renderer.setSize(window.innerWidth, window.innerHeight);
	renderer.setAnimationLoop(animate);
	renderer.toneMapping = THREE.ACESFilmicToneMapping;
	renderer.toneMappingExposure = 0.5;
	renderer.shadowMap.enabled = true; // Enable shadow maps
	container.appendChild(renderer.domElement);

	//

	scene = new THREE.Scene();
	
	camera = new THREE.PerspectiveCamera(
		55,
		window.innerWidth / window.innerHeight,
		1,
		20000
	);
	camera.position.set(91, 190, 304);
	//
	
	// for zooming with the background image
	const skybox = new GroundedSkybox( hdrEquirect, 1500, 1000 );
	skybox.position.y = 15 - 0.01;
	scene.add( skybox );
	scene.background = hdrEquirect;
	//

	// for zooming alone uncomment above
	// scene.environment = hdrEquirect
	//
	
	sun = new THREE.Vector3();
	
	// Skybox

	const sky = new Sky();
	sky.scale.setScalar(10000);
	scene.add(sky);

	const skyUniforms = sky.material.uniforms;

	skyUniforms["turbidity"].value = 10;
	skyUniforms["rayleigh"].value = 2;
	skyUniforms["mieCoefficient"].value = 0.005;
	skyUniforms["mieDirectionalG"].value = 0.8;

	const parameters = {
		elevation: 7,
		azimuth: 180,
	};

	const pmremGenerator = new THREE.PMREMGenerator(renderer);
	const sceneEnv = new THREE.Scene();

	let renderTarget;

	function updateSun() {
		const phi = THREE.MathUtils.degToRad(90 - parameters.elevation);
		const theta = THREE.MathUtils.degToRad(parameters.azimuth);

		sun.setFromSphericalCoords(1, phi, theta);

		sky.material.uniforms["sunPosition"].value.copy(sun);

		if (renderTarget !== undefined) renderTarget.dispose();

		sceneEnv.add(sky);
		renderTarget = pmremGenerator.fromScene(sceneEnv);

		// Scene Background (is commented)
		// scene.add(sky);
		//

		scene.environment = renderTarget.texture;
		// Update the directional light position
        directionalLight.position.copy(sun).multiplyScalar(10000);
	}

	// Add a directional light to represent the sun
    const directionalLight = new THREE.DirectionalLight(0xffffff, .1);
    directionalLight.position.set(0, 10000, 0); // Initial position
    directionalLight.castShadow = true; // Enable shadows

    // Configure shadow properties for the light
    directionalLight.shadow.mapSize.width = 2048; // Shadow map resolution
    directionalLight.shadow.mapSize.height = 2048;
    directionalLight.shadow.camera.near = 0.5; // Shadow camera frustum
    directionalLight.shadow.camera.far = 50000;
    directionalLight.shadow.camera.left = -500;
    directionalLight.shadow.camera.right = 500;
    directionalLight.shadow.camera.top = 500;
    directionalLight.shadow.camera.bottom = -500;
	
    scene.add(directionalLight);
	
	updateSun();
	//


	const material = new THREE.MeshPhysicalMaterial( {
		color: 0xffffff,
		metalness: 1,
		roughness: 0,
		ior: 1.5, //
		envMap: hdrEquirect,
		envMapIntensity: 1,
		transmission: 0, // // use material.transmission for glass materials 
		specularIntensity: 1, //
		specularColor: 0xffffff, //
		opacity: 1,
		side: THREE.DoubleSide,
		transparent: true
	} );
	


	loadAssets(scene, render, material)
	//

	orbit = new OrbitControls(camera, renderer.domElement);
	orbit.maxPolarAngle = Math.PI * 0.495;
	orbit.target.set(94, 26, -22);
	orbit.update();

	//

	// the transform controls (movement)
    control = new TransformControls(camera, renderer.domElement);
	control.addEventListener("change", render);
	control.addEventListener("dragging-changed", function (event) {
		orbit.enabled = !event.value;
	});
	
	control.addEventListener('mouseDown', function(event) {
        if (control.object) {
            control.object.userData.oldPosition = control.object.position.clone();
        }
    });
    
    control.addEventListener('mouseUp', function(event) {
        if (control.object) {
            const oldPosition = control.object.userData.oldPosition;
            const newPosition = control.object.position.clone();
            if (!oldPosition.equals(newPosition)) {
                const moveCommand = new MoveObjectCommand(control.object, newPosition, oldPosition);
                executeCommand(moveCommand);
            }
        }
	});
	
	scene.add(control);


	
	
	//
	
	stats = new Stats();
	container.appendChild(stats.dom);

	// GUI

	const gui = new GUI();

	const folderSky = gui.addFolder("Controls Here");
	// folderSky.add(parameters, "elevation", -20, 20, 0.1).onChange(updateSun);
	// folderSky.add(parameters, "azimuth", -180, 180, 0.1).onChange(updateSun);
	folderSky.open();
	
	
	// event listeners
    window.addEventListener("click", onClick);
	window.addEventListener("dblclick", onDoubleClick);
	window.addEventListener("resize", onWindowResize);
	
	// keyboard shortcuts
	window.addEventListener("keydown", onKeyDown);
	window.addEventListener("keyup", onKeyUp);
}

function intersect(pos) {
	raycaster.setFromCamera(pos, camera);
	return raycaster.intersectObjects(scene.children);
}

function onClick(event) {
    findAndAttachDraggable(event, false);
}

function onDoubleClick(event) {
    findAndAttachDraggable(event, true);
}

function findAndAttachDraggable(event, isDoubleClick = false) {
    // Calculate mouse position in normalized device coordinates
    clickMouse.x = (event.clientX / window.innerWidth) * 2 - 1;
    clickMouse.y = -(event.clientY / window.innerHeight) * 2 + 1;

    // Find intersections
    const found = intersect(clickMouse);

    // If an object is found, make it draggable
    if (found.length > 0) {
        draggable = null;
        let temp = null;
        // Find the first draggable object
        for (let i = 0; i < found.length; i++) {
            if (found[i].object.userData.draggable) {
                temp = found[i].object;
                break;
            }
        }
        if (!temp) {
            // Detach control if no draggable object is found
            control.detach();
            render();
            return;
        }

        // Find the parent object with userData.isParent
        let parent = temp;
        while (parent) {
            if (parent.userData.isParent) {
                draggable = parent;
                control.attach(draggable);

                if (isDoubleClick) {
                    // Smoothly zoom the camera to the selected object
                    const box = new THREE.Box3().setFromObject(draggable);
                    const center = box.getCenter(new THREE.Vector3());

                    const size = box.getSize(new THREE.Vector3());
                    const maxDim = Math.max(size.x, size.y, size.z);

                    const fov = camera.fov * (Math.PI / 180);
                    const cameraZ = Math.abs(maxDim / 2 / Math.tan(fov / 2));

                    // Adjust camera distance to be in front of the model
                    const distance = cameraZ + maxDim * 1.5; // Adding a factor to move the camera further in front
                    const direction = new THREE.Vector3();
                    camera.getWorldDirection(direction);
                    direction.normalize();

                    const targetPosition = new THREE.Vector3().copy(center).addScaledVector(direction, -distance);

                    const zoomDuration = 1000; // 1 second

                    new TWEEN.Tween(camera.position)
                        .to({ x: targetPosition.x, y: targetPosition.y, z: targetPosition.z }, zoomDuration)
                        .easing(TWEEN.Easing.Quadratic.InOut)
                        .onUpdate(() => orbit.update())
                        .start();

                    new TWEEN.Tween(orbit.target)
                        .to({ x: center.x, y: center.y, z: center.z }, zoomDuration)
                        .easing(TWEEN.Easing.Quadratic.InOut)
                        .onUpdate(() => orbit.update())
                        .start();
                } 
                render();
                return;
            } else {
                parent = parent.parent;
            }
        }
        if (!draggable) {
            control.detach();
            render();
        }
    }
}
function rotateControl() {
	control.setMode("rotate");
}

function translateControl() {
	control.setMode("translate");
}

function scaleControl() {
	control.setMode("scale");
}

function onKeyDown(event) {
	// change the control settings
	switch (event.key) {
		case "Shift":
			control.setTranslationSnap(1);
			control.setRotationSnap(THREE.MathUtils.degToRad(15));
			control.setScaleSnap(0.25);
			break;

		case "w": // translate
			translateControl();
			break;

		case "e": // rotate
			rotateControl();
			break;

		case "r": // scale
			scaleControl();
			break;

		case "+":
		case "=":
			control.setSize(control.size + 0.1);
			break;

		case "-":
		case "_":
			control.setSize(Math.max(control.size - 0.1, 0.1));
			break;

		case "h":
			control.showX = false;
			control.showY = false;
			control.showZ = false;
			break;
		
		case event.ctrlKey && 'z':
			// undo();
			break;
		
		case event.ctrlKey && 'y':
			// redo();
			break;
	}
}

function onKeyUp(event) {
	// reset the control settings
	switch (event.key) {
		case "Shift":
			control.setTranslationSnap(null);
			control.setRotationSnap(null);
			control.setScaleSnap(null);
			break;

		case "h":
			// reset the control settings
			control.showX = true;
			control.showZ = true;
			control.showY = true; // remove if restrict movement along y is needed
			break;
	}
}

function onWindowResize() {
	camera.aspect = window.innerWidth / window.innerHeight;
	camera.updateProjectionMatrix();

	renderer.setSize(window.innerWidth, window.innerHeight);
}

function animate() {
	TWEEN.update();
	render();
	stats.update();
}

function render() {
	renderer.render(scene, camera);
}

// Set the render function in commands.js
setRenderFunction(render);
