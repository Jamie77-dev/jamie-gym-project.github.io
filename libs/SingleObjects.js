import * as THREE from "./three.module.js";
import { addUserDataRecursively, gltfLoader, textureLoader, objectLoader, objLoader } from "./Utils.js";

const MODEL_PATH = "./assets/models";
const TEXTURE_PATH = "./assets/textures";
const POSITION = [0, 0, 0];

export function BoxingRing() {
	return new Promise((resolve, reject) => {
		gltfLoader.load(`${MODEL_PATH}/gltf/BoxingRing.glb`, function (gltf) {
			const ring = gltf.scene;
			ring.scale.set(10, 10, 10);
			ring.position.set(...POSITION);
			addUserDataRecursively(ring);
			ring.userData.isParent = true;
			resolve(ring);
		});
	});
}

export function ArmChair() {
	// armChair
	return new Promise((resolve, reject) => {
		gltfLoader.load(`${MODEL_PATH}/gltf/armChair.glb`, function (gltf) {
			const chair = gltf.scene;
			chair.scale.set(40, 40, 40);
			chair.rotation.set(
				THREE.MathUtils.degToRad(-180),
				THREE.MathUtils.degToRad(0),
				THREE.MathUtils.degToRad(-180)
			);
			addUserDataRecursively(chair);
			chair.userData.isParent = true;
			chair.position.set(...POSITION);
			resolve(chair);
		});
	});
}

export function Cabinet() {
	// Cabinet
	return new Promise((resolve, reject) => {
		gltfLoader.load(`${MODEL_PATH}/gltf/Cabinet.glb`, function (gltf) {
			const cabinet = gltf.scene;
			cabinet.scale.set(20, 14, 20);
			cabinet.position.set(...POSITION);
			addUserDataRecursively(cabinet);
			cabinet.userData.isParent = true;
			resolve(cabinet);
		});
	});
}

// Elliptical
export function Elliptical({ material }) {
	return new Promise((resolve, reject) => {
		objectLoader.load(`${MODEL_PATH}/json/Elliptical.json`, (obj) => {
			obj.userData.isParent = true;
			const blackMetalMaterial = material.clone();
			blackMetalMaterial.color = new THREE.Color(0x00000);
			const plasticMaterial = new THREE.MeshStandardMaterial({
				roughness: 1,
				metalness: 0.1,
				color: new THREE.Color("#212121"),
				emissive: new THREE.Color("#212121"),
			});
			const whiteMetalMaterial = material.clone();
			whiteMetalMaterial.color = new THREE.Color("#ebebeb");
			addUserDataRecursively(obj);
			const plasticNames = [
				"Group_026",
				"Group_016",
				"Group_022",
				"Group_002",
				"Group_001",
				"Group_020",
				"Group_038",
				"Group_038",
			];
			const whiteMetal = [
				"32_tooth_chainring_001",
				"42_tooth_chainring_001",
				"spider_001",
				"BBracket_001",
				"Group_005",
				"Group_004",
				"Group_014",
				"Group_015",
				"Group_018",
				"Group_031",
				"DIA0_5_001",
				"Group_001",
			];
			const redLogo = ["Group_032", "Group_030", "Group_002", "Group_003"];
			obj.children.forEach((child) => {
				if (redLogo.includes(child.name)) {
					const mat = material.clone();
					mat.color = new THREE.Color("#ec0909");
					child.material = mat;
				} else if (whiteMetal.includes(child.name)) {
					child.material = whiteMetalMaterial;
				} else if (plasticNames.includes(child.name)) {
					child.material = plasticMaterial;
				} else {
					child.material = blackMetalMaterial;
				}
			});
			obj.position.set(...POSITION);
			resolve(obj);
		});
	});
}

