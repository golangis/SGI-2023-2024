import * as THREE from "three";

/**
    This class customizes the gui interface for the app
*/
class MyCarpet {
    constructor() {

        this.width =  3.5;
        this.height = 0.05;
        this.length =  6;

        this.carpetMaterial = new THREE.MeshPhongMaterial({
            emissive: "#000000",
            shininess: 0,
            map: new THREE.TextureLoader().load('textures/carpet.jpg')
        })
        
    }

    buildCarpet() {
        
        const carpetGeometry = new THREE.BoxGeometry(
            this.width,
            this.height,
            this.length
        );

        this.carpetMesh = new THREE.Mesh(carpetGeometry, this.carpetMaterial);
        this.carpetMesh.position.set(2, this.height/2, 0);

        this.carpetMesh.receiveShadow = true;
        return this.carpetMesh;
    }

    
}

export { MyCarpet };
