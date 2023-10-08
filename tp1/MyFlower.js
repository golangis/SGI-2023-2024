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
        // Assuming you have a scene, camera, and renderer set up

        // Define parameters
        const stalkRadiusTop = 0.01; // Radius of the stalk at the top
        const stalkHeight = 0.5; // Height of the stalk
        const curvePoints = [
            new THREE.Vector3(0, 0, 0), // Start point
            new THREE.Vector3(0, 0.1, 0.3), // Control point 1
            new THREE.Vector3(0, 0.3, -0.1), // Control point 2
            new THREE.Vector3(0, stalkHeight, 0), // End point
        ];

        // Create Bezier curve geometry
        const curve = new THREE.CubicBezierCurve3(...curvePoints);
        const curveGeometry = new THREE.BufferGeometry();
        curveGeometry.vertices = curve.getPoints(50); // Adjust the number of points for smoothness

        // Create the material for the stalk
        const stalkMaterial = new THREE.MeshBasicMaterial({ color: 0x228b22 }); // Green color

        // Create a tube geometry for the stalk
        const stalkTubeGeometry = new THREE.TubeGeometry(
            curve,
            50,
            stalkRadiusTop,
            10,
            false
        );
        const stalkMesh = new THREE.Mesh(stalkTubeGeometry, stalkMaterial);

        return stalkMesh;
    }

    buildFlower() {
        const flowerGroup = new THREE.Group(), flowerHead = new THREE.Group();
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
        flowerHead.rotateX(Math.PI/3)

        flowerGroup.add(flowerHead)
        flowerGroup.add(stalk);


        flowerGroup.rotateX(Math.PI)
        flowerGroup.position.y = 0.5;
        return flowerGroup;
    }
}

export { MyFlower };
