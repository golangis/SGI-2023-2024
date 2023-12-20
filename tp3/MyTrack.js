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

	buildInnerTrackLine() {
		let vectors = this.data.track.points.map((point) => {
			return new THREE.Vector3(...point.value);
		});

		const trackLine = this.initCatmullRomCurve(vectors);

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

		const pointsCount = 100;
		let pts = curve.getPoints(pointsCount);
		let pts2 = curve.getPoints(pointsCount + 1);

		const perpendiculars = this.getPerpendiculars(pts2);

		const width = 2;
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

		let vertices = [];
		let indices = [];

		let addedPoints = 0;

		for (let i = 0, nextIndex = i + 1; i < pts.length; i++, nextIndex++) {

			if (i === pts.length - 1) {
				nextIndex = 0
			}

			const pointIn = pts[i],
				pointOut = outerPoints[i],
				nextInPoint = pts[nextIndex],
				nextOutPoint = outerPoints[nextIndex];

			vertices.push(...nextInPoint);
			vertices.push(...nextOutPoint);

			vertices.push(...pointIn);
			vertices.push(...pointOut);

			indices.push(addedPoints, addedPoints + 2, addedPoints + 3);
			indices.push(addedPoints + 3, addedPoints + 1, addedPoints);

			addedPoints += 4;
		}

		const trackGeometry = new THREE.BufferGeometry();

		trackGeometry.setIndex(indices);
		trackGeometry.setAttribute(
			"position",
			new THREE.BufferAttribute(new Float32Array(vertices), 3)
		);

		const trackMaterial = new THREE.MeshBasicMaterial({ color: 0x222222 });
		const trackMesh = new THREE.Mesh(trackGeometry, trackMaterial);

		this.app.scene.add(trackMesh);
	}
}

export { MyTrack };