export function ExerciseBike({ material }) {
	const blackMetalMaterial = material.clone();
	blackMetalMaterial.color = new THREE.Color("#000000");
	const plasticMaterial = new THREE.MeshStandardMaterial({
		roughness: 1,
		metalness: 0.1,
		color: new THREE.Color("#0d0d0d"),
		emissive: new THREE.Color("#0d0d0d"),
	});
	const whiteMetal = material.clone();
	return new Promise((resolve, reject) => {
		gltfLoader.load(`${MODEL_PATH}/gltf/ExerciseBike.glb`, function (gltf) {
			const obj = gltf.scene;
			obj.userData.isParent = true;
			addUserDataRecursively(obj);
			obj.scale.set(0.1, 0.1, 0.1);
			obj.position.set(...POSITION);
			obj.rotation.set(
				THREE.MathUtils.degToRad(-180),
				THREE.MathUtils.degToRad(90),
				THREE.MathUtils.degToRad(-180)
			);
			const main = obj.children[0].children;
			main[0].material = blackMetalMaterial;
			main[1].material = whiteMetal;
			main[2].material = new THREE.MeshStandardMaterial({
				map: textureLoader.load("/assets/textures/exerciseBike/OnOff.png"),
			});
			main[3].material = plasticMaterial;
			main[4].material = new THREE.MeshStandardMaterial({
				map: textureLoader.load("/assets/textures/exerciseBike/TgAl-A.jpg"),
			});
			main[5].material = plasticMaterial;
			main[6].material = new THREE.MeshStandardMaterial({
				map: textureLoader.load("/assets/textures/exerciseBike/Unity Cross Per.jpg"),
			});
			Array(main[7], main[8]).forEach((e) => {
				e.material = new THREE.MeshStandardMaterial({
					map: textureLoader.load("/assets/textures/exerciseBike/TgAl.jpg"),
				});
			});
			resolve(obj);
		});
	});
}

export function Hyperextension() {
	return new Promise((resolve, reject) => {
		objectLoader.load(`${MODEL_PATH}/json/Hyperextension.json`, (obj) => {
			obj.scale.set(0.11, 0.11, 0.11);
			// obj.rotation.set(
			//     THREE.MathUtils.degToRad(-180),
			//     THREE.MathUtils.degToRad(90),
			//     THREE.MathUtils.degToRad(-180),
			// )
			obj.position.set(...POSITION);
			obj.userData.isParent = true;
			addUserDataRecursively(obj);
			resolve(obj);
		});
	});
}

export function GroupEquipment({ material }) {
	return new Promise((resolve, reject) => {
		objectLoader.load(`${MODEL_PATH}/json/GroupEquipment.json`, (obj) => {
			const metalMaterial = material.clone();
			const plasticMaterial = new THREE.MeshStandardMaterial({
				roughness: 1,
				metalness: 0.1,
				color: new THREE.Color("#0d0d0d"),
				emissive: new THREE.Color("#0d0d0d"),
			});
			obj.children.forEach((child) => {
				const choice = Math.floor(Math.random() * 2);
				if (child.material) {
					if (choice == 1) {
						child.material = metalMaterial;
					} else {
						child.material = plasticMaterial;
					}
				}
			});
			obj.userData.isParent = true;
			addUserDataRecursively(obj);
			obj.position.set(...POSITION);
			resolve(obj);
		});
	});
}

export function TeaPot({ material }) {
	// load pot
	return new Promise((resolve, reject) => {
		objLoader.load(`${MODEL_PATH}/obj/teapot.obj`, (obj) => {
			const metalMaterial = material.clone();
			const plasticMaterial = new THREE.MeshStandardMaterial({
				roughness: 0,
				metalness: 1,
				color: new THREE.Color("#0d1117"),
			});
			obj.children[0].material = metalMaterial;
			obj.children[1].material = plasticMaterial;
			obj.children[2].material = metalMaterial;
			obj.children[3].material = plasticMaterial;
			obj.children[4].material = metalMaterial;
			obj.children[5].material = plasticMaterial;
			obj.children[6].material = metalMaterial;

			obj.scale.set(0.2, 0.2, 0.2);
			obj.position.set(...POSITION);
			addUserDataRecursively(obj);
			obj.userData.isParent = true;
			resolve(obj);
		});
	});
}

