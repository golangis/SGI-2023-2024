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
            color: "#c71237"
        });

        this.greenMaterial = new THREE.MeshPhongMaterial({
            specular: "#FFFFFF",
            emissive: "#101010",
            shininess: 30,
            color: "#03fca1"
        });

        this.yellowMaterial = new THREE.MeshPhongMaterial({
            specular: "#FFFFFF",
            emissive: "#101010",
            shininess: 30,
            color: "#ed952f"
        });

        this.textMaterial = new THREE.MeshPhongMaterial({
            specular: "#000FFF",
            shininess: 30,
            color: "#909090"
        });

        this.menu = new THREE.Group();
    }

    buildDifficultyMenu() {


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

        // Text Menu Name
        let textNameMenu = new My3DText(this.app, "Choose Difficulty", this.textMaterial);
        let text_name = textNameMenu.buildText();

        text_name.rotateX(Math.PI / 9)
        text_name.scale.set(2, 2, 2)
        text_name.position.set(-11.5, 12, 0)


        let textEasy = new My3DText(this.app, "Easy Mode", this.greenMaterial);
        let text_easy = textEasy.buildText();
        text_easy.rotateX(-Math.PI/12)


        text_easy.position.set(-4.7, 5, 0)

        let textMedium = new My3DText(this.app, "Medium Mode", this.yellowMaterial);
        let text_medium = textMedium.buildText();
        text_medium.rotateX(-Math.PI/8)

        text_medium.position.set(-5.5, 0, 0)


        let textHard = new My3DText(this.app, "Hard Mode", this.redMaterial);
        let text_hard = textHard.buildText();
        text_hard.rotateX(-Math.PI/7)
        text_hard.position.set(-4.7, -5, 0)

        this.shineParams = {
            time: 0
        };


        this.menu.add(text_name);

        this.menu.add(text_easy);
        this.menu.add(text_medium);
        this.menu.add(text_hard);

        this.menu.scale.set(0.7, 0.7, 0.7)
        this.menu.position.set(500, 297, 0)
        return this.menu;
    }
}

export { MyMenuDifficulty };