import * as THREE from "three";

/**
    This class customizes the gui interface for the app
*/
class MyTable {
    constructor(length, width, height, material) {
        this.length = length || 3;
        this.width = width || 2;
        this.height = height || 1.5;
        this.material =
            material ||
            new THREE.MeshPhongMaterial({
                specular: "#111111",
                emissive: "#000000",
                shininess: 90,
                map: new THREE.TextureLoader().load('textures/wood-table.jpg')
                
            });

        if (this.width > this.length) {
            const a = this.width;
            this.width = this.length;
            this.length = a;
        }
    }

    buildTableGroup() {
        this.tableGroup = new THREE.Group();

        const tableTopGeometry = new THREE.BoxGeometry(
            this.length,
            this.width,
            0.2
        );
        const tableLegGeometry = new THREE.CylinderGeometry(
            0.1,
            0.1,
            this.height
        );

        this.tableTop = new THREE.Mesh(tableTopGeometry, this.material);
        this.tableLeg = new THREE.Mesh(tableLegGeometry, this.material);

        const legSpacing = this.length / Math.floor(this.length / 3);
        const legHeight = (this.height / 2);


        for (
            let i = -(this.length / 2);
            i <= this.length / 2;
            i += legSpacing
        ) {
            let instance1 = this.tableLeg.clone(),
                instance2 = this.tableLeg.clone();
            const posX = Math.floor(this.width / 2) - 0.2;

            instance1.position.set(i - Math.sign(i) * 0.2, posX, -legHeight);
            instance1.rotateX(-Math.PI / 2);

            instance2.position.set(i - Math.sign(i) * 0.2, -posX, -legHeight);
            instance2.rotateX(-Math.PI / 2);

            this.tableTop.add(instance1);
            this.tableTop.add(instance2);

        }

        this.tableGroup.rotateX(-Math.PI / 2);
        this.tableGroup.position.set(0, this.height, 0);

        this.tableGroup.add(this.tableTop);

        return this.tableGroup;
    }
}

export { MyTable };
