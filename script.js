if (!localStorage.getItem('tutorialViewed')) {
	// Show the tutorial to the user
	window.location.href = "tutorial.html"
}
closeTutorialWindow()

import {
	GUIMap,
	coffeeSection,
	gym1,
	gym2,
	reception,
	restingArea,
	weightRoom,
	yogaRoom,
} from "./libs/GUIMap.js";
import { OrbitControls } from "./libs/OrbitControls.js";
import { RGBELoader } from "./libs/RGBELoader.js";
import { Sky } from "./libs/Sky.js";
import Stats from "./libs/stats.module.js";
import * as THREE from "./libs/three.module.js";
import { TransformControls } from "./libs/TransformControls.js";
import * as TWEEN from "./libs/tween.module.js";
import loadAssets, { MODEL_PATH } from "./libs/XController.js";
import { manager, gui, textureLoader, objectLoader, closeTutorialWindow } from "./libs/Utils.js";
import {
	AddObjectCommand,
	ChangeFloorTypeCommand,
	ChangeWallColorCommand,
	ChangeWallTypeCommand,
	ClearCanvasCommand,
	CloneObjectCommand,
	MoveObjectCommand,
	RemoveObjectCommand,
	RotateObjectCommand,
	changeFloorColorCommand,
	executeCommand,
	redo,
	setRenderFunction,
	undo,
} from "./libs/Command.js";
import { YogaMat } from "./libs/SingleObjects.js";
import { checkCollision, disposeObject, duplicateObject } from "./libs/Utils.js";



let container,
	stats,
	genMaterial,
	lightsGroup,
	camera,
	scene,
	renderer,
	control,
	orbit,
	sun,
	roof,
	oldDraggablePosition
const clickMouse = new THREE.Vector2(); // create once
const raycaster = new THREE.Raycaster(); // create once
var draggable;
var oldDraggable;
const gymFloor = [];
const receptionRestingArea = [];
const walls = []
const collideWalls = []

const bulbLuminousPowers = {
	"110000 lm (1000W)": 110000,
	"3500 lm (300W)": 3500,
	"1700 lm (100W)": 1700,
	"1000 lm (90W)": 1000,
	"800 lm (60W)": 800,
	"400 lm (40W)": 500,
	"180 lm (25W)": 180,
	"20 lm (4W)": 20,
	Off: 0,
};

const lightTypes = {
	Circle: loadCeilingLight,
	Square: loadSquareBulb,
};

const LightParams = {
	bulbPower: Object.keys(bulbLuminousPowers)[3],
	exposure: 1,
	lightType: Object.keys(lightTypes)[0],
};

