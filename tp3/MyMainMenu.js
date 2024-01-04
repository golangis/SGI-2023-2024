import * as THREE from "three";
import { My3DText } from "./My3DText.js";
import { MySprite } from "./MySprite.js";
/**
 * This class customizes the gui interface for the main menu 
 */
class MyMainMenu {
    constructor(app) {
        this.app = app;
        this.yellowMaterial = new THREE.MeshPhongMaterial({
            specular: "#999999",
            color: "#FFF000"
        });
        
        this.backgroundMaterial = new THREE.MeshPhongMaterial({
            emissive: "#000000",
            shininess: 0,
            map: new THREE.TextureLoader().load('textures/win95.jpg')
        })

        this.menu = new THREE.Group();

        const el = document.getElementById("nameInputReal")
        el
            .addEventListener("input", (event) => {
                this.writeNamePlayer();
            });


    }

    writeNamePlayer() {
        const textNameMaterial = new THREE.MeshPhongMaterial({
            specular: "#000FFF",
            shininess: 5,
            color: "#000000"
        });
        const nameTextWritten = document.getElementById("nameInputReal").value;

        let textNameGame = new My3DText(this.app, nameTextWritten, textNameMaterial);
        let text_name = textNameGame.buildText();
        text_name.scale.set(0.4, 0.4, 0.4)
        text_name.rotateX(-Math.PI / 10)
        text_name.position.set(-3, 0.5, 3)
        this.inputBoxMesh.clear()
        this.inputBoxMesh.add(text_name)
    }
    buildMainMenu() {


        // Background
        let background = new THREE.PlaneGeometry(200, 160);
        this.backgroundMesh = new THREE.Mesh(background, this.backgroundMaterial);
        this.backgroundMesh.position.set(0,0,-5)
        
        // Text
        this.textMaterial = new THREE.MeshPhongMaterial({
            specular: "#FFFFFF",
            shininess: 30,
            color: "#909090"
        });

        const myTextGroup = new MySprite("Escaping FEUP");
        myTextGroup.rotateX(Math.PI/7)
		myTextGroup.scale.set(0.03,0.03,0.03)
        myTextGroup.position.set(-6.5,3,0)

        // Text Game Name
        let textAuthorsName = new My3DText(this.app, "Matilde Silva & Mariana Rocha", this.textMaterial);
        let text_author_name = textAuthorsName.buildText();
        text_author_name.rotateX(-Math.PI / 4)
        text_author_name.scale.set(0.3, 0.3, 0.3)
        text_author_name.position.set(-1.5,-8.5, 0)



        // Text Button Start
        let textButtonPlay = new My3DText(this.app, "Start", this.yellowMaterial);
        let text_desc = textButtonPlay.buildText();
        text_desc.rotateX(-Math.PI / 7)
        text_desc.rotateX(-Math.PI / 10)
        text_desc.position.set(-0.2, -2, 0)
        text_desc.traverse((c) => {
            c.layers.enable(21)
            c.name = "StartGameButton"
        })

        // Text Game Name
        let playerNameText = new My3DText(this.app, "Player Name (optional)", this.textMaterial);
        let player_name = playerNameText.buildText();
        player_name.rotateX(-Math.PI / 6)
        player_name.scale.set(0.2, 0.2, 0.2)
        player_name.position.set(0, -3, 0)


        let inputBox = new THREE.PlaneGeometry(10, 1);
        this.inputBoxMesh = new THREE.Mesh(inputBox);
        this.inputBoxMesh.rotateX(-Math.PI / 10)
        this.inputBoxMesh.position.set(1.5, -4, 0)
        this.inputBoxMesh.name = "InputBoxStart"
        this.inputBoxMesh.traverse((c) => c.layers.enable(21))

        this.menu.add(this.backgroundMesh);
        this.menu.add(myTextGroup);
        this.menu.add(text_author_name);
        this.menu.add(text_desc);
        this.menu.add(player_name)
        this.menu.add(this.inputBoxMesh)

        this.menu.scale.set(2, 2, 2)
        this.menu.position.set(200 - 3, 300, 0)
        return this.menu;
    }
}

export { MyMainMenu };
