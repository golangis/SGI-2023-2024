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
		let curve = new THREE.CatmullRomCurve3(points, true, "centripetal");
		this.trackCurve = curve;

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
		let vectors = this.data.track.points.map((point) => {
			return new THREE.Vector3(...point.value);
		});

		const trackLine = this.initCatmullRomCurve(vectors);

		/*const center = this.getCenterPoint(trackLine);
		trackLine.position.sub(center);*/

		this.app.scene.add(trackLine);
	}

	getPerpendiculars(points) {
		let perpendiculars = [];

		for (let i = 0; i < points.length; i++) {
			const at = i / points.length;

			const tangent = this.trackCurve.getTangentAt(at);

			const perpendicularToTangent = tangent
				.clone()
				.cross(new THREE.Vector3(0, 1, 0))
				.normalize();

			perpendiculars.push(perpendicularToTangent);
		}

		return perpendiculars;
	}

	getCenterPoint(mesh) {
		var geometry = mesh.geometry;
		geometry.computeBoundingBox();
		var center = new THREE.Vector3();
		geometry.boundingBox.getCenter(center);
		mesh.localToWorld(center);
		return center;
	}

	buildTrackFaces() {
		const curve = this.trackCurve;

		const pointsCount = 100,
			pointsCount1 = 101;
		let pts = curve.getPoints(pointsCount);
		let pts2 = curve.getPoints(pointsCount + 1);

		const perpendiculars = this.getPerpendiculars(pts2);

		const width = 2;
		const widthSteps = 1;
		const outerPoints = [];

		for (let i = 0; i < pts.length; i++) {
			const point1 = pts[i],
				point2 = perpendiculars[i];

			const Q = point1.clone().add(point2.clone().multiplyScalar(width));

			outerPoints.push(Q);
		}

		////////////////
		const tubeGeometry = new THREE.TubeGeometry(
			new THREE.CatmullRomCurve3(outerPoints, true, "centripetal"),
			this.numberOfSamples,
			0.005
		);

		const lineObj = new THREE.Mesh(tubeGeometry, this.lineMaterial);

		this.app.scene.add(lineObj);

		////////////////

	}
}

export { MyTrack };