export function CSet({ material }) {

	// set
	return new Promise((resolve, reject) => {
		objLoader.load(`${MODEL_PATH}/obj/set.obj`, (obj) => {
			const mat = material.clone();
			mat.transmission = 0;
			mat.metalness = 0;

			obj.children.forEach((child) => {
				child.material = mat.clone();
			});

			obj.children[2].material.color = new THREE.Color("#cca928");
			obj.children[4].material.color = new THREE.Color("#f5d88a");

			obj.scale.set(0.2, 0.2, 0.2);
			obj.position.set(...POSITION);
			obj.rotation.set(
				THREE.MathUtils.degToRad(-180),
				THREE.MathUtils.degToRad(56.16),
				THREE.MathUtils.degToRad(-180)
			);
			addUserDataRecursively(obj);
			obj.userData.isParent = true;
			resolve(obj);
		});
	});
}

export function KettleBell() {
	return new Promise((resolve, reject) => {
		objectLoader.load(`${MODEL_PATH}/json/KettleBell.json`, (obj) => {
			const handleMaterial = new THREE.MeshStandardMaterial({
				roughness: 0,
				metalness: 0.84,
			});

			const bodyMaterial = new THREE.MeshStandardMaterial({
				roughness: 0,
				metalness: 0,
				color: "#e5ad34",
			});

			const numberMateria = new THREE.MeshStandardMaterial({
				roughness: 0,
				metalness: 1,
			});

			obj.children[0].material = handleMaterial;
			obj.children[1].material = bodyMaterial;
			obj.children[2].material = numberMateria;
			obj.userData.isParent = true;
			addUserDataRecursively(obj);
			obj.position.set(...POSITION);
			resolve(obj);
		});
	});
}

// Couch Material Start
const aoMap = textureLoader.load(`${TEXTURE_PATH}/couch/AO.png`);
const map = textureLoader.load(`${TEXTURE_PATH}/couch/COL.png`);
const displacementMap = textureLoader.load(`${TEXTURE_PATH}/couch/DISP.png`);
const metalnessMap = textureLoader.load(`${TEXTURE_PATH}/couch/METALNESS.png`);
const normalMap = textureLoader.load(`${TEXTURE_PATH}/couch/NRM.png`);
const roughnessMap = textureLoader.load(`${TEXTURE_PATH}/couch/ROUGHNESS.png`);

const textureScale = 30; // Adjust this value as needed
[aoMap, map, displacementMap, metalnessMap, normalMap, roughnessMap].forEach(
	(texture) => {
		if (texture) {
			texture.repeat.set(textureScale, textureScale);
			texture.wrapS = THREE.RepeatWrapping;
			texture.wrapT = THREE.RepeatWrapping;
		}
	}
);
const couchMaterial = new THREE.MeshStandardMaterial({
	aoMap: aoMap,
	map: map,
	displacementMap: displacementMap,
	metalnessMap: metalnessMap,
	normalMap: normalMap,
	roughnessMap: roughnessMap,
	displacementScale: 0.1, // Adjust as needed
	displacementBias: 0, // Adjust as needed
	color: new THREE.Color("#F2edca"),
	roughness: 0.5, // Adjust to change the reflection properties
	metalness: 0.2, // Adjust to change the metallic look
});
// Couch Material End

export function Mat() {
	return new Promise((resolve, reject) => {
		objectLoader.load(`${MODEL_PATH}/json/Mat.json`, (obj) => {
			addUserDataRecursively(obj);
			obj.userData.isParent = true;
			obj.material = couchMaterial.clone();
			// obj.material.displacementMap = null
			obj.position.set(...POSITION);
			resolve(obj);
		});
	});
}

export function Couch() {
	return new Promise((resolve, reject) => {
		objectLoader.load(`${MODEL_PATH}/json/Couch.json`, (obj) => {
			obj.children[0].material = couchMaterial.clone();
			obj.children[0].material.color = new THREE.Color("#F2edca");
			addUserDataRecursively(obj);
			obj.userData.isParent = true;
			obj.position.set(...POSITION);
			resolve(obj);
		});
	});
}

