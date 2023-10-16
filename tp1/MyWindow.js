import * as THREE from "three";

/**
    This class customizes the gui interface for the app
*/
class MyWindow {
    constructor() {}

    buildWindow() {
        //initialization
        const loader = new THREE.TextureLoader();
        const texture = loader.load("textures/wood.jpg");
        texture.wrapS = THREE.RepeatWrapping;
        texture.wrapT = THREE.RepeatWrapping;
        texture.repeat.set(1, 0.2);

        const material = new THREE.MeshStandardMaterial({ map: texture });

        this.windowTexture = new THREE.TextureLoader().load(
            "./textures/landi.jpg"
        );

        this.windowTexture.wrapS = THREE.MirroredRepeatWrapping;
        this.windowTexture.wrapT = THREE.MirroredRepeatWrapping;
        this.windowTexture.repeat.set(1, 1);

        const windowMaterial = new THREE.MeshBasicMaterial({
            map: this.windowTexture,
            transparent: true,
        });

        const planeGeomtry = new THREE.PlaneGeometry(2, 1.2);

        let background = new THREE.Mesh(
            planeGeomtry,
            windowMaterial
        );

        const geometry1 = new THREE.BoxGeometry(1.2, 0.05, 0.05),
            geometry2 = new THREE.BoxGeometry(2, 0.05, 0.05);
            
        
        const frame1 = new THREE.Mesh(geometry1, material),
            frame2 = new THREE.Mesh(geometry1, material),
            frame3 = new THREE.Mesh(geometry2, material),
            frame4 = new THREE.Mesh(geometry2, material),
            frame5 = new THREE.Mesh(geometry2, material),
            frame6 = new THREE.Mesh(geometry1, material);

        frame1.rotateZ(Math.PI / 2);
        frame2.rotateZ(Math.PI / 2);

        background.add(frame1, frame2, frame3, frame4, frame5, frame6);
        frame1.position.set(-1, 0, 0);
        frame2.position.set(1, 0, 0);
        frame3.position.set(0, 0.575, 0);
        frame4.position.set(0, -0.575, 0);
        frame5.position.set(0, 0, 0)
        frame6.position.set(0, 0, 0)
        
        frame6.rotateZ(Math.PI / 2)

        background.scale.setScalar(2);

        return background;
    }

    updateTexturePosition(camera) {
        const maxXOffset = 5;
        const maxYOffset = -0.1;

        this.windowTexture.offset.x = Math.max(
            -camera.position.x / 1.2,
            -maxXOffset
        );
        this.windowTexture.offset.y = Math.max(
            -camera.position.y / 20,
            -maxYOffset
        );
    }
}

export { MyWindow };
