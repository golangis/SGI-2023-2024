import * as THREE from "three";

import { MyNurbsBuilder } from "./MyNurbsBuilder.js";

class MyFlower {
    constructor() {
        // Define parameters
        this.petalRadius = 0.08; // Radius of the hexagonal petals
        this.petalHeight = 0.02; // Height of the hexagonal petals
        this.numPetals = 6; // Number of petals
        this.centerRadius = 0.055; // Radius of the circular center
        this.centerHeight = 0.021; // Height of the circular center

        this.petalMaterial = new THREE.MeshPhongMaterial({
            color: "#ed81f7",
            specular: "#000000",
            emissive: "#000000",
            shininess: 90,
        });

        this.centerMaterial = new THREE.MeshBasicMaterial({
            color: "#ffd445",
        });
    }

    // Assuming you have a scene, camera, and renderer set up

    createPetal() {
        const petalGeometry = new THREE.CylinderGeometry(
            this.petalRadius,
            this.petalRadius,
            this.petalHeight,
            6
        );
        const petalMesh = new THREE.Mesh(petalGeometry, this.petalMaterial);
        return petalMesh;
    }

    createCenter() {
        const centerGeometry = new THREE.CylinderGeometry(
            this.centerRadius,
            this.centerRadius,
            this.centerHeight,
            32
        );
        const centerMesh = new THREE.Mesh(centerGeometry, this.centerMaterial);
        return centerMesh;
    }

    createStalk() {
        const stalkRadiusTop = 0.01; // Radius of the stalk at the top
        const stalkHeight = 0.7; // Height of the stalk
        const curvePoints = [
            new THREE.Vector3(0, 0, 0),
            new THREE.Vector3(0, 0.1, 0.3),
            new THREE.Vector3(0, 0.3, -0.1),
            new THREE.Vector3(0, stalkHeight, 0),
        ];

        const curve = new THREE.CubicBezierCurve3(...curvePoints);

        const stalkMaterial = new THREE.MeshBasicMaterial({ color: 0x228b22 });

        const stalkTubeGeometry = new THREE.TubeGeometry(
            curve,
            20,
            stalkRadiusTop,
            10,
            false
        );
        const stalkMesh = new THREE.Mesh(stalkTubeGeometry, stalkMaterial);

        return stalkMesh;
    }

    buildFlower() {
        const flowerGroup = new THREE.Group(),
            flowerHead = new THREE.Group();
        for (let i = 0; i < this.numPetals; i++) {
            const angle = (i / this.numPetals) * Math.PI * 2;
            const petal = this.createPetal();
            petal.position.set(
                Math.cos(angle) * this.petalRadius,
                0,
                Math.sin(angle) * this.petalRadius
            );
            petal.rotation.y = angle;
            flowerHead.add(petal);
        }

        // Add the center
        const center = this.createCenter();
        const stalk = this.createStalk();
        flowerHead.add(center);
        flowerHead.rotateX(Math.PI / 3);

        flowerGroup.add(flowerHead);
        flowerGroup.add(stalk);

        flowerGroup.rotateX(Math.PI);
        flowerGroup.position.y = 0.5;

        flowerGroup.scale.setScalar(4);

        let children = flowerGroup.children;
        let i = 0;

        while (i < children.length) {
            children[i].castShadow = true;
            children[i].receiveShadow = true;
            i++;
        }

        
        return flowerGroup;
    }
}

export { MyFlower };
