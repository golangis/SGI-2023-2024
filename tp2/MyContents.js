import * as THREE from 'three';
import { MyAxis } from './MyAxis.js';
import { MyFileReader } from './parser/MyFileReader.js';
import { MyObjectCreator } from './MyObjectCreator.js';
/**
 *  This class contains the contents of out application
 */
class MyContents  {

    /**
       constructs the object
       @param {MyApp} app The application object
    */ 
    constructor(app) {
        this.app = app
        this.axis = null

        this.reader = new MyFileReader(app, this, this.onSceneLoaded);
		this.reader.open("scenes/demo/demo.xml");		
    }

    /**
     * initializes the contents
     */
    init() {
        // create once 
        if (this.axis === null) {
            // create and attach the axis to the scene
            this.axis = new MyAxis(this)
            this.app.scene.add(this.axis)
        }
    }

    /**
     * Called when the scene xml file load is complete
     * @param {MySceneData} data the entire scene data object
     */
    onSceneLoaded(data) {
        console.info("scene data loaded " + data + ". visit MySceneData javascript class to check contents for each data item.")
        this.onAfterSceneLoadedAndBeforeRender(data);
    }

    output(obj, indent = 0) {
        console.log("" + new Array(indent * 4).join(' ') + " - " + obj.type + " " + (obj.id !== undefined ? "'" + obj.id + "'" : ""))
    }

    onAfterSceneLoadedAndBeforeRender(data) {
       
        // refer to descriptors in class MySceneData.js
        // to see the data structure for each item

        this.output(data.options)
        console.log("textures:")
        for (var key in data.textures) {
            let texture = data.textures[key]
            this.output(texture, 1)
        }

        console.log("materials:")
        for (var key in data.materials) {
            let material = data.materials[key]
            this.output(material, 1)
        }

        console.log("cameras:")
        for (var key in data.cameras) {
            let camera = data.cameras[key]
            this.output(camera, 1)
        }

        console.log("nodes:")
        for (var key in data.nodes) {
            let node = data.nodes[key]
            this.output(node, 1)
            for (let i = 0; i < node.children.length; i++) {
				let child = node.children[i]
				
                if (child.type === "primitive") {
                    console.log("" + new Array(2 * 4).join(' ') + " - " + child.type + " with "  + child.representations.length + " " + child.subtype + " representation(s)")
                    if (child.subtype === "nurbs") {
                        console.log("" + new Array(3 * 4).join(' ') + " - " + child.representations[0].controlpoints.length + " control points")
                    }
                }
                else {
                    this.output(child, 2)
                }
            }
        }

		console.log("-------------------------------------------------------------")
		
		this.myObjectCreator = new MyObjectCreator(data, this.app.scene);

		this.addGlobals(data, this.app.scene)
		
		const camerasMap = new MyObjectCreator(data, this.app.scene).getCamerasMap();

		this.app.addCameras(camerasMap, data.activeCameraId)
		
		
		console.log("Data\n", data)
		const rootObject = this.visitNodes(data.nodes[data.rootId], null);
		this.app.scene.add(rootObject)

    }

    update() {
        
	}
	

	addGlobals(data, scene) {
		scene.fog = new THREE.Fog(
			new THREE.Color(data.fog.color.r, data.fog.color.g, data.fog.color.b),
			data.fog.near,
			data.fog.far
		)

		scene.add(
			new THREE.AmbientLight(
				new THREE.Color(
					data.options.ambient.r,
					data.options.ambient.g,
					data.options.ambient.b
				)
			)
		)

		scene.background = new THREE.Color(
			data.options.background.r,
			data.options.background.g,
			data.options.background.b
		)
		
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

	// TODO cascade materials

}

export { MyContents };