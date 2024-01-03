import * as THREE from "three";

/**

 *  This class contains the contents of thr game power ups

 */

class MyPowerUp {
	constructor(app) {
		this.app = app;
	}

	buildCylinder(x, y, z) {
		const cylinder = new THREE.Mesh(
			new THREE.CylinderGeometry(1, 1, 0.2, 20, 20),
			new THREE.MeshBasicMaterial({
				map: new THREE.TextureLoader().load("./textures/powerup.png"),
			})
		);

		cylinder.rotation.set(0, Math.PI/20, Math.PI/2);
		cylinder.position.set(x, y, z);

		this.app.scene.add(cylinder);
		cylinder.AABB = new THREE.Box3().setFromObject(cylinder);
		return cylinder;
	}
}

export { MyPowerUp };
