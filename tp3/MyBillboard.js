import * as THREE from "three";

/**

 *  This class contains the contents of out application

 */

class MyBillboard {
	constructor(app) {
		this.app = app;
		this.screens = [];
	}

	createBillboard() {
		const billboardGroup = new THREE.Group();
		const top = new THREE.Group();
		const pillar = new THREE.Mesh(
			new THREE.CylinderGeometry(0.6, 0.6, 10),
			new THREE.MeshBasicMaterial({
				color: 0x000000,
			})
		);

		const sideLength = 10;
		
		const triangleGeometry = new THREE.BufferGeometry().setFromPoints([
			new THREE.Vector3(sideLength/2, 0,  (Math.sqrt(3)*sideLength) / 2),
			new THREE.Vector3(sideLength, 0, 0),
			new THREE.Vector3(0, 0, 0),
		]);

		const base = new THREE.Mesh(
			triangleGeometry,
			new THREE.MeshBasicMaterial({
				color: 0x000000,
				side: THREE.DoubleSide
			})
		);

		base.geometry.center();

		const clone = base.clone()
		clone.position.set(0, 15, 0);

		const screen = new THREE.Mesh(
			new THREE.PlaneGeometry(10, 5),
			new THREE.MeshBasicMaterial({
				color: 0xFFFFFF,
				side: THREE.DoubleSide
			})
		);

		const clone2 = screen.clone(), clone3 = screen.clone();

		clone2.rotateY(Math.PI / 3);
		clone2.position.set(2.5, 12.5, 0);

		clone3.rotateY(-Math.PI / 3);
		clone3.position.set(-2.5, 12.5, 0);
		
		screen.position.set(0, 12.5, -4.33);
		pillar.position.set(0, 5, 0);
		base.position.set(0, 10, 0);
		
		top.add(screen, clone, clone2, clone3, base);
		top.position.set(0, 0, 1);

		this.screens.push(screen, clone2, clone3);

		billboardGroup.add(top, pillar);
		this.app.scene.add(billboardGroup);
	}
}

export { MyBillboard };
