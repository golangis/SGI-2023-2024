import * as THREE from "three";
import { MyNurbsBuilder } from "./MyNurbsBuilder.js";

/**
    This class customizes the gui interface for the app
*/
class MyObjectCreator {
	constructor(data) {
		this.sceneData = data;
		this.builder = new MyNurbsBuilder();
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

	/**
	 * None of the built-in materials in Three.js include all of the attributes
	 * If the value is not required, and thus null, the constructor catches that?
	 */
	getMaterialsMap() {
		let materialMap = new Map();

		for (var key in this.sceneData.materials) {
			let material = this.sceneData.materials[key];

			const materialObject = new THREE.MeshPhongMaterial({
				color: material.color,
				specular: material.specular,
				emissive: material.emissive,
				shininess: material.shininess,
				wireframe: material.wireframe,
				// TODO
				//flatShading:
				//shading
				//textureref
				//texlength_s
				//texlength_t
				//twosided
			});

			materialMap.set(material.id, materialObject);
		}

		console.log(materialMap);
		return materialMap;
	}

	getCamerasMap() {
		let camerasMap = new Map();

		for (var key in this.sceneData.cameras) {
			let camera = this.sceneData.cameras[key];

			switch (camera.type) {
				case "orthogonal":
					// TODO "location", "target"
					camerasMap.set(
						camera.id,
						new THREE.OrthographicCamera(
							camera.left,
							camera.right,
							camera.top,
							camera.bottom,
							camera.near,
							camera.far
						)
					);
					break;

				case "perspective":
					// TODO "angle", "location", "target"
					camerasMap.set(
						camera.id,
						new THREE.PerspectiveCamera(camera.near, camera.far)
					);
					break;
			}
		}

		return camerasMap;
	}

	createPrimitiveObjectGeometry(primitiveObject) {
		console.log(primitiveObject);
		const objectAttributes = primitiveObject.representations[0];

		switch (primitiveObject.subtype) {
			case "cylinder":
				const cylinderGeometry = new THREE.CylinderGeometry(
					objectAttributes.top,
					objectAttributes.base,
					objectAttributes.height,
					objectAttributes.slices,
					objectAttributes.stacks,
					!objectAttributes.capsclose, // Negation because it is the opposite of the constructor argument -> 'OpenEnded'
					objectAttributes.thetastart,
					objectAttributes.thetalength
				);

				return cylinderGeometry;

			case "rectangle":
				// TODO os xy1 e xy2 são as posições das pontas do retangulo?
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

				return rectangleGeometry;

			case "triangle":
				// TODO testar Triangle -> nenhum objeto na Demo é um triangulo
				// TODO os xyz1, xyz2 e xyz3 são as posições das pontas do triangulo?
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
				break;
		}
	}
}

export { MyObjectCreator };
