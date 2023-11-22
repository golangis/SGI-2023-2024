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
		this.lights = []
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
		let object = new THREE.Object3D(),
			childObj = new THREE.Object3D();

		if (node.type === "lod") {
			object = new THREE.LOD();
		}

		object.name = node.id;

		if (node.children) {
			node.children.forEach((element) => {
				if (
					node.materialIds !== undefined &&
					node.materialIds.length !== 0 &&
					(element.materialIds === undefined ||
						element.materialIds.length === 0)
				) {
					lastMaterial = node.materialIds[0];
				}

				if (element.type === "lodnoderef") {
					childObj = this.visitNodes(element.node, node, lastMaterial);
					object.addLevel(childObj, element.mindist);
				} else {
					childObj = this.visitNodes(element, node, lastMaterial);

					childObj.castShadow = node.castShadows;
					childObj.receiveShadow = node.receiveShadows;
					object.add(childObj);
				}

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

			if (node.subtype === "polygon" || node.subtype === "model3d") {
				mesh = geom;
			} else {
				mesh = new THREE.Mesh(geom);
				if (material !== undefined) {
					const materialMap = this.myObjectCreator.getMaterialsMap();
					const materialObject = materialMap.get(material);
					console.log('potas', materialObject)
					mesh.material = materialObject.clone();

					if (node.subtype === "rectangle") {
						if (mesh.material.map != null) {
							mesh.material.map = mesh.material.map.clone()
							mesh.material.map.repeat.set(geom.parameters.width / materialObject.texlength_s, geom.parameters.height / materialObject.texlength_t)
							mesh.material.map.wrapS = THREE.RepeatWrapping;
							mesh.material.map.wrapT = THREE.RepeatWrapping;
						}

						mesh.material.bumpMap?.repeat.set(geom.parameters.width / materialObject.texlength_s, geom.parameters.height / materialObject.texlength_t)
						if (mesh.material.bumpMap != null) {
							mesh.material.bumpMap.wrapS = THREE.RepeatWrapping;
							mesh.material.bumpMap.wrapT = THREE.RepeatWrapping;
						}
						
						mesh.material.specularMap?.repeat.set(geom.parameters.width / materialObject.texlength_s, geom.parameters.height / materialObject.texlength_t)
						if (mesh.material.specularMap != null) {
							mesh.material.specularMap.wrapS = THREE.RepeatWrapping;
							mesh.material.specularMap.wrapT = THREE.RepeatWrapping;
						}
					}

					if (node.subtype === "triangle") {
						const point1 = node.representations[0].xyz1;
						const point2 = node.representations[0].xyz2;
						const point3 = node.representations[0].xyz3;

						const a = Math.sqrt((point2[0] - point1[0])**2 + (point2[1] -point1[1])**2 + (point2[2] - point1[2])**2)
						const b = Math.sqrt((point3[0] - point2[0])**2 + (point3[1] -point2[1])**2 + (point3[2] - point2[2])**2)
						const c = Math.sqrt((point1[0] - point3[0])**2 + (point1[1] -point3[1])**2 + (point1[2] - point3[2])**2)

						const sin_alpha = Math.sqrt(1 - ((a**2 - b**2 + c**2) / (2*a*c))**2)

						const height = c * sin_alpha;
						const width = a;

						mesh.material.map?.repeat.set(width/ materialObject.texlength_s, height / materialObject.texlength_t)
						if (mesh.material.map != null) {
							mesh.material.map.wrapS = THREE.RepeatWrapping;
							mesh.material.map.wrapT = THREE.RepeatWrapping;
						}

						mesh.material.bumpMap?.repeat.set(width / materialObject.texlength_s, height / materialObject.texlength_t)
						if (mesh.material.bumpMap != null) {
							mesh.material.bumpMap.wrapS = THREE.RepeatWrapping;
							mesh.material.bumpMap.wrapT = THREE.RepeatWrapping;
						}
						
						mesh.material.specularMap?.repeat.set(width / materialObject.texlength_s, height / materialObject.texlength_t)
						if (mesh.material.specularMap != null) {
							mesh.material.specularMap.wrapS = THREE.RepeatWrapping;
							mesh.material.specularMap.wrapT = THREE.RepeatWrapping;
						}
					}
				}
			}
			mesh.castShadow = parent.castShadows;
			mesh.receiveShadow = parent.receiveShadows;

			nodeObj.add(mesh);

			return nodeObj;
		} else if (lightType.includes(node.type)) {
			const nodeObj = new THREE.Object3D();
			const light = this.myObjectCreator.createLightObject(node);
			nodeObj.name = node.id;
			nodeObj.add(light);

			this.lights.push(light)

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
					object.rotation.x =
						transformation.rotation[0];
					object.rotation.y =
						transformation.rotation[1];
					object.rotation.z =
						transformation.rotation[2];
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
			} catch { }
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
