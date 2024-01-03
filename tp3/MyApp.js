import * as THREE from "three";
import { OrbitControls } from "three/addons/controls/OrbitControls.js";
import { MyContents } from "./MyContents.js";
import { MyGuiInterface } from "./MyGuiInterface.js";
import Stats from "three/addons/libs/stats.module.js";


/**
 * This class contains the application object
 */
class MyApp {
	/**
	 * the constructor
	 */
	constructor() {
		this.scene = null;
		this.stats = null;

		// camera related attributes
		this.activeCamera = null;
		this.activeCameraName = null;
		this.lastCameraName = null;
		this.cameras = [];
		this.frustumSize = 20;

		// other attributes
		this.renderer = null;
		this.controls = null;
		this.gui = null;
		this.axis = null;
		this.contents == null;
	}
	/**
	 * initializes the application
	 */
	init() {
		// Create an empty scene~4
		this.scene = new THREE.Scene();
		this.scene.background = new THREE.Color(0x101010);

		this.stats = new Stats();
		this.stats.showPanel(1); // 0: fps, 1: ms, 2: mb, 3+: custom
		document.body.appendChild(this.stats.dom);

		// Create a renderer with Antialiasing
		this.renderer = new THREE.WebGLRenderer({ antialias: true });
		this.renderer.setPixelRatio(window.devicePixelRatio);
		this.renderer.setClearColor("#000000");

		this.renderer.shadowMap.enabled = true;
		this.renderer.shadowMap.type = THREE.PCFSoftShadowMap;

		this.initCameras();
		this.setActiveCamera("Perspective");
		// Configure renderer size
		this.renderer.setSize(window.innerWidth, window.innerHeight);

		// Append Renderer to DOM
		document.getElementById("canvas").appendChild(this.renderer.domElement);

		// manage window resizes
		window.addEventListener("resize", this.onResize.bind(this), false);

		// A clock to get DeltaTime
		this.clock = new THREE.Clock(true);
	}

	/**
	 * initializes all the cameras
	 */
	initCameras() {
		const aspect = window.innerWidth / window.innerHeight;

		// Create a basic perspective camera
		const perspective1 = new THREE.PerspectiveCamera(75, aspect, 0.1, 1000);
		perspective1.position.set(10, 10, 3);
		this.cameras["Perspective"] = perspective1;

		// defines the frustum size for the orthographic cameras
		const left = (-this.frustumSize / 2) * aspect;
		const right = (this.frustumSize / 2) * aspect;
		const top = this.frustumSize / 2;
		const bottom = -this.frustumSize / 2;
		const near = -this.frustumSize / 2;
		const far = this.frustumSize;

		//-------------------------------- CAMERA MENU PICK CAR ----------------------------------

		const menuPickCamera = new THREE.PerspectiveCamera(50, window.innerWidth / window.innerHeight, 0.1, 3000);
		menuPickCamera.position.set(0, 515, 30);
		const camTarget = new THREE.Object3D();
		camTarget.position.set;

		menuPickCamera.lookAt(new THREE.Vector3(0, 509, 0))


		this.cameras['Pick Car Menu'] = menuPickCamera


		//-------------------------------- CAMERA MENU PICK CAR ----------------------------------

		const menuPickOpCamera = new THREE.PerspectiveCamera(50, window.innerWidth / window.innerHeight, 0.1, 3000);
		menuPickOpCamera.position.set(0, 1015, 30);
		menuPickOpCamera.lookAt(new THREE.Vector3(0, 1009, 0))


		this.cameras['Pick Car Op Menu'] = menuPickOpCamera


		//-------------------------------- CAMERA MENU PICK CAR ----------------------------------

		const menuPickDifficulty = new THREE.PerspectiveCamera(50, window.innerWidth / window.innerHeight, 0.1, 3000);
		menuPickDifficulty.position.set(500, 300, 30);
		menuPickDifficulty.lookAt(new THREE.Vector3(500, 300, 0))


		this.cameras['Pick Difficulty Menu'] = menuPickDifficulty


		//------------------------------ MENU START ---------------------------------------------

		const menuStartCamera = new THREE.PerspectiveCamera(50, window.innerWidth / window.innerHeight, 0.1, 3000);
		menuStartCamera.position.set(200, 310, 30);
		menuStartCamera.camTarget = new THREE.Object3D();
		menuStartCamera.camTarget.position.set(new THREE.Vector3(200, 300, 0))
		menuStartCamera.lookAt(new THREE.Vector3(200, 300, 0))

		this.cameras['Start Menu'] = menuStartCamera


		// create a left view orthographic camera
		const orthoLeft = new THREE.OrthographicCamera(
			left,
			right,
			top,
			bottom,
			near,
			far
		);
		orthoLeft.up = new THREE.Vector3(0, 1, 0);
		orthoLeft.position.set(-this.frustumSize / 4, 0, 0);
		orthoLeft.lookAt(new THREE.Vector3(0, 0, 0));
		this.cameras["Left"] = orthoLeft;

		// create a top view orthographic camera
		const orthoTop = new THREE.OrthographicCamera(
			left,
			right,
			top,
			bottom,
			near,
			far
		);
		orthoTop.up = new THREE.Vector3(0, 0, 1);
		orthoTop.position.set(0, this.frustumSize / 4, 0);
		orthoTop.lookAt(new THREE.Vector3(0, 0, 0));
		this.cameras["Top"] = orthoTop;

		// create a front view orthographic camera
		const orthoFront = new THREE.OrthographicCamera(
			left,
			right,
			top,
			bottom,
			near,
			far
		);
		orthoFront.up = new THREE.Vector3(0, 1, 0);
		orthoFront.position.set(0, 0, this.frustumSize / 4);
		orthoFront.lookAt(new THREE.Vector3(0, 0, 0));
		this.cameras["Front"] = orthoFront;
	}

