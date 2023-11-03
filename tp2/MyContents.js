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
		
		this.addGlobals(data, this.app.scene)
		
		const camerasMap = new MyObjectCreator(data, this.app.scene).getCamerasMap();

		this.app.addCameras(camerasMap, data.activeCameraId)
		
		
		console.log("MyContents.js print 1\n", data)
		const nodes = this.createNodeHierarchy(data, this.app.scene)
		console.log("MyContents.js print 2\n", nodes)
		this.applyTransformations(data, nodes)

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

	createNodeHierarchy(data, scene) {

		const lightType = ['spotlight', 'pointlight', 'directionallight']
		const myObjectCreator = new MyObjectCreator(data, this.app.scene);
		const materialMap = myObjectCreator.getMaterialsMap();
		const nodes = new Map();
		
		for (var key in data.nodes) {
			let node = data.nodes[key]
			let nodeObj = new THREE.Object3D()
			nodeObj.name = node.id

			for (let i = 0; i < node.children.length; i++) {
				
				let child = node.children[i]

				if (child.type === "primitive") {
					const childObj = new THREE.Object3D()
					const geom = myObjectCreator.createPrimitiveObjectGeometry(child)
					const mesh = new THREE.Mesh(geom);

					if ((node.materialIds[0] !== undefined)) {
						mesh.material = materialMap.get(node.materialIds[0])
					}

					childObj.add(mesh)
					nodeObj.add(childObj)
				}

				else if (lightType.includes(child.type)) {
					const childObj = new THREE.Object3D()
					const light = myObjectCreator.createLightObject(child)
					childObj.name = child.id
					childObj.add(light)
					nodeObj.add(childObj)
				}
			}

			nodes.set(node.id, nodeObj)
		}

		for (var key in data.nodes) {
			let node = data.nodes[key]
			for (let i = 0; i < node.children.length; i++) {
                
				let child = node.children[i]

				let parentNode = nodes.get(node.id), childNode = nodes.get(child.id)
				if (childNode !== undefined && parentNode !== undefined) {
					
					if (childNode.parent !== null) {
						const clone = childNode.clone()
						
						parentNode.add(clone)
					}
					
					else {
						parentNode.add(childNode)
					}

					nodes.set(node.id, parentNode)

				}

			}
		}
		
		scene.add(nodes.get(data.rootId))

		return nodes
	}

	applyTransformations(data, nodes) {
		for (var key in data.nodes) {
			let node = data.nodes[key]
			const object = nodes.get(node.id)

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

	// TODO add materials

}

export { MyContents };