const hdrEquirect = new RGBELoader(manager)
	.load("assets/textures/roy.hdr", function () {
		hdrEquirect.mapping = THREE.EquirectangularReflectionMapping;

		init();
		render();
		loadCeilingLight();
		loadWalls();
		loadFloor();
		loadRoof();
		loadGUI();
	});

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

	sun = new THREE.Vector3();
	// scene.background = hdrEquirect;

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
		scene.add(sky);

		scene.environment = renderTarget.texture;
		// Update the directional light position
		directionalLight.position.copy(sun).multiplyScalar(10000);
	}

	// Add a directional light to represent the sun
	const directionalLight = new THREE.DirectionalLight(0xffffff, 5);
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

	genMaterial = new THREE.MeshPhysicalMaterial({
		color: 0xffffff,
		metalness: 1,
		roughness: 0,
		ior: 1.5, //
		// envMap: hdrEquirect,
		envMapIntensity: 1,
		transmission: 0, // // use material.transmission for glass materials
		specularIntensity: 1, //
		specularColor: 0xffffff, //
		opacity: 1,
		side: THREE.DoubleSide,
		transparent: true,
	});

	loadAssets(scene, render, genMaterial);
	//

	orbit = new OrbitControls(camera, renderer.domElement);
	orbit.maxPolarAngle = Math.PI * 0.495;
	orbit.target.set(94, 26, -22);
	orbit.update();

	//

	// the transform controls (movement)
	control = new TransformControls(camera, renderer.domElement);
	control.showY = false
	control.addEventListener("change", () => {
		if (control.object) {
			const wall = checkCollision(control.object, collideWalls)

			
			if (wall) {
				const obj = control.object
				control.detach()
				
				// Check if there's any movement or rotation
				const positionChanged = !obj.position.equals(draggable.userData.oldPosition);
				const rotationChanged = !obj.rotation.equals(draggable.userData.oldRotation);
				
				// check if object was moved
				
				if (positionChanged) {
					const offset = 0.5

					// Check collision on the x-axis
					// check if it moved
					if (obj.position.x != draggable.userData.oldPosition.x) {
						if ((0 - obj.position.x) > 0) {
							obj.position.x += offset; // Move left
						} else {
							obj.position.x -= offset; // Move right
						}
					}
					
					// Check collision on the z-axis
					// check if it moved
					if (obj.position.z != draggable.userData.oldPosition.z) {
						if ((0 - obj.position.z) > 0) {
							obj.position.z += offset; // Move back
						} else {
							obj.position.z -= offset; // Move forward
						}
					}
					const cmd = new MoveObjectCommand(obj, obj.position.clone(), draggable.userData.oldPosition, control)
					executeCommand(cmd)
					draggable = obj
					control.attach(obj)
					
				}

				else if (rotationChanged) {
					const rotationOffset = 0.1; // Adjust this value as needed

					if (obj.rotation.y !== draggable.userData.oldRotation.y) {
						if ((0 - obj.rotation.y) > 0) {
							obj.rotation.y += rotationOffset; // Rotate counterclockwise
						} else {
							obj.rotation.y -= rotationOffset; // Rotate clockwise
						}
					}
					const cmd = new RotateObjectCommand(obj, obj.rotation.clone(), draggable.userData.oldRotation, control)
					executeCommand(cmd)
					draggable = obj
					control.attach(obj)
				}
			}
			render()
		}
	});

	control.addEventListener("dragging-changed", function (event) {
		orbit.enabled = !event.value;
	});

	control.addEventListener("mouseDown", function (event) {
		if (control.object && draggable) {
			draggable.userData.oldPosition = control.object.position.clone();
			draggable.userData.oldRotation = control.object.rotation.clone();
		}

	});

	control.addEventListener("mouseUp", function (event) {
		if (control.object) {
			const oldPosition = control.object.userData.oldPosition;
			const newPosition = control.object.position.clone();
			
			const oldRotation = control.object.userData.oldRotation;
			const newRotation = control.object.rotation.clone();
			if (!oldPosition.equals(newPosition)) {
				const moveCommand = new MoveObjectCommand(
					control.object,
					newPosition,
					oldPosition,
					control
				);
				executeCommand(moveCommand);
			}

			else if (!oldRotation.equals(newRotation)) {
				const rotateCommand = new RotateObjectCommand(
					control.object,
					newRotation,
					oldRotation,
					control
				);
				executeCommand(rotateCommand);
			}
		}
	});

	scene.add(control);

	//

	stats = new Stats();
	container.appendChild(stats.dom);

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
	oldDraggable = draggable ? draggable : oldDraggable;
	// Find intersections
	const found = intersect(clickMouse);

	// If an object is found, make it draggable
	if (found.length > 0) {
		if (found.length <= 2) {
			control.detach()
			draggable = null
			oldDraggable = null
		}
		draggable = null;
		let temp = null;
		// Find the first draggable object
		for (let i = 0; i < found.length; i++) {
			if (
				found[i].object.userData.draggable ||
				found[i].object.userData.floor ||
				found[i].object.userData.isRoof
			) {
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
		// zoom here remove (s)
		if (temp.userData.floor && isDoubleClick) {
			const intersectionPoint = found[found.length - 2].point;
			zoomIn(temp, intersectionPoint);
			return;
		}
		if (temp.userData.isRoof && isDoubleClick) {
			const intersectionPoint = found[found.length - 2].point;
			console.log(intersectionPoint)
			return;
		}
		// Find the parent object with userData.isParent
		let parent = temp;
		while (parent) {
			if (parent.userData.isParent) {
				draggable = parent;
				console.log(draggable)
				control.attach(draggable);

				if (isDoubleClick) {
					zoomIn(draggable);
				}
				render();
				return;
			} else {
				parent = parent.parent;
			}
		}
		if (!draggable) {
			draggable = draggable ? draggable : oldDraggable;
    		draggable ? control.attach(draggable) : control.detach();
			render()
		}
	}
}


async function zoomIn(object, pos = null, zoomLevel = "full", customFactor = 1.5) {
    let box;
    // Smoothly zoom the camera to the selected object
    if (pos) {
        let yMat = await YogaMat();
        yMat.position.set(pos.x, 10, pos.z);
        box = new THREE.Box3().setFromObject(yMat);

        // Dispose of the loaded object to free up memory
        disposeObject(yMat);
    } else {
        box = new THREE.Box3().setFromObject(object);
    }
    const center = box.getCenter(new THREE.Vector3());

    const size = box.getSize(new THREE.Vector3());
    const maxDim = Math.max(size.x, size.y, size.z);

    const fov = camera.fov * (Math.PI / 180);
    const cameraZ = Math.abs(maxDim / 2 / Math.tan(fov / 2));

    let distanceFactor;

    switch (zoomLevel) {
        case "full":
            distanceFactor = 1.5; // Full zoom
            break;
        case "half":
            distanceFactor = 3; // Half zoom
            break;
        case "custom":
            distanceFactor = customFactor; // Custom zoom based on the provided factor
            break;
        default:
            distanceFactor = 1.5; // Default to full zoom if an invalid value is passed
    }

    const distance = cameraZ + maxDim * distanceFactor; // Adjust camera distance
    const direction = new THREE.Vector3();
    camera.getWorldDirection(direction);
    direction.normalize();

    const targetPosition = new THREE.Vector3()
        .copy(center)
        .addScaledVector(direction, -distance);

    const zoomDuration = 1000; // 1 second

    new TWEEN.Tween(camera.position)
        .to(
            { x: targetPosition.x, y: targetPosition.y, z: targetPosition.z },
            zoomDuration
        )
        .easing(TWEEN.Easing.Quadratic.InOut)
        .onUpdate(() => orbit.update())
        .start();

    new TWEEN.Tween(orbit.target)
        .to({ x: center.x, y: center.y, z: center.z }, zoomDuration)
        .easing(TWEEN.Easing.Quadratic.InOut)
        .onUpdate(() => orbit.update())
        .start();
}

function rotateControl() {
	control.setMode("rotate");
	control.showY = true
	control.showX = false
	control.showZ = false
}

function translateControl() {
	control.setMode("translate");
	control.showY = false
	control.showX = true
	control.showZ = true
}

function deleteDraggable() {
	if (control.object) {
		const deleteCommand = new RemoveObjectCommand(scene, control.object, control, setDraggable);
		executeCommand(deleteCommand);
	}
}

function onKeyDown(event) {
	// change the control settings
	switch (event.key) {
		case "Shift":
			control.setTranslationSnap(1);
			control.setRotationSnap(THREE.MathUtils.degToRad(15));
			control.setScaleSnap(0.25);
			break;

		case "Escape":
			control.detach();
			draggable = null;
			oldDraggable = null;
			break;
		
		case "m": // translate
			translateControl();
			break;

		case "r": // rotate
			rotateControl();
			break;

		case "+":
		case "=":
			control.setSize(control.size + 0.1);
			break;

		case "-":
		case "_":
			control.setSize(Math.max(control.size - 0.1, 0.1));
			break;


		case event.ctrlKey && "z":
			undo();
			break;

		case event.ctrlKey && "y":
			redo();
			break;

		case "Delete":
			deleteDraggable();
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
	}
}

function onWindowResize() {
	camera.aspect = window.innerWidth / window.innerHeight;
	camera.updateProjectionMatrix();

	renderer.setSize(window.innerWidth, window.innerHeight);
}

function generateTexture() {
	const canvas = document.createElement("canvas");
	canvas.width = 2;
	canvas.height = 2;

	const context = canvas.getContext("2d");
	context.fillStyle = "white";
	context.fillRect(0, 1, 2, 1);

	return canvas;
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

function loadSquareBulb() {
	const group = new THREE.Group();
	const mainGroup = new THREE.Group();
	group.name = "Square";
	
	// Define the outer square shape
	const outerSquareSize = 2;
	const innerSquareSize = 1;

	const shape = new THREE.Shape();
	shape.moveTo(-outerSquareSize / 2, -outerSquareSize / 2);
	shape.lineTo(outerSquareSize / 2, -outerSquareSize / 2);
	shape.lineTo(outerSquareSize / 2, outerSquareSize / 2);
	shape.lineTo(-outerSquareSize / 2, outerSquareSize / 2);
	shape.lineTo(-outerSquareSize / 2, -outerSquareSize / 2);

	// Define the inner square (hole) as a path
	const hole = new THREE.Path();
	hole.moveTo(-innerSquareSize / 2, -innerSquareSize / 2);
	hole.lineTo(innerSquareSize / 2, -innerSquareSize / 2);
	hole.lineTo(innerSquareSize / 2, innerSquareSize / 2);
	hole.lineTo(-innerSquareSize / 2, innerSquareSize / 2);
	hole.lineTo(-innerSquareSize / 2, -innerSquareSize / 2);

	shape.holes.push(hole);

	// Create the geometry from the shape
	const geometry = new THREE.ShapeGeometry(shape);

	// Create a material and a mesh
	const material = new THREE.MeshStandardMaterial();
	const squareRing = new THREE.Mesh(geometry, material);

	// Add the square ring to the scene
	squareRing.rotation.set(
		THREE.MathUtils.degToRad(90),
		THREE.MathUtils.degToRad(0),
		THREE.MathUtils.degToRad(0),
	)
	squareRing.scale.set(1.892, 2.177, 1)
	const light = new THREE.PointLight()
	light.intensity = 1000
	light.decay = 1.5
	light.userData.draggable = true
	group.add(squareRing, light)
	const objects = duplicateObject("CellingLight", group)
	objects.forEach((e) => mainGroup.add(e))
	if (lightsGroup) {
		scene.remove(lightsGroup);
	}
	lightsGroup = mainGroup
	scene.add(lightsGroup)
	render();
}

function loadCeilingLight() {
	const mainGroup = new THREE.Group();
	const group = new THREE.Group();
	group.name = "Celling";
	const geo = new THREE.RingGeometry()
	const mat = new THREE.MeshStandardMaterial()
	const mesh = new THREE.Mesh(geo, mat)
	mesh.rotation.set(
		THREE.MathUtils.degToRad(90),
		THREE.MathUtils.degToRad(0),
		THREE.MathUtils.degToRad(0),
	)
	mesh.scale.set(1.892, 2.177, 1)
	const light = new THREE.PointLight()
	light.intensity = 1000
	light.decay = 1.5
	group.add(mesh, light)
	group.position.set(315.895, 46.871, 99.200);
	const objects = duplicateObject("CellingLight", group)
	objects.forEach((e) => mainGroup.add(e))
	if (lightsGroup) {
		scene.remove(lightsGroup);
	}
	lightsGroup = mainGroup
	scene.add(lightsGroup)
	render();
}

function loadFloor() {
	objectLoader.load(`${MODEL_PATH}/json/Floor.json`, (obj) => {
		obj.children.forEach((child) => {
			child.receiveShadow = true;
			delete child.userData.draggable;
			if (child.userData.place === "rca") {
				receptionRestingArea.push(child);
			} else {
				gymFloor.push(child);
			}
		});

		scene.add(obj);
	});
	render();
}

function loadWalls() {
	const material = new THREE.MeshStandardMaterial({
		color: new THREE.Color("#72563b"),
		map: textureLoader.load("assets/textures/smooth plaster/map.jpg"),
		roughnessMap: textureLoader.load("assets/textures/smooth plaster/rough.jpg")
	})
	
	objectLoader.load(`${MODEL_PATH}/json/Upper wall.json`, (obj) => {
		obj.children.forEach((child) => {
			child.material = material
			delete child.userData.draggable
			if (!child.userData.innerWall) {
				collideWalls.push(child)
			}
			walls.push(child)
		})
		scene.add(obj)
	})
	
	objectLoader.load(`${MODEL_PATH}/json/Gym outline.json`, (obj) => {
		scene.add(obj)
	})
	render();
}


function loadRoof() {
	const geometry = new THREE.PlaneGeometry()
	const material = new THREE.MeshStandardMaterial({
		color: new THREE.Color("#404040")
	})
	roof = new THREE.Mesh(geometry, material)
	roof.position.set(98.106, 47.737, -16.232)
	roof.scale.set(558.699, 333.325, 1)
	roof.rotation.set(
		THREE.MathUtils.degToRad(90),
		THREE.MathUtils.degToRad(0),
		THREE.MathUtils.degToRad(0),
	)
	roof.userData.isRoof = true
	scene.add(roof)
}

function setDraggable(val) {
	draggable = val
	oldDraggable = val
}

function loadGUI() {

	// GUI
	var ColorPalette = {
		receptionRestingAreaFloor: "#FFFFFF",
		mainGymFloor: "#FFFFFF",
		wallsColor: "#72563b"
	};
	
	// Models
	const folderModels = gui.addFolder("Models");
	Object.keys(GUIMap).forEach((key) => {
		const map = GUIMap[key];
		const name = map.name;
		const obj = {};
		obj[name] = () => {
			map.func({material: genMaterial}).then((obj) => {
				if (name == "Wall Art") {
					const n = Math.floor(Math.random() * 5) + 1;
					const mat = new THREE.MeshStandardMaterial({
						map: textureLoader.load(`./assets/textures/wallArts/${n}.jpg`),
					});
					obj.children[0].material = mat;
				} else if (name === "Coffee Table") {
					obj = obj[0];
				} else if (name === "Stool") {
					obj = obj[2];
				}
				let x, y, z
				const place = map.place;
				if (place === reception) {
					x = 142.42
					z = -102.10
				} else if (place == gym1) {
					x = -89.80
					z = 56
				} else if (place === gym2) {
					x = 115.17
					z = 49.55
				} else if (place === restingArea) {
					x = 301.38
					z = 67.10
				} else if (place === coffeeSection) {
					x = 96.70
					z = -147.74
				} else if (place === weightRoom) {
					x = 303.23
					z = -7.92
				} else if (place === yogaRoom) {
					x = 236.00
					z = -91.49
				}
					
				if (x) {
					obj.position.set(x, obj.position.y, z)
				}
				else {
					if (map.position) {
						const p = map.position
						obj.position.set(p[0], p[1], p[2])
					}
				}
				const cmd = new AddObjectCommand(scene, obj, control, setDraggable);
				executeCommand(cmd);
				zoomIn(obj, null, "half")
			});
		};
		const m = folderModels.add(obj, name);
		const img = document.createElement("img");
		img.src = `./assets/images/${map.image}.jpg`;
		img.style.marginLeft = "10px";
		img.style.marginRight = "10px";
		img.style.width = "20px";
		img.style.height = "20px";
		const span = m.__li.querySelector(".property-name");
		span.insertBefore(img, span.firstChild);
	});
	
	// lights
	const folderLights = gui.addFolder("Lights");
	
	function increaseIntensity() {
		lightsGroup.children.forEach((light) => {
			const pointBulb = light.children[light.children.length - 1];
			pointBulb.intensity = bulbLuminousPowers[LightParams.bulbPower];
		});
	}
	
	function changeBulbType(value) {
		lightTypes[value]();
	}
	
	folderLights
		.add(LightParams, "lightType", Object.keys(lightTypes))
		.name("Bulb Type")
		.onChange(changeBulbType);
	
	folderLights
		.add(LightParams, "bulbPower", Object.keys(bulbLuminousPowers))
		.name("Bulb Power")
		.onChange(increaseIntensity);
	// lights
	
	// floor
	const folderFloor = gui.addFolder("Floors");
	const mainGymFloorTypes = {
		"Dry Blast Mold": {
			map: textureLoader.load("assets/textures/plastic/COL.png"),
			rough: textureLoader.load("assets/textures/plastic/GLOSS.png"),
		},
		"Scratched Marble": {
			map: textureLoader.load("assets/textures/scratch/map.jpg"),
			bump: textureLoader.load("assets/textures/scratch/bump.jpg"),
		},
		"Smudged Marble": {
			map: textureLoader.load("assets/textures/smudge/map.jpg"),
			bump: textureLoader.load("assets/textures/smudge/bump.jpg"),
		},
	};
	
	const receptionRestingTypes = {
		"Oak Wood Veneer": {
			map: textureLoader.load("assets/textures/oak/map.jpg"),
			rough: textureLoader.load("assets/textures/oak/rough.jpg"),
		},
		"Speckled Sunset Terrazzo": {
			map: textureLoader.load("assets/textures/terazzFloor/map.png"),
			rough: textureLoader.load("assets/textures/terazzFloor/rough.png"),
		},
		"White Denali Quartzite": {
			map: textureLoader.load("assets/textures/marbleFloor/map.jpg"),
			rough: textureLoader.load("assets/textures/marbleFloor/rough.jpg"),
		},
	};
	
	const wallTypes = {
		"Plain Painted Plaster": {
			map: textureLoader.load("assets/textures/smooth plaster/map.jpg"),
			rough: textureLoader.load("assets/textures/smooth plaster/rough.jpg"),
		},
		"Poured Concrete Panel ": {
			map: textureLoader.load("assets/textures/concrete/map.jpg"),
			rough: textureLoader.load("assets/textures/concrete/rough.jpg"),
		},
		"Clay Rammed Earth": {
			map: textureLoader.load("assets/textures/rammed earth/map.png"),
			rough: textureLoader.load("assets/textures/rammed earth/rough.png"),
		},
		"Painted Stucco": {
			map: textureLoader.load("assets/textures/stucco cast/map.png"),
			rough: textureLoader.load("assets/textures/stucco cast/rough.png"),
		},
	};
	
	const typeParams = {
		mainGymFloor: Object.keys(mainGymFloorTypes)[0],
		receptionRestingFLoor: Object.keys(receptionRestingTypes)[0],
		walls: Object.keys(wallTypes)[0],
	};
	
	// // reception/resting area floor
	let prevRRAColor = new THREE.Color(ColorPalette.receptionRestingAreaFloor);
	let newRRAColor;
	let canChangeRRAColor = true;
	const receptionRoomFolder = folderFloor.addFolder("Reception/Resting Area");
	receptionRoomFolder.add(typeParams, "receptionRestingFLoor", Object.keys(receptionRestingTypes)).name("Floor Type").onChange(handleRRAFloorTypeChange);
	const colorController = receptionRoomFolder
	.addColor(ColorPalette, "receptionRestingAreaFloor")
	.name("Floor color")
	.onChange(handleRRAColorChange);
	colorController.domElement.addEventListener("mouseup", handleRRAMouseUp);
	
	function handleRRAColorChange(val) {
		if (canChangeRRAColor) {
			prevRRAColor = receptionRestingArea[0].material.color.clone();
			canChangeRRAColor = false;
		}
		newRRAColor = new THREE.Color(val);
		receptionRestingArea.forEach((child) => {
			child.material.color.set(newRRAColor);
		});
	}
	function handleRRAMouseUp() {
		const cmd = new changeFloorColorCommand(
			new THREE.Color(newRRAColor),
			prevRRAColor,
			receptionRestingArea,
			ColorPalette,
			colorController,
			"receptionRestingAreaFloor"
		);
		executeCommand(cmd);
		canChangeRRAColor = true;
	}
	// // reception/resting area floor
	
	// main gym floor
	let prevMGColor = new THREE.Color(ColorPalette.mainGymFloor);
	let newMGColor;
	let canChangeMGColor = true;
	const manGymFloorFolder = folderFloor.addFolder("Main Gym Floor");
	// manGymFloorFolder.add(typeParams, "mainGymFloor", Object.keys(mainGymFloorTypes)).name("Floor Type").onChange(handleMGFloorTypeChange);
	const colorMGController = manGymFloorFolder
	.addColor(ColorPalette, "mainGymFloor")
	.name("Floor color")
		.onChange(handleMGColorChange);
	colorMGController.domElement.addEventListener("mouseup", handleMGMouseUp);
	
	function handleMGColorChange(val) {
		if (canChangeMGColor) {
			prevMGColor = gymFloor[0].material.color.clone();
			canChangeMGColor = false;
		}
		newMGColor = new THREE.Color(val);
		gymFloor.forEach((child) => {
			child.material.color.set(newMGColor);
		});
	}
	
	function handleMGMouseUp() {
		const cmd = new changeFloorColorCommand(
			new THREE.Color(newMGColor),
			prevMGColor,
			gymFloor,
			ColorPalette,
			colorMGController,
			"mainGymFloor"
		);
		executeCommand(cmd);
		canChangeMGColor = true;
	}
	
	function handleMGFloorTypeChange(val) {
		const data = mainGymFloorTypes[val];
		const prevMat = gymFloor[0].material.clone();
		const newMat = gymFloor[0].material.clone();
		newMat.map = data.map;
		newMat.roughnessMap = data.rough;
		newMat.bumpMap = data.bump;
		const cmd = new ChangeFloorTypeCommand(newMat, prevMat, gymFloor);
		executeCommand(cmd);
	}
	
	function handleRRAFloorTypeChange(val) {
		console.log("change");
		const data = receptionRestingTypes[val];
		const prevMat = receptionRestingArea[0].material.clone();
		const newMat = receptionRestingArea[0].material.clone();
		newMat.map = data.map;
		newMat.roughnessMap = data.rough;
		const cmd = new ChangeFloorTypeCommand(newMat, prevMat, receptionRestingArea);
		executeCommand(cmd);
	}
	// main gym floor
	
	// walls
	
	const wallFolder = gui.addFolder("Walls")
	let prevWallColor = new THREE.Color(ColorPalette.wallsColor);
	let newWallColor;
	let canChangeWallColor = true;
	wallFolder.add(typeParams, "walls", Object.keys(wallTypes)).name("Wall Type").onChange(handleWallTypeChange);
	const wallsColorController = wallFolder
	.addColor(ColorPalette, "wallsColor")
	.name("Wall color")
	.onChange(handleWallColorChange);
	wallsColorController.domElement.addEventListener("mouseup", handleWallMouseUp);
	function handleWallColorChange(val) {
		if (canChangeWallColor) {
			prevWallColor = walls[0].material.color.clone();
			canChangeWallColor = false;
		}
		newWallColor = new THREE.Color(val);
		walls.forEach((child) => {
			child.material.color.set(newWallColor);
		});
	}
	function handleWallMouseUp() {
		const cmd = new ChangeWallColorCommand(
			new THREE.Color(newWallColor),
			prevWallColor,
			walls,
			ColorPalette,
			wallsColorController,
			"wallsColor"
		);
		executeCommand(cmd);
		canChangeWallColor = true;
	}
	
	function handleWallTypeChange(val) {
		const data = wallTypes[val];
		const prevMat = walls[0].material.clone();
		const newMat = walls[0].material.clone();
		newMat.map = data.map
		newMat.roughnessMap = data.rough
		const cmd = new ChangeWallTypeCommand(newMat, prevMat, walls);
		executeCommand(cmd);
	}
	// walls
	const editFolder = gui.addFolder("Edit")
	editFolder.add(
		{
			"Clone Object": () => {
				if (control.object) {
					const cmd = new CloneObjectCommand(scene, control, draggable)
					executeCommand(cmd)
				}
			}
		},
		"Clone Object"
	)
	editFolder.add({"Undo": undo}, "Undo")
	editFolder.add({"Redo": redo}, "Redo")
	editFolder.add({"Delete Object": deleteDraggable}, "Delete Object")

	// show tutorial
	gui.add(
		{
			"Show Tutorial": () => {
				closeTutorialWindow(true)
				window.open("tutorial.html")
			}
		},
		"Show Tutorial"
	)
	// Clear canvas
	gui.add(
		{
			"Clear Canvas": () => {
				if (window.confirm("Do you want to clear Canvas of all movable objects?")) {
					const cmd = new ClearCanvasCommand(scene, control);
					executeCommand(cmd);
				}
			},
		},
		"Clear Canvas"
	);
	// clear canvas
	gui.add(
		{
			"Go to Home": () => {
				window.location.href = "index.html"
			}
		},
		"Go to Home"
	)
}



