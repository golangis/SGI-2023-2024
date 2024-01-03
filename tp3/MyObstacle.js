import * as THREE from "three";
import vertex from "./shaders/powerup-vert.js";
import frag from "./shaders/powerup-frag.js";

/**

 *  This class contains the contents of out application

 */

class MyObstacle {
	constructor(app) {
		this.app = app;

		const tex = new THREE.TextureLoader().load("./textures/white.png");

		const pulsatingMaterial = new THREE.ShaderMaterial({
			uniforms: {
				time: { type: "f", value: 0.0 },
				rotationSpeed: { type: "f", value: -1.5 },
				uTexture: { type: "sampler2D", value: tex },
				dilationRange: { type: "f", value: 0.1 },
				dilationSpeed: { type: "f", value: 1.0 },
			},

			vertexShader: vertex,
			fragmentShader: frag,
		});

		this.firecrackerMaterial = pulsatingMaterial.clone();
		this.firecrackerMaterial.uniforms.uTexture.value =
			new THREE.TextureLoader().load(
				"./textures/firecracker_obstacle.png"
			);

		this.slowMaterial = pulsatingMaterial.clone();
		this.slowMaterial.uniforms.uTexture.value =
			new THREE.TextureLoader().load("./textures/slow_obstacle.png");

		this.speedMaterial = pulsatingMaterial.clone();
		this.speedMaterial.uniforms.uTexture.value =
			new THREE.TextureLoader().load("./textures/speed_obstacle.png");
	}

	buildExampleObstacles() {
		// Makes players car slower
		const slowCube = new THREE.Mesh(
			new THREE.BoxGeometry(7, 7, 7),
			new THREE.MeshBasicMaterial({
				map: new THREE.TextureLoader().load(
					"./textures/slow_obstacle.png"
				),
			})
		);

		slowCube.obstacleType = "slow";
		slowCube.rotation.set(0, 0, 0);
		slowCube.position.set(0, 3, 250);

		// Changes A and D
		const firecrackerCube = new THREE.Mesh(
			new THREE.BoxGeometry(7, 7, 7),
			new THREE.MeshBasicMaterial({
				map: new THREE.TextureLoader().load(
					"./textures/firecracker_obstacle.png"
				),
			})
		);

		firecrackerCube.obstacleType = "firecracker";
		firecrackerCube.rotation.set(0, 0, 0);
		firecrackerCube.position.set(20, 3, 250);

		// Makes opponnent car faster
		const speedCube = new THREE.Mesh(
			new THREE.BoxGeometry(7, 7, 7),
			new THREE.MeshBasicMaterial({
				map: new THREE.TextureLoader().load(
					"./textures/speed_obstacle.png"
				),
			})
		);

		speedCube.obstacleType = "speed";
		speedCube.rotation.set(0, 0, 0);
		speedCube.position.set(-20, 3, 250);

		// TODO shaders para dar um bocado de flavour
		this.app.scene.add(slowCube);
		this.app.scene.add(firecrackerCube);
		this.app.scene.add(speedCube);
	}

	buildObstacle(type, position) {
		const boxGeom = new THREE.BoxGeometry(1, 1, 1);
		switch (type) {
			case "firecracker":
				const firecrackerCube = new THREE.Mesh(
					boxGeom,
					this.firecrackerMaterial
				);

				firecrackerCube.obstacleType = "firecracker";
				firecrackerCube.position.set(...position);
				firecrackerCube.AABB = new THREE.Box3().setFromObject(
					firecrackerCube
				);

				return firecrackerCube;
			case "speed":
				const speedCube = new THREE.Mesh(boxGeom, this.speedMaterial);

				speedCube.obstacleType = "speed";
				speedCube.position.set(...position);
				speedCube.AABB = new THREE.Box3().setFromObject(speedCube);

				return speedCube;
			case "slow":
				const slowCube = new THREE.Mesh(boxGeom, this.slowMaterial);

				slowCube.obstacleType = "slow";
				slowCube.position.set(...position);
				slowCube.AABB = new THREE.Box3().setFromObject(slowCube);

				return slowCube;
		}
	}

	buildObstacleLotFloor() {
		const geometry = new THREE.PlaneGeometry(200, 200);

		const texture = new THREE.TextureLoader().load("textures/grass.jpg");

		texture.repeat.set(4, 4); // Repeat the texture 4 times in both horizontal and vertical directions

		texture.wrapS = THREE.RepeatWrapping;
		texture.wrapT = THREE.RepeatWrapping;

		const material = new THREE.MeshBasicMaterial({
			color: 0x449654,
			map: texture,
		});

		const floor = new THREE.Mesh(geometry, material);
		floor.rotateX(-Math.PI / 2);
		floor.position.set(0, -0.05, 200);
		this.app.scene.add(floor);
	}

	buildObstacleLot() {
		const texObject = new THREE.TextureLoader().load(
			"./textures/white.png"
		);

		const materialObject = new THREE.MeshPhongMaterial({
			map: texObject,
			side: THREE.BackSide,
		});

		const skyboxGeo = new THREE.BoxGeometry(200, 200, 200);

		const skybox = new THREE.Mesh(skyboxGeo, materialObject);
		skybox.position.set(0, 50, 200);

		this.app.scene.add(skybox);

		const aspect = window.innerWidth / window.innerHeight;
		const camObj = new THREE.PerspectiveCamera(60, aspect, 0.1, 1000);
		camObj.position.set(0, 15, 300);

		this.app.addCamera("Obstacle Lot", "Obstacle Lot", camObj);

		this.buildObstacleLotFloor();
		this.buildExampleObstacles();
	}

	update(delta) {
		this.firecrackerMaterial.uniforms.time.value += delta;
		this.speedMaterial.uniforms.time.value += delta;
		this.slowMaterial.uniforms.time.value += delta;
	}
}

export { MyObstacle };