export function Plant() {
	// pot
	const potMat = new THREE.MeshStandardMaterial({
		color: "#694b00",
		roughness: 0,
		metalness: 0,
	});

	const stemMat = new THREE.MeshStandardMaterial({
		color: "#3f933e",
		roughness: 1,
		metalness: 0,
	});

	const leavesMat = new THREE.MeshStandardMaterial({
		color: "#3ad737",
		roughness: 1,
		metalness: 0,
	});
	return new Promise((resolve, reject) => {
		objectLoader.load(`${MODEL_PATH}/json/Plant.json`, (obj) => {
			obj.children[0].material = potMat;
			obj.children[1].material = stemMat;
			obj.children[2].material = leavesMat;

			obj.userData.isParent = true;
			addUserDataRecursively(obj);
			// obj.position.set(...POSITION);
			resolve(obj);
		});
	});
}

export function PullUpObject() {
	return new Promise((resolve, reject) => {
		let axis;
		objectLoader.load(`${MODEL_PATH}/json/axis.json`, (obj) => {
			const mat = new THREE.MeshStandardMaterial({
				metalness: 1,
				roughness: 0,
				color: new THREE.Color("#525151"),
			});
			obj.material = mat;
			axis = obj;
		});

		// pullUp
		gltfLoader.load(`${MODEL_PATH}/gltf/PullUpObject.glb`, function (gltf) {
			const group = new THREE.Group();
			const pull = gltf.scene;
			pull.children[0].children.forEach((child) => {
				child.material.roughness = 0;
				child.material.metalness = 0.04;
			});
			pull.scale.set(0.25, 0.25, 0.25);
			pull.position.set(-38.69, 0, -54.766);
			group.userData.isParent = true;
			group.add(pull, axis);
			group.position.set(...POSITION);
			addUserDataRecursively(group);
			resolve(group);
		});
	});
}

export function Clock() {
	return new Promise((resolve, reject) => {
		objectLoader.load(`${MODEL_PATH}/json/Clock.json`, (obj) => {
			addUserDataRecursively(obj);
			obj.userData.isParent = true;
			obj.position.set(...POSITION);
			resolve(obj);
		});
	});
}

export function CoffeeTableSet() {
	const coffeeMap = textureLoader.load(`${TEXTURE_PATH}/coffee/col.jpg`);
	const roughnessMap = textureLoader.load(`${TEXTURE_PATH}/coffee/rough.jpg`);

	// table
	return new Promise((resolve, reject) => {
		gltfLoader.load(`${MODEL_PATH}/gltf/CoffeeTable.glb`, function (gltf) {
			const objects = [];
			const table = gltf.scene;
			const mat = table.children[0].children[0].material;
			mat.roughness = 0;
			mat.metalness = 0.7;
			mat.map = coffeeMap;
			mat.roughnessMap = roughnessMap;

			table.rotation.set(
				THREE.MathUtils.degToRad(-90),
				THREE.MathUtils.degToRad(0),
				THREE.MathUtils.degToRad(0)
			);
			table.userData.isParent = true;
			addUserDataRecursively(table);
			table.scale.set(0.15, 0.15, 0.15);
			table.position.set(...POSITION);
			objects.push(table);

			// reception table
			const receptionTable = table.clone();
			receptionTable.position.set(...POSITION);
			receptionTable.scale.set(0.17, 0.17, 0.17);
			objects.push(receptionTable);

			// stool
			const stool = table.clone();
			stool.position.set(...POSITION);
			stool.scale.set(0.08, 0.08, 0.08);
			objects.push(stool);

			resolve(objects);
		});
	});
}

