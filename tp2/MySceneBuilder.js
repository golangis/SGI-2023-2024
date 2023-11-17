import * as THREE from "three";
import { MyObjectCreator } from "./MyObjectCreator.js";

/**
    This class customizes the gui interface for the app
*/
class MySceneBuilder {
	constructor(data, app) {
		this.data = data;
		this.scene = app.scene;
		this.app = app;
		this.myObjectCreator = new MyObjectCreator(data, this.app.scene);
		this.rootObject = null;
	}

	addGlobals() {
		this.scene.fog = new THREE.Fog(
			new THREE.Color(
				this.data.fog.color.r,
				this.data.fog.color.g,
				this.data.fog.color.b
			),
			this.data.fog.near,
			this.data.fog.far
		);

		this.scene.add(
			new THREE.AmbientLight(
				new THREE.Color(
					this.data.options.ambient.r,
					this.data.options.ambient.g,
					this.data.options.ambient.b
				)
			)
		);

		this.scene.background = new THREE.Color(
			this.data.options.background.r,
			this.data.options.background.g,
			this.data.options.background.b
		);
	}

	addSkybox() {
		const skybox = this.myObjectCreator.createSkyBox(
			this.data.skyboxes.default
		);
		this.scene.add(skybox);
	}

	addCameras() {
		const camerasMap = this.myObjectCreator.getCamerasMap();

		this.app.addCameras(camerasMap, this.data.activeCameraId);
	}


	visitNodes(node, parent, lastMaterial) {
		let object = new THREE.Object3D();
		object.name = node.id;

		if (node.children) {
			node.children.forEach((element) => {

				if (
					node.materialIds.length !== 0 &&
					(element.materialIds === undefined ||
						element.materialIds.length === 0)
				) {
					lastMaterial = (node.materialIds[0]);
				}

				const childObj = this.visitNodes(element, node, lastMaterial);
				
				childObj.castShadow = node.castShadows
				childObj.receiveShadow = node.receiveShadows

				object.add(childObj);
			});
		} else {
			object = this.buildLeafNode(node, parent, lastMaterial);
		}

		if (node.type === "node") {
			this.applyTransformations(node, object);
		}

		return object;
	}

	buildLeafNode(node, parent, material) {
		const lightType = ["spotlight", "pointlight", "directionallight"];

		if (node.type === "primitive") {
			const nodeObj = new THREE.Object3D();
			const geom =
				this.myObjectCreator.createPrimitiveObjectGeometry(node);
			let mesh = new THREE.Mesh();

			if (node.subtype === "polygon") {
				mesh = geom;
			} else {
				mesh = new THREE.Mesh(geom);
				if (material !== undefined) {
					const materialMap = this.myObjectCreator.getMaterialsMap();
					mesh.material = materialMap.get(material);
				}
			}
			mesh.castShadow = parent.castShadows
			mesh.receiveShadow = parent.receiveShadows

			nodeObj.add(mesh);

			return nodeObj;
		} else if (lightType.includes(node.type)) {
			const nodeObj = new THREE.Object3D();
			const light = this.myObjectCreator.createLightObject(node);
			nodeObj.name = node.id;
			nodeObj.add(light);

			return nodeObj;
		}
	}

	applyTransformations(node, object) {
		node.transformations.forEach(function (transformation) {
			switch (transformation.type) {
				case "T":
					object.translateX(transformation.translate[0]);
					object.translateY(transformation.translate[1]);
					object.translateZ(transformation.translate[2]);
					break;
				case "R":
					// TODO trocar de graus para radianos
					object.rotation.x = THREE.MathUtils.degToRad(
						transformation.rotation[0]
					);
					object.rotation.y = THREE.MathUtils.degToRad(
						transformation.rotation[1]
					);
					object.rotation.z = THREE.MathUtils.degToRad(
						transformation.rotation[2]
					);
					break;
				case "S":
					object.scale.x = transformation.scale[0];
					object.scale.y = transformation.scale[1];
					object.scale.z = transformation.scale[2];
					break;
				default:
					break;
			}
		});
	}

	transformIntoWireframes(node, value) {
		if (node.children) {
			node.children.forEach((child) => {
				if (child.type == "Mesh") {
					const inheritance = this.checkInheritance(node);

					child.material.wireframe = value || inheritance;
					child.material.needsUpdate = true;
				}

				this.transformIntoWireframes(child, value);
			});
		}
	}

	checkInheritance(node) {
		let ancestor = node;
		let materialKey = "";

		while (
			(materialKey === "" || materialKey === undefined) &&
			ancestor !== null
		) {
			ancestor = ancestor.parent;

			try {
				materialKey = this.data.nodes[ancestor.name].materialIds[0];
			} catch {}
		}

		if (ancestor === null) {
			return false;
		}

		const materialMap = this.myObjectCreator.getMaterialsMap();
		const material = materialMap.get(
			this.data.nodes[ancestor.name].materialIds[0]
		);
		const inheritance = material.wireframe;

		return inheritance;
	}
}

export { MySceneBuilder };
