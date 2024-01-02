import * as THREE from "three";
import { My3DText } from "./My3DText.js";
/**
 * This class customizes the gui interface for the main menu 
 */
class MyMainMenu {
    constructor(app) {
        this.app = app;
        this.backgroundMaterial = new THREE.MeshPhongMaterial({
            specular: "#FFFFFF",
            emissive: "#101010",
            shininess: 30,
            color: "#909090"
        });
        this.menu = new THREE.Group();

    }

    buildMainMenu() {
        let textGenerator = new My3DText(this.app, "damn son");
        let car1 = textGenerator.buildText();
        car1.position.set(0, 0, 0);

        this.menu.add(car1);
        this.menu.position.set(0, 0 , 0);

        return this.menu;
    }
}

export { MyMainMenu };
