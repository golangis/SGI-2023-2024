import * as THREE from "three";
import { MyAxis } from "./MyAxis.js";
import { MyFileReader } from "./parser/MyFileReader.js";
import { MySceneBuilder } from "./MySceneBuilder.js";
import { MyTrack } from "./MyTrack.js";
import { MyRoute } from "./MyRoute.js";
import { MyCar } from "./MyCar.js";
import { MyPowerUp } from "./MyPowerUp.js";
import { MyTimer } from "./MyTimer.js";
/**
 *  This class contains the contents of out application
 */
class MyContents {
	/**
       constructs the object
       @param {MyApp} app The application object
    */
	constructor(app) {
		this.app = app;
		this.axis = null;

		this.reader = new MyFileReader(app, this, this.onSceneLoaded);
		this.reader.open("./game.xml");

		this.collision = false;
		this.outOfBounds = false;
		this.drag = false;
		this.penalty = false;
		this.penaltyActive = false;

		this.first = true;
	}

	/**
	 * initializes the contents
	 */
	init() {
		// create once
		if (this.axis === null) {
			// create and attach the axis to the scene
			this.axis = new MyAxis(this);
			this.app.scene.add(this.axis);
		}
	}

	/**
	 * Called when the scene xml file load is complete
	 * @param {MySceneData} data the entire scene data object
	 */
	onSceneLoaded(data) {
		console.info(
			"scene data loaded " +
				data +
				". visit MySceneData javascript class to check contents for each data item."
		);

		this.keys = { W: false, A: false, S: false, D: false, P: false };
		this.drag = false;

		document.addEventListener("keydown", (event) => {
			const key = event.key.toUpperCase();
			if (this.keys.hasOwnProperty(key)) {
				this.keys[key] = true;
				this.handleKeyPress(key);
			}
		});

		document.addEventListener("keyup", (event) => {
			const key = event.key.toUpperCase();
			if (this.keys.hasOwnProperty(key)) {
				this.keys[key] = false;
				if (key === "W" || key === "S") {
					this.drag = true;
				} else if (key === "D" || key === "A") {
					this.playerCar.resetWheels();
				}
			}
		});

		this.onAfterSceneLoadedAndBeforeRender(data);
	}

	handleKeyPress() {
		if (this.keys.W) {
			this.drag = false;
			this.playerCar.accelerate();
		}
		if (this.keys.A) {
			this.playerCar.turnLeft();
		}
		if (this.keys.S) {
			this.drag = false;
			this.playerCar.brake();
		}
		if (this.keys.D) {
			this.playerCar.turnRight();
		}

		if (this.keys.P) {
			this.autonomousCarMixer.paused = !this.autonomousCarMixer.paused;
			
			if (this.timer.isRunning) {
				this.timer.pause();
			} else {
				this.timer.resume();
			}
		}
	}

	output(obj, indent = 0) {
		console.log(
			"" +
				new Array(indent * 4).join(" ") +
				" - " +
				obj.type +
				" " +
				(obj.id !== undefined ? "'" + obj.id + "'" : "")
		);
	}

