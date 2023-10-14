import * as THREE from "three";
import { MyAxis } from "./MyAxis.js";
import { MyTable } from "./MyTable.js";
import { MyCakeStand } from "./MyCakeStand.js";
import { MyCake } from "./MyCake.js";
import { MyRoom } from "./MyRoom.js";
import { MyCandle } from "./MyCandle.js";
import { MyCarocha } from "./MyCarocha.js";
import { MyMola } from "./MyMola.js";
import { MyNewspaper } from "./MyNewspaper.js";
import { MyVase } from "./MyVase.js";
import { MyFlower } from "./MyFlower.js";
import { MyWindow } from "./MyWindow.js";
import { MyPicFrame } from "./MyPicFrame.js";
import { MyOven } from "./MyOven.js";
/**
 *  This class contains the contents of out application
 */
class MyContents {
    /**
       constructs the object
       @param {MyApp} app The application object
    */
    constructor(app) {
        this.app = app;
        this.axis = null;

        // box related attributes
        this.boxMesh = null;
        this.boxMeshSize = 1.0;
        this.boxEnabled = true;
        this.lastBoxEnabled = null;
        this.boxDisplacement = new THREE.Vector3(0, 2, 0);

        // plane related attributes
        this.diffusePlaneColor = "#00ffff";
        this.specularPlaneColor = "#777777";
        this.planeShininess = 30;
        this.planeMaterial = new THREE.MeshPhongMaterial({
            color: this.diffusePlaneColor,
            specular: this.diffusePlaneColor,
            emissive: "#000000",
            shininess: this.planeShininess,
        });
    }

    /**
     * builds the box mesh with material assigned
     */
    buildBox() {
        let boxMaterial = new THREE.MeshPhongMaterial({
            color: "#ffff77",
            specular: "#000000",
            emissive: "#000000",
            shininess: 90,
        });

        // Create a Cube Mesh with basic material
        let box = new THREE.BoxGeometry(
            this.boxMeshSize,
            this.boxMeshSize,
            this.boxMeshSize
        );
        this.boxMesh = new THREE.Mesh(box, boxMaterial);
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
            this.axis = new MyAxis(this);
            this.app.scene.add(this.axis);
        }

        // Spotlight Cake
        let colorSpotLight = 0xf6e4bc;
        let intensitySpotLight = 30;
        let distanceSpotLight = 5;

        const spotlight = new THREE.SpotLight(
            colorSpotLight,
            intensitySpotLight,
            distanceSpotLight,
            Math.PI / 12,
            1
        );
        const spotlightHelper = new THREE.SpotLightHelper(spotlight);

        spotlight.position.set(2, distanceSpotLight, 0);

        this.app.scene.add(spotlight);
        this.app.scene.add(spotlightHelper);

        // Spotlight Oven
        let colorSpotLightOven = 0xf6e4bc;
        let intensitySpotLightOven = 300;
        let distanceSpotLightOven = 10;

        const spotlightOven = new THREE.SpotLight(
            colorSpotLightOven,
            intensitySpotLightOven,
            distanceSpotLightOven,
            Math.PI / 12,
            1
        );
        const spotlightHelperOven = new THREE.SpotLightHelper(spotlightOven);

        spotlightOven.position.set(-4.5, distanceSpotLightOven, 0);

        this.app.scene.add(spotlightOven);
        this.app.scene.add(spotlightHelperOven);

        // Light Room
        let colorLightRoom = 0xebd480;
        let intensityLightRoom = 50;
        let distanceLightRoom = 10;

        const lightRoom = new THREE.PointLight(
            colorLightRoom,
            intensityLightRoom,
            0,
            Math.PI / 2,
            0.2
        );
        const lightHelperRoom = new THREE.PointLightHelper(lightRoom);

        lightRoom.position.set(0, distanceLightRoom, 0);

        this.app.scene.add(lightRoom);
        this.app.scene.add(lightHelperRoom);

        // Ambient Light
        const lightAmbient = new THREE.AmbientLight(0x404040);
        this.app.scene.add(lightAmbient, 0.1);

