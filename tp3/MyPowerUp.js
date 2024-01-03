import * as THREE from "three";
import vertex from "./shaders/powerup-vert.js";
import frag from "./shaders/powerup-frag.js"


/**

 *  This class contains the contents of out application

 */

class MyPowerUp {
	constructor(app) {
		this.app = app;
		this.constructCube();
	}

	constructCube() {
		const powerupTex = new THREE.TextureLoader().load(
			"./textures/powerup.png"
		);

		this.pulsatingMaterial = new THREE.ShaderMaterial({
			uniforms: {
				time: { type: "f", value: 0.0 },
				rotationSpeed: { type: "f", value: 1.5 },
				uTexture: { type: "sampler2D", value: powerupTex },
				dilationRange: { type: "f", value: 0.1 },
				dilationSpeed: { type: "f", value: 1.0 },
			},

			vertexShader: vertex,
			fragmentShader: frag
		});

		const cube = new THREE.Mesh(
			new THREE.BoxGeometry(1, 1, 1),
			this.pulsatingMaterial
		);

		cube.rotation.set(Math.PI / 30, Math.PI / 40, 0);
		cube.position.set(0, 0, 0);

		this.cube = cube;
	}


	buildCube(x, y, z) {
		const cube = this.cube.clone();

		cube.rotation.set(Math.PI / 30, Math.PI / 40, 0);
		cube.position.set(x, y, z);

		this.app.scene.add(cube);
		cube.AABB = new THREE.Box3().setFromObject(cube);
		return cube;
	}

	update(delta) {
		this.pulsatingMaterial.uniforms.time.value += delta;
	}
}

export { MyPowerUp };
