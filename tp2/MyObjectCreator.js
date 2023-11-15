import * as THREE from "three";
import { MyNurbsBuilder } from "./MyNurbsBuilder.js";

/**
    This class customizes the gui interface for the app
*/
class MyObjectCreator {
	constructor(data, scene) {
		this.sceneData = data;
		this.builder = new MyNurbsBuilder();
		this.scene = scene;
	}

	getTexturesMap() {
		let textureMap = new Map();

		for (var key in this.sceneData.textures) {
			let texture = this.sceneData.textures[key];
			const texObject = new THREE.TextureLoader().load(
				"./" + texture.filepath
			);
			textureMap.set(texture.id, texObject);
		}

		return textureMap;
	}

	getMaterialsMap() {
		let materialMap = new Map();
		const textureMap = this.getTexturesMap();

		for (var key in this.sceneData.materials) {
			let material = this.sceneData.materials[key];
			// TODO atributos "texlength_s" e "texlength_t"
			const materialObject = new THREE.MeshPhongMaterial({
				color: material.color,
				specular: material.specular,
				emissive: material.emissive,
				shininess: material.shininess,
				wireframe: material.wireframe,
				map: (material.textureref !== null)? textureMap.get(material.textureref): null,
				flatShading: material.shading === "flat" ? true : false,
				side:
				material.twosided === true
				? THREE.DoubleSide
				: THREE.FrontSide,
			});
			
			materialObject.name = key;
			
			materialMap.set(material.id, materialObject);
		}

		return materialMap;
	}

	getCamerasMap() {
		let camerasMap = new Map();

		for (var key in this.sceneData.cameras) {
			let camera = this.sceneData.cameras[key];
			let cameraObject;

			switch (camera.type) {
				case "orthogonal":
					cameraObject = new THREE.OrthographicCamera(
						camera.left,
						camera.right,
						camera.top,
						camera.bottom,
						camera.near,
						camera.far
					);

					break;

				case "perspective":
					cameraObject = new THREE.PerspectiveCamera(
						camera.angle,
						undefined,
						camera.near,
						camera.far
					);
					break;
			}

			cameraObject.position.set(
				camera.location[0],
				camera.location[1],
				camera.location[2]
			);

			const targetObject = new THREE.Object3D();
			targetObject.position.set(
				camera.target[0],
				camera.target[1],
				camera.target[2]
			);

			cameraObject.target = targetObject;

			camerasMap.set(camera.id, cameraObject);
		}

		return camerasMap;
	}

	createPrimitiveObjectGeometry(primitiveObject) {
		const objectAttributes = primitiveObject.representations[0];

		switch (primitiveObject.subtype) {
			case "cylinder":
				const cylinderGeometry = new THREE.CylinderGeometry(
					objectAttributes.top,
					objectAttributes.base,
					objectAttributes.height,
					objectAttributes.slices,
					objectAttributes.stacks,
					!objectAttributes.capsclose,
					objectAttributes.thetastart,
					objectAttributes.thetalength
				);

				return cylinderGeometry;

			case "rectangle":
				const xy1 = objectAttributes.xy1,
					xy2 = objectAttributes.xy2;

				const width = Math.abs(xy2[0] - xy1[0]),
					height = Math.abs(xy2[1] - xy1[1]);

				const rectangleGeometry = new THREE.PlaneGeometry(
					width,
					height,
					objectAttributes.parts_x,
					objectAttributes.parts_y
				);

				rectangleGeometry.translate(
					(xy2[0] + xy1[0]) / 2,
					(xy2[1] + xy1[1]) / 2,
					0
				);

				return rectangleGeometry;

			case "triangle":
				// TODO testar Triangle -> nenhum objeto na Demo é um triangulo
				const xyz1 = objectAttributes.xyz1,
					xyz2 = objectAttributes.xyz2,
					xyz3 = objectAttributes.xyz3;

				let triangleGeometry = new THREE.Geometry();

				let triangle = new THREE.Triangle(xyz1, xyz2, xyz3);

				let normal = triangle.normal();
				triangleGeometry.vertices.push(
					triangle.a,
					triangle.b,
					triangle.c
				);

				triangleGeometry.faces.push(new THREE.Face3(0, 1, 2, normal));

				return triangleGeometry;

			case "sphere":
				// TODO testar Sphere -> nenhum objeto na Demo é uma esfera
				const sphereGeom = new THREE.SphereGeometry(
					objectAttributes.radius,
					objectAttributes.slices,
					objectAttributes.stacks,
					objectAttributes.phistart,
					objectAttributes.philength,
					objectAttributes.thetastart,
					objectAttributes.thetalength
				);

				return sphereGeom;

			case "nurbs":
				const controlPoints = objectAttributes.controlpoints,
					degree_u = objectAttributes.degree_u,
					degree_v = objectAttributes.degree_v;

				let controlNURBs = [],
					counter = 0,
					list = [];

				controlPoints.forEach(function (point) {
					list.push([point.xx, point.yy, point.zz, 1]);
					if (counter == degree_v) {
						controlNURBs.push(list);
						list = [];
						counter = 0;
					} else {
						counter++;
					}
				});

				const NURBGeom = this.builder.build(
					controlNURBs,
					degree_u,
					degree_v,
					objectAttributes.parts_u,
					objectAttributes.parts_v
				);

				return NURBGeom;

			case "box":
				const box_xyz1 = objectAttributes.xyz1;
				const box_xyz2 = objectAttributes.xyz2;

				const box_width = Math.abs(box_xyz2[0] - box_xyz1[0]);
				const box_height = Math.abs(box_xyz2[1] - box_xyz1[1]);
				const box_depth = Math.abs(box_xyz2[2] - box_xyz1[2]);

				const boxGeometry = new THREE.BoxGeometry(
					box_width,
					box_height,
					box_depth,
					objectAttributes.parts_x,
					objectAttributes.parts_y,
					objectAttributes.parts_z
				);

				return boxGeometry;

			default:
				console.log("\noh no! we dont have any object like that :/\n");
				break;
		}
	}

