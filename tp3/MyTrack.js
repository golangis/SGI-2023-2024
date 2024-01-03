import * as THREE from "three";
import { MyTriangle } from "./MyTriangle.js";

/**

 *  This class contains the contents of the track for the racing game

 */

class MyTrack {
	constructor(app, route, trackWidth, trackMaterial) {
		this.app = app;
		this.lineMaterial = new THREE.MeshBasicMaterial({ map: new THREE.TextureLoader().load('textures/road.jpg') })
		|| new THREE.MeshBasicMaterial({ color: 0xff0000 });
		

		this.trackMaterial = new THREE.MeshBasicMaterial({ map: new THREE.TextureLoader().load('textures/road.jpg') })
		|| new THREE.MeshBasicMaterial({ color: 0xff0000 });

		this.numberOfSamples = 200;

		this.trackCurve = route;
		this.pointsCount = 100;
		this.trackWidth = trackWidth;
		this.innerMarkers = [];
		this.outerMarkers = [];

		this.laps = 0;
		this.gameOver = false;

		this.nextMarkerIndex = 0;
	}

	getCenterPoint(mesh) {
		var geometry = mesh.geometry;
		geometry.computeBoundingBox();
		var center = new THREE.Vector3();
		geometry.boundingBox.getCenter(center);
		mesh.localToWorld(center);
		this.trackCurve.center = center;
		return center;
	}

	createMarker() {
		const base = new THREE.Mesh(
			new THREE.CylinderGeometry(0.08, 0.08, 0.05),
			new THREE.MeshBasicMaterial({ color: 0x3d2b1d })
		);

		const pole = new THREE.Mesh(
			new THREE.CylinderGeometry(0.05, 0.05, 0.75),
			new THREE.MeshBasicMaterial({ color: 0x3d2b1d })
		);
		const top = new THREE.Mesh(
			new THREE.CylinderGeometry(0.05, 0.05, 0.25),
			new THREE.MeshBasicMaterial({ color: 0xff0000 })
		);

		pole.position.set(0, 0.35, 0);
		top.position.set(0, 0.85, 0);
		top.name = "top";

		const marker = new THREE.Object3D();
		marker.add(pole, top, base);

		return marker;
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
				.add(
					perpendicularToTangent
						.clone()
						.multiplyScalar(this.trackWidth)
				);

			outerPoints.push(Q);
		}

