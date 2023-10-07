import * as THREE from "three";

class MyMola {
    constructor(
        radius,
        height,
        numberOfStacks,
        position,
        lineMaterial,
        numberOfSamples
    ) {
        this.radius = radius || 0.25;
        this.height = height || 0.5;
        this.numberOfStacks = numberOfStacks || 5;
        this.numberOfSamples = numberOfSamples || 100;
        this.position = position || new THREE.Vector3(0, 0, 0);
        this.lineMaterial =
            lineMaterial || new THREE.LineBasicMaterial({ color: 0x808080});
    }

    /**
     *   x(t) = r * cos(t)
     *   z(t) = r * sin(t)
     *   y(t) = h * t
     *
     *   r = radius of the spring
     *   h = height between each layer
     *   t = [0, n]
     *   n = number of stacks
     */
    buildMola() {
        // Create an array to hold the points of the spring
        const points = [];

        for (let i = 0; i <= this.numberOfSamples; i++) {
            const theta =
                (i / this.numberOfSamples) * this.numberOfStacks * Math.PI * 2;
            const y = i * (this.height / this.numberOfSamples);
            const x = this.radius * Math.cos(theta);
            const z = this.radius * Math.sin(theta);
            points.push(new THREE.Vector3(x, y, z));
        }

        return this.initCatmullRomCurve(points);
    }

    initCatmullRomCurve(points) {
        let curve = new THREE.CatmullRomCurve3(points);

        // sample a number of points on the curve

        let sampledPoints = curve.getPoints(this.numberOfSamples);

        const curveGeometry = new THREE.BufferGeometry().setFromPoints(
            sampledPoints
        );

        const lineObj = new THREE.Line(curveGeometry, this.lineMaterial);

        lineObj.position.set(this.position.x, this.position.y, this.position.z);

        return lineObj;
    }
}

export { MyMola };
