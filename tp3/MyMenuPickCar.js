import * as THREE from "three";

/**
    This class customizes the gui interface for the app
*/
class MyMenuPickCar {
    constructor(burnerMaterial) {

        this.width = 42;
        this.height = 18;
        this.thickness = 1;


        this.backgroundMaterial = new THREE.MeshPhongMaterial({
            specular: "#FFFFFF",
            emissive: "#101010",
            shininess: 30,
            color: "#909090"
        });

        this.burnerMaterial = burnerMaterial || new THREE.MeshPhongMaterial({
            specular: "#444444",
            emissive: "#000000",
            shininess: 50,
            color: "#000000"
        });




    }

    buildPickMenu() {
        this.menu = new THREE.Group();

        const backgroundGeometry = new THREE.BoxGeometry(
            this.width,
            this.height,
            this.thickness
        );


        this.menuBack = new THREE.Mesh(backgroundGeometry, this.backgroundMaterial);


        this.menu.add(this.menuBack);

        this.menu.position.set(0, this.height / 2 + 500, 0);
        return this.menu;
    }


}

export { MyMenuPickCar };
