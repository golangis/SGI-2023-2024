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
		this.orientation = Math.PI/2;
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

		this.orientation = Math.PI / 2

		mesh.position.set(this.x, 0, this.z);
		
		this.carMesh = mesh;
		this.app.scene.add(mesh);

		return mesh;
	}

	updateCarCoordinates(delta) {
		
		this.velocity = this.acceleration * delta * 50;
		
		this.x =
			this.x +
			((Math.sin(this.orientation) * Math.PI) / 180) * this.velocity;
		this.z =
			this.z +
			((Math.cos(this.orientation) * Math.PI) / 180) * this.velocity;
		
		this.carMesh.position.set(-this.x, 0, -this.z);
		this.carMesh.rotation.set(0, this.orientation, 0);
	}

	accelerate(delta) {
		if (this.acceleration < 50) {
			this.acceleration += 0.5
		}
		this.updateCarCoordinates(delta);
	}

	brake(delta) {
		if (this.acceleration > -50) {
			this.acceleration -= 0.5
		}
		this.updateCarCoordinates(delta);

	}

	turnLeft(delta) {
		this.orientation += Math.PI/20
		this.updateCarCoordinates(delta);
	}

	turnRight(delta) {
		this.orientation -= Math.PI / 20;
		this.updateCarCoordinates(delta);
	}
	
}

export { MyCar };
