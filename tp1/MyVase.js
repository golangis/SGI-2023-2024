import * as THREE from "three";

import { MyNurbsBuilder } from "./MyNurbsBuilder.js";

class MyVase {
    constructor() {
        this.samplesU = 50;
        this.samplesV = 50;

        const map = new THREE.TextureLoader().load("textures/vase.jpg");

        map.wrapS = map.wrapT = THREE.RepeatWrapping;

        map.anisotropy = 16;

        map.colorSpace = THREE.SRGBColorSpace;

        this.material = new THREE.MeshLambertMaterial({
            map: map,

            side: THREE.DoubleSide,
        });

        this.builder = new MyNurbsBuilder();
    }

    createTube() {
        // declare local variables

        let controlPoints = [];

        let surfaceData;

        let mesh;

        let orderU = 7;

        let orderV = 2;

        // build nurb #1

        for (let j = 0; j < Math.PI * 2; j += (Math.PI * 2) / (orderU + 1)) {
            let column = [];
            let radius = 0.8;
            for (let i = 0; i < orderV + 1; i += 1) {
                if (j == 0) {
                    const x = (radius - 0.19) * Math.cos(j);
                    const z = (radius - 0.19) * Math.sin(j);
                    const y = i / 2 - 0.3;
                    column.push([x, y, z, 1]);
                    continue;
                }

                const x = radius * Math.cos(j);
                const z = radius * Math.sin(j);
                const y = i / 2 - 0.3;

                column.push([x, y, z, 1]);
            }

            controlPoints.push(column);
        }
        let point = controlPoints[0];
        controlPoints.push(point);
        orderU++;

        surfaceData = this.builder.build(
            controlPoints,
            orderU,
            orderV,
            this.samplesU,
            this.samplesV,
            this.material
        );

        mesh = new THREE.Mesh(surfaceData, this.material);
        mesh.position.set(0, 1.5, 0);

        return mesh;
    }

    createBottom() {
        // declare local variables

        let controlPoints = [];

        let surfaceData;

        let mesh;

        let orderU = 7;

        let orderV = 3;

        // build nurb #1

        for (let j = 0; j < Math.PI * 2; j += (Math.PI * 2) / (orderU + 1)) {
            let column = [];
            let radius = 0.8;
            for (let i = 0; i < orderV + 1; i += 1) {
                // tube vs sphere critical code
                if (i != 0 && i != 3) {
                    radius = 1.8;
                } else {
                    radius = 0.8;
                }

                if (j == 0) {
                    if (i != 0 && i != 3) {
                        radius = 1.45;
                    } else {
                        radius = 0.8;
                    }

                    const x = (radius - 0.19) * Math.cos(j);
                    const z = (radius - 0.19) * Math.sin(j);
                    const y = i / 2;
                    column.push([x, y, z, 1]);
                    continue;
                }

                const x = radius * Math.cos(j);
                const z = radius * Math.sin(j);
                const y = i / 2;

                column.push([x, y, z, 1]);
            }

            controlPoints.push(column);
        }
        let point = controlPoints[0];
        controlPoints.push(point);
        orderU++;

        surfaceData = this.builder.build(
            controlPoints,
            orderU,
            orderV,
            this.samplesU,
            this.samplesV,
            this.material
        );

        mesh = new THREE.Mesh(surfaceData, this.material);

        return mesh;
    }

    createBase() {
        const geometry = new THREE.CircleGeometry(0.52);
        const circle = new THREE.Mesh(geometry, this.material);
        return circle;
    }

    buildVase() {
        const tube = this.createTube();
        const bottom = this.createBottom();

        const base = this.createBase();
        base.rotateX(Math.PI / 2)
        base.position.set(0.09, 0, 0)
        
        const vase = new THREE.Group();
        vase.add(tube);
        vase.add(bottom);
        vase.add(base);

        vase.scale.setScalar(0.25);
        vase.rotateX(-Math.PI / 2);
        vase.position.set(0, 0.8, 0)
        vase.rotateZ(Math.PI)
        vase.castShadow = true;
        return vase;
    }
}

export { MyVase };
