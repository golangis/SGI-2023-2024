import * as THREE from 'three';
import { MyAxis } from './MyAxis.js';

/**
 *  This class contains the contents of out application
 */
class MyContents  {

    /**
       constructs the object
       @param {MyApp} app The application object
    */ 
    constructor(app) {
        this.app = app
        this.axis = null

        // box related attributes
        this.boxMesh = null
        this.boxMeshSize = 1.0
        this.boxEnabled = true
        this.lastBoxEnabled = null
        this.boxDisplacement = new THREE.Vector3(0,2,0)

        // plane related attributes
        this.diffusePlaneColor = "#00ffff"
        this.specularPlaneColor = "#777777"
        this.planeShininess = 30
        this.planeMaterial = new THREE.MeshPhongMaterial({ color: this.diffusePlaneColor, 
            specular: this.diffusePlaneColor, emissive: "#000000", shininess: this.planeShininess })
    }

    /**
     * builds the box mesh with material assigned
     */
    buildBox() {    
        let boxMaterial = new THREE.MeshPhongMaterial({ color: "#ffff77", 
        specular: "#000000", emissive: "#000000", shininess: 90 })

        // Create a Cube Mesh with basic material
        let box = new THREE.BoxGeometry(  this.boxMeshSize,  this.boxMeshSize,  this.boxMeshSize );
        this.boxMesh = new THREE.Mesh( box, boxMaterial );
        this.boxMesh.rotation.x = -Math.PI / 2;
        this.boxMesh.position.y = this.boxDisplacement.y;

        
        // Geometric transformations
        
        // Rotate in X axis + Translate in Z axis
        // this.boxMesh.rotation.x = Math.PI / 9;
        // this.boxDisplacement.z = 3;

        // Scaling then Translate
        // this.boxMesh.scale.set(1,1,2);
        // this.boxDisplacement.x = 3;
        
    }

