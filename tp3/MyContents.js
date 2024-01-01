import * as THREE from "three";
import { MyAxis } from "./MyAxis.js";
import { MyFileReader } from "./parser/MyFileReader.js";
import { MySceneBuilder } from "./MySceneBuilder.js";
import { MyObjectCreator } from "./MyObjectCreator.js";
import { MyTrack } from "./MyTrack.js";
import { MyRoute } from "./MyRoute.js";
import { MyCar } from "./MyCar.js";
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
		this.penaltyActive = false;

		this.first = true;


		this.raycaster = new THREE.Raycaster()
		this.raycaster.near = 1
		this.raycaster.far = 30

		this.pointer = new THREE.Vector2()
		this.intersectedObj = null
		this.pickingColor = "0x00ff00"


		this.availableLayers = ['none', 1, 2, 3]
		this.selectedLayer = this.availableLayers[0]    // change this in interface

		// define the objects ids that are not to be pickeable
		// NOTICE: not a ThreeJS facility
		this.notPickableObjIds = []

		document.addEventListener(
			"pointermove",
			// "mousemove",
			// "pointerdown",
			this.onPointerMove.bind(this)
		);
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


	onPointerMove(event) {

		// calculate pointer position in normalized device coordinates
		// (-1 to +1) for both components

		//of the screen is the origin
		this.pointer.x = (event.clientX / window.innerWidth) * 2 - 1;
		this.pointer.y = -(event.clientY / window.innerHeight) * 2 + 1;

		//console.log("Position x: " + this.pointer.x + " y: " + this.pointer.y);

		//2. set the picking ray from the camera position and mouse coordinates
		this.raycaster.setFromCamera(this.pointer, this.app.getActivemenu());

		//3. compute intersections
		var intersects = this.raycaster.intersectObjects(this.app.scene.children);

		this.pickingHelper(intersects)

		this.transverseRaycastProperties(intersects)
	}

    changeColorOfFirstPickedObj(obj) {
        if (this.lastPickedObj != obj) {
            if (this.lastPickedObj)
                this.lastPickedObj.material.color.setHex(this.lastPickedObj.currentHex);
            this.lastPickedObj = obj;
            this.lastPickedObj.currentHex = this.lastPickedObj.material.color.getHex();
            this.lastPickedObj.material.color.setHex(this.pickingColor);
        }
    }

    restoreColorOfFirstPickedObj() {
        if (this.lastPickedObj)
            this.lastPickedObj.material.color.setHex(this.lastPickedObj.currentHex);
        this.lastPickedObj = null;
    }

	
    transverseRaycastProperties(intersects) {
        for (var i = 0; i < intersects.length; i++) {

            console.log(intersects[i]);

            /*
            An intersection has the following properties :
                - object : intersected object (THREE.Mesh)
                - distance : distance from camera to intersection (number)
                - face : intersected face (THREE.Face3)
                - faceIndex : intersected face index (number)
                - point : intersection point (THREE.Vector3)
                - uv : intersection point in the object's UV coordinates (THREE.Vector2)
            */
        }
    }
	
	pickingHelper(intersects) {
		if (intersects.length > 0) {
			const obj = intersects[0].object
			if (this.notPickableObjIds.includes(obj.name)) {
				this.restoreColorOfFirstPickedObj()
				console.log("Object cannot be picked !")
			}
			else
				this.changeColorOfFirstPickedObj(obj)
		} else {
			this.restoreColorOfFirstPickedObj()
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

		this.keys = { W: false, A: false, S: false, D: false };
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
			this.playerCar.accelerate(this.penaltyActive);
		}
		if (this.keys.A) {
			this.playerCar.turnLeft();
		}
		if (this.keys.S) {
			this.drag = false;
			this.playerCar.brake(this.penaltyActive);
		}
		if (this.keys.D) {
			this.playerCar.turnRight();
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

		this.sceneBuilder = new MySceneBuilder(data, this.app);

		const light1 = new THREE.AmbientLight(0xffffff, 2.5); // soft white light
		const light2 = new THREE.DirectionalLight(0xffffff, 2.5); // soft white light
		const light_menu_car = new THREE.PointLight(0xffffff, 3, 10); // soft white light
		
		const menuPickCar = new MyMenuPickCar(this.app).buildPickMenu();

		this.app.scene.add(light1);
		this.app.scene.add(light2);
		light_menu_car.position.set(0,509,40);
		light_menu_car.target = menuPickCar;

        const menu_light_helper = new THREE.PointLightHelper(light_menu_car);

		this.app.scene.add(light_menu_car);
		this.app.scene.add(menu_light_helper);
		this.app.scene.add(menuPickCar);
		this.sceneBuilder.addGlobals();
		this.sceneBuilder.addCameras();
		this.sceneBuilder.addSkybox();

		this.startGame(
			data,
			"./object3D/sedan.glb",
			"./object3D/suvLuxury.glb"
		);
	}

	startGame(data, playerCarFilepath, opponentCarFilepath) {
		const routeObj = new MyRoute(this.app, data);
		const trackObj = new MyTrack(this.app, data, routeObj.curve, 5, null);

		this.trackMesh = trackObj.drawTrack();
		trackObj.drawTrackFloor();

		this.playerCar = new MyCar(this.app, playerCarFilepath, 7, 4, true);
		
		this.opponentCar = new MyCar(
			this.app,
			opponentCarFilepath,
			7,
			6,
			false
		);
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
					console.log("penalty finish");
				}, 5000);

				console.log("penalty initiated");
				this.penaltyActive = true;
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
	}
}

// TODO player track checkpoints 

export { MyContents };