	onAfterSceneLoadedAndBeforeRender(data) {
		// refer to descriptors in class MySceneData.js
		// to see the data structure for each item

		this.output(data.options);

		// first and only skybox is called "default"
		this.output(data.skyboxes["default"]);
		console.log("textures:");
		for (var key in data.textures) {
			let texture = data.textures[key];
			this.output(texture, 1);
		}

		console.log("materials:");
		for (var key in data.materials) {
			let material = data.materials[key];
			this.output(material, 1);
		}

		console.log("cameras:");
		for (var key in data.cameras) {
			let camera = data.cameras[key];
			this.output(camera, 1);
		}

		console.log("nodes:");
		for (var key in data.nodes) {
			let node = data.nodes[key];
			this.output(node, 1);
			if (node.loaded === false) {
				console.error(
					"" +
						new Array(2 * 4).join(" ") +
						" not loaded. Possibly refered as a node child but not defined in scene."
				);
			}
			for (let i = 0; i < node.children.length; i++) {
				let child = node.children[i];
				if (child.type === "primitive") {
					console.log(
						"" +
							new Array(2 * 4).join(" ") +
							" - " +
							child.type +
							" with " +
							child.representations.length +
							" " +
							child.subtype +
							" representation(s)"
					);
					if (child.subtype === "nurbs") {
						console.log(
							"" +
								new Array(3 * 4).join(" ") +
								" - " +
								child.representations[0].controlpoints.length +
								" control points"
						);
					}
				} else if (child.type === "lodref") {
					console.log(
						"" +
							new Array(2 * 4).join(" ") +
							" - " +
							child.type +
							", id " +
							child.id
					);
				} else {
					this.output(child, 2);
				}
			}
		}

		console.log("lods:");
		for (var key in data.lods) {
			let lod = data.lods[key];
			this.output(lod, 1);
			if (lod.loaded === false) {
				console.error(
					"" +
						new Array(2 * 4).join(" ") +
						" not loaded. Possibly refered as a node child but not defined in scene."
				);
			}
			for (let i = 0; i < lod.children.length; i++) {
				let child = lod.children[i];
				console.log(
					"" +
						new Array(2 * 4).join(" ") +
						" - " +
						child.type +
						" " +
						child.node.id +
						", min distance: " +
						child.mindist
				);
			}
		}

		console.log(
			"-------------------------------------------------------------"
		);

		this.timer = new MyTimer();

		const sceneBuilder = new MySceneBuilder(data, this.app);

		const light1 = new THREE.AmbientLight(0xffffff, 2.5); // soft white light
		const light2 = new THREE.DirectionalLight(0xffffff, 2.5); // soft white light

		this.app.scene.add(light1);
		this.app.scene.add(light2);

		sceneBuilder.addGlobals();
		sceneBuilder.addCameras();
		sceneBuilder.addSkybox();

		this.startGame(
			data,
			"./object3D/sedan.glb",
			"./object3D/suvLuxury.glb"
		);

		const pw = new MyPowerUp(this.app);

		pw.buildCube(40, 1, 5.5);
		pw.buildCube(10, 1, -29.5);
		pw.buildCube(-63, 1, 19);
		pw.buildCube(-30, 1, 13);
	}

	startGame(data, playerCarFilepath, opponentCarFilepath) {

		const routeObj = new MyRoute(this.app, data);
		this.trackObj = new MyTrack(this.app, routeObj.curve, 5, null);

		this.trackMesh = this.trackObj.drawTrack();

		this.trackObj.drawTrackFloor();
		this.trackObj.addMarkersToTrack(30);
		this.trackObj.createMarkerRays();

		this.playerCar = new MyCar(this.app, playerCarFilepath, 7, 4, true);
		this.opponentCar = new MyCar(
			this.app,
			opponentCarFilepath,
			7,
			6,
			false,
			this.trackObj.calculateAutonomousTrack(4)
		);

		const keyFrames = this.opponentCar.getKeyframes();
		this.autonomousCarMixer =
			this.opponentCar.animateAutonomousCar(keyFrames);

		// TODO when countdown ends, call these functions
		this.trackObj.changeFirstMarkers();
		this.opponentCar.action.play();
		this.timer.start();
	}

	checkForCollisionBetweenCars() {
		if (this.playerCar.AABB && this.opponentCar.AABB) {
			const result = this.playerCar.AABB.intersectsBox(
				this.opponentCar.AABB
			);

			if (result) {
				console.log("Collision!");
				return result;
			}
		}
		return false;
	}

	checkIfCarOnTrack(carPosition) {
		return (
			new THREE.Raycaster(
				carPosition,
				new THREE.Vector3(0, -1, 0),
				0,
				1
			).intersectObject(this.trackMesh).length > 0
		);
	}

	deductPenalties() {
		if (!this.first) {
			this.collision = this.checkForCollisionBetweenCars();
			this.outOfBounds = !this.checkIfCarOnTrack(
				this.playerCar.carMesh.position
			);

			this.penalty = this.collision || this.outOfBounds;
			if (!this.penaltyActive && this.penalty) {
				setTimeout(() => {
					this.penaltyActive = false;
					this.playerCar.penalty = this.penaltyActive;

					console.log("penalty finish");
				}, 5000);

				this.penaltyActive = true;
				this.playerCar.penalty = this.penaltyActive;
				console.log("penalty initiated");
			}
		}

		this.first = false;
	}

	update(delta) {
		this.delta = delta;
		this.degree = (3 * Math.PI) / 20;

		if (this.drag) {
			this.playerCar.decelerate(0.05);
		}

		this.playerCar.updateCar(delta);
		this.deductPenalties();

		this.trackObj.checkThatMarkerWasPassed(this.playerCar.carMesh);

		if (!this.autonomousCarMixer.paused) {
			this.autonomousCarMixer.update(delta);
		}
	}
}

// aumentar velocidade e meter um obstaculo na pista

export { MyContents };
