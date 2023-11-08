import * as THREE from "three";
import { MyObjectCreator } from "./MyObjectCreator.js";

/**
    This class customizes the gui interface for the app
*/
class MySceneBuilder{
	constructor(data, app) {
		this.data = data;
		this.scene = app.scene;
		this.app = app;
		this.myObjectCreator = new MyObjectCreator(data, this.app.scene);
	}

	addGlobals() {
		this.scene.fog = new THREE.Fog(
			new THREE.Color(this.data.fog.color.r, this.data.fog.color.g, this.data.fog.color.b),
			this.data.fog.near,
			this.data.fog.far
		)

		this.scene.add(
			new THREE.AmbientLight(
				new THREE.Color(
					this.data.options.ambient.r,
					this.data.options.ambient.g,
					this.data.options.ambient.b
				)
			)
		)

		this.scene.background = new THREE.Color(
			this.data.options.background.r,
			this.data.options.background.g,
			this.data.options.background.b
		)
		
	}

	addCameras() {
		const camerasMap = this.myObjectCreator.getCamerasMap();

		this.app.addCameras(camerasMap, this.data.activeCameraId)
	}

	visitNodes(node, parent) {

		let object = new THREE.Object3D()
		object.name = node.id
	
		
		if (node.children) {
			node.children.forEach(
				(element) => {

					if ((node.materialIds.length !== 0)) {
						element.materialIds = []
						element.materialIds.push(node.materialIds[0])
					}
					
					const childObj = (this.visitNodes(element, node))
					object.add(childObj)
				}
			)
		}
		
		else {
			object = this.buildLeafNode(node, parent)
		}
		
		if (node.type === 'node') {
			this.applyTransformations(node, object)
		}

		

		return object;
	}

	buildLeafNode(node, parent) {
		
		const lightType = ['spotlight', 'pointlight', 'directionallight']

		if (node.type === "primitive") {
			const nodeObj = new THREE.Object3D()
			const geom = this.myObjectCreator.createPrimitiveObjectGeometry(node)
			const mesh = new THREE.Mesh(geom);

			if ((parent.materialIds[0] !== undefined)) {
				const materialMap = this.myObjectCreator.getMaterialsMap();
				mesh.material = materialMap.get(parent.materialIds[0])
			}

			nodeObj.add(mesh)

			return nodeObj;
		}

		else if (lightType.includes(node.type)) {
			const nodeObj = new THREE.Object3D()
			const light = this.myObjectCreator.createLightObject(node)
			nodeObj.name = node.id
			nodeObj.add(light)

			return nodeObj;
		}

	}

	applyTransformations(node, object) {
		
		node.transformations.forEach(function (transformation) {
			switch (transformation.type) {
				case "T":
					object.position.x += transformation.translate[0]
					object.position.y += transformation.translate[1]
					object.position.z += transformation.translate[2]
					break;
				case "R":
					object.rotation.x += THREE.MathUtils.degToRad(transformation.rotation[0])
					object.rotation.y += THREE.MathUtils.degToRad(transformation.rotation[1])
					object.rotation.z += THREE.MathUtils.degToRad(transformation.rotation[2])
					break;
				case "S":
					object.scale.x *= transformation.scale[0]
					object.scale.y *= transformation.scale[1]
					object.scale.z *= transformation.scale[2]
					break;
				default:
					break;
			}
		}
		);

	}

}

export { MySceneBuilder };
