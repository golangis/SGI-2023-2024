import * as THREE from "three";

/**
    This class customizes the gui interface for the app
*/
class MyObjectCreator {
    constructor(data) {
        this.sceneData = data;
    }

    getTexturesMap() {
        let textureMap = new Map();

        for (var key in this.sceneData.textures) {
            let texture = this.sceneData.textures[key]
            const texObject = new THREE.TextureLoader().load("./"+texture.filepath)
            textureMap.set(texture.id, texObject)
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
            let material = this.sceneData.materials[key]
            
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

            materialMap.set(material.id, materialObject)
        }

        return materialMap;
    }


    getCamerasMap() {
        let camerasMap = new Map();

        for (var key in this.sceneData.cameras) {
            let camera = this.sceneData.cameras[key]

            switch (camera.type) {
                case "orthogonal":
                    break;
                
                case "perspective":
                    break;
                
            }
            
            console.log(camera.id, camera)
        }
    }
}

export { MyObjectCreator };
