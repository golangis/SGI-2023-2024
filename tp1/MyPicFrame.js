import * as THREE from "three";

/**
    This class customizes the gui interface for the app
*/
class MyPicFrame {
    constructor(frameHeight, frameWidth, frameTickness, frameMaterial) {

        this.frameHeight = frameHeight || 2;
        this.frameWidth = frameWidth || 1.5;
        this.frameTickness = frameTickness || 0.04;

        this.frameMaterial = frameMaterial || new THREE.MeshBasicMaterial({ color: "#ff00ff" });
        
    }

    buildPicFrame() {
        let frame = new THREE.BoxGeometry(this.frameWidth, this.frameHeight, this.frameTickness);
        let frameMesh = new THREE.Mesh(frame, this.frameMaterial);
        frameMesh.position.set(0, 3, -5 + this.frameThickness);

        return frameMesh;
    }

    
}

export { MyPicFrame };
