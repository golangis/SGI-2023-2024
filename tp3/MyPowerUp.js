import * as THREE from "three";

/**

 *  This class contains the contents of out application

 */

class MyPowerUp {
	constructor(app) {
		this.app = app;
	}

	buildCube(x, y, z) {
		const cube = new THREE.Mesh(
			new THREE.BoxGeometry(1, 1, 1),
			new THREE.MeshBasicMaterial({
				map: new THREE.TextureLoader().load("./textures/powerup.png"),
			})
		);

		cube.rotation.set(Math.PI / 30, Math.PI / 40, 0);
		cube.position.set(x, y, z);

		this.app.scene.add(cube);
		cube.AABB = new THREE.Box3().setFromObject(cube);
		return cube;
	}
}

export { MyPowerUp };
