import * as THREE from "three";

/**
    This class customizes the gui interface for the app
*/
class MyFridge {
    constructor() {

        this.width =  1;
        this.height = 4;
        this.length =  1.4;

        this.MyFridgeFrontMaterial = new THREE.MeshPhongMaterial({
            shininess: 0,
            map: new THREE.TextureLoader().load('textures/fridge.jpg')
        })

        this.MyFridgeMaterial = new THREE.MeshPhongMaterial({
            shininess: 0,
            color: '#606060'
        })
        
    }

    buildFridge() {
        this.fridgeGroup = new THREE.Group();
        
        const fridgeMesh = new THREE.BoxGeometry(
            this.width,
            this.height,
            this.length
        );

        const fridgeFrontMesh = new THREE.BoxGeometry(
            0.1,
            this.height,
            this.length
        );

        this.fridgeMesh = new THREE.Mesh(fridgeMesh, this.MyFridgeMaterial);
        this.fridgeMesh.position.set(5 - this.width/2, this.height/2 , 4.5 - this.length/2);
        this.fridgeFrontMesh = new THREE.Mesh(fridgeFrontMesh, this.MyFridgeFrontMaterial);
        this.fridgeFrontMesh.position.set(5 - this.width, this.height/2 , 4.5 - this.length/2);

        this.fridgeGroup.add(this.fridgeFrontMesh);
        this.fridgeGroup.add(this.fridgeMesh);

        return this.fridgeGroup;
    }

    
}

export { MyFridge };
