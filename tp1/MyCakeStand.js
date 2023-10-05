import * as THREE from "three";

/**
    This class customizes the gui interface for the app
*/
class MyCakeStand {
    constructor(
        app,
        plateTopRadius,
        plateBottomRadius,
        standTopRadius,
        standBottomRadius,
        standHeight,
        material
    ) {
        this.app = app;
        this.plateTopRadius = plateTopRadius || 0.35;
        this.plateBottomRadius = plateBottomRadius || 0.32;
        this.standTopRadius = standTopRadius || 0.1;
        this.standBottomRadius = standBottomRadius || 0.22;
        this.standHeight = standHeight || 0.2;
        this.material =
            material ||
            new THREE.MeshPhongMaterial({
                color: "#e8faf2",
                specular: "#000000",
                emissive: "#000000",
                shininess: 90,
            });
    }

    buildCakeStand() {
        // Create cake stand base
        const cakeStandGeometry = new THREE.CylinderGeometry(
            this.standTopRadius,
            this.standBottomRadius,
            this.standHeight
        );

        // Create cake stand plate
        const plateGeometry = new THREE.CylinderGeometry(
            this.plateTopRadius,
            this.plateBottomRadius,
            0.02
        );

        let cakeStandMesh = new THREE.Mesh(cakeStandGeometry, this.material);
        let cakeStandPlateMesh = new THREE.Mesh(plateGeometry, this.material);

        cakeStandMesh.position.set(0, -this.standHeight / 2, 0);

        cakeStandPlateMesh.rotateX(Math.PI / 2);

        cakeStandPlateMesh.add(cakeStandMesh);

        cakeStandPlateMesh.position.set(0, 0, this.standHeight + 0.1);

        return cakeStandPlateMesh;
    }
}

export { MyCakeStand };
