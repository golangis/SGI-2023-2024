import * as THREE from "three";
import { MyQuarterCurve } from "./MyQuarterCurve.js";

class MyCarocha {
    constructor(lineMaterial) {
        this.lineMaterial = lineMaterial || new THREE.LineBasicMaterial({color: 0xFF0000});
    }

    buildCarocha() {
        const carochaGroup = new THREE.Group();

        const curve1 = new MyQuarterCurve(
                4,
                new THREE.Vector3(0, -2, 0),
                2,
                this.lineMaterial
            ),
            curve2 = new MyQuarterCurve(
                2,
                new THREE.Vector3(0, 0, 0),
                1,
                this.lineMaterial
            ),
            curve3 = new MyQuarterCurve(
                2,
                new THREE.Vector3(2, -2, 0),
                1,
                this.lineMaterial
            );

        const curve4 = new MyQuarterCurve(
                1.5,
                new THREE.Vector3(-2.5, -2, 0),
                2,
                this.lineMaterial
            ),
            curve5 = new MyQuarterCurve(
                1.5,
                new THREE.Vector3(-2.5, -2, 0),
                1,
                this.lineMaterial
            ),
            curve6 = new MyQuarterCurve(
                1.5,
                new THREE.Vector3(2.5, -2, 0),
                2,
                this.lineMaterial
            ),
            curve7 = new MyQuarterCurve(
                1.5,
                new THREE.Vector3(2.5, -2, 0),
                1,
                this.lineMaterial
            );

        carochaGroup.add(
            curve1,
            curve2,
            curve3,
            curve4,
            curve5,
            curve6,
            curve7
        );

        
        const frame = this.buildFrame();
        carochaGroup.add(frame)
        carochaGroup.scale.setScalar(0.25);
        return carochaGroup;
    }

    buildFrame() {
        //initialization
        const loader = new THREE.TextureLoader();
        const texture = loader.load("textures/frame.jpg");
        texture.wrapS = THREE.RepeatWrapping;
        texture.wrapT = THREE.RepeatWrapping;
        texture.repeat.set(1, 0.2);
        
        const material = new THREE.MeshStandardMaterial({map: texture});
        
        let background = new THREE.Mesh(new THREE.PlaneGeometry(2.2, 1.3), new THREE.MeshBasicMaterial({color: 0xe3d3e0}));
        

        const geometry1 = new THREE.BoxGeometry(1.5, 0.2, 0.05), geometry2 = new THREE.BoxGeometry(2, 0.2, 0.05);
        const frame1 = new THREE.Mesh(geometry1, material),
            frame2 = new THREE.Mesh(geometry1, material),
            frame3 = new THREE.Mesh(geometry2, material),
            frame4 = new THREE.Mesh(geometry2, material);

        frame1.rotateZ(Math.PI / 2)
        frame2.rotateZ(Math.PI/2)
        
        background.add(frame1, frame2, frame3, frame4);
        frame1.position.set(-1.1, 0, 0)
        frame2.position.set(1.1, 0, 0)
        frame3.position.set(0, 0.65, 0)
        frame4.position.set(0, -0.65, 0)

        background.scale.setScalar(5)
        return background;
        
    }
}

export { MyCarocha };
