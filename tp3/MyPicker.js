import * as THREE from "three";
import { MyAxis } from "./MyAxis.js";
import { My3DText } from "./My3DText.js";

/**
 *  This class contains the contents of out application
 */
class MyPicker {

    constructor(app) {
        this.app = app;
        this.raycaster = new THREE.Raycaster()
        this.raycaster.near = 1
        // this.raycaster.far = 200
        this.raycaster.layers.set(21)

        this.pointer = new THREE.Vector2()
        this.intersectedObj = null
        this.pickingColor = "0x9933ff"

        this.availableLayers = ['none', 1, 2, 3]
        this.selectedLayer = this.availableLayers[0]    // change this in interface

        // define the objects ids that are not to be pickeable
        // NOTICE: not a ThreeJS facility
        this.notPickableObjIds = []


        document.addEventListener(
            "pointermove",
            this.onPointerMove.bind(this)
        );
        document.addEventListener(
            "click",
            this.onClick.bind(this)
        );
    }

    getIntersections(event) {
        this.pointer.x = (event.clientX / window.innerWidth) * 2 - 1;
        this.pointer.y = -(event.clientY / window.innerHeight) * 2 + 1;

        this.raycaster.setFromCamera(this.pointer, this.app.getActiveCamera());
        var intersects = this.raycaster.intersectObjects(this.app.scene.children);

       // console.log(intersects)


        return intersects;
    }

    onClick(event) {
        const intersects = this.getIntersections(event)

        //console.log(intersects[0])
        const startGameButtonObject = intersects.find(obj => obj.object.name === "StartGameButton");
        // Player car
        const buttonCar1 = intersects.find(obj => obj.object.name === "button1");
        const buttonCar2 = intersects.find(obj => obj.object.name === "button2");
        const buttonCar3 = intersects.find(obj => obj.object.name === "button3");
        // Oponent Car
        const buttonCar4 = intersects.find(obj => obj.object.name === "button11");
        const buttonCar5 = intersects.find(obj => obj.object.name === "button22");
        const buttonCar6 = intersects.find(obj => obj.object.name === "button33");

        if (startGameButtonObject) {
            this.app.setActiveCamera("Pick Car Menu")
        }
        // Player Car
        if (buttonCar1) {
            this.app.contents.myCar = "./object3D/deliveryFlat.glb";
            this.app.setActiveCamera("Pick Car Op Menu")
        }
        else if (buttonCar2) {
            this.app.contents.myCar = "./object3D/taxi.glb";
            this.app.setActiveCamera("Pick Car Op Menu")
        }
        else if (buttonCar3) {
            this.app.contents.myCar = "./object3D/police.glb";
            this.app.setActiveCamera("Pick Car Op Menu")
        }

        //Oponent Car
        if (buttonCar4) {
            this.app.contents.opponentCar = "./object3D/deliveryFlat.glb";
            this.app.contents.startGame(
                this.app.contents.data,
                this.app.contents.myCar,
                this.app.contents.opponentCar,
                50
            );
        }
        else if (buttonCar5) {
            this.app.contents.opponentCar = "./object3D/taxi.glb";
            this.app.contents.startGame(
                this.app.contents.data,
                this.app.contents.myCar,
                this.app.contents.opponentCar,
                50
            );
        }
        else if (buttonCar6) {
            this.app.contents.opponentCar = "./object3D/police.glb";
            this.app.contents.startGame(
                this.app.contents.data,
                this.app.contents.myCar,
                this.app.contents.opponentCar,
                50
            );
        }


        this.pickingHelper(intersects)
        this.transverseRaycastProperties(intersects)
    }


    onPointerMove(event) {
        document.body.style.cursor = "auto"

        const intersects = this.getIntersections(event);

       // console.log(intersects[0])
        const inputBoxStartObject = intersects.find(obj => obj.object.name === "InputBoxStart");
        const startGameButtonObject = intersects.find(obj => obj.object.name === "StartGameButton");
        const buttonCar1 = intersects.find(obj => obj.object.name === "button1");
        const buttonCar2 = intersects.find(obj => obj.object.name === "button2");
        const buttonCar3 = intersects.find(obj => obj.object.name === "button3");
        const buttonCar4 = intersects.find(obj => obj.object.name === "button11");
        const buttonCar5 = intersects.find(obj => obj.object.name === "button22");
        const buttonCar6 = intersects.find(obj => obj.object.name === "button33");

        if (inputBoxStartObject) {
            document.getElementById("nameInputReal").focus();
            //console.log("InputBoxStart is intersected!");
        }
        if (startGameButtonObject || buttonCar1 || buttonCar2 || buttonCar3 || buttonCar4 || buttonCar5 || buttonCar6) {
            document.body.style.cursor = "pointer"
        }

        this.pickingHelper(intersects)

        this.transverseRaycastProperties(intersects)
    }

    changeColorOfFirstPickedObj(obj) {
        if (this.lastPickedObj != obj) {
            if (this.lastPickedObj)
                this.lastPickedObj.material.color.setHex(this.lastPickedObj.currentHex);
            this.lastPickedObj = obj;
            this.lastPickedObj.currentHex = this.lastPickedObj.material.color.getHex();
            this.lastPickedObj.material.color.setHex(this.pickingColor);
        }

    }

    restoreColorOfFirstPickedObj() {
        if (this.lastPickedObj)
            this.lastPickedObj.material.color.setHex(this.lastPickedObj.currentHex);
        this.lastPickedObj = null;
    }


    transverseRaycastProperties(intersects) {
        for (var i = 0; i < intersects.length; i++) {

            //console.log(intersects[i]);
        }
    }


    pickingHelper(intersects) {
        if (intersects.length > 0) {
            const obj = intersects[0].object
            if (this.notPickableObjIds.includes(obj.name)) {
                this.restoreColorOfFirstPickedObj()
                //console.log("Object cannot be picked !")
            }
            else
                this.changeColorOfFirstPickedObj(obj)
        } else {
            this.restoreColorOfFirstPickedObj()
        }
    }



}

export { MyPicker };
