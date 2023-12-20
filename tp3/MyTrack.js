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
		this.numberOfSamples = 200;

		let vectors = this.data.track.points.map((point) => {
			return new THREE.Vector3(point.value[0], 0, point.value[1]);
		});

		this.trackCurve = new THREE.CatmullRomCurve3(
			vectors,
			true,
			"centripetal"
		);
		this.pointsCount = 100;
	}

	drawInnerTrackLine() {
		let sampledPoints = this.trackCurve.getPoints(this.numberOfSamples);

		const tubeGeometry = new THREE.TubeGeometry(
			new THREE.CatmullRomCurve3(sampledPoints),
			this.numberOfSamples,
			0.05
		);

		const lineObj = new THREE.Mesh(tubeGeometry, this.lineMaterial);

		lineObj.position.set(0, 0, 0);

		this.app.scene.add(lineObj);
	}

	drawOuterTrackLine() {
		const outerPoints = this.calculateOuterTrackPoints();
		
		const tubeGeometry = new THREE.TubeGeometry(
			new THREE.CatmullRomCurve3(outerPoints, true, "centripetal"),
			this.numberOfSamples,
			0.05
		);

		const lineObj = new THREE.Mesh(tubeGeometry, this.lineMaterial);

		this.app.scene.add(lineObj);
	}

	calculateOuterTrackPoints() {
		const curve = this.trackCurve;

		let pts = curve.getPoints(this.pointsCount);

		const width = 6;
		const outerPoints = [];

		const curveLength = this.trackCurve.getLength();

		const spacedLengths = this.trackCurve.getLengths(pts.length);

		for (let i = 0; i < pts.length; i++) {
			const at = spacedLengths[i] / curveLength;

			const point = curve.getPointAt(at);
			const tangent = curve.getTangentAt(at);

			const perpendicularToTangent = tangent
				.clone()
				.cross(new THREE.Vector3(0, 1, 0))
				.normalize();

			const Q = point
				.clone()
				.add(perpendicularToTangent.clone().multiplyScalar(width));

			outerPoints.push(Q);
		}

		return outerPoints;
	}

	createTrackGeometry() {
		const outerPoints = this.calculateOuterTrackPoints();

		let pts = this.trackCurve.getPoints(this.pointsCount);

		let vertices = [];
		let indices = [];

		let addedPoints = 0;

		for (let i = 0, nextIndex = i + 1; i < pts.length; i++, nextIndex++) {
			if (i === pts.length - 1) {
				nextIndex = 0;
			}

			const pointIn = pts[i],
				pointOut = outerPoints[i],
				nextInPoint = pts[nextIndex],
				nextOutPoint = outerPoints[nextIndex];

			vertices.push(...nextInPoint);
			vertices.push(...nextOutPoint);

			vertices.push(...pointIn);
			vertices.push(...pointOut);

			indices.push(addedPoints, addedPoints + 2, addedPoints + 3); // NextInPoint, InPoint, OutPoint
			indices.push(addedPoints + 3, addedPoints + 1, addedPoints); // OutPoint, NextOutPoint, NextInPoint

			addedPoints += 4;
		}

		const trackGeometry = new THREE.BufferGeometry();

		trackGeometry.setIndex(indices);
		trackGeometry.setAttribute(
			"position",
			new THREE.BufferAttribute(new Float32Array(vertices), 3)
		);

		return trackGeometry;
	}

	drawTrack() {
		const trackGeometry = this.createTrackGeometry();

		const trackMaterial = new THREE.MeshBasicMaterial({ color: 0x222222 });
		const trackMesh = new THREE.Mesh(trackGeometry, trackMaterial);

		this.app.scene.add(trackMesh);
	}
}

export { MyTrack };