	addCameras(camerasMap, defaultCamera) {
		this.cameraKeys = [];
		for (const value of camerasMap) {
			this.cameras[value[0]] = value[1];
		}

		for (var key in this.cameras) {
			this.cameraKeys.push(key);
		}

		this.setActiveCamera(defaultCamera);
	}

	addCamera(camKey, camName, camObj) {
		this.cameraKeys.push(camKey);
		this.cameras[camName] = camObj;
	}

	/**
	 * sets the active camera by name
	 * @param {String} cameraName
	 */
	setActiveCamera(cameraName) {
		this.activeCameraName = cameraName;
		this.activeCamera = this.cameras[this.activeCameraName];
	}

	getActiveCamera() {
		return this.cameras[this.activeCameraName]
	}
	/**
	 * updates the active camera if required
	 * this function is called in the render loop
	 * when the active camera name changes
	 * it updates the active camera and the controls
	 */
	updateCameraIfRequired() {
		// camera changed?
		if (this.lastCameraName !== this.activeCameraName) {
			this.lastCameraName = this.activeCameraName;
			this.activeCamera = this.cameras[this.activeCameraName];
			document.getElementById("camera").innerHTML = this.activeCameraName;

			// call on resize to update the camera aspect ratio
			// among other things
			this.onResize();

			// are the controls yet?
			if (this.activeCameraName == "Pick Car Menu" || this.activeCameraName == "Start Menu" || this.activeCameraName == "Pick Car Op Menu" || this.activeCameraName == "Pick Difficulty Menu") {
				// no controls in here
			}
			else if (this.controls === null) {
				// Orbit controls allow the camera to orbit around a target.
				this.controls = new OrbitControls(
					this.activeCamera,
					this.renderer.domElement
				);
				if (this.activeCamera.camTarget) {
					this.controls.target = this.activeCamera.camTarget.position;
				} else {
					this.controls.target = (new THREE.Vector3(0, 0, 0));
				}
				this.controls.enableZoom = true;
				this.controls.update();
				
			}
			else {
				this.controls.object = this.activeCamera;
				if (this.activeCamera.camTarget) {
					this.controls.target = this.activeCamera.camTarget.position;
				} else {
					this.controls.target = (new THREE.Vector3(0, 0, 0));
				}
			}
		}
	}

	changeCamera(camName) {
		this.setActiveCamera(camName);
		this.updateCameraIfRequired();
	}

	/**
	 * the window resize handler
	 */
	onResize() {
		if (this.activeCamera !== undefined && this.activeCamera !== null) {
			this.activeCamera.aspect = window.innerWidth / window.innerHeight;
			this.activeCamera.updateProjectionMatrix();
			this.renderer.setSize(window.innerWidth, window.innerHeight);
		}
	}
	/**
	 *
	 * @param {MyContents} contents the contents object
	 */
	setContents(contents) {
		this.contents = contents;
	}

	/**
	 * @param {MyGuiInterface} contents the gui interface object
	 */
	setGui(gui) {
		this.gui = gui;
	}

	/**
	 * the main render function. Called in a requestAnimationFrame loop
	 */
	render() {
		this.stats.begin();
		this.updateCameraIfRequired();

		// update the animation if contents were provided
		if (this.activeCamera !== undefined && this.activeCamera !== null) {
			this.contents.update(this.clock.getDelta());
		}

		// required if controls.enableDamping or controls.autoRotate are set to true
		this.controls?.update();

		// render the scene
		this.renderer.render(this.scene, this.activeCamera);

		// subsequent async calls to the render loop
		requestAnimationFrame(this.render.bind(this));

		this.lastCameraName = this.activeCameraName;
		this.stats.end();
	}
}

export { MyApp };
