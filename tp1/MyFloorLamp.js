import * as THREE from "three";

/**
    This class customizes the gui interface for the app
*/
class MyFloorLamp {
    constructor( lampRadius, lampHeight, stickRadius, stickHeight, baseHeight) {

        this.lampRadius = 0.8;
        this.lampHeight = 0.8;
        this.stickRadius = 0.1;
        this.stickHeight = 3;
        this.baseHeight = 0.1;
        
        this.holderMaterial = new THREE.MeshPhongMaterial({
            specular: "#444444",
            emissive: "#101010",
            shininess: 30,
            color: "#6b4f2a",
            side: THREE.DoubleSide
        });        

        this.lampMaterial = new THREE.MeshPhongMaterial({
            specular: "#444444",
            emissive: "#101010",
            shininess: 30,
            color: "#e8c392",
            side: THREE.DoubleSide
        });        

        this.bulbMaterial = new THREE.MeshPhongMaterial({
            specular: "#444444",
            emissive: "#FFFFFF",
            shininess: 30,
            color: "#FFFFFF",
        });        


        
    }

    buildFloorLamp() {
        this.lampGroup = new THREE.Group();

        const baseGeometry = new THREE.CylinderGeometry(
            this.lampRadius - 0.5,
            this.lampRadius,
            this.baseHeight
        );

        const stickGeometry = new THREE.CylinderGeometry(
            this.stickRadius,
            this.stickRadius,
            this.stickHeight
        );

        const lampGeometry = new THREE.CylinderGeometry(
            this.lampRadius*5/6,
            this.lampRadius,
            this.lampHeight,
            32,
            1,
            true
        );

        const bulbGeometry = new THREE.SphereGeometry(
            this.lampRadius*1/6,
        );

        // Bottom Base Lamp
        this.base = new THREE.Mesh(baseGeometry, this.holderMaterial);
        this.base.position.set(5 - this.lampRadius, this.baseHeight/2, -5 + this.lampRadius);

        // Stick Lamp
        this.stick = new THREE.Mesh(stickGeometry, this.holderMaterial);
        this.stick.position.set(5 - this.lampRadius, this.stickHeight/2, -5 + this.lampRadius);

        // Lamp Abajur
        this.lamp = new THREE.Mesh(lampGeometry, this.lampMaterial);
        this.lamp.position.set(5 - this.lampRadius, this.stickHeight, -5 + this.lampRadius);

        // Bulb
        this.bulb = new THREE.Mesh(bulbGeometry,this.bulbMaterial);
        this.bulb.position.set(5 - this.lampRadius, this.stickHeight, -5 + this.lampRadius);

        // Light
        let colorLight = 0xfbdd9a;
        let intensityLight = 1;


        const light = new THREE.PointLight(
            colorLight,
            intensityLight
        );

        light.position.set(5 - this.lampRadius, this.stickHeight, -5 + this.lampRadius);
        light.castShadow = true;

        this.lampGroup.add(light);
        this.lampGroup.add(this.stick);
        this.lampGroup.add(this.base); 
        this.lampGroup.add(this.lamp);
        this.lampGroup.add(this.bulb);

        return this.lampGroup;
    }

    
}

export { MyFloorLamp };
