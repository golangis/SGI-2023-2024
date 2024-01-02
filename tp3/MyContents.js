import * as THREE from "three";
import { MyAxis } from "./MyAxis.js";
import { MyFileReader } from "./parser/MyFileReader.js";
import { MySceneBuilder } from "./MySceneBuilder.js";
import { MyTrack } from "./MyTrack.js";
import { MyRoute } from "./MyRoute.js";
import { MyCar } from "./MyCar.js";
import { MyPowerUp } from "./MyPowerUp.js";
import { MyTimer } from "./MyTimer.js";
import { MyObstacle } from "./MyObstacle.js";
import { MyMenuPickCar } from "./MyMenuPickCar.js";
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

		this.first = true;
		this.firecrackerPenalty = false;
		this.speedPenalty = false;

		this.slowPowerup = false;
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
		if (this.gameTimer.isRunning) {
			if (this.keys.W) {
				this.drag = false;
				this.playerCar.accelerate();
			}
			if (this.keys.A) {
				if (this.firecrackerPenalty) {
					this.playerCar.turnRight();
				} else {
					this.playerCar.turnLeft();
				}
			}
			if (this.keys.S) {
				this.drag = false;
				this.playerCar.brake();
			}
			if (this.keys.D) {
				if (this.firecrackerPenalty) {
					this.playerCar.turnLeft();
				} else {
					this.playerCar.turnRight();
				}
			}
		}

		if (this.keys.P) {
			if (this.gameTimer.isRunning) {
				this.pauseGame();
			} else {
				this.resumeGame();
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

		this.gameTimer = new MyTimer();

		const sceneBuilder = new MySceneBuilder(data, this.app);

		const light1 = new THREE.AmbientLight(0xffffff, 2.5); // soft white light
		const light2 = new THREE.DirectionalLight(0xffffff, 2.5); // soft white light
		const light_menu_car = new THREE.PointLight(0xffffff, 100, 10, 0); // soft white light

		const menuPickCar = new MyMenuPickCar(this.app).buildPickMenu();

		this.app.scene.add(light1);
		this.app.scene.add(light2);
		light_menu_car.position.set(0, 509, 40);

		this.app.scene.add(light_menu_car);
		this.app.scene.add(menuPickCar);
		sceneBuilder.addGlobals();
		sceneBuilder.addCameras();
		sceneBuilder.addSkybox();

		this.obstacleObj = new MyObstacle(this.app);
		this.obstacleObj.buildObstacleLot();

		this.startGame(
			data,
			"./object3D/sedan.glb",
			"./object3D/suvLuxury.glb"
		);

		this.powerUps = [];
		this.obstacles = [];

		const pw = new MyPowerUp(this.app);

		this.powerUps.push(
			pw.buildCube(40, 1, 5.5),
			pw.buildCube(10, 1, -29.5),
			pw.buildCube(-63, 1, 19),
			pw.buildCube(-30, 1, 13)
		);
	}

	startGame(data, playerCarFilepath, opponentCarFilepath) {
		const routeObj = new MyRoute(this.app, data);
		this.trackObj = new MyTrack(this.app, routeObj.curve, 5, null);

		this.trackMesh = this.trackObj.drawTrack();

		this.trackObj.drawTrackFloor();
		this.trackObj.addMarkersToTrack(30);
		this.trackObj.createMarkerRays();
		this.trackObj.createTrackCamera();

		this.playerCar = new MyCar(this.app, playerCarFilepath, 7, 4, true);

		this.opponentCar = new MyCar(
			this.app,
			opponentCarFilepath,
			7,
			6,
			false,
			this.trackObj.calculateAutonomousTrack(4)
		);

		// TODO change this value for autonomous car difficulty (60, 50, 40) (easy, medium, hard)
		const keyFrames = this.opponentCar.getKeyframes(40);
		this.autonomousCarMixer =
			this.opponentCar.animateAutonomousCar(keyFrames);

		// TODO when game begin countdown ends, call these functions
		this.trackObj.changeFirstMarkers();
		this.opponentCar.action.play();
		this.gameTimer.start();
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

	waitForObstacleType() {
		// TODO fazer a parte em que o user de facto faz o picking

		// obstacle type => "firecracker" ou "speed" ou "slow"
		return "firecracker";
	}

	waitForPositionSelection(obstacleType) {
		// TODO fazer a parte em que o user de facto escolhe onde cai o obstaculo
		const position = new THREE.Vector3(-20, 1, 30);

		return this.obstacleObj.buildObstacle(obstacleType, position);
	}

	executePowerupSequence() {
		this.pauseGame();

		this.app.changeCamera("Obstacle Lot");

		const obstacleType = this.waitForObstacleType();

		this.app.changeCamera("Game Lot Birdseye");

		const obstacleObj = this.waitForPositionSelection(obstacleType);

		this.obstacles.push(obstacleObj);
		this.app.scene.add(obstacleObj);

		this.app.changeCamera("Car");

		// Put powerup into effect
		const pw = Math.floor(Math.random() * 2);
		if (pw == 0) {
			//make player faster
			console.log("fast player powerup initiate");
			this.playerCar.superSpeed = true;
			setTimeout(() => {
				this.playerCar.superSpeed = false;
				console.log("fast player powerup over");
			}, 5000);
		} else {
			//make opponent slower
			console.log("slow opponnent powerup initiate");
			this.slowPowerup = true;
			setTimeout(() => {
				this.slowPowerup = false;
				console.log("slow opponnent powerup over");
			}, 5000);
		}

		// TODO maybe countdown for before game restart?
		this.resumeGame();
	}

	checkPowerupsCollision() {
		if (this.playerCar.AABB) {
			this.powerUps.forEach((powerup) => {
				if (this.playerCar.AABB.intersectsBox(powerup.AABB)) {
					const index = this.powerUps.indexOf(powerup);
					if (index > -1) {
						this.powerUps.splice(index, 1);
						setTimeout(() => {
							this.powerUps.push(powerup);
						}, 3000);
					}

					console.log("powerup!");

					this.executePowerupSequence();
				}
			});
		}
	}

	checkObstaclesCollision() {
		if (this.playerCar.AABB) {
			this.obstacles.forEach((obstacle) => {
				if (this.playerCar.AABB.intersectsBox(obstacle.AABB)) {
					console.log("obstacle!", obstacle.obstacleType);

					switch (obstacle.obstacleType) {
						case "firecracker":
							setTimeout(() => {
								this.firecrackerPenalty = false;
								console.log("firecracker finish");
							}, 5000);

							console.log("firecracker active");
							this.firecrackerPenalty = true;
							break;
						case "speed":
							setTimeout(() => {
								this.speedPenalty = false;
								console.log("opponnent speed finish");
							}, 5000);

							console.log("opponnent speed active");
							this.speedPenalty = true;
							break;

						case "slow":
							setTimeout(() => {
								this.penaltyActive = false;
								this.playerCar.penalty = this.penaltyActive;

								console.log("player slow speed finish");
							}, 5000);

							console.log("player slow speed active");
							this.penaltyActive = true;
							this.playerCar.penalty = this.penaltyActive;
							break;
					}

					const index = this.obstacles.indexOf(obstacle);
					if (index > -1) {
						this.obstacles.splice(index, 1);
						setTimeout(() => {
							this.obstacles.push(obstacle);
						}, 3000);
					}
				}
			});
		}
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

	pauseGame() {
		this.gameTimer.pause();
		this.autonomousCarMixer.paused = true;
	}

	resumeGame() {
		this.gameTimer.resume();
		this.autonomousCarMixer.paused = false;
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

		if (this.gameTimer.isRunning) {
			if (this.drag) {
				this.playerCar.decelerate(0.05);
			}

			this.playerCar.updateCar(delta);
			this.opponentCar.updateAABB();

			this.deductPenalties();

			this.trackObj.checkThatMarkerWasPassed(this.playerCar.carMesh);

			this.checkPowerupsCollision();
			this.checkObstaclesCollision();

			if (!this.autonomousCarMixer.paused) {
				if (this.speedPenalty) {
					this.autonomousCarMixer.update(delta * 1.2);
				} else if (this.slowPowerup) {
					this.autonomousCarMixer.update(delta * 0.7);
				} else {
					this.autonomousCarMixer.update(delta);
				}
			}
		}
	}
}

/**
 * Powerups
 * 		superspeed
 * 		slow speed for opponnent
 * 		?
 *
 * Obstacles
 * 		slow speed for player
 * 		change A and D keys
 * 		superspeed for opponnent
 *
 */

export { MyContents };
