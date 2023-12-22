import * as THREE from "three";
import { GLTFLoader } from "three/addons/loaders/GLTFLoader.js";

/**

 *  This class contains the contents of out application

 */

class MyCar {
	constructor(app, carFilepath) {
		this.app = app;
		this.carFilepath = carFilepath;
		this.velocity = 0;
		this.orientation = 0;
		this.acceleration = 0;

		this.x = 7;
		this.z = 5;
		this.orientation = -Math.PI / 2;
		this.wheelMeshes = [];

		this.carSteer = 0;
	}

	loadCar() {
		const path = this.carFilepath;
		const loader = new GLTFLoader();
		const mesh = new THREE.Object3D();

		loader.load(
			path,
			function (object) {
				mesh.add(object.scene);
				this.findWheels(mesh);
			}.bind(this),
			function (xhr) {
				console.log((xhr.loaded / xhr.total) * 100 + "% loaded");
			},
			function (error) {
				console.log("An error happened");
			}
		);

		mesh.scale.setScalar(1);
		
		mesh.rotation.y = (-Math.PI / 2);
		mesh.position.set(this.x, 0, this.z);

		this.carMesh = mesh;
		this.app.scene.add(mesh);
		return mesh;
	}

	findWheels(currentMesh) {
		if (this.wheelMeshes.length == 2) {
			return;
		}

		currentMesh.children.forEach((element) => {
			if (
				element.name.includes("wheel_front") &&
				element.type === "Group"
			) {
				this.wheelMeshes.push(element);
			} else {
				this.findWheels(element);
			}
		});

		return;
	}

	// TODO camera following the car around
	createCarCamera() {
		// DEBUG
		const camTarget = new THREE.Object3D();
		camTarget.add(new THREE.Mesh(new THREE.BoxGeometry(0.2, 0.2, 0.2)));
		camTarget.position.set(this.x, 2.2, this.z);

		this.app.scene.add(camTarget);
		////////

		const aspect = window.innerWidth / window.innerHeight;
		const newCamera = new THREE.PerspectiveCamera(60, aspect, 0.1, 1000);

		newCamera.position.set(this.x + 5.5, 3, this.z + 3.5);
		newCamera.lookAt(this.x, 2.2, this.z);

		camTarget.add(newCamera);

		this.app.camTarget = camTarget;
		this.app.addCamera("Car", "Car", newCamera);

		//console.log(this.carMesh);
	}

	updateCarCamera() {
		const targetPosition = new THREE.Vector3(this.x, 2.2, this.z);
		this.app.camTarget.position.set(this.x, 2.2, this.z);
	}

	updateCarCoordinates(delta) {
		this.velocity = (this.acceleration * delta * 50).toFixed(2);

		this.x -=
			((Math.sin(this.orientation) * Math.PI) / 180) * this.velocity;
		this.z -=
			((Math.cos(this.orientation) * Math.PI) / 180) * this.velocity;

		this.carMesh.position.set(this.x, 0, this.z);

		this.carMesh.rotation.y = THREE.MathUtils.lerp(
			this.carMesh.rotation.y,
			this.orientation,
			0.05
		);

		this.updateCarCamera();
	}

	accelerate() {
		if (this.acceleration < 18) {
			this.acceleration += 0.5;
		}
	}

	brake() {
		if (this.acceleration > -18) {
			this.acceleration -= 0.5;
		}
	}

	// TODO if player outside track, reduce their velocity
	decelerate(ratio) {
		if (this.velocity > 0 && this.acceleration > 0) {
			this.acceleration -= ratio;
		} else if (this.velocity < 0 && this.acceleration < 0) {
			this.acceleration += ratio;
		} else {
			this.acceleration = 0;
		}
	}

	turnLeft() {
		if (this.velocity != 0) {
			this.orientation += Math.PI / 30;
		}
		if (this.wheelMeshes[0].rotation.y < 2 * (Math.PI / 20)) {
			this.turnWheels(Math.PI / 10);
		}
	}

	turnRight() {
		if (this.velocity != 0) {
			this.orientation -= Math.PI / 30;
		}
		if (this.wheelMeshes[0].rotation.y > -2 * (Math.PI / 20)) {
			this.turnWheels(-Math.PI / 10);
		}
	}

	turnWheels(degree) {
		this.carSteer += degree;
	}

	resetWheels() {
		this.carSteer = 0;
	}


	updateWheels() {
		this.wheelMeshes.forEach((element) => {
			element.rotation.y = THREE.MathUtils.lerp(
				element.rotation.y,
				this.carSteer,
				0.05
			);
		});
	}
}

export { MyCar };
