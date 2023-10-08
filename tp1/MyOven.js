import * as THREE from "three";

/**
    This class customizes the gui interface for the app
*/
class MyOven {
    constructor( ovenWidth, ovenHeight, ovenTickness, ovenMaterial) {

        this.ovenWidth = ovenWidth || 1.2;
        this.ovenHeight = ovenHeight || 1.8;
        this.ovenTickness = ovenTickness || 2;

        
        this.ovenMaterial = ovenMaterial ||  new THREE.MeshPhongMaterial({
            specular: "#111111",
            emissive: "#222222",
            shininess: 30,
            color: "#606060"
        });
        
    }

    buildOven() {
        let oven = new THREE.BoxGeometry(this.ovenWidth, this.ovenHeight, this.ovenTickness);
        let ovenMesh = new THREE.Mesh(oven, this.ovenMaterial);
        ovenMesh.position.set(-5 + this.ovenWidth/2, this.ovenHeight / 2, 0);

        const burnerOven = new THREE.CylinderGeometry(
            0.3,
            0.3,
            0.1
        );

        return ovenMesh;
    }

    
}

export { MyOven };