		return outerPoints;
	}

	createInnerMarkersArray(numOfMarkers) {
		const marker = this.createMarker();
		let pts = this.trackCurve.getSpacedPoints(numOfMarkers);
		let clone = marker.clone();

		for (let i = 0; i < pts.length - 1; i++) {
			clone.position.set(...pts[i]);
			clone.position.sub(this.offset);

			this.innerMarkers.push(clone);

			clone = marker.clone();
		}

		return this.innerMarkers;
	}

	createOuterMarkersArray(numOfMarkers) {
		const marker = this.createMarker();
		let clone = marker.clone();

		for (let i = 0; i < numOfMarkers; i++) {
			let at = i / numOfMarkers;

			const point = this.trackCurve.getPointAt(at);
			const tangent = this.trackCurve.getTangentAt(at);

			const perpendicularToTangent = tangent
				.clone()
				.cross(new THREE.Vector3(0, 1, 0))
				.normalize();

			const Q = point
				.clone()
				.add(
					perpendicularToTangent
						.clone()
						.multiplyScalar(this.trackWidth)
				);

			clone.position.set(...Q);
			clone.position.sub(this.offset);

			this.outerMarkers.push(clone);

			clone = marker.clone();
		}

		return this.outerMarkers;
	}

	addMarkersToTrack(numOfMarkers) {
		this.createInnerMarkersArray(numOfMarkers);
		this.createOuterMarkersArray(numOfMarkers);

		const dummy1 = this.innerMarkers.slice(this.innerMarkers.length - 8);

		dummy1.push(
			...this.innerMarkers.slice(0, this.innerMarkers.length - 8)
		);

		const dummy2 = this.outerMarkers.slice(this.outerMarkers.length - 8);

		dummy2.push(
			...this.outerMarkers.slice(0, this.outerMarkers.length - 8)
		);

		this.innerMarkers = dummy1;
		this.outerMarkers = dummy2;

		for (let i = 0; i < numOfMarkers; i++) {
			this.app.scene.add(this.innerMarkers[i]);
			this.app.scene.add(this.outerMarkers[i]);
		}
	}

	changeFirstMarkers() {
		const yellow = new THREE.MeshBasicMaterial({ color: 0xe0b002 });
		this.changeColorOfMarker(this.innerMarkers[0], yellow);
		this.changeColorOfMarker(this.outerMarkers[0], yellow);
	}

	createMarkerRays() {
		let rays = [];

		for (let i = 0; i < this.outerMarkers.length; i++) {
			const distance = this.innerMarkers[i].position.distanceTo(
				this.outerMarkers[i].position
			);
			const origin = this.outerMarkers[i].position.clone();

			const direction = new THREE.Vector3()
				.subVectors(
					this.innerMarkers[i].position,
					this.outerMarkers[i].position
				)
				.normalize();

			origin.y += 0.5; // Raise ray a bit so it hits the middle of the car

			const ray = new THREE.Raycaster(origin, direction, 0, distance);
			rays.push(ray);
		}

		this.markerRays = rays;
		return rays;
	}

	changeColorOfMarker(marker, material) {
		marker.children.forEach((element) => {
			if (element.name === "top") {
				element.material = material;
			}
		});
	}

	resetMarkers() {
		const red = new THREE.MeshBasicMaterial({ color: 0xff0000 });
		this.innerMarkers.forEach((element) => {
			this.changeColorOfMarker(element, red);
		});
		this.outerMarkers.forEach((element) => {
			this.changeColorOfMarker(element, red);
		});
	}

	checkThatMarkerWasPassed(carObj) {
		const carMesh = carObj.carMesh;

		const yellow = new THREE.MeshBasicMaterial({ color: 0xe0b002 });
		const green = new THREE.MeshBasicMaterial({ color: 0x00ff00 });

		if (this.markerRays !== undefined) {
			if (
				this.markerRays[this.nextMarkerIndex].intersectObject(carMesh)
					.length > 0
			) {
				this.changeColorOfMarker(
					this.outerMarkers[this.nextMarkerIndex],
					green
				);

				this.changeColorOfMarker(
					this.innerMarkers[this.nextMarkerIndex],
					green
				);

				if (this.nextMarkerIndex === this.outerMarkers.length - 1) {
					if (carObj.numberOfLaps !== 3) {
						this.resetMarkers();
						this.nextMarkerIndex = 0;
						carObj.numberOfLaps++;
					} else {
						return;
					}
				} else {
					this.nextMarkerIndex++;
				}

				this.changeColorOfMarker(
					this.outerMarkers[this.nextMarkerIndex],
					yellow
				);

				this.changeColorOfMarker(
					this.innerMarkers[this.nextMarkerIndex],
					yellow
				);
			}
		}
	}

	calculateAutonomousTrack(scalar) {
		const curve = this.trackCurve;

		let pts = curve.getPoints(this.pointsCount);

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
				.add(perpendicularToTangent.clone().multiplyScalar(scalar));

			outerPoints.push(Q);
		}

		outerPoints.center = this.trackCurve.center;

		return outerPoints;
	}

	createTrackGeometry() {
		const outerPoints = this.calculateOuterTrackPoints();
		this.outerPoints = outerPoints;

		let pts = this.trackCurve.getPoints(this.pointsCount);

		let vertices = [],
			indices = [];

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
		const trackMesh = new THREE.Mesh(trackGeometry, this.trackMaterial);

		const center = this.getCenterPoint(trackMesh);

		trackMesh.position.sub(center);
		this.offset = center;
		this.app.scene.add(trackMesh);

		const finishLine = new THREE.Mesh(
			new THREE.PlaneGeometry(this.trackWidth, 1.5),
			new THREE.MeshBasicMaterial({
				map: new THREE.TextureLoader().load("./textures/finish.jpg"),
			})
		);

		finishLine.rotation.set(-Math.PI / 2, 0, Math.PI / 2 - Math.PI / 7.2);
		finishLine.position.set(-4, 0.005, 1.9);
		this.app.scene.add(finishLine);

		return trackMesh;
	}

	createTrackCamera() {
		const aspect = window.innerWidth / window.innerHeight;
		const camObj = new THREE.PerspectiveCamera(60, aspect, 0.1, 1000);
		camObj.position.set(0, 80, 0);

		this.app.addCamera("Game Lot Birdseye", "Game Lot Birdseye", camObj);
	}

	drawTrackFloor() {
		const geometry = new THREE.PlaneGeometry(200, 200);

		const texture = new THREE.TextureLoader().load("textures/grass.jpg");

		texture.repeat.set(8, 8); // Repeat the texture 4 times in both horizontal and vertical directions

		texture.wrapS = THREE.RepeatWrapping;
		texture.wrapT = THREE.RepeatWrapping;

		const material = new THREE.MeshBasicMaterial({
			color: 0x449654,
			map: texture,
		});

		const floor = new THREE.Mesh(geometry, material);
		floor.rotateX(-Math.PI / 2);
		floor.position.y = -0.05;
		this.app.scene.add(floor);
	}
}

export { MyTrack };
