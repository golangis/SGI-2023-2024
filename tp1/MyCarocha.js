import * as THREE from "three";
import { MyQuarterCurve } from "./MyQuarterCurve.js";

class MyCarocha {
    constructor(lineMaterial) {
        this.lineMaterial = lineMaterial;
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

        return carochaGroup;
    }
}

export { MyCarocha };
