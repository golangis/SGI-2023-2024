import * as THREE from "three";

/**

 *  This class contains the contents of out application

 */

class MyTrack {
	constructor(app, data, trackMaterial) {
		this.app = app;
		this.data = data;
		this.lineMaterial = new THREE.LineBasicMaterial({ color: 0x808080 });
		this.trackMaterial = trackMaterial;
		this.numberOfSamples = 70;
	}

	initCatmullRomCurve(points) {
		let curve = new THREE.CatmullRomCurve3(points);

		// sample a number of points on the curve

		let sampledPoints = curve.getPoints(this.numberOfSamples);

		const tubeGeometry = new THREE.TubeGeometry(
			new THREE.CatmullRomCurve3(sampledPoints),
			this.numberOfSamples,
			0.005
		);

		const lineObj = new THREE.Mesh(tubeGeometry, this.lineMaterial);

		lineObj.position.set(0, 0, 0);
		return lineObj;
	}

	buildTrackLine() {

		let vectors = this.data.track.points.map(point => {
			return new THREE.Vector3(...point.value);
		});
		
		vectors.push(vectors[0])
		
		const trackLine = this.initCatmullRomCurve(vectors)
		this.app.scene.add(trackLine)
	}
}

export { MyTrack };
