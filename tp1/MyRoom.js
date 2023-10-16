import * as THREE from "three";

/**
    This class customizes the gui interface for the app
*/
class MyRoom {
    constructor(roomWidth, roomHeight, roomDepth, floorMaterial, wallMaterial) {

        this.roomWidth = roomWidth || 10;
        this.roomHeight = roomHeight || 10;
        this.roomDepth = roomDepth || 5;

        const textureFloor = new THREE.TextureLoader().load( "textures/floor.jpg" );
        textureFloor.wrapS = THREE.RepeatWrapping;
        textureFloor.wrapT = THREE.RepeatWrapping;
        textureFloor.repeat.set( 4, 4 );

        const textureCeiling = new THREE.TextureLoader().load( "textures/ceiling.jpg" );
        textureCeiling.wrapS = THREE.RepeatWrapping;
        textureCeiling.wrapT = THREE.RepeatWrapping;
        textureCeiling.repeat.set( 4, 2 );


        const textureWall = new THREE.TextureLoader().load( "textures/wall.jpg" );
        textureWall.wrapS = THREE.RepeatWrapping;
        textureWall.wrapT = THREE.RepeatWrapping;
        textureWall.repeat.set( 3, 1)
    

        this.floorMaterial =
            floorMaterial ||
            new THREE.MeshLambertMaterial({
                map: textureFloor
            });

        this.ceilingMaterial =
            new THREE.MeshLambertMaterial({
                map: textureCeiling
            });

        this.wallMaterial =
            wallMaterial ||
            new THREE.MeshLambertMaterial({
                map: textureWall
            });
    }

    
    buildRoom() {
        // Create floor Mesh with basic material

        const floor = new THREE.PlaneGeometry(this.roomWidth, this.roomHeight);
        let floorMesh = new THREE.Mesh(floor, this.floorMaterial);
        floorMesh.rotation.x = -Math.PI / 2;
        floorMesh.position.y = -0;

        const ceiling = new THREE.PlaneGeometry(this.roomWidth, this.roomHeight);
        let ceilingMesh = new THREE.Mesh(ceiling, this.ceilingMaterial);
        ceilingMesh.rotation.x = Math.PI / 2;
        ceilingMesh.position.y = 5;


        floorMesh.receiveShadow = true;
        // Create walls

        let sideWallGeom = new THREE.PlaneGeometry(this.roomWidth, this.roomDepth);
        let frontWallGeom = new THREE.PlaneGeometry(this.roomHeight, this.roomDepth);
        
        let leftWallMesh = new THREE.Mesh(sideWallGeom, this.wallMaterial);
        leftWallMesh.rotation.x = Math.PI;
        leftWallMesh.rotation.z = Math.PI;
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
            frontWallMesh,
            ceilingMesh
        );
        
        return roomGroup;
    }

}

export { MyRoom };
