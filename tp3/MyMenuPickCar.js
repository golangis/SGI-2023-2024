import * as THREE from "three";
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js';
import { My3DText } from "./My3DText.js";

/**
 * This class customizes the gui interface for the menu of picking the car to use on the game
 */
class MyMenuPickCar {
    constructor(app) {
        this.width = 42;
        this.height = 18;
        this.thickness = 1;
        this.app = app;
        this.menu = new THREE.Group();

        this.backgroundMaterial = new THREE.MeshPhongMaterial({
            specular: "#FFFFFF",
            emissive: "#101010",
            shininess: 30,
            color: "#909090"
        });

        this.opa = new THREE.MeshPhongMaterial({
            specular: "#FFFFFF",
            emissive: "#101010",
            shininess: 30,
            color: "#909090"
        });
    }

    buildPickMenu() {
        // Background

        // Lights
        const pointLightMenuPick = new THREE.PointLight(
            0xfbdd9a,
            50,
            0,
            Math.PI / 2,
            0.2
        );

        pointLightMenuPick.position.set(-2, 4, 20);
        pointLightMenuPick.castShadow = true;

        const lightMenuPick1 = new THREE.SpotLight(
            0xff0000,
            100,
            0,
            Math.PI
        );


        lightMenuPick1.position.set(0, 4, 10);
        lightMenuPick1.castShadow = true;

        const lightMenuPick2 = new THREE.SpotLight(
            0x0000ff,
            100,
            0,
            Math.PI
        );


        lightMenuPick2.position.set(7, 4, 5);
        lightMenuPick2.castShadow = true;


        const lightMenuPick3 = new THREE.SpotLight(
            0xffff00,
            100,
            0,
            Math.PI
        );


        lightMenuPick3.position.set(-7, 4, 5);
        lightMenuPick3.castShadow = true;

        this.menu.add(lightMenuPick1)
        this.menu.add(lightMenuPick2)
        this.menu.add(lightMenuPick3)
        this.menu.add(pointLightMenuPick)

        // Text
        this.textMaterial = new THREE.MeshPhongMaterial({
            specular: "#000FFF",
            shininess: 30,
            color: "#909090"
        });
        let textGenerator = new My3DText(this.app, "Pick Your Car", this.textMaterial);
        let text_desc = textGenerator.buildText();
        text_desc.rotateX(Math.PI / 15)
        text_desc.position.set(-4, 7, 8)

        this.menu.add(text_desc);

        this.shineParams = {
            time: 0
        };


        // Car Stands
        const carStand = new THREE.CylinderGeometry(3, 4, 15);
        this.carStandMesh1 = new THREE.Mesh(carStand, this.backgroundMaterial);
        this.carStandMesh1.position.set(0, -7.5, 10)

        this.carStandMesh2 = new THREE.Mesh(carStand, this.backgroundMaterial);
        this.carStandMesh2.position.set(-7, -7.5, 5)

        this.carStandMesh3 = new THREE.Mesh(carStand, this.backgroundMaterial);
        this.carStandMesh3.position.set(7, -7.5, 5)

        const backgroundGeometry = new THREE.BoxGeometry(
            this.width,
            this.height,
            this.thickness
        );


        this.menu.add(this.carStandMesh1);
        this.menu.add(this.carStandMesh2);
        this.menu.add(this.carStandMesh3);

        this.menu.position.set(0, this.height / 2 + 500, 0);

        // Cars 
        let car1 = this.loadCars("./object3D/deliveryFlat.glb");
        car1.position.set(0, 0, 10)
        car1.name = "car1n"
        car1.traverse((c) => c.layers.enable(21))


        let car2 = this.loadCars("./object3D/taxi.glb");
        car2.position.set(-7, 0, 5)

        let car3 = this.loadCars("./object3D/police.glb");
        car3.position.set(7, 0, 5)


        return this.menu;
    }


    loadCars(path_car) {
        const path = path_car;
        const loader = new GLTFLoader();
        const mesh = new THREE.Object3D();
        this.carMesh = new THREE.Object3D();

        loader.load(
            path,
            function (object) {
                mesh.add(object.scene);
                this.AABB = new THREE.Box3().setFromObject(this.carMesh);
            }.bind(this),
            function (xhr) {
                console.log((xhr.loaded / xhr.total) * 100 + "% loaded");
            },
            function (error) {
                console.log("An error happened");
            }
        );

        this.carMesh.add(mesh);
        this.carMesh.rotateY(Math.PI);
        this.carMesh.scale.set(2, 2, 2);
        this.menu.add(this.carMesh);

        return this.carMesh
    }


    updateMenuPicker() {
        this.shineParams.time += 0.03;

        const shineIntensity = Math.abs(Math.sin(this.shineParams.time)) * 0.3 + 0.5; // Adjust the intensity as needed
        this.textMaterial.emissive.setRGB((Math.cos(shineIntensity)* 0.7)**2, 0.1,  Math.sin(shineIntensity));
    };
}
export { MyMenuPickCar };