export function TotalTrainer({ material }) {
	const plasticMaterial = new THREE.MeshStandardMaterial({
		roughness: 1,
		metalness: 1,
		color: new THREE.Color("#525151"),
	});

	const plastics = [
		"for_legs",
		"main_bench",
		"moving_part_for_scrollers",
		"main_rama_cloth",
		"front_handlers",
		"moving_handlers",
		"pen_01",
		"pen_02",
		"legs_plastic",
		"moving_part_hz",
	];
	const black_metals = [];
	return new Promise((resolve, reject) => {
		objLoader.load(`${MODEL_PATH}/obj/t_trainer.obj`, (obj) => {
			obj.children.forEach((child) => {
				if (plastics.find((element) => element === child.name) !== undefined) {
					child.material = plasticMaterial;
				} else {
					child.material = material.clone();
				}
			});

			addUserDataRecursively(obj);
			obj.userData.isParent = true;
			obj.scale.set(0.2, 0.2, 0.2);
			obj.rotation.set(
				THREE.MathUtils.degToRad(0),
				THREE.MathUtils.degToRad(90),
				THREE.MathUtils.degToRad(0)
			);
			obj.position.set(...POSITION);
			resolve(obj);
		});
	});
}

export function TreadMill() {
	return new Promise((resolve, reject) => {
		gltfLoader.load(`${MODEL_PATH}/gltf/Treadmill.glb`, (gltf) => {
			const obj = gltf.scene;
			const children = obj.children[0].children;
			children[0].children.forEach((child) => {
				child.material.roughness = 0;
			});
			children[1].children[1].material.roughness = 0;
			children[2].children[1].material.roughness = 0;

			// apply screen
			children[0].children[7].material.map = textureLoader.load(
				`${TEXTURE_PATH}/treadmill/screen.jpg`
			);
			// apply rubber
			children[0].children[3].material.map = textureLoader.load(
				`${TEXTURE_PATH}/treadmill/rubber.jpg`
			);

			addUserDataRecursively(obj);
			obj.userData.isParent = true;
			obj.position.set(...POSITION);
			resolve(obj);
		});
	});
}

export function VendingMachine() {
	const material = new THREE.MeshStandardMaterial({
		map: textureLoader.load(`${TEXTURE_PATH}/vending/base.png`),
		normalMap: textureLoader.load(`${TEXTURE_PATH}/vending/normal.png`),
		metallnesMap: textureLoader.load(`${TEXTURE_PATH}/vending/normal.png`),
		roughnessMap: textureLoader.load(`${TEXTURE_PATH}/vending/rough.png`),
		aoMap: textureLoader.load(`${TEXTURE_PATH}/vending/rough.png`),
		roughness: 0,
	});
	return new Promise((resolve, reject) => {
		objLoader.load(`${MODEL_PATH}/obj/vending.obj`, (obj) => {
			obj.scale.set(5.7, 5.7, 5.7);
			obj.children[0].material = material;
			obj.userData.isParent = true;
			addUserDataRecursively(obj);
			obj.position.set(...POSITION);
			resolve(obj);
		});
	});
}

export function HangingBulb({ intensity = 500, decay = 1.5 }) {
	return new Promise((resolve, reject) => {
		objectLoader.load(`${MODEL_PATH}/json/HangingBulb.json`, (obj) => {
			const bulb = obj.children[1];
			const pointLight = obj.children[2];
			bulb.material = new THREE.MeshBasicMaterial({
				emissive: 0xffffee,
				emissiveIntensity: 1,
				color: 0xffffff,
			});
			bulb.castShadow = false;
			bulb.receiveShadow = false;
			pointLight.decay = decay;
			pointLight.intensity = intensity;
			obj.position.y = 17.6;
			resolve(obj);
		});
	});
}

export function CeilingLight({ intensity = 500, decay = 1.5 }) {
	return new Promise((resolve, reject) => {
		objectLoader.load(`${MODEL_PATH}/json/CellingLight.json`, (obj) => {
			const pointLight = obj.children[2];
			pointLight.decay = decay;
			pointLight.intensity = intensity;
			obj.position.y = 46.027;
			resolve(obj);
		});
	});
}

