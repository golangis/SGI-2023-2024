import * as THREE from "three";
import { MyAxis } from "./MyAxis.js";
import { MyFileReader } from "./parser/MyFileReader.js";
import { MySceneBuilder } from "./MySceneBuilder.js";
import { MyObjectCreator } from "./MyObjectCreator.js";
/**
 *  This class contains the contents of out application
 */
class MyContents {
	/**
       constructs the object
       @param {MyApp} app The application object
    */
	constructor(app) {
		this.app = app;
		this.axis = null;

		this.reader = new MyFileReader(app, this, this.onSceneLoaded);
		this.reader.open("scenes/entrega/entrega.xml");

		this.activateWireframe = false;
	}

	/**
	 * initializes the contents
	 */
	init() {
		// create once
		if (this.axis === null) {
			// create and attach the axis to the scene
			this.axis = new MyAxis(this);
			this.app.scene.add(this.axis);
		}
	}

	/**
	 * Called when the scene xml file load is complete
	 * @param {MySceneData} data the entire scene data object
	 */
	onSceneLoaded(data) {
		console.info(
			"scene data loaded " +
				data +
				". visit MySceneData javascript class to check contents for each data item."
		);
		this.onAfterSceneLoadedAndBeforeRender(data);
	}

	output(obj, indent = 0) {
		console.log(
			"" +
				new Array(indent * 4).join(" ") +
				" - " +
				obj.type +
				" " +
				(obj.id !== undefined ? "'" + obj.id + "'" : "")
		);
	}

	onAfterSceneLoadedAndBeforeRender(data) {
		// refer to descriptors in class MySceneData.js
		// to see the data structure for each item

		this.output(data.options);

		// first and only skybox is called "default"
		this.output(data.skyboxes["default"]);
		console.log("textures:");
		for (var key in data.textures) {
			let texture = data.textures[key];
			this.output(texture, 1);
		}

		console.log("materials:");
		for (var key in data.materials) {
			let material = data.materials[key];
			this.output(material, 1);
		}

		console.log("cameras:");
		for (var key in data.cameras) {
			let camera = data.cameras[key];
			this.output(camera, 1);
		}

		console.log("nodes:");
		for (var key in data.nodes) {
			let node = data.nodes[key];
			this.output(node, 1);
			if (node.loaded === false) {
				console.error(
					"" +
						new Array(2 * 4).join(" ") +
						" not loaded. Possibly refered as a node child but not defined in scene."
				);
			}
			for (let i = 0; i < node.children.length; i++) {
				let child = node.children[i];
				if (child.type === "primitive") {
					console.log(
						"" +
							new Array(2 * 4).join(" ") +
							" - " +
							child.type +
							" with " +
							child.representations.length +
							" " +
							child.subtype +
							" representation(s)"
					);
					if (child.subtype === "nurbs") {
						console.log(
							"" +
								new Array(3 * 4).join(" ") +
								" - " +
								child.representations[0].controlpoints.length +
								" control points"
						);
					}
				} else if (child.type === "lodref") {
					console.log(
						"" +
							new Array(2 * 4).join(" ") +
							" - " +
							child.type +
							", id " +
							child.id
					);
				} else {
					this.output(child, 2);
				}
			}
		}

		console.log("lods:");
		for (var key in data.lods) {
			let lod = data.lods[key];
			this.output(lod, 1);
			if (lod.loaded === false) {
				console.error(
					"" +
						new Array(2 * 4).join(" ") +
						" not loaded. Possibly refered as a node child but not defined in scene."
				);
			}
			for (let i = 0; i < lod.children.length; i++) {
				let child = lod.children[i];
				console.log(
					"" +
						new Array(2 * 4).join(" ") +
						" - " +
						child.type +
						" " +
						child.node.id +
						", min distance: " +
						child.mindist
				);
			}
		}

		console.log(
			"-------------------------------------------------------------"
		);

		this.sceneBuilder = new MySceneBuilder(data, this.app);

		this.sceneBuilder.addGlobals();
		this.sceneBuilder.addCameras();
		this.sceneBuilder.addSkybox();

		this.rootObject = this.sceneBuilder.visitNodes(
			data.nodes[data.rootId],
			undefined,
			undefined
		);

		this.app.scene.add(this.rootObject);

	}

	update() { }
	
	activateWireframes(value) {
		this.sceneBuilder.transformIntoWireframes(
			this.rootObject,
			value
		);
	}

	createTexture() {
        const video = document.getElementById( 'some-video' );
        this.planeTexture = new THREE.VideoTexture( video );
        this.planeTexture.colorSpace = THREE.SRGBColorSpace;
    }

}

export { MyContents };

