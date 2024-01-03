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
        this.raycaster.far = 200
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

    onClick(event) {

        this.pointer.x = (event.clientX / window.innerWidth) * 2 - 1;
        this.pointer.y = -(event.clientY / window.innerHeight) * 2 + 1;

        this.raycaster.setFromCamera(this.pointer, this.app.getActiveCamera());
        var intersects = this.raycaster.intersectObjects(this.app.scene.children);



        console.log(intersects[0])
        const startGameButtonObject = intersects.find(obj => obj.object.name === "StartGameButton");

        const findAncestorsCar1 = intersects.find(obj => { 
            let found = false;
            obj.object.traverseAncestors((ancestor) => { if (ancestor.name == "car1n") found = true; }) 
            return found;
        });

        if (startGameButtonObject) {
            this.app.setActiveCamera("Pick Car Menu")
        }

        if (findAncestorsCar1){
            
        }

        this.pickingHelper(intersects)
        this.transverseRaycastProperties(intersects)
    }


    onPointerMove(event) {
        document.body.style.cursor = "auto"

        this.pointer.x = (event.clientX / window.innerWidth) * 2 - 1;
        this.pointer.y = -(event.clientY / window.innerHeight) * 2 + 1;

        this.raycaster.setFromCamera(this.pointer, this.app.getActiveCamera());

        var intersects = this.raycaster.intersectObjects(this.app.scene.children);

        console.log(intersects[0])
        const inputBoxStartObject = intersects.find(obj => obj.object.name === "InputBoxStart");
        const startGameButtonObject = intersects.find(obj => obj.object.name === "StartGameButton");

        if (inputBoxStartObject) {
            document.getElementById("nameInputReal").focus();
            console.log("InputBoxStart is intersected!");
        }
        if (startGameButtonObject) {
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

            console.log(intersects[i]);
        }
    }


    pickingHelper(intersects) {
        if (intersects.length > 0) {
            const obj = intersects[0].object
            if (this.notPickableObjIds.includes(obj.name)) {
                this.restoreColorOfFirstPickedObj()
                console.log("Object cannot be picked !")
            }
            else
                this.changeColorOfFirstPickedObj(obj)
        } else {
            this.restoreColorOfFirstPickedObj()
        }
    }



}

export { MyPicker };
