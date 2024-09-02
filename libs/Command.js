import * as THREE from "./three.module.js";
import { disposeObject, showToast } from "./Utils.js";

export class Command {
	execute() {}
	undo() {}
}

export class AddObjectCommand extends Command {
	constructor(scene, object, control, setDraggable) {
		super();
		this.scene = scene;
		this.object = object;
		this.control = control;
		this.setDraggable = setDraggable
	}

	execute() {
		this.scene.add(this.object);
		this.control.attach(this.object);
		this.setDraggable(this.object)
	}

	undo() {
		this.control.detach();
		this.scene.remove(this.object);
		disposeObject(this.object)
		this.setDraggable(null)
	}
}

export class RemoveObjectCommand extends Command {
	constructor(scene, object, control, func) {
		super();
		this.scene = scene;
		this.object = object;
		this.control = control;
		this.func = func
	}

	execute() {
		this.control.detach();
		this.scene.remove(this.object);
		disposeObject(this.object)
		this.func(null)
	}
	
	undo() {
		this.scene.add(this.object);
		this.control.attach(this.object);
		this.func(this.object)
	}
}

export class MoveObjectCommand extends Command {
	constructor(object, newPosition, oldPosition, control) {
		super();
		this.object = object;
		this.newPosition = newPosition.clone();
		this.oldPosition = oldPosition.clone();
		this.control = control
	}

	execute() {
		this.object.position.copy(this.newPosition);
		this.control.attach(this.object)
	}

	undo() {
		this.object.position.copy(this.oldPosition);
		this.control.attach(this.object)
	}
}


export class RotateObjectCommand extends Command {
	constructor(object, newRotation, oldRotation, control) {
		super();
		this.object = object;
		this.newRotation = newRotation.clone();
		this.oldRotation = oldRotation.clone();
		this.control = control
	}

	execute() {
		this.object.rotation.copy(this.newRotation);
		this.control.attach(this.object)
	}
	
	undo() {
		this.object.rotation.copy(this.oldRotation);
		this.control.attach(this.object)
	}
}

export class CloneObjectCommand extends Command {
	constructor(scene, control, draggable) {
		super()
		this.scene = scene;
		this.object = control.object.clone();
		this.control = control;
		this.draggable = draggable
	}

	execute() {
		this.scene.add(this.object)
		if ((0 - this.object.position.z) > 0) {
			this.object.position.z += 2; // Move back
		} else {
			this.object.position.z -= 2; // Move forward
		}
		this.draggable = this.object 
		this.control.attach(this.object)
		showToast(`${this.object.name} Cloned!`)
	}

	undo() {
		this.control.detach()
		this.scene.remove(this.object)
	}
}

export class ClearCanvasCommand extends Command {
	constructor(scene, control) {
		super();
		this.scene = scene;
		this.control = control;
		this.objects = [];
	}

	execute() {
		this.control.detach();
		this.scene.children.forEach((obj) => {
			if (obj.userData.draggable && obj.userData.isParent) {
				this.objects.push(obj);
			}
		});
		this.objects.forEach((o) => this.scene.remove(o));
	}

	undo() {
		this.objects.forEach((e) => this.scene.add(e));
	}
}

export class changeFloorColorCommand extends Command {
	constructor(current, prev, list, palette, colorController, key) {
		super();
		this.current = current;
		this.prev = prev;
		this.list = list;
		this.palette = palette;
		this.colorController = colorController;
		this.key = key;
	}

	execute() {
		this.list.forEach((child) => {
			child.material.color.set(this.current);
		});
		this.updatePalette(this.current);
		this.colorController.setValue(`#${this.current.getHexString()}`);
	}

	undo() {
		this.list.forEach((child) => {
			child.material.color.set(this.prev);
		});
		this.updatePalette(this.prev);
		this.colorController.setValue(`#${this.prev.getHexString()}`);
	}
	updatePalette(color) {
		this.palette[this.key] = `#${color.getHexString()}`;
	}
}

export class ChangeWallColorCommand extends changeFloorColorCommand {
	
}

export class ChangeFloorTypeCommand extends Command {
	constructor(newMat, prevMat, list) {
		super();
		this.newMat = newMat;
		this.prevMat = prevMat;
		this.list = list;
	}

	execute() {
		this.list.forEach((child) => {
			child.material = this.newMat;
			child.material.map.colorSpace = THREE.SRGBColorSpace;
		});
	}

	undo() {
		this.list.forEach((child) => {
			child.material = this.prevMat;
			child.material.map.colorSpace = THREE.SRGBColorSpace;
		});
	}
}

export class ChangeWallTypeCommand extends ChangeFloorTypeCommand {}

export const undoStack = [];
export const redoStack = [];

export function executeCommand(command) {
	command.execute();
	undoStack.push(command);
	// Clear the redo stack whenever a new command is executed
	redoStack.length = 0;
	render();
}

export function undo() {
	if (undoStack.length > 0) {
		const command = undoStack.pop();
		command.undo();
		redoStack.push(command);
		render();
	}
}

export function redo() {
	if (redoStack.length > 0) {
		const command = redoStack.pop();
		command.execute();
		undoStack.push(command);
		render();
	}
}

// Placeholder for the render function, to be defined in the main script
let renderFunction = null;

export function setRenderFunction(func) {
	renderFunction = func;
}

function render() {
	if (renderFunction) {
		renderFunction();
	}
}