    /**
     * initializes the contents
     */
    init() {
       
        // create once 
        if (this.axis === null) {
            // create and attach the axis to the scene
            this.axis = new MyAxis(this)
            this.app.scene.add(this.axis)
        }

        // add a point light on top of the model
        const pointLight = new THREE.PointLight( 0xffffff, 500, 0 );
        pointLight.position.set( 0, 20, 0 );
        this.app.scene.add( pointLight );

        // add a point light helper for the previous point light
        const sphereSize = 0.5;
        const pointLightHelper = new THREE.PointLightHelper( pointLight, sphereSize );
        this.app.scene.add( pointLightHelper );

        // add an ambient light
        const ambientLight = new THREE.AmbientLight( 0x555555 );
        this.app.scene.add( ambientLight );
        
        this.buildRoom();

        this.buildTable();

        this.buildCakeStand();
        
        /*
        this.buildBox()
        
        // Create Circle
        let circle = new THREE.CircleGeometry(0.5);
        let circleMaterial = new THREE.MeshPhongMaterial({ color: "#ffff77", specular: "#000000", emissive: "#000000", shininess: 90 })
        this.circleMesh = new THREE.Mesh(circle, circleMaterial);
        this.circleMesh.position.set(0, 0.5, 2);
        this.app.scene.add(this.circleMesh);


        // Create sphere
        let sphere = new THREE.SphereGeometry(0.5);
        this.sphereMesh = new THREE.Mesh(sphere, circleMaterial);
        this.sphereMesh.position.set(3, 0.5, 0);
        this.app.scene.add(this.sphereMesh);

        // Create half sphere
        let halfSphere = new THREE.SphereGeometry(0.5, 32, 32, -Math.PI/2, Math.PI);
        this.halfSphereMesh = new THREE.Mesh(halfSphere, circleMaterial);
        this.halfSphereMesh.position.set(3, 0.5, 3);
        this.app.scene.add(this.halfSphereMesh);

        // Create cylinder
        let cylinder = new THREE.CylinderGeometry(0.5, 0.5, 1)
        this.cylinderMesh = new THREE.Mesh(cylinder, circleMaterial)
        this.cylinderMesh.position.set(-4, 0.5, 3);
        this.app.scene.add(this.cylinderMesh);

        // Create halfCylinder
        let halfCylinder = new THREE.CylinderGeometry(0.5, 0.5, 1, 32, 32, false, -Math.PI, Math.PI);
        this.halfCylinderMesh = new THREE.Mesh(halfCylinder, circleMaterial)
        this.halfCylinderMesh.position.set(-2, 0.5, 3);
        this.app.scene.add(this.halfCylinderMesh);


         // Create cone
        let cone = new THREE.ConeGeometry(0.5, 1)
        this.coneMesh = new THREE.Mesh(cone, circleMaterial)
        this.coneMesh.position.set(-4, 0.5, -3);
        this.app.scene.add(this.coneMesh);

        // Create halfcone
        let halfcone = new THREE.ConeGeometry(0.5, 1, 32, 32, false, -Math.PI, Math.PI);
        this.halfconeMesh = new THREE.Mesh(halfcone, circleMaterial)
        this.halfconeMesh.position.set(-2, 0.5,-3);
        this.app.scene.add(this.halfconeMesh);

        
        
        // Create Polyhedron

        const verticesOfCube = [
            -1,-1,-1,    1,-1,-1,    1, 1,-1,    -1, 1,-1,
            -1,-1, 1,    1,-1, 1,    1, 1, 1,    -1, 1, 1,
        ];
        const indicesOfFaces = [
            2,1,0,    0,3,2,
            0,4,7,    7,3,0,
            0,1,5,    5,4,0,
            1,2,6,    6,5,1,
            2,3,7,    7,6,2,
            4,5,6,    6,7,4
        ];

        // create a material, color or image texture
        const polyhedronMaterial = new THREE.MeshBasicMaterial({
            color: 0xffffff,
            wireframe: true
        });

        let polyhedron = new THREE.PolyhedronGeometry(verticesOfCube, indicesOfFaces, 0.5, 1)
        this.polyhedronMesh = new THREE.Mesh(polyhedron, polyhedronMaterial)
        this.polyhedronMesh.position.set(2, 0.5,-3)
        this.app.scene.add(this.polyhedronMesh);

        */
    }


    /**
     * Creates the walls and floor of the room
     */

    buildRoom(){
                
        // Create floor Mesh with basic material
        
        let floor = new THREE.PlaneGeometry( 10, 10 );
        this.floorMesh = new THREE.Mesh( floor, this.planeMaterial );
        this.floorMesh.rotation.x = -Math.PI / 2;
        this.floorMesh.position.y = -0;

        
        // Create walls
        
        let leftWall = new THREE.PlaneGeometry( 10, 5 );
        this.leftWallMesh = new THREE.Mesh( leftWall, this.planeMaterial );
        this.leftWallMesh.rotation.x = Math.PI;
        this.leftWallMesh.position.set(0, 2.5, 5);
        
        let rightWall = new THREE.PlaneGeometry( 10, 5 );
        this.rightWallMesh = new THREE.Mesh( rightWall, this.planeMaterial );
        this.rightWallMesh.rotation.x = 2*Math.PI;
        this.rightWallMesh.position.set(0, 2.5, -5);
        
        let backWall = new THREE.PlaneGeometry( 10,5 );
        this.backWallMesh = new THREE.Mesh( backWall, this.planeMaterial );
        this.backWallMesh.rotation.y = Math.PI/2;
        this.backWallMesh.position.set(-5, 2.5, 0);

        this.roomGroup = new THREE.Group();

        this.roomGroup.add(this.floorMesh, this.leftWallMesh, this.rightWallMesh, this.backWallMesh)

        this.app.scene.add(this.roomGroup)
        
    }
    

