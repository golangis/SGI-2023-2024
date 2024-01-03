import * as THREE from "three";
import { MyAxis } from "./MyAxis.js";

/**
 *  This class contains the contents of out application
 */
class MyPicker {

    constructor(app) {
        this.app = app;
        this.raycaster = new THREE.Raycaster()
        this.raycaster.near = 1
        this.raycaster.far = 40
        this.raycaster.layers.set(21)

        this.pointer = new THREE.Vector2()
        this.intersectedObj = null
        this.pickingColor = "0x00ff00"


        // structure of layers: each layer will contain its objects
        // this can be used to select objects that are pickeable     
        this.availableLayers = ['none', 1, 2, 3]
        this.selectedLayer = this.availableLayers[0]    // change this in interface

        // define the objects ids that are not to be pickeable
        // NOTICE: not a ThreeJS facility
        this.notPickableObjIds = []
        // this.notPickableObjIds = ["col_0_0", "col_2_0", "col_1_1"]
        // this.notPickableObjIds = ["myplane", "col_0_0", "col_2_0", "col_1_1"]

        //register events

        document.addEventListener(
            "pointermove",
            // "mousemove",
            // "pointerdown",
            this.onPointerMove.bind(this)
        );
    }


    onPointerMove(event) {

        this.pointer.x = (event.clientX / window.innerWidth) * 2 - 1;
        this.pointer.y = -(event.clientY / window.innerHeight) * 2 + 1;

        this.raycaster.setFromCamera(this.pointer, this.app.getActiveCamera());

        //3. compute intersections
        var intersects = this.raycaster.intersectObjects(this.app.scene.children);



        // Check if any object with the name "InputBoxStart" is intersected
        console.log(intersects[0])
        const inputBoxStartObject = intersects.find(obj => obj.object.name === "InputBoxStart");

        if (inputBoxStartObject) {
            document.getElementById("nameInputReal").focus();
            console.log("InputBoxStart is intersected!");
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
