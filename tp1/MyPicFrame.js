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

        const woodFrame = this.buildFrame();
        frameMesh.add(woodFrame);

        return frameMesh;
    }

    buildFrame() {
        //initialization
        const loader = new THREE.TextureLoader();
        const texture = loader.load("textures/wood.jpg");
        texture.wrapS = THREE.RepeatWrapping;
        texture.wrapT = THREE.RepeatWrapping;
        
        const material = new THREE.MeshStandardMaterial({map: texture});
        
        

        const geometry1 = new THREE.BoxGeometry(this.frameHeight, 0.1, 0.05), geometry2 = new THREE.BoxGeometry(this.frameWidth, 0.1, 0.05);
        const frame1 = new THREE.Mesh(geometry1, material),
            frame2 = new THREE.Mesh(geometry1, material),
            frame3 = new THREE.Mesh(geometry2, material),
            frame4 = new THREE.Mesh(geometry2, material);

        frame1.rotateZ(Math.PI / 2)
        frame2.rotateZ(Math.PI/2)
        
        frame1.position.set(-(this.frameWidth/2-0.05), 0, 0)
        frame2.position.set((this.frameWidth/2-0.05), 0, 0)
        frame3.position.set(0, (this.frameHeight/2), 0)
        frame4.position.set(0, -(this.frameHeight / 2), 0)
        
        const frameGroup = new THREE.Group();

        frameGroup.add(frame1, frame2, frame3, frame4);

        return frameGroup;
        
    }

    
}

export { MyPicFrame };