    /**
     * Create table
     */
    buildTable(){
        
        // Create table top
        
        this.tableGroup = new THREE.Group();

        let tableMaterial = new THREE.MeshPhongMaterial({ color: "#995e17", 
        specular: "#000000", emissive: "#000000", shininess: 90 })
        let tableTop = new THREE.BoxGeometry(3,2,0.2);
        this.tableMesh = new THREE.Mesh( tableTop, tableMaterial );
        
        this.tableGroup.position.y = 2

        
        // Create table legs
        
        let tableLeg = new THREE.CylinderGeometry(0.1, 0.1, 2)
        this.tableLegMesh = new THREE.Mesh(tableLeg, tableMaterial)
        
        for (let j = -1; j < 2; j+=2) {
            for(let i = -1; i < 2; i+=2){
                let instance = this.tableLegMesh.clone();
                instance.position.set((i)*1.3, (j)*0.8, -1);
                instance.rotateX(-Math.PI/2)
                this.tableMesh.add(instance);
            }
        }
        
        this.tableGroup.rotateX(-Math.PI/2)
        
        this.tableGroup.add(this.tableMesh)
        this.app.scene.add(this.tableGroup)

    }
    

    buildCakeStand() {
        
        let plateMaterial = new THREE.MeshPhongMaterial({ color: "#e8faf2", 
            specular: "#000000", emissive: "#000000", shininess: 90
        })
        
		// Create cake stand base
		let cakeStand = new THREE.CylinderGeometry(0.1, 0.22, 0.2);
		this.cakeStandMesh = new THREE.Mesh(cakeStand, plateMaterial);
        this.cakeStandMesh.position.set(0, 0, 0.2);
        
        // Create cake stand plate
		let cakeStandPlate = new THREE.CylinderGeometry(0.35, 0.32, 0.02);
		this.cakeStandPlateMesh = new THREE.Mesh(cakeStandPlate, plateMaterial);
		this.cakeStandPlateMesh.position.set(0, 0.1, 0);
        

        this.cakeStandMesh.rotateX(Math.PI/2)
        this.tableMesh.add(this.cakeStandMesh)
        this.cakeStandMesh.add(this.cakeStandPlateMesh);
	}
    
    /**
     * updates the diffuse plane color and the material
     * @param {THREE.Color} value 
     */
    updateDiffusePlaneColor(value) {
        this.diffusePlaneColor = value
        this.planeMaterial.color.set(this.diffusePlaneColor)
    }
    /**
     * updates the specular plane color and the material
     * @param {THREE.Color} value 
     */
    updateSpecularPlaneColor(value) {
        this.specularPlaneColor = value
        this.planeMaterial.specular.set(this.specularPlaneColor)
    }
    /**
     * updates the plane shininess and the material
     * @param {number} value 
     */
    updatePlaneShininess(value) {
        this.planeShininess = value
        this.planeMaterial.shininess = this.planeShininess
    }
    
    /**
     * rebuilds the box mesh if required
     * this method is called from the gui interface
     */
    rebuildBox() {
        // remove boxMesh if exists
        if (this.boxMesh !== undefined && this.boxMesh !== null) {  
            this.app.scene.remove(this.boxMesh)
        }
        this.buildBox();
        this.lastBoxEnabled = null
    }
    
    /**
     * updates the box mesh if required
     * this method is called from the render method of the app
     * updates are trigered by boxEnabled property changes
     */
    updateBoxIfRequired() {
        if (this.boxEnabled !== this.lastBoxEnabled) {
            this.lastBoxEnabled = this.boxEnabled
            if (this.boxEnabled) {
                this.app.scene.add(this.boxMesh)
            }
            else {
                this.app.scene.remove(this.boxMesh)
            }
        }
    }

    /**
     * updates the contents
     * this method is called from the render method of the app
     * 
     */
    update() {
        /*// check if box mesh needs to be updated
        this.updateBoxIfRequired()

        // sets the box mesh position based on the displacement vector
        this.boxMesh.position.x = this.boxDisplacement.x
        this.boxMesh.position.y = this.boxDisplacement.y
        this.boxMesh.position.z = this.boxDisplacement.z*/
        
    }

}

export { MyContents };