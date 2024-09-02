import { MAP } from "./Map.js";
import {
	ArmChair,
	Bench,
	BoxingRing,
	Cabinet,
	Clock,
	CoffeeTableSet,
	Couch,
	CSet,
	DumbbellRack,
	Elliptical,
	ExerciseBike,
	GroupEquipment,
	Human,
	Hyperextension,
	KettleBell,
	Mat,
	Plant,
	PullUpObject,
	ReceptionDesk,
	TeaPot,
	TotalTrainer,
	TreadMill,
	VendingMachine,
	WallArt,
	YogaMat,
} from "./SingleObjects.js";
import * as THREE from "./three.module.js";
import { addUserDataRecursively, disposeObject, duplicateObject, objectLoader, textureLoader } from "./Utils.js";

export const MODEL_PATH = "./assets/models";
export const TEXTURE_PATH = "./assets/textures";


function loadMoreWallArts(scene) {
    const baseMaterial = new THREE.MeshStandardMaterial({
        metalness: 0.46,
        roughness: 0
    });

	const path = TEXTURE_PATH + "/wallArts/"
    const oneGeo = new THREE.PlaneGeometry(25, 27);
    const one = new THREE.Mesh(oneGeo, baseMaterial.clone());
    one.position.set(-167.273, 16.676, -0.218);
	one.rotation.y = THREE.MathUtils.degToRad(90);
	one.material.map = textureLoader.load(path + "one.jpg")
	
    const twoGeo = new THREE.PlaneGeometry(86, 38);
    const two = new THREE.Mesh(twoGeo, baseMaterial.clone());
    two.position.set(-13.236, 24.086, -57.470);
    two.rotation.y = THREE.MathUtils.degToRad(-90);
	two.material.map = textureLoader.load(path + "two.jpg")
	
    const threeGeo = new THREE.PlaneGeometry(137, 39);
    const three = new THREE.Mesh(threeGeo, baseMaterial.clone());
    three.position.set(-8.562, 24.086, -31.704);
    three.rotation.y = THREE.MathUtils.degToRad(90);
	three.material.map = textureLoader.load(path + "three.jpg")
	
    const fourGeo = new THREE.PlaneGeometry(87, 39);
    const four = new THREE.Mesh(fourGeo, baseMaterial.clone());
    four.position.set(52.465, 22.792, -108.449);
	four.material.map = textureLoader.load(path + "four.jpg")
	
    const fiveGeo = new THREE.PlaneGeometry(36, 39);
    const five = new THREE.Mesh(fiveGeo, baseMaterial.clone());
    five.position.set(281.300, 23.076, -28.827);
    five.rotation.y = THREE.MathUtils.degToRad(-90);
	five.material.map = textureLoader.load(path + "five.jpg")
	
    const sixGeo = new THREE.PlaneGeometry(65, 39);
    const six = new THREE.Mesh(sixGeo, baseMaterial.clone());
    six.position.set(323.621, 23.076, -59.037);
	six.material.map = textureLoader.load(path + "six.jpg")
	
    const sevenGeo = new THREE.PlaneGeometry(40, 39);
    const seven = new THREE.Mesh(sevenGeo, baseMaterial.clone());
    seven.position.set(219.356, 22.093, -87.867);
    seven.rotation.y = THREE.MathUtils.degToRad(90);
	seven.material.map = textureLoader.load(path + "six.jpg")
	
    const eightGeo = new THREE.PlaneGeometry(35, 39);
    const eight = new THREE.Mesh(eightGeo, baseMaterial.clone());
    eight.position.set(260.121, 23.205, 135.493);
    eight.rotation.y = THREE.MathUtils.degToRad(-180);
	eight.material.map = textureLoader.load(path + "eight.jpg")
	
    const nineGeo = new THREE.PlaneGeometry(82, 39);
    const nine = new THREE.Mesh(nineGeo, baseMaterial.clone());
    nine.position.set(56.358, 23.193, 133.332);
    nine.rotation.y = THREE.MathUtils.degToRad(-180);
	nine.material.map = textureLoader.load(path + "nine.jpg")

    const objs = [one, two, three, four, five, six, seven, eight, nine];
	objs.forEach((obj) => {
		obj.userData.isParent = true
		obj.userData.draggable = true
		obj.name = "Wall Art"
		scene.add(obj)
		
	});
}

function loadBoxingRing(scene) {
	BoxingRing().then((ring) => {
		ring.position.set(176.19, 0, 21.575);
		scene.add(ring);
	});
	;
}

function loadArmChair(scene) {
	ArmChair().then((chair) => {
		chair.position.set(75.394, 0, -115.721);
		const duplicatedObjects = duplicateObject("armChair", chair);
		duplicatedObjects.forEach((newObject) => scene.add(newObject)); // Add duplicated objects to scene
		scene.add(chair);
	});
	;
}

