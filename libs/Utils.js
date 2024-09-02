import { GUI } from "./dat.gui.module.js";
import { MAP } from "./Map.js";
import * as THREE from "./three.module.js";
import { GLTFLoader } from "./GLTFLoader.js";
import { OBJLoader } from "./OBJLoader.js";

export function closeTutorialWindow(val=false) {
	localStorage.setItem('closeTutorialWindow', val)
}
export const gui = new GUI({});
export const manager = new THREE.LoadingManager();
var initialLoad = true;
const loadingScreen = document.getElementById("loading-screen");
const loadingProgress = document.getElementById("loading-progress");

manager.onStart = function (url, itemsLoaded, itemsTotal) {
	if (initialLoad) {
		gui.hide();
	}
	console.log(
		"Started loading file: " +
			url +
			".\nLoaded " +
			itemsLoaded +
			" of " +
			itemsTotal +
			" files."
	);
};

manager.onLoad = function () {
	console.log("Loading complete!");
	document.querySelector('body').style.setProperty('--before-background', 'none');
	document.querySelector('body').style.setProperty('--before-content', 'none');
	loadingScreen.style.display = "none";
	document.getElementById("container").style.display = "block";
	if (initialLoad) {
		gui.show();
		initialLoad = false;
	}
};

manager.onProgress = function (url, itemsLoaded, itemsTotal) {
	const progress = Math.round((itemsLoaded / itemsTotal) * 100);
	loadingProgress.textContent = progress + "%";
	document.querySelector("#progressbar .bar").style.width = `${
		(itemsLoaded * 100) / itemsTotal
	}%`;
	// console.log('Loading file: ' + url + '.\nLoaded ' + itemsLoaded + ' of ' + itemsTotal + ' files.');
};

manager.onError = function (url) {
	console.log("There was an error loading " + url);
};

// Function to recursively add userData to all children
export function addUserDataRecursively(object) {
	object.userData.draggable = true;
	object.castShadow = true;
	object.receiveShadow = true;
	object.children.forEach((child) => {
		addUserDataRecursively(child);
	});
}

export function duplicateObject(name, object) {
	const map = MAP[name];
	if (!map) {
		return [];
	}
	let count = 0;
	const newObjects = [];
	for (let key in map.children) {
		let child = map.children[key];
		const position = child.position;
		const rotation = child.rotation;
		const scale = child.scale;
		const newObject = object.clone();
		newObject.name = `${key}${name}`;
		newObject.position.set(position[0], position[1], position[2]);
		if (rotation) {
			newObject.rotation.set(
				THREE.MathUtils.degToRad(rotation[0]),
				THREE.MathUtils.degToRad(rotation[1]),
				THREE.MathUtils.degToRad(rotation[2])
			);
		}
		if (scale) {
			newObject.scale.set(scale[0], scale[1], scale[2]);
		}
		newObjects.push(newObject);
	}
	return newObjects;
}

export function showToast(text, timeout = 2000) {
	var toast = document.getElementById("toast");
	toast.className = "toast show";
	toast.innerHTML = text;
	setTimeout(function () {
		toast.className = toast.className.replace("show", "");
	}, timeout);
}

export function checkCollision(object, walls) {
	if (!object) {
		return false;
	}
	const objectBox = new THREE.Box3().setFromObject(object);
	for (let wall of walls) {
		const wallBox = new THREE.Box3().setFromObject(wall);
		if (objectBox.intersectsBox(wallBox)) {
			return wall; // Collision detected
		}
	}
	return false;
}

export function disposeObject(object) {
	object.traverse((child) => {
		if (child.geometry) {
			child.geometry.dispose();
		}

		if (child.material) {
			if (Array.isArray(child.material)) {
				child.material.forEach((material) => {
					disposeMaterial(material);
				});
			} else {
				disposeMaterial(child.material);
			}
		}
	});
}

export function disposeMaterial(material) {
	if (material.map) material.map.dispose();
	if (material.lightMap) material.lightMap.dispose();
	if (material.aoMap) material.aoMap.dispose();
	if (material.emissiveMap) material.emissiveMap.dispose();
	if (material.bumpMap) material.bumpMap.dispose();
	if (material.normalMap) material.normalMap.dispose();
	if (material.displacementMap) material.displacementMap.dispose();
	if (material.roughnessMap) material.roughnessMap.dispose();
	if (material.metalnessMap) material.metalnessMap.dispose();
	if (material.alphaMap) material.alphaMap.dispose();
	if (material.envMap) material.envMap.dispose();

	material.dispose();
}

export const textureLoader = new THREE.TextureLoader(manager);
export const objectLoader = new THREE.ObjectLoader(manager);
export const gltfLoader = new GLTFLoader(manager);
export const objLoader = new OBJLoader(manager);
