import * as THREE from "three";
import { GLTFLoader } from "three/addons/loaders/GLTFLoader.js";

/**

 *  This class contains the contents of out application

 */

class MyCar {
	constructor(app, carFilepath, x, z, createCamera, routePoints) {
		this.app = app;
		this.carFilepath = carFilepath;
		this.velocity = 0;
		this.orientation = 0;
		this.acceleration = 0;

		this.x = x;
		this.z = z;
		this.orientation = -Math.PI / 2;
		this.wheelMeshes = [];

		this.carSteer = 0;
		this.topSpeed = 8.5;

		// Function calls to render car and create camera
		this.loadCar();
		if (createCamera) {
			this.createCarCamera();
		}

		if (routePoints) {
			this.autonomousCurvePoints = routePoints;

			this.curve = new THREE.CatmullRomCurve3(
				this.autonomousCurvePoints,
				true,
				"centripetal"
			);

			this.curve.center = routePoints.center;
		}
	}

	getKeyframes() {
		const lapTime = 60;
		const keyFrames = [];

		for (let i = 0; i < 100; i++) {
			const prog = ((i + 71.3) / 100) % 1;

			const tangent = this.curve.getTangentAt(prog);
			const carPos = this.curve.getPointAt(prog);
			carPos.sub(this.curve.center);

			const carRot = Math.atan2(tangent.x, tangent.z) + Math.PI;

			const time = lapTime * (i/100);

			const quat = new THREE.Quaternion().setFromEuler(
				new THREE.Euler(0, carRot, 0)
			);

			const frame = {
				time: time,
				position: carPos,
				quaternion: quat,
			};

			keyFrames.push(frame);
		}

		return keyFrames;
	}

	loadCar() {
		const path = this.carFilepath;
		const loader = new GLTFLoader();
		const mesh = new THREE.Object3D();
		this.carMesh = new THREE.Object3D();

		loader.load(
			path,
			function (object) {
				mesh.add(object.scene);
				this.findWheels(mesh);

				this.AABB = new THREE.Box3().setFromObject(this.carMesh);
			}.bind(this),
			function (xhr) {
				console.log((xhr.loaded / xhr.total) * 100 + "% loaded");
			},
			function (error) {
				console.log("An error happened");
			}
		);

		this.carMesh.add(mesh);

		this.carMesh.scale.setScalar(1);

		this.carMesh.rotation.y = -Math.PI / 2;
		this.carMesh.position.set(this.x, 0, this.z);

		mesh.position.set(0, 0, -0.65);

		this.app.scene.add(this.carMesh);
		return this.carMesh;
	}

	animateAutonomousCar(keyframes) {
		let mixer = new THREE.AnimationMixer(this.carMesh);

		let quaternionRotationTrack = new THREE.QuaternionKeyframeTrack(
			".quaternion",
			keyframes.map((kf) => kf.time),
			keyframes.flatMap((kf) => {
				return kf.quaternion.toArray();
			})
		);

		let positionTrack = new THREE.VectorKeyframeTrack(
			".position",
			keyframes.map((kf) => kf.time),
			keyframes.flatMap((kf) => kf.position.toArray())
		);

		let clip = new THREE.AnimationClip(
			"carAnimation",
			Math.max(...keyframes.map((kf) => kf.time)),
			[positionTrack, quaternionRotationTrack]
		);

		let action = mixer.clipAction(clip);
		action.play();

		return mixer;
	}

	findWheels(currentMesh) {
		if (this.wheelMeshes.length == 2) {
			return;
		}

		let backlog = [];
		backlog.push(currentMesh);

		while (backlog.length != 0) {
			currentMesh = backlog[0];
			backlog = backlog.slice(1);

			currentMesh.children.forEach((element) => {
				if (
					element.name.includes("wheel") &&
					element.name.includes("front") &&
					element.type === "Group"
				) {
					this.wheelMeshes.push(element);
				} else {
					backlog.push(element);
				}

				if (this.wheelMeshes.length == 2) {
					return;
				}
			});
		}

		return;
	}

	createCarCamera() {
		const camTarget = new THREE.Object3D();
		camTarget.add(new THREE.Mesh());
		camTarget.position.set(this.x, 2.2, this.z);

		const aspect = window.innerWidth / window.innerHeight;
		const newCamera = new THREE.PerspectiveCamera(60, aspect, 0.1, 1000);

		newCamera.position.set(0, 3, 4.5);

		this.carMesh.add(newCamera);

		newCamera.camTarget = camTarget;
		this.camTarget = camTarget;

		this.app.addCamera("Car", "Car", newCamera);
	}

	updateCarCamera() {
		this.camTarget.position.set(this.x, 2.2, this.z);
	}

	updateCar(delta) {
		this.velocity = Math.min(
			(this.acceleration * delta * 50).toFixed(2),
			this.topSpeed
		);

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
		this.updateWheels();

		if (this.AABB) {
			this.AABB = this.AABB.setFromObject(this.carMesh);
		}
	}

	accelerate(penalty) {
		let ratio = 0.5,
			topValue = 18;

		if (this.acceleration < topValue) {
			if (penalty) {
				ratio = 0.7 * ratio;
				topValue = 0.7 * topValue;
				this.topSpeed = 5.0;
			} else {
				this.topSpeed = 8.5;
			}

			this.acceleration += ratio;
		}
	}

	brake(penalty) {
		let ratio = 0.5,
			topValue = -18;

		if (this.acceleration > topValue) {
			if (penalty) {
				ratio = 0.7 * ratio;
				topValue = 0.7 * topValue;
				this.topSpeed = 5.0;
			} else {
				this.topSpeed = 8.5;
			}

			this.acceleration -= ratio;
		}
	}

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
		if (this.velocity > 0) {
			this.orientation += Math.PI / 30;
		} else if (this.velocity < 0) {
			this.orientation -= Math.PI / 30;
		}

		if (this.wheelMeshes[0].rotation.y < 1.5 * (Math.PI / 20)) {
			this.turnWheels(Math.PI / 10);
		}
	}

	turnRight() {
		if (this.velocity > 0) {
			this.orientation -= Math.PI / 30;
		} else if (this.velocity < 0) {
			this.orientation += Math.PI / 30;
		}

		if (this.wheelMeshes[0].rotation.y > -1.5 * (Math.PI / 20)) {
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
