import * as THREE from "three";
import { MyNurbsBuilder } from "./MyNurbsBuilder.js";

/**

 *  This class contains the contents of out application

 */

class MyNewspaper {
    constructor(scale) {
        this.samplesU = 20;
        this.samplesV = 20;
        this.scale = scale || 1;

        const map = new THREE.TextureLoader().load("textures/newspaper.jpg");

        map.wrapS = map.wrapT = THREE.RepeatWrapping;

        map.anisotropy = 16;

        map.colorSpace = THREE.SRGBColorSpace;
        this.material = new THREE.MeshLambertMaterial({
            map: map,

            side: THREE.DoubleSide,
        });
        this.builder = new MyNurbsBuilder();
    }

    generateCoverControlPoints(baseControlPoints) {
        const coverControlPoints = [];

        for (let u = 0; u < baseControlPoints.length; u++) {
            const row = baseControlPoints[u];
            const coverRow = [];

            for (let v = 0; v < row.length; v++) {
                const basePoint = row[v];
                const coverPoint = [
                    basePoint[0],
                    basePoint[1],
                    basePoint[2] + 1,
                    1,
                ]; // Adjust the z-coordinate for the cover
                coverRow.push(coverPoint);
            }

            coverControlPoints.push(coverRow);
        }

        return coverControlPoints;
    }

    buildNewspaper() {
        let controlPoints;

        let surfaceData;

        let mesh;

        let orderU = 1;

        let orderV = 1;

        // build nurb #1

        controlPoints = [
            // U = 0

            [
                // V = ​​0..1

                [0.2, -1.5, 0.2, 1],
                [0.16, -0.5, 0.2, 1],
                [0.16, 0.5,  0.2, 1],
                [0.2, 1.5,  0.2, 1],
            ],

            [
                // V = ​​0..1;

                [-1.5, -1.5, 0.0, 1],
                [-1.5, -0.5, 0, 1],
                [-1.5, 0.5, 0, 1],
                [-1.5, 1.5, 0.0, 1],
            ],

            // U = 1

            [
                // V = ​​0..1

                [0, -1.5, 3.0, 1],

                [0, -0.5, 2.4, 1],

                [0, 0.5, 2.4, 1],

                [0, 1.5, 3.0, 1],
            ],

            // U = 2

            [
                // V = ​​0..1

                [1.5, -1.5, 0.0, 1],

                [0.9, -0.5, 0, 1],

                [0.9, 0.5, 0, 1],

                [1.5, 1.5, 0.0, 1],
            ],

            [
                // V = ​​0..1

                [-0.28, -1.5, 0.32, 1],
                [-0.28, -0.5, 0.32, 1],
                [-0.28, 0.5 , 0.32, 1],
                [-0.28, 1.5 , 0.32, 1],
            ],
            
        ];

        surfaceData = this.builder.build(
            controlPoints,
            orderU+3,
            orderV+2,
            this.samplesU,
            this.samplesV,
            this.material
        );

        mesh = new THREE.Mesh(surfaceData, this.material);
        mesh.rotateZ(Math.PI/2)
        console.log(mesh)
        mesh.scale.setScalar(this.scale);


        return mesh;
    }
}

export { MyNewspaper };
