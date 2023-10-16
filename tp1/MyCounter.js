import * as THREE from "three";

/**
    This class customizes the gui interface for the app
*/
class MyCounter {
    constructor( width, height, thickness) {

        this.counterWidth = 4;
        this.counterHeight =  1.5;
        this.counterThickness =  1.2;

        const textureCounter = new THREE.TextureLoader().load( "textures/counter-drawer.jpg" );
        textureCounter.wrapS = THREE.RepeatWrapping;
        textureCounter.wrapT = THREE.RepeatWrapping;
        textureCounter.repeat.set( 4,1 );

        const textureTopCounter = new THREE.TextureLoader().load( "textures/top-counter.jpg" );
        textureTopCounter.wrapS = THREE.RepeatWrapping;
        textureTopCounter.wrapT = THREE.RepeatWrapping;
        textureTopCounter.repeat.set( 4,1 );


        this.topMaterial = new THREE.MeshPhongMaterial({
            specular: "#444444",
            emissive: "#101010",
            shininess: 10,
            map: textureTopCounter
        });

        this.bottomMaterial = new THREE.MeshPhongMaterial({
            specular: "#444444",
            emissive: "#000000",
            shininess: 50,
            map: textureCounter
        });

        this.frontMaterial = new THREE.MeshPhongMaterial({
            specular: "#444444",
            emissive: "#000000",
            shininess: 50,
            map: new THREE.TextureLoader().load('textures/oven-glass.png')
        })
        

        
    }

    buildCounter() {
        this.counterGroup = new THREE.Group();
        const counterGeometry = new THREE.BoxGeometry(
            this.counterWidth,
            this.counterHeight,
            this.counterThickness
        );

        const topCounterGeometry = new THREE.BoxGeometry(
            this.counterWidth ,
            this.counterHeight / 6,
            this.counterThickness
        );
        this.counter1 = new THREE.Mesh(counterGeometry, this.bottomMaterial);
        this.counter1.position.set(-5 + this.counterThickness/2, this.counterHeight/2, -5 + this.counterWidth/2);
        this.counter1.rotateY(Math.PI/2);

        this.topCounter1 = new THREE.Mesh(topCounterGeometry, this.topMaterial);
        this.topCounter1.position.set(-5 + this.counterThickness/2, this.counterHeight + this.counterHeight/12, -5 + this.counterWidth/2);
        this.topCounter1.rotateY(Math.PI/2);

        this.counter2 = new THREE.Mesh(counterGeometry, this.bottomMaterial);
        this.counter2.position.set(-5 + this.counterThickness/2, this.counterHeight/2, 5 - this.counterWidth/2);
        this.counter2.rotateY(Math.PI/2);

        this.topCounter2 = new THREE.Mesh(topCounterGeometry, this.topMaterial);
        this.topCounter2.position.set(-5 + this.counterThickness/2, this.counterHeight + this.counterHeight/12, 5 - this.counterWidth/2);
        this.topCounter2.rotateY(Math.PI/2);

        this.counterGroup.add(this.counter1);
        this.counterGroup.add(this.counter2);
        this.counterGroup.add(this.topCounter1);
        this.counterGroup.add(this.topCounter2);

        this.topCounter1.receiveShadow = true;
        this.topCounter1.castShadow = true;
        return this.counterGroup;
    }

    
}

export { MyCounter };
