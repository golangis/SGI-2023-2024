import * as THREE from "three";

/**
    This class customizes the gui interface for the app
*/
class MyCake {
    constructor(
        radius,
        height,
        cakeExteriorMaterial,
        cakeInteriorMaterial
    ) {
        this.radius = radius || 0.27;
        this.height = height || 0.35;
        this.thetaStart = 0;
        this.thetaLength = Math.PI * 1.5;

        this.cakeExteriorMaterial =
            cakeExteriorMaterial ||
            new THREE.MeshPhongMaterial({
                color: "#eb8f9b",
                specular: "#000000",
                emissive: "#000000",
                shininess: 90,
            });

        this.cakeInteriorMaterial =
            cakeInteriorMaterial ||
            new THREE.MeshBasicMaterial({
                color: "#d6b383",
            });
    }

    buildCake() {
        // Create cake
        const cakeGeometry = new THREE.CylinderGeometry(
            this.radius,
            this.radius,
            this.height,
            32,
            32,
            false,
            this.thetaStart,
            this.thetaLength
        );

        const cakeInteriorGeometry = new THREE.PlaneGeometry(
            this.radius,
            this.height
        );

        let cakeMesh = new THREE.Mesh(cakeGeometry, this.cakeExteriorMaterial);

        // Create cake interior
        let cakeInteriorMesh = new THREE.Mesh(
            cakeInteriorGeometry,
            this.cakeInteriorMaterial
        );

        cakeMesh.position.set(0, this.height / 2, 0);

        const instance = cakeInteriorMesh.clone();
        
        cakeInteriorMesh.rotateY(-Math.PI / 2);
        cakeInteriorMesh.position.set(0, 0, this.radius/2);
        
        instance.rotateY(Math.PI*2);
        instance.position.set(-this.radius / 2, 0, 0);

        
        cakeMesh.add(cakeInteriorMesh);
        cakeMesh.add(instance);

        return cakeMesh;
    }
}

export { MyCake };
