import * as THREE from "three";

/**

 *  This class contains the contents of out application

 */

class MyRoute {
	constructor(app, data) {
		this.app = app;
		this.data = data;

		let vectors = this.data.track.points.map((point) => {
			return new THREE.Vector3(point.value[0], 0, point.value[1]);
		});

		this.curve = new THREE.CatmullRomCurve3(
			vectors,
			true,
			"centripetal"
		);
	}

}

export { MyRoute };
