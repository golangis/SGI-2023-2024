import * as THREE from "three";
import { OBJLoader } from "three/addons/loaders/OBJLoader.js";
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

		this.x = -7;
		this.z = -5;
		this.orientation = Math.PI / 2;
	}

	loadCar() {
		const path = this.carFilepath;
		const loader = new GLTFLoader();
		const mesh = new THREE.Object3D();

		loader.load(
			path,
			function (object) {
				mesh.add(object.scene);
			},
			function (xhr) {
				console.log((xhr.loaded / xhr.total) * 100 + "% loaded");
			},
			function (error) {
				console.log("An error happened");
			}
		);

		mesh.scale.setScalar(1);

		this.orientation = Math.PI / 2;

		mesh.position.set(this.x, 0, this.z);

		this.carMesh = mesh;
		this.app.scene.add(mesh);

		return mesh;
	}

	// TODO car wheels also turn
	// TODO camera following the car around
	createCarCamera() {
		// DEBUG
		const camTarget = new THREE.Object3D();
		camTarget.add(new THREE.Mesh(new THREE.BoxGeometry(0.2, 0.2, 0.2)));

		this.app.scene.add(camTarget);
		////////

		const aspect = window.innerWidth / window.innerHeight;
		const newCamera = new THREE.PerspectiveCamera(60, aspect, 0.1, 1000);

		newCamera.position.set(-this.x + 5.5, 3, -this.z + 3.5);

		camTarget.position.set(-this.x, 2.2, -this.z);
		newCamera.target = camTarget;

		this.app.addCamera("Car", "Car", newCamera);
	}

	updateCarCamera() {
		this.app.cameras["Car"].position.set(-this.x + 5.5, 3, -this.z + 3.5);
		this.app.cameras["Car"].target.position.set(-this.x, 2.2, -this.z);
		this.app.cameras["Car"].target.rotation.set(0, this.orientation-Math.PI/2, 0);
	}

	updateCarCoordinates(delta) {
		this.velocity = (this.acceleration * delta * 50).toFixed(2);

		this.x =
			this.x +
			((Math.sin(this.orientation) * Math.PI) / 180) * this.velocity;
		this.z =
			this.z +
			((Math.cos(this.orientation) * Math.PI) / 180) * this.velocity;

		this.carMesh.position.set(-this.x, 0, -this.z);
		this.carMesh.rotation.set(0, this.orientation, 0);

		this.updateCarCamera();
	}

	accelerate(delta) {
		if (this.acceleration < 18) {
			this.acceleration += 0.5;
		}
		this.updateCarCoordinates(delta);
	}

	brake(delta) {
		if (this.acceleration > -18) {
			this.acceleration -= 0.5;
		}
		this.updateCarCoordinates(delta);
	}

	// TODO if player outside track, reduce their velocity
	decelerate(delta) {
		if (this.velocity > 0 && this.acceleration > 0) {
			this.acceleration -= 0.05;
		} else if (this.velocity < 0 && this.acceleration < 0) {
			this.acceleration += 0.05;
		} else {
			this.acceleration = 0;
		}

		this.updateCarCoordinates(delta);
	}

	turnLeft(delta) {
		if (this.velocity != 0) {
			this.orientation += Math.PI / 30;
			this.updateCarCoordinates(delta);
		}
	}

	turnRight(delta) {
		if (this.velocity != 0) {
			this.orientation -= Math.PI / 30;
			this.updateCarCoordinates(delta);
		}
	}
}

export { MyCar };
