import * as THREE from "three";
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js';

/**
 * This class customizes the gui interface for the app
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

        this.menu.add(pointLightMenuPick)

        // Car Stands
        const carStand = new THREE.CylinderGeometry(3, 4, 15);
        this.carStandMesh1 = new THREE.Mesh(carStand, this.backgroundMaterial);
        this.carStandMesh1.position.set(0,-7.5, 10)

        this.carStandMesh2 = new THREE.Mesh(carStand, this.backgroundMaterial);
        this.carStandMesh2.position.set(-7,-7.5, 5)

        this.carStandMesh3 = new THREE.Mesh(carStand, this.backgroundMaterial);
        this.carStandMesh3.position.set(7,-7.5, 5)

        const backgroundGeometry = new THREE.BoxGeometry(
            this.width,
            this.height,
            this.thickness
        );


        this.menu.add(this.carStandMesh1);
        this.menu.add(this.carStandMesh2);
        this.menu.add(this.carStandMesh3);

        this.menu.position.set(0, this.height / 2 + 500, 0);

        let car1 = this.loadCars("./object3D/deliveryFlat.glb");
        car1.position.set(0, 0, 10)

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


}

export { MyMenuPickCar };