function loadCabinet(scene) {
	Cabinet().then((cabinet) => {
		cabinet.position.set(323.683, 0, 33.601);
		scene.add(cabinet);
		const cabinet2 = cabinet.clone();
		cabinet2.position.set(-2.611, 0, -145.776);
		cabinet2.rotation.set(
			THREE.MathUtils.degToRad(0),
			THREE.MathUtils.degToRad(90),
			THREE.MathUtils.degToRad(0)
		);
		scene.add(cabinet2);
	});

	;
}

// Elliptical
function loadElliptical(scene, material) {
	Elliptical({material: material, }).then((obj) => {
		const jsons = duplicateObject("Elliptical", obj);
		obj.position.set(-118.94, 0, -97.173);
		jsons.forEach((newObject) => scene.add(newObject));
		scene.add(obj);
	});
	;
}

function loadExerciseBike(scene, material) {
	ExerciseBike({material: material, }).then((obj) => {
		// obj.position.set(-155.075, 0 - 29.795)
		const jsons = duplicateObject("ExerciseBike", obj);
		jsons.forEach((newObject) => scene.add(newObject));
		// scene.add(obj)
	});
	;
}

function loadHyperextension(scene, material) {
	Hyperextension({material: material, }).then((obj) => {
		obj.position.set(13.869, 0, -96.446);
		const jsons = duplicateObject("Hyperextension", obj);
		jsons.forEach((newObject) => scene.add(newObject));
		scene.add(obj);
	});
	;
}

function loadGroupEquipment(scene, material) {
	GroupEquipment({material: material, }).then((obj) => {
		obj.position.set(102.332, 0, 0.237);
		const jsons = duplicateObject("GroupEquipment", obj);
		jsons.forEach((newObject) => scene.add(newObject));
		scene.add(obj);
	});
	;
}

function loadCoffeeSet(scene, material) {
	// load pot
	TeaPot({material: material, }).then((obj) => {
		obj.position.set(-2.484, 11.948, -157.236);
		scene.add(obj);
	});

	// load set
	CSet({material: material, }).then((obj) => {
		obj.position.set(0, 11.911, -145.037);
		scene.add(obj);
	});
	;
}

function loadKettleBell(scene) {
	KettleBell().then((obj) => {
		obj.position.set(337, -1, -58.237);
		obj.scale.set(.6, .6, .6)
		const objs = duplicateObject("KettleBell", obj);
		objs.forEach((newObject) => scene.add(newObject));
		scene.add(obj);
	});
	;
}

function loadCouch(scene) {
	Couch().then((obj) => {
		obj.position.set(323.893, 0, 53.669);
		scene.add(obj);
	});
	Mat().then((obj) => {
		obj.position.set(317.96, 0, 59.542);
		scene.add(obj);
	});
	;
}

function loadPlant(scene) {
	Plant().then((obj) => {
		obj.position.set(117.382, 25.202, -65.181);
		const plants = duplicateObject("Plant", obj);
		plants.forEach((newObject) => scene.add(newObject));
		scene.add(obj);
	});
	;
}

function loadPullUpObject(scene) {
	PullUpObject().then((obj) => {
		const objects = duplicateObject("PullUpObject", obj);
		objects.forEach((e) => scene.add(e));
		scene.add(obj);
	});
	;
}

function loadClock(scene) {
	Clock().then((obj) => {
		obj.position.set(178.088, 37.0, -165.742);
		const clocks = duplicateObject("Clock", obj);
		clocks.forEach((e) => scene.add(e));
		scene.add(obj);
	});
	;
}

function loadCoffeeTable(scene) {
	CoffeeTableSet().then((objects) => {
		const table = objects[0];
		table.position.set(40.528, 0, -118.127);
		const tables = duplicateObject("Table", table);
		tables.forEach((e) => scene.add(e));
		// scene.add(table);
		disposeObject(table)

		const receptionTable = objects[1];
		receptionTable.position.set(209.133, 0, -65.144);
		scene.add(receptionTable);

		const stool = objects[2];
		stool.position.set(32.4, 0, -115.5);
		const stools = duplicateObject("Stool", stool);
		stools.forEach((e) => scene.add(e));
		// scene.add(stool);
		disposeObject(stool)
	});
	;
}

function loadTotalTrainer(scene, material) {
	TotalTrainer({material: material, }).then((obj) => {
		const objs = duplicateObject("TotalTrainer", obj);
		objs.forEach((e) => scene.add(e))
		// scene.add(obj);
		disposeObject(obj)
	});
	;
}

function loadTreadMill(scene) {
	TreadMill().then((obj) => {
		obj.position.set(-152.619, 0.3, 98.73);
		const tMills = duplicateObject("Treadmill", obj);
		tMills.forEach((e) => scene.add(e));
		scene.add(obj);
	});
	;
}

function loadVendingMachine(scene) {
	VendingMachine().then((obj) => {
		obj.position.set(289.1, 0, 37.586);
		scene.add(obj);
	});
	;
}

function loadGlassDoor(scene, material) {
	const metalMaterial = material.clone();
	const glassMaterial = new THREE.MeshStandardMaterial({
		transparent: true,
		opacity: .50
	})

	objectLoader.load(`${MODEL_PATH}/json/GlassDoor.json`, (obj) => {
		obj.children.forEach((child) => {
			child.material = metalMaterial;
			child.receiveShadow = true;
		});

		obj.children[2].material = glassMaterial;
		obj.position.z += 0.1;
		scene.add(obj);
	});
	;
}

function loadSmallDoor(scene, material) {
	const metalMaterial = material.clone();
	const woodMaterial = material.clone();
	woodMaterial.transmission = 0;
	woodMaterial.metalness = 0;
	woodMaterial.roughness = 0.21;
	woodMaterial.color.set(new THREE.Color("#ec8e22"));

	objectLoader.load(`${MODEL_PATH}/json/SmallDoor.json`, (obj) => {
		obj.children[0].material = woodMaterial;
		obj.children[1].material = woodMaterial;
		obj.children[2].material = metalMaterial;
		obj.children[3].material = metalMaterial;
		obj.position.z += 0.1;
		obj.position.x += 0.5;
		obj.scale.y += 0.5;
		addUserDataRecursively(obj);
		const objs = duplicateObject("SmallDoor", obj);

		objs.push(obj);
		objs.forEach((e) => scene.add(e));
	});

	;
}

function loadWindow(scene, material) {
	const glassMaterial = new THREE.MeshStandardMaterial({
		transparent: true,
		opacity: .50
	})
	const frameMaterial = material.clone();
	const metalMaterial = material.clone();
	frameMaterial.transmission = 0;
	frameMaterial.metalness = 0;
	frameMaterial.roughness = 1;
	frameMaterial.color.set(new THREE.Color("#272626"));

	function setMaterial(wind) {
		wind.children[0].material = glassMaterial;
		wind.children[1].material = glassMaterial;
		wind.children[2].material = metalMaterial;
		wind.children[3].material = frameMaterial;
		wind.children[4].material = frameMaterial;
		wind.children[5].material = frameMaterial;
		wind.children[6].material = frameMaterial;
	}

	objectLoader.load(`${MODEL_PATH}/json/Windows.json`, (obj) => {
		obj.children.forEach((child) => {
			child.children.forEach((window) => {
				setMaterial(window);
				window.castShadow = true
				window.receiveShadow = true
			});
		});

		// recepton[0]
		const rWin = obj.children[4];
		rWin.children[0].scale.x += 0.2;

		// weight room
		const WGW = obj.children[2];
		WGW.children[0].scale.x += 0.2;
		WGW.children[2].scale.x += 0.2;

		// resting area
		const RAW = obj.children[1];
		const raw1 = RAW.children[0];
		raw1.scale.x += 0.2;
		raw1.position.z += 0.4;

		// window group 6
		const WG6 = obj.children[5];
		WG6.children[0].scale.x += 0.2;

		// window group 2
		const WG2 = obj.children[9];
		WG2.children[2].scale.x += 0.1;

		// addUserDataRecursively(mainWindow)
		// mainWindow.userData.isParent = true
		scene.add(obj);
	});
	;
}


function loadDumbbellRack(scene) {
	DumbbellRack().then((obj) => {
		obj.position.set(-31.464, .5, 131.052);
		const objs = duplicateObject("DumbbellRack", obj);
		objs.forEach((e) => scene.add(e));
		scene.add(obj);
	});
	;
}

function loadReceptionDesk(scene) {
	ReceptionDesk().then((obj) => {
		obj.position.set(166.836, 0, -165.47);
		const objs = duplicateObject("ReceptionDesk", obj);
		objs.forEach((e) => scene.add(e));
		scene.add(obj);
	});
	;
}

function loadReebokBike(scene, material) {
	Elliptical({material: material, }).then((obj) => {
		const jsons = duplicateObject("ReebokBike", obj);
		jsons.forEach((newObject) => scene.add(newObject));
		obj.position.set(15.888, 0, 36.611);
		scene.add(obj);
	});
	;
}

function loadSpinningBike(scene, material) {
	ExerciseBike({material: material, }).then((obj) => {
		const jsons = duplicateObject("SpinningBike", obj);
		jsons.forEach((newObject) => scene.add(newObject));
		obj.position.set(92.077, 0, -98.76);
		scene.add(obj);
	});
	;
}

function loadWallArts(scene) {
	const wallMap = MAP.WallArt.children;
	WallArt().then((obj) => {
		obj.position.set(329.81, 21.151, 16.783);
		const objects = duplicateObject("WallArt", obj);
		objects.forEach((o, index) => {
			const ind = index + 2;
			const n = wallMap[ind].num;
			const mat = new THREE.MeshStandardMaterial({
				map: textureLoader.load(`${TEXTURE_PATH}/wallArts/${n}.jpg`),
			});
			o.children[0].material = mat;
		});
		obj.children[0].material.map = textureLoader.load(`${TEXTURE_PATH}/wallArts/` + "5.jpg");
		scene.add(obj);
		objects.forEach((e) => scene.add(e));
	});
	;
}

function loadBench(scene) {
	Bench().then((obj) => {
		obj.position.set(-18.451, 5.413, 6.693);
		const benches = duplicateObject("Bench", obj);
		benches.forEach((e) => scene.add(e));
		scene.add(obj);
	});
	;
}

function loadYogaMat(scene) {
	YogaMat().then((obj) => {
		obj.position.set(271.0, 0, -71.0);
		const mats = duplicateObject("YogaMat", obj);
		mats.forEach((e) => scene.add(e));
		scene.add(obj);
	});
}

function loadSigns(scene, material) {
	const baseMaterial = new THREE.MeshStandardMaterial({
		metalness: 0.46,
		roughness: 0
	});

	// gym
	const gymGeometry = new THREE.BoxGeometry(20, 0.15, 5);
	const gymSign = new THREE.Mesh(gymGeometry, baseMaterial.clone())
	gymSign.position.set(215.592, 41.728, -76.375);
	gymSign.material.map = textureLoader.load(`${TEXTURE_PATH}/signs/` + "gym.png");
	gymSign.rotation.set(
		THREE.MathUtils.degToRad(90),
		THREE.MathUtils.degToRad(0),
		THREE.MathUtils.degToRad(90)
	);

	// yoga room
	const yogaGeometry = new THREE.BoxGeometry(23, 0.15, 5);
	const yogaSign = new THREE.Mesh(yogaGeometry, baseMaterial.clone())
	yogaSign.rotation.set(
		THREE.MathUtils.degToRad(90),
		THREE.MathUtils.degToRad(0),
		THREE.MathUtils.degToRad(0)
	);
	yogaSign.position.set(236.986, 41.728, -60.347);
	yogaSign.material.map = textureLoader.load(`${TEXTURE_PATH}/signs/` + "yoga.png");

	// weight room
	const weightGeometry = new THREE.BoxGeometry(22, 0.15, 5);
	const weightSign = new THREE.Mesh(weightGeometry, baseMaterial.clone())
	weightSign.position.set(283.239, 41.728, 7.248);
	weightSign.material.map = textureLoader.load(`${TEXTURE_PATH}/signs/` + "weight.png");
	weightSign.rotation.set(
		THREE.MathUtils.degToRad(90),
		THREE.MathUtils.degToRad(0),
		THREE.MathUtils.degToRad(90)
	);
	
	// exit
	const exitGeometry = new THREE.BoxGeometry(10.442, 0.150, 4.469);
	const exitSign = new THREE.Mesh(exitGeometry, baseMaterial.clone())
	exitSign.position.set(343.463, 41.728, 93.037);
	exitSign.material.map = textureLoader.load(`${TEXTURE_PATH}/signs/` + "exit.png");
	exitSign.rotation.set(
		THREE.MathUtils.degToRad(90),
		THREE.MathUtils.degToRad(0),
		THREE.MathUtils.degToRad(90)
	);
	const objs = [gymSign, yogaSign, weightSign, exitSign]
	objs.forEach((e) => {
		e.userData.draggable = true
		e.userData.isParent = true
		scene.add(e)
	})
	;

}

function loadHumans(scene, material) {
	Human().then((obj) => {
		obj.position.set(184.1, 0, -144.98);
		scene.add(obj);
	});
	
	Human().then((obj) => {
		obj.position.set(174.34, 9, 14.42);
		scene.add(obj);	
	})
}
function loadAssets(scene, render, material) {
	const functions = [
		loadGlassDoor,
		loadBoxingRing,
		loadArmChair,
		loadCabinet,
		loadTreadMill,
		loadVendingMachine,
		loadCoffeeSet,
		loadExerciseBike,
		loadCouch,
		loadReceptionDesk,
		loadClock,
		loadWallArts,
		loadYogaMat,
		loadDumbbellRack,
		loadSigns,
		loadWindow,
		loadSmallDoor,
		loadBench,
		loadCoffeeTable,
		loadMoreWallArts,
		loadElliptical,
		loadKettleBell,
		loadPlant,
		loadPullUpObject,
		loadReebokBike,
		loadSpinningBike,
		loadTotalTrainer,
		loadHumans
	];
	functions.forEach((func) => {
		func(scene, material);
	});
	render()
}
export default loadAssets;
