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
      
        let textButtonPlay = new My3DText(this.app, "Play");

        return this.menu;
    }
}

export { MyMainMenu };
