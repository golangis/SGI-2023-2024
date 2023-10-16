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
import { MyCounter } from "./MyCounter.js";
import { MyFloorLamp } from "./MyFloorLamp.js";
import { MyCarpet } from "./MyCarpet.js";
import { MyMicrowave } from "./MyMicrowave.js";
import { MyFridge } from "./MyFridge.js";
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
        this.mapSize = 4096;

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
     * initializes the contents
     */
    init() {
        // create once
        if (this.axis === null) {
            // create and attach the axis to the scene
            this.axis = new MyAxis(this);
            //this.app.scene.add(this.axis);
        }

        this.buildScene();
    }

    buildScene() {
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

        spotlight.position.set(0, distanceSpotLight, 0);
        spotlight.target.position.set(0, 1, 0);
        spotlight.castShadow = true;

        let spotlightHelper = new THREE.SpotLightHelper(spotlight, colorSpotLight);

        this.app.scene.add(spotlight);
    

        // Spotlight Window
        const light = new THREE.DirectionalLight(0xffffff, 0.5);
        light.position.set(5, 5, 0);
        light.shadow.mapSize.width = this.mapSize;
        light.shadow.mapSize.height = this.mapSize;
        light.castShadow = true;
        
        let helper = new THREE.SpotLightHelper(light, 0xffffff);

        //this.app.scene.add(helper);
        this.app.scene.add(light);

        // Spotlight Oven
        let colorSpotLightOven = 0xf6e4bc;
        let intensitySpotLightOven = 30;
        let distanceSpotLightOven = 4.7;

        const spotlightOven = new THREE.SpotLight(
            colorSpotLightOven,
            intensitySpotLightOven,
            distanceSpotLightOven,
            Math.PI / 9,
            1
        );
        spotlightOven.position.set(-4.3, distanceSpotLightOven, 0);
        spotlightOven.target.position.set(-4.3, 0, 0);

        let spotlightOvenHelper = new THREE.SpotLightHelper(spotlightOven, colorSpotLightOven);

        spotlightOven.shadow.mapSize.width = this.mapSize;

        spotlightOven.castShadow = true;

        this.app.scene.add(spotlightOven);

        // Light Room
        let colorLightRoom = 0xfbdd9a;
        let intensityLightRoom = 10;
        let distanceLightRoom = 4;

        const lightRoom = new THREE.PointLight(
            colorLightRoom,
            intensityLightRoom,
            0,
            Math.PI / 2,
            0.2
        );

        lightRoom.position.set(-2, distanceLightRoom, 0);
        lightRoom.castShadow = true;

        const lightAmbient = new THREE.AmbientLight( 0x404040 ); // soft white light
        this.app.scene.add( lightAmbient );

        this.app.scene.add(lightRoom);
        this.roomGroup = new MyRoom().buildRoom();
        this.tableGroup = new MyTable().buildTableGroup();
        this.cakeStand = new MyCakeStand().buildCakeStand();
        this.carpet = new MyCarpet().buildCarpet();
        this.cake = new MyCake().buildCake();
        this.candle = new MyCandle().buildCandle();
        this.floorLamp = new MyFloorLamp().buildFloorLamp();
        this.carocha = new MyCarocha().buildCarocha();
        this.mola = new MyMola().buildMola();
        this.normalNewspaper = new MyNewspaper(0.2).buildNormalNewspaper();
        this.creativeNewspaper = new MyNewspaper(0.2).buildCreativeNewspaper();
        this.vase = new MyVase().buildVase();
        this.flower = new MyFlower().buildFlower();
        this.windowObject = new MyWindow();
        this.window = this.windowObject.buildWindow();
        this.oven = new MyOven().buildOven();
        this.counter = new MyCounter().buildCounter();
        this.microwave = new MyMicrowave().buildMicrowave();
        this.fridge = new MyFridge().buildFridge();

        this.framePic1 = new MyPicFrame(
            null,
            null,
            null,
            new THREE.MeshPhongMaterial({
                map: new THREE.TextureLoader().load("textures/mariana.jpg"),
            })
        ).buildPicFrame();

        this.framePic2 = new MyPicFrame(
            null,
            null,
            null,
            new THREE.MeshPhongMaterial({
                map: new THREE.TextureLoader().load("textures/matilde.jpg"),
            })
        ).buildPicFrame();

        this.app.scene.add(this.roomGroup);

        this.roomGroup.add(this.tableGroup);
        this.roomGroup.add(this.oven);
        this.roomGroup.add(this.counter);
        this.roomGroup.add(this.floorLamp);
        this.roomGroup.add(this.framePic1);
        this.roomGroup.add(this.framePic2);
        this.roomGroup.add(this.window);
        this.roomGroup.add(this.carocha);
        this.roomGroup.add(this.carpet);
        this.roomGroup.add(this.microwave);
        this.roomGroup.add(this.fridge);

        this.tableGroup.add(this.cakeStand);
        this.tableGroup.add(this.creativeNewspaper);
        this.tableGroup.add(this.normalNewspaper);
        this.tableGroup.add(this.mola);
        this.tableGroup.add(this.vase);

        this.cakeStand.add(this.cake);
        this.cake.add(this.candle);

        this.vase.add(this.flower);

        this.framePic1.position.set(-2, 3, -5);
        this.framePic2.position.set(2, 3, -5);
        this.tableGroup.position.x = 0;

        this.window.position.set(4.975, 3.5, 0);
        this.window.rotateY(-Math.PI / 2);

        this.carocha.position.set(0, 3.5, 4.975);
        this.carocha.rotateY(Math.PI);

        this.creativeNewspaper.position.set(1.9, -0.2, 0.207);
        this.normalNewspaper.position.set(1.5, 0.5, 0.15);

        this.mola.position.set(1.2, -0.3, 0.2);
        this.mola.rotateZ(Math.PI / 8);

        this.vase.position.set(-1.2, 0, 0.101);

        this.flower.position.set(-0.2, 3, 0);
        this.flower.rotateY(Math.PI);
        this.flower.rotateZ(Math.PI / 9);
    }
    
    /**
     * updates the contents
     * this method is called from the render method of the app
     *
     */
    update(camera) {
        this.windowObject.updateTexturePosition(camera);
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