        this.roomGroup = new MyRoom().buildRoom();
        this.tableGroup = new MyTable().buildTableGroup();
        this.cakeStand = new MyCakeStand().buildCakeStand();
        this.cake = new MyCake().buildCake();
        this.candle = new MyCandle().buildCandle();

        this.carocha = new MyCarocha().buildCarocha();
        this.mola = new MyMola().buildMola();
        this.normalNewspaper = new MyNewspaper(0.2).buildNormalNewspaper();
        this.creativeNewspaper = new MyNewspaper(0.2).buildCreativeNewspaper();
        this.vase = new MyVase().buildVase();
        this.flower = new MyFlower().buildFlower();
        this.windowObject = new MyWindow();
        this.window = this.windowObject.buildFrame();
        this.oven = new MyOven().buildOven();
        this.framePic1 = new MyPicFrame(
            null,
            null,
            null,
            new THREE.MeshPhongMaterial({
                map: new THREE.TextureLoader().load("textures/mariana.png"),
            })
        ).buildPicFrame();
        this.framePic2 = new MyPicFrame(
            null,
            null,
            null,
            new THREE.MeshPhongMaterial({
                map: new THREE.TextureLoader().load("textures/matilde.png"),
            })
        ).buildPicFrame();

        this.app.scene.add(this.roomGroup);
        this.roomGroup.add(this.tableGroup);
        this.roomGroup.add(this.oven);
        this.roomGroup.add(this.framePic1);
        this.roomGroup.add(this.framePic2);
        this.tableGroup.add(this.cakeStand);
        this.cakeStand.add(this.cake);
        this.cake.add(this.candle);

        this.framePic1.position.set(-2, 3, -5);
        this.framePic2.position.set(2, 3, -5);
        this.tableGroup.position.x = 2;

        //this.candle.add(this.carocha);
        // this.candle.add(this.mola);
        // this.candle.add(this.creativeNewspaper);
        // this.candle.add(this.normalNewspaper);
        // this.candle.add(this.vase);
        // this.candle.add(this.flower);
        // this.candle.add(this.window);
    }

    /**
     * updates the diffuse plane color and the material
     * @param {THREE.Color} value
     */
    updateDiffusePlaneColor(value) {
        this.diffusePlaneColor = value;
        this.planeMaterial.color.set(this.diffusePlaneColor);
    }
    /**
     * updates the specular plane color and the material
     * @param {THREE.Color} value
     */
    updateSpecularPlaneColor(value) {
        this.specularPlaneColor = value;
        this.planeMaterial.specular.set(this.specularPlaneColor);
    }
    /**
     * updates the plane shininess and the material
     * @param {number} value
     */
    updatePlaneShininess(value) {
        this.planeShininess = value;
        this.planeMaterial.shininess = this.planeShininess;
    }

    /**
     * rebuilds the box mesh if required
     * this method is called from the gui interface
     */
    rebuildBox() {
        // remove boxMesh if exists
        if (this.boxMesh !== undefined && this.boxMesh !== null) {
            this.app.scene.remove(this.boxMesh);
        }
        this.buildBox();
        this.lastBoxEnabled = null;
    }

    /**
     * updates the box mesh if required
     * this method is called from the render method of the app
     * updates are trigered by boxEnabled property changes
     */
    updateBoxIfRequired() {
        if (this.boxEnabled !== this.lastBoxEnabled) {
            this.lastBoxEnabled = this.boxEnabled;
            if (this.boxEnabled) {
                this.app.scene.add(this.boxMesh);
            } else {
                this.app.scene.remove(this.boxMesh);
            }
        }
    }

    /**
     * updates the contents
     * this method is called from the render method of the app
     *
     */
    update(camera) {
        this.windowObject.updateTexturePosition(camera);
        /*// check if box mesh needs to be updated
        this.updateBoxIfRequired()

        // sets the box mesh position based on the displacement vector
        this.boxMesh.position.x = this.boxDisplacement.x
        this.boxMesh.position.y = this.boxDisplacement.y
        this.boxMesh.position.z = this.boxDisplacement.z*/
    }
}

export { MyContents };

// Demo code for each object
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
