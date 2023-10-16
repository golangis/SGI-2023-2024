import * as THREE from "three";

/**
    This class customizes the gui interface for the app
*/
class MyOven {
    constructor(burnerMaterial) {

        this.ovenWidth =  1.2;
        this.ovenHeight =  1.8;
        this.ovenThickness =  2;

        
        this.ovenMaterial = new THREE.MeshPhongMaterial({
            specular: "#FFFFFF",
            emissive: "#101010",
            shininess: 30,
            color: "#909090"
        });

        this.burnerMaterial = burnerMaterial || new THREE.MeshPhongMaterial({
            specular: "#444444",
            emissive: "#000000",
            shininess: 50,
            color: "#111111"
        });

        this.glassOvenMaterial = this.glassOvenMaterial || new THREE.MeshPhongMaterial({
            specular: "#444444",
            emissive: "#000000",
            shininess: 50,
            map: new THREE.TextureLoader().load('textures/oven-glass.png')
        })
        

        
    }

    buildOven() {
        this.ovenGroup = new THREE.Group();
        let burnerOvenRad = 0.2;
        let burnerOvenHeight = 0.03;

        let glassWidth = 1;
        let glassHeight = 0.6;
        let glassThickness = 0.05;

        let extractorBottomRad = this.ovenWidth;
        let extractorTopRad = extractorBottomRad*0.6;
        let extractorHeight = 1;
        let extractorSeg = 4; 

    

        const ovenGeometry = new THREE.BoxGeometry(
            this.ovenWidth,
            this.ovenHeight,
            this.ovenThickness
        );

        const burnerOvenGeometry = new THREE.CylinderGeometry(
            burnerOvenRad,
            burnerOvenRad,
            burnerOvenHeight
        );

        const glassOvenGeometry = new THREE.BoxGeometry(
            glassWidth,
            glassHeight,
            glassThickness
        );

        const extractorGeometry = new THREE.CylinderGeometry(
            extractorTopRad,
            extractorBottomRad,
            extractorHeight,
            extractorSeg
        ) 

        this.ovenBody = new THREE.Mesh(ovenGeometry, this.ovenMaterial);
        this.ovenBody.position.set(-5 + this.ovenWidth/2, this.ovenHeight/2, 0);

        // Burners of the oven
        this.burnerOven1 = new THREE.Mesh(burnerOvenGeometry, this.burnerMaterial);
        this.burnerOven1.position.set(-burnerOvenRad - 0.15, this.ovenHeight/2 + burnerOvenHeight/2, -0.45)

        this.burnerOven2 = new THREE.Mesh(burnerOvenGeometry, this.burnerMaterial);
        this.burnerOven2.position.set(-burnerOvenRad - 0.15, this.ovenHeight/2 + burnerOvenHeight/2, 0.45)

        this.burnerOven3 = new THREE.Mesh(burnerOvenGeometry, this.burnerMaterial);
        this.burnerOven3.position.set(-burnerOvenRad + 0.5, this.ovenHeight/2 + burnerOvenHeight/2, -0.45)

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

        this.ovenGroup.add(this.ovenBody); 
        return this.ovenGroup;
    }

    
}

export { MyOven };
