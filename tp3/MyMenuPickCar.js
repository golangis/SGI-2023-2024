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
    }

    buildPickMenu() {
        const backgroundGeometry = new THREE.BoxGeometry(
            this.width,
            this.height,
            this.thickness
        );
        this.menuBack = new THREE.Mesh(backgroundGeometry, this.backgroundMaterial);

        this.menu.add(this.menuBack);

        this.menu.position.set(0, this.height / 2 + 500, 0);

        let car1= this.loadCars("./object3D/van.glb");
        car1.position.set(2, 0, 5)
        let car2 = this.loadCars("./object3D/taxi.glb");
        car2.position.set(-10, 0, 5)
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
        this.carMesh.rotateY(Math.PI + Math.PI/6)
        this.carMesh.scale.set(2,2,2)
        this.menu.add(this.carMesh);

        return this.carMesh
    }


}

export { MyMenuPickCar };
