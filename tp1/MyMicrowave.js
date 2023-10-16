import * as THREE from "three";

/**
    This class customizes the gui interface for the app
*/
class MyMicrowave {
    constructor() {

        this.width =  1;
        this.height = 1;
        this.length =  2.2;

        this.MyMicrowaveFrontMaterial = new THREE.MeshPhongMaterial({
            shininess: 0,
            specular: '#444444',
            map: new THREE.TextureLoader().load('textures/microwave.jpg')
        })

        this.MyMicrowaveMaterial = new THREE.MeshPhongMaterial({
            shininess: 0,
            specular: '#FFFFFF',
            color: '#404040'
        })
        
    }

    buildMicrowave() {
        let counterHeight = 1.5;
        this.microwaveGroup = new THREE.Group();
        const microwaveMesh = new THREE.BoxGeometry(
            this.width,
            this.height,
            this.length
        );

        const microwaveFrontMesh = new THREE.BoxGeometry(
            0.1,
            this.height,
            this.length
        );

        this.microwaveMesh = new THREE.Mesh(microwaveMesh, this.MyMicrowaveMaterial);
        this.microwaveMesh.position.set(-5 + this.width/2, this.height/2  + counterHeight * 7/6, -3);
        this.microwaveFrontMesh = new THREE.Mesh(microwaveFrontMesh, this.MyMicrowaveFrontMaterial);
        this.microwaveFrontMesh.position.set(-5 + this.width, this.height/2 + counterHeight * 7/6, -3);

        this.microwaveGroup.add(this.microwaveFrontMesh);
        this.microwaveGroup.add(this.microwaveMesh);

        return this.microwaveGroup;
    }

    
}

export { MyMicrowave };
