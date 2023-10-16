import * as THREE from "three";

class MyQuarterCurve {
    constructor(
        curveRadius,
        curveCenterPosition,
        quadrant,
        lineMaterial,
        numberOfSamples
    ) {
        this.curveRadius = curveRadius || 1;
        this.numberOfSamples = numberOfSamples || 16;
        this.lineMaterial =
            lineMaterial || new THREE.LineBasicMaterial({ color: 0xffff00 });
        this.curvePosition = curveCenterPosition || new THREE.Vector3(0, 0, 0);
        this.hullMaterial = new THREE.MeshBasicMaterial({
            color: 0xffffff,
            opacity: 1.5,
            transparent: true,
        });
        this.quadrant = quadrant || 3;

        return this.initCubicBezierCurve();
    }

    initCubicBezierCurve() {
        let x_sign = 1,
            y_sign = 1;

        switch (this.quadrant) {
            case 2:
                x_sign = -1;
                break;
            case 3:
                x_sign = -1;
                y_sign = -1;
                break;
            case 4:
                y_sign = -1;
                break;
            default:
                break;
        }

        let points = [
            new THREE.Vector3(x_sign * this.curveRadius, 0, 0.0),

            new THREE.Vector3(
                x_sign * this.curveRadius,
                4/3 * y_sign * this.curveRadius * (Math.sqrt(2) - 1),
                0.0
            ),
            new THREE.Vector3(
                4/3 * x_sign * this.curveRadius * (Math.sqrt(2) - 1),
                y_sign * this.curveRadius,
                0.0
            ),

            new THREE.Vector3(0, y_sign * this.curveRadius, 0.0),
        ];

        let curve = new THREE.CubicBezierCurve3(
            points[0],
            points[1],
            points[2],
            points[3]
        );

        // sample a number of points on the curve

        let sampledPoints = curve.getPoints(this.numberOfSamples);

        let curveGeometry = new THREE.BufferGeometry().setFromPoints(
            sampledPoints
        );

        let lineObj = new THREE.Line(curveGeometry, this.lineMaterial);

        lineObj.position.set(
            this.curvePosition.x,
            this.curvePosition.y,
            this.curvePosition.z
        );

        return lineObj;
    }

    drawHull(position, points) {
        const geometry = new THREE.BufferGeometry().setFromPoints(points);

        let line = new THREE.Line(geometry, this.hullMaterial);

        // set initial position

        line.position.set(position.x, position.y, position.z);

        return line;
    }
}

export { MyQuarterCurve };
