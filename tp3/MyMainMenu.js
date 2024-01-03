import * as THREE from "three";
import { My3DText } from "./My3DText.js";
import { MyPicker } from "./MyPicker.js";
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

        // Picker
        this.picker = new MyPicker(this.app);

        // Text
        this.textMaterial = new THREE.MeshPhongMaterial({
            specular: "#000FFF",
            shininess: 30,
            color: "#909090"
        });
        // Text Game Name
        let textNameGame = new My3DText(this.app, "Windows at Night", this.textMaterial);
        let text_name = textNameGame.buildText();
        text_name.rotateX(-Math.PI / 7)
        text_name.scale.set(0.5, 0.5, 0.5)
        text_name.position.set(-4, 3, 0)

        // Text Button Start
        let textButtonPlay = new My3DText(this.app, "Start", this.textMaterial);
        let text_desc = textButtonPlay.buildText();
        text_desc.rotateX(-Math.PI / 7)
        text_desc.rotateX(-Math.PI / 10)
        text_desc.position.set(-0.2,-2,0)
        text_desc.traverse((c) => c.layers.enable(21))

        // Text Game Name
        let playerNameText = new My3DText(this.app, "Player Name (optional)", this.textMaterial);
        let player_name = playerNameText.buildText();
        player_name.rotateX(-Math.PI / 6)
        player_name.scale.set(0.2, 0.2, 0.2)
        player_name.position.set(0, -6, 0)


        let inputBox = new THREE.PlaneGeometry(10, 2);
        let inputBoxMesh = new THREE.Mesh(inputBox);
        inputBoxMesh.rotateX(-Math.PI / 10)
        inputBoxMesh.position.set(1.5, -4, 0)
        inputBoxMesh.name = "InputBoxStart"
        inputBoxMesh.traverse((c) => c.layers.enable(21))


        this.menu.add(text_desc);
        this.menu.add(text_name);
        this.menu.add(player_name)
        this.menu.add(inputBoxMesh)


        this.menu.scale.set(2, 2, 2)
        this.menu.position.set(200 - 3, 300, 0)
        return this.menu;
    }
}

export { MyMainMenu };
