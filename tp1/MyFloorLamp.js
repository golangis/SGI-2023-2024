import * as THREE from "three";

/**
    This class customizes the gui interface for the app
*/
class MyFloorLamp {
    constructor( lampRadius, lampHeight, stickRadius, stickHeight) {

        this.lampRadius = 1.2;
        this.lampHeight = 0.8;
        this.stickRadius = 0.2;
        this.stickHeight = 1.8;
        
        this.ovenMaterial = new THREE.MeshPhongMaterial({
            specular: "#444444",
            emissive: "#101010",
            shininess: 30,
            color: "#909090"
        });        

        
    }

    buildFloorLamp() {
        this.lampGroup = new THREE.Group();

        const baseGeometry = new THREE.CylinderGeometry(
            this.lampRadius,
            this.lampRadius,
            0.1
        );

        const lampGeometry = new THREE.CylinderGeometry(
            this.lampRadius*5/6,
            this.lampRadius,
            this.lampHeight
        );

        // Bottom Base Lamp
        this.base = new THREE.Mesh(baseGeometry, '#A7837B');
        this.base.position.set(-5 + this.ovenWidth/2, this.ovenHeight/2, 0);

        this.burnerOven4 = new THREE.Mesh(burnerOvenGeometry, this.burnerMaterial);
        this.burnerOven4.position.set(-burnerOvenRad + 0.5, this.ovenHeight/2 + burnerOvenHeight/2, 0.45)

        // Glass
        this.glass = new THREE.Mesh(glassOvenGeometry, this.glassOvenMaterial)
        this.glass.position.set(this.ovenWidth/2, 0, 0)
        this.glass.rotateY(Math.PI/2)
        this.glass.scale.set(2,2,2)

        // Extractor
        this.extractor = new THREE.Mesh(extractorGeometry, this.ovenMaterial);
        this.extractor.rotateY(Math.PI/4)
        this.extractor.position.set(-this.ovenWidth/2 + extractorBottomRad / 2 + 0.2, 3.3, 0); 

        this.ovenBody.add(this.burnerOven1);
        this.ovenBody.add(this.burnerOven2);
        this.ovenBody.add(this.burnerOven3);
        this.ovenBody.add(this.burnerOven4);

        this.ovenBody.add(this.glass);

        this.ovenBody.add(this.extractor);

        this.lampGroup.add(this.ovenBody); 
        return this.lampGroup;
    }

    
}

export { MyFloorLamp };
