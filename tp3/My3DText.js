import * as THREE from "three";
import { TextGeometry } from 'three/addons/geometries/TextGeometry.js';
import { FontLoader } from 'three/addons/loaders/FontLoader.js';

/**
 * 3D Text creation
 */
class My3DText {
    constructor(app, text_arg, material) {
        this.app = app;
        this.text_arg = text_arg;
        this.material = material ?? new THREE.MeshPhongMaterial({
            specular: "#FFFFFF",
            emissive: "#101010",
            shininess: 30,
            color: "#909090"
        });
        this.textGroup = new THREE.Group();

    }

    buildText() {
        let car1 = this.loadText(this.text_arg);
        return this.textGroup;
    }


    loadText(text_arg) {
        const text = text_arg
        const loader = new FontLoader();
        let geometryMesh = new THREE.Mesh(undefined, this.material);
        this.textMesh = new THREE.Object3D();


        loader.load('fonts/helvetiker_bold.typeface.json', function (font) {

            const geometry = new TextGeometry(text, {
                font: font,
                size: 1,
                height: 0.5,
                curveSegments: 12,
                bevelEnabled: true,
                bevelThickness: 0,
                bevelSize: 0,
                bevelOffset: 0,
                bevelSegments: 5
            });

            geometryMesh.geometry = geometry;
        });

        this.textGroup.add(geometryMesh);

        return geometryMesh;
    };

}

export { My3DText };