	createLightObject(lightObject) {
		switch (lightObject.type) {
			// TODO atributo "enable"
			case "spotlight":
				const spotLight = new THREE.SpotLight(
					lightObject.color,
					lightObject.intensity,
					lightObject.distance,
					lightObject.angle,
					lightObject.penumbra,
					lightObject.decay
				);

				spotLight.position.set(
					lightObject.position[0],
					lightObject.position[1],
					lightObject.position[2]
				);

				spotLight.castShadow = lightObject.castshadow;

				spotLight.shadow.camera.far = lightObject.shadowfar;

				spotLight.shadow.mapSize = new THREE.Vector2(
					lightObject.shadowmapsize,
					lightObject.shadowmapsize
				);

				const targetObject = new THREE.Object3D();
				targetObject.position.copy(
					new THREE.Vector3(
						lightObject.target[0],
						lightObject.target[1],
						lightObject.target[2]
					)
				);
				this.scene.add(targetObject);

				spotLight.target = targetObject;

				return spotLight;

			// TODO atributo "enable"
			case "pointlight":
				const pointLight = new THREE.PointLight(
					lightObject.color,
					lightObject.intensity,
					lightObject.distance,
					lightObject.decay
				);

				pointLight.position.set(
					lightObject.position[0],
					lightObject.position[1],
					lightObject.position[2]
				);

				pointLight.castShadow = lightObject.castshadow;

				pointLight.shadow.camera.far = lightObject.shadowfar;

				pointLight.shadow.mapSize = new THREE.Vector2(
					lightObject.shadowmapsize,
					lightObject.shadowmapsize
				);

				return pointLight;

			// TODO atributos "enable","shadowright", "shadowleft", "shadowbottom", "shadowtop"
			case "directionallight":
				const directionalLight = new THREE.DirectionalLight(
					lightObject.color,
					lightObject.intensity
				);

				directionalLight.position.set(
					lightObject.position[0],
					lightObject.position[1],
					lightObject.position[2]
				);

				directionalLight.castShadow = lightObject.castshadow;

				directionalLight.shadow.camera.far = lightObject.shadowfar;

				directionalLight.shadow.mapSize = new THREE.Vector2(
					lightObject.shadowmapsize,
					lightObject.shadowmapsize
				);

				return directionalLight;

			default:
				console.log("No light of type ", lightObject.type);
				return;
		}
	}

	createSkyBox(node) {
		const sides = ["front", "back", "up", "down", "right", "left"]
		const materialObjects = [];

		sides.forEach(function (side) {
			const texObject = new THREE.TextureLoader().load("./"+node[side]);

			const materialObject = new THREE.MeshPhongMaterial({
				emissive: node.emissive,
				emissiveIntensity: node.intensity,
				map: texObject,
				side: THREE.BackSide
			});
			
			materialObjects.push(materialObject)
		})
		
		const skyboxGeo = new THREE.BoxGeometry(node.size[0], node.size[1], node.size[2]);
  		const skybox = new THREE.Mesh(skyboxGeo, materialObjects);
		skybox.position.set(node.center[0], node.center[1], node.center[2])

		return skybox
	}
}

export { MyObjectCreator };
