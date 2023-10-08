import * as THREE from "three";

/**
    This class customizes the gui interface for the app
*/
class MyRoom {
    constructor(roomWidth, roomHeight, roomDepth, floorMaterial, wallMaterial) {

        this.roomWidth = roomWidth || 10;
        this.roomHeight = roomHeight || 10;
        this.roomDepth = roomDepth || 5;

        this.floorMaterial =
            floorMaterial ||
            new THREE.MeshPhongMaterial({
                color: "#d6a267",
                specular: "#000000",
                emissive: "#000000",
                shininess: 90,
            });

        this.wallMaterial =
            wallMaterial ||
            new THREE.MeshPhongMaterial({
                color: "#fcbd74",
                specular: "#000000",
                emissive: "#000000",
                shininess: 90,
            });
    }

    
    buildRoom() {
        // Create floor Mesh with basic material

        const floor = new THREE.PlaneGeometry(this.roomWidth, this.roomHeight);
        let floorMesh = new THREE.Mesh(floor, this.floorMaterial);
        floorMesh.rotation.x = -Math.PI / 2;
        floorMesh.position.y = -0;

        // Create walls

        let sideWallGeom = new THREE.PlaneGeometry(this.roomWidth, this.roomDepth);
        let frontWallGeom = new THREE.PlaneGeometry(this.roomHeight, this.roomDepth);
        
        let leftWallMesh = new THREE.Mesh(sideWallGeom, this.wallMaterial);
        leftWallMesh.rotation.x = Math.PI;
        leftWallMesh.position.set(0, this.roomDepth/2, this.roomHeight/2);

        let rightWallMesh = new THREE.Mesh(sideWallGeom, this.wallMaterial);
        rightWallMesh.rotation.x = 2 * Math.PI;
        rightWallMesh.position.set(0, this.roomDepth/2, -this.roomHeight/2);

        let backWallMesh = new THREE.Mesh(frontWallGeom, this.wallMaterial);
        backWallMesh.rotation.y = Math.PI / 2;
        backWallMesh.position.set(-this.roomWidth/2, this.roomDepth/2, 0);

        let frontWallMesh = new THREE.Mesh(frontWallGeom, this.wallMaterial);
        frontWallMesh.rotation.y = -Math.PI / 2;
        frontWallMesh.position.set(this.roomWidth/2, this.roomDepth/2, 0);

        const roomGroup = new THREE.Group();

        roomGroup.add(
            floorMesh,
            leftWallMesh,
            rightWallMesh,
            backWallMesh,
            frontWallMesh
        );

        return roomGroup;
    }

}

export { MyRoom };
