import * as THREE from "three";
import { My3DText } from "./My3DText.js";
/**
 * This class customizes the gui interface for the  menu  of choosing difficulty
 */
class MyMenuDifficulty {
    constructor(app) {
        this.app = app;

        this.backgroundMaterial = new THREE.MeshPhongMaterial({
            specular: "#FFFFFF",
            emissive: "#101010",
            shininess: 30,
            color: "#909090"
        });

        this.redMaterial = new THREE.MeshPhongMaterial({
            specular: "#808080",
            emissive: "#101010",
            shininess: 30,
            color: "#FF0000"
        });

        this.blueMaterial = new THREE.MeshPhongMaterial({
            specular: "#FFFFFF",
            emissive: "#101010",
            shininess: 30,
            color: "#0000FF"
        });

        this.yellowMaterial = new THREE.MeshPhongMaterial({
            specular: "#FFFFFF",
            emissive: "#101010",
            shininess: 30,
            color: "#FFFF00"
        });

        this.textMaterial = new THREE.MeshPhongMaterial({
            specular: "#000FFF",
            shininess: 30,
            color: "#909090"
        });

        this.menu = new THREE.Group();
    }

    buildDifficultyMenu() {

        // Text Menu Name
        let textNameMenu = new My3DText(this.app, "Choose Difficulty", this.textMaterial);
        let text_name = textNameMenu.buildText();

        text_name.rotateX(-Math.PI / 7)
        text_name.scale.set(0.5, 0.5, 0.5)
        text_name.position.set(-4, 3, 0)


        let textEasy = new My3DText(this.app, "Easy Mode", this.textMaterial);
        let text_easy = textEasy.buildText();

        text_easy.position.set(-7,0,0)

        let textMedium = new My3DText(this.app, "Medium Mode", this.textMaterial);
        let text_medium = textMedium.buildText();

        
        let textHard = new My3DText(this.app, "Hard Mode", this.textMaterial);
        let text_hard = textHard.buildText();
        text_hard.position.set(7,0,0)


        this.menu.add(text_name);

        this.menu.add(text_easy);
        this.menu.add(text_medium);
        this.menu.add(text_hard);

        this.menu.scale.set(2, 2, 2)
        this.menu.position.set(500, 300, 0)
        return this.menu;
    }
}

export { MyMenuDifficulty };
