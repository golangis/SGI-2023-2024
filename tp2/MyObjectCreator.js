import * as THREE from "three";
import { MyNurbsBuilder } from "./MyNurbsBuilder.js";
import { MyTriangle } from "./MyTriangle.js";
import * as BufferGeometryUtils from "three/addons/utils/BufferGeometryUtils.js";

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
				map:
					material.textureref !== null
						? textureMap.get(material.textureref)
						: null,
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

				const triangleGeometry = new MyTriangle(
					xyz1[0],
					xyz1[1],
					xyz1[2],
					xyz1[0],
					xyz3[1],
					xyz4[2],
					xyz3[0],
					xyz3[1],
					xyz3[2]
				);

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

			case "polygon":
				const polygonGeometry = this.createPolygonGeometry(
					objectAttributes.radius,
					objectAttributes.stacks,
					objectAttributes.slices,
					objectAttributes.color_c,
					objectAttributes.color_p
				);

				return polygonGeometry;
			default:
				console.log("\noh no! we dont have any object like that :/\n");
				break;
		}
	}

	createPolygonGeometry(radius, stacks, slices, color_c, color_p) {
		const angleIncrement = (2 * Math.PI) / slices;
		const stackLength = radius / stacks;

		let material = new THREE.MeshBasicMaterial({ color: color_c });

		const polygonGroup = new THREE.Group();

		for (let theta = 0; theta <= 2 * Math.PI; ) {
			const x0 = 0,
				y0 = 0;
			const x1 = Math.cos(theta) * stackLength,
				y1 = Math.sin(theta) * stackLength;

			theta += angleIncrement;

			const x2 = Math.cos(theta) * stackLength,
				y2 = Math.sin(theta) * stackLength;

			const triangleGeo = new MyTriangle(x0, y0, 0, x1, y1, 0, x2, y2, 0);

			const mesh = new THREE.Mesh(triangleGeo, material);
			polygonGroup.add(mesh);
		}

		for (let stack = 1; stack < stacks; stack++) {
			const t = stack / stacks;
			const color = new THREE.Color().lerpColors(color_c, color_p, t);

			material = new THREE.MeshBasicMaterial({ color: color });

			for (let theta = 0; theta <= 2 * Math.PI; ) {
				const x0 = Math.cos(theta) * stackLength * stack,
					y0 = Math.sin(theta) * stackLength * stack;

				const x1 = Math.cos(theta) * stackLength * (stack + 1),
					y1 = Math.sin(theta) * stackLength * (stack + 1);

				theta += angleIncrement;

				const x2 = Math.cos(theta) * stackLength * (stack + 1),
					y2 = Math.sin(theta) * stackLength * (stack + 1);

				const x3 = Math.cos(theta) * stackLength * stack,
					y3 = Math.sin(theta) * stackLength * stack;

				const triangleGeo1 = new MyTriangle(
						x0,
						y0,
						0,
						x1,
						y1,
						0,
						x2,
						y2,
						0
					),
					triangleGeo2 = new MyTriangle(
						x0,
						y0,
						0,
						x2,
						y2,
						0,
						x3,
						y3,
						0
					);

				const mesh1 = new THREE.Mesh(triangleGeo1, material),
					mesh2 = new THREE.Mesh(triangleGeo2, material);

				polygonGroup.add(mesh1);
				polygonGroup.add(mesh2);
			}
		}

		return polygonGroup;
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
		const sides = ["front", "back", "up", "down", "right", "left"];
		const materialObjects = [];

		sides.forEach(function (side) {
			const texObject = new THREE.TextureLoader().load("./" + node[side]);

			const materialObject = new THREE.MeshPhongMaterial({
				emissive: node.emissive,
				emissiveIntensity: node.intensity,
				map: texObject,
				side: THREE.BackSide,
			});

			materialObjects.push(materialObject);
		});

		const skyboxGeo = new THREE.BoxGeometry(
			node.size[0],
			node.size[1],
			node.size[2]
		);
		const skybox = new THREE.Mesh(skyboxGeo, materialObjects);
		skybox.position.set(node.center[0], node.center[1], node.center[2]);

		return skybox;
	}
}

export { MyObjectCreator };