export function DumbbellRack() {
	return new Promise((resolve, reject) => {
		objectLoader.load(`${MODEL_PATH}/json/DumbbellRack.json`, (obj) => {
			addUserDataRecursively(obj);
			obj.userData.isParent = true;
			obj.position.set(...POSITION);
			resolve(obj);
		});
	});
}

export function ReceptionDesk() {
	return new Promise((resolve, reject) => {
		objectLoader.load(`${MODEL_PATH}/json/ReceptionDesk.json`, (obj) => {
			addUserDataRecursively(obj);
			obj.children[19].material = obj.children[3].material;
			obj.children[obj.children.length - 1].material = obj.children[3].material;
			obj.userData.isParent = true;
			obj.position.set(...POSITION);
			obj.scale.set(0.135, 0.12, 0.135);
			resolve(obj);
		});
	});
}

export function ReebokBike({ material }) {
	return new Promise((resolve, reject) => {
		objectLoader.load(`${MODEL_PATH}/json/ReebokBike.json`, (obj) => {
			obj.userData.isParent = true;
			const metalMaterial = material.clone();
			const plasticMaterial = new THREE.MeshStandardMaterial({
				roughness: 1,
				metalness: 0.1,
				color: new THREE.Color("#0d0d0d"),
				emissive: new THREE.Color("#0d0d0d"),
			});

			addUserDataRecursively(obj);
			obj.children.forEach((child) => {
				const choice = Math.floor(Math.random() * 2);
				if (child.material) {
					if (choice == 1) {
						child.material = metalMaterial;
					} else {
						child.material = plasticMaterial;
					}
				}
			});
			obj.position.set(...POSITION);
			resolve(obj);
		});
	});
}

export function SpinningBike({ material }) {
	return new Promise((resolve, reject) => {
		objectLoader.load(`${MODEL_PATH}/json/SpinningBike.json`, (obj) => {
			const metalMaterial = material.clone();
			const plasticMaterial = new THREE.MeshStandardMaterial({
				roughness: 1,
				metalness: 0.1,
				color: new THREE.Color("#0d0d0d"),
				emissive: new THREE.Color("#0d0d0d"),
			});

			obj.children.forEach((child) => {
				const choice = Math.floor(Math.random() * 2);
				if (child.material) {
					if (choice == 1) {
						child.material = metalMaterial;
					} else {
						child.material = plasticMaterial;
					}
				}
			});
			obj.userData.isParent = true;
			addUserDataRecursively(obj);
			obj.position.set(...POSITION);
			resolve(obj);
		});
	});
}

export function WallArt() {
	return new Promise((resolve, reject) => {
		objectLoader.load(`${MODEL_PATH}/json/Wall art.json`, (obj) => {
			addUserDataRecursively(obj);
			const color = new THREE.Color("#2c2b2b");
			obj.children[1].material.color = color;
			obj.userData.isParent = true;
			obj.position.set(...POSITION);
			resolve(obj);
		});
	});
}

export function Bench() {
	return new Promise((resolve, reject) => {
		objectLoader.load(`${MODEL_PATH}/json/Bench.json`, (obj) => {
			addUserDataRecursively(obj);
			obj.userData.isParent = true;
			obj.position.set(...POSITION);
			resolve(obj);
		});
	});
}

export function YogaMat() {
	return new Promise((resolve, reject) => {
		objectLoader.load(`${MODEL_PATH}/json/YogaMat.json`, (obj) => {
			addUserDataRecursively(obj);
			obj.userData.isParent = true;
			obj.material.color = new THREE.Color("#d3c527");
			obj.position.set(...POSITION);
			resolve(obj);
		});
	});
}


export function Human() {
	// Human
	return new Promise((resolve, reject) => {
		gltfLoader.load(`${MODEL_PATH}/gltf/human.glb`, function (gltf) {
			const human = gltf.scene;
			human.scale.set(13, 13, 13);
			addUserDataRecursively(human);
			human.userData.isParent = true;
			resolve(human);
		});
	});
}