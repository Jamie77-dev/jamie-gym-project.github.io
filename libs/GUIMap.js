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
	ExerciseBike,
	Human,
	KettleBell,
	Mat,
	Plant,
	PullUpObject,
	ReceptionDesk,
	SpinningBike,
	TeaPot,
	TotalTrainer,
	TreadMill,
	VendingMachine,
	WallArt,
	YogaMat,
} from "./SingleObjects.js";

export const gym1 = "gym 1";
export const gym2 = "gym 2";
export const reception = "reception";
export const weightRoom = "weight room";
export const yogaRoom = "yoga room";
export const restingArea = "resting area";
export const coffeeSection = "coffee section";

export const GUIMap = {
	treadMill: {
		name: "Treadmill",
		image: "treadmill",
		func: TreadMill,
		place: gym1,
	},
	armChair: {
		name: "Arm Chair",
		image: "armChair",
		func: ArmChair,
		place: reception,
	},
	bench: {
		name: "Bench",
		image: "bench",
		func: Bench,
		place: gym2,
	},
	boxingRing: {
		name: "Boxing Ring",
		image: "boxingRing",
		func: BoxingRing,
		place: gym2,
	},
	cabinet: {
		name: "Cabinet",
		image: "cabinet",
		func: Cabinet,
		place: restingArea,
	},
	clock: {
		name: "Clock",
		image: "clock",
		func: Clock,
		position: [89.18, 37.0, -165.74]
	},
	couch: {
		name: "Couch",
		image: "couch",
		func: Couch,
		place: restingArea,
	},
	coffeeTable: {
		name: "Coffee Table",
		image: "cTableStool",
		func: CoffeeTableSet,
		place: coffeeSection,
	},
	stool: {
		name: "Stool",
		image: "cTableStool",
		func: CoffeeTableSet,
		place: coffeeSection,
	},
	cupSet: {
		name: "Cup Set",
		image: "cupSet",
		func: CSet,
		position: [38.65, 11.911, -145.037]
	},
	dumbbellRack: {
		name: "Dumbbell Rack",
		image: "dumbbellRack",
		func: DumbbellRack,
		place: weightRoom,
	},
	exerciseBike: {
		name: "Exercise Bike",
		image: "exerciseBike",
		func: ExerciseBike,
		place: gym1,
	},
	kettleBell: {
		name: "Kettle Bell",
		image: "kettlebell",
		func: KettleBell,
		place: weightRoom,
	},
	mat: {
		name: "Mat",
		image: "mat",
		func: Mat,
		place: restingArea,
	},
	plant: {
		name: "Plant",
		image: "plant",
		func: Plant,
		place: gym2,
	},
	pullUpObject: {
		name: "Pull Up Object",
		image: "pullupObject",
		func: PullUpObject,
		place: gym1,
	},
	receptionDesk: {
		name: "Reception Desk",
		image: "receptionDesk",
		func: ReceptionDesk,
		place: reception,
	},
	yogaMat: {
		name: "Yoga Mat",
		image: "yogaMat",
		func: YogaMat,
		place: yogaRoom,
	},
	teaPot: {
		name: "Tea Pot",
		image: "teapot",
		func: TeaPot,
		position: [38.65, 11.911, -145.037]
	},
	totalTrainer: {
		name: "Total Trainer",
		image: "totalTrainer",
		func: TotalTrainer,
		place: gym2,
	},
	vendingMachine: {
		name: "Vending Machine",
		image: "vendingMachine",
		func: VendingMachine,
		place: restingArea,
	},
	wallArt: {
		name: "Wall Art",
		image: "wallArt",
		func: WallArt,
		position: [175.43, 15.019, -122.07]
	},
	Character: {
		name: "Character",
		image: "human",
		func: Human,
		place: gym2
	}
};
