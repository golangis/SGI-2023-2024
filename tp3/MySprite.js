import * as THREE from "three";

export class MySprite {
    constructor(text) {
        // Chars ordered as in sprite sheet
        this.characters = ' !"#$%&`()*+,-./0123456789:;<=>?@ABCDEFGHIJKLMNOPQRSTUVWXYZ[/]^_`abcdefghijklmnopqrstuvwxyz{|}~';
        this.text = text;
        // Some measures needed to grab the correct char
        this.charWidth = 102;
        this.charHeight = 102;
        this.numColumns = 10;
        this.spacing = 0.01;

        const totalCharacters = 100;

        this.spriteUrl = "textures/sprite_sheet.png";

        const textGroup = new THREE.Group();

        for (let i = 0; i < text.length; i++) {
            const charGiven = text[i];
            const charIndex = this.characters.indexOf(charGiven);

            const column = charIndex % this.numColumns;
            const row = Math.floor(charIndex / this.numColumns);

            const charGeometry = new THREE.PlaneGeometry(this.charWidth / 2, this.charHeight / 2);

            const textureLoader = new THREE.TextureLoader();
            const spritesheetTexture = textureLoader.load(this.spriteUrl);
            const charMaterial = new THREE.MeshBasicMaterial({
                map: spritesheetTexture,
                transparent: true,
                depthWrite: false,
            });

            const uMin = column / this.numColumns;
            const uMax = (column + 1) / this.numColumns;
            const vMin = 1 - (row + 1) / (totalCharacters / this.numColumns);
            const vMax = 1 - row / (totalCharacters / this.numColumns);

            charGeometry.attributes.uv = new THREE.Float32BufferAttribute([
                uMin, vMax, uMax, vMax, uMin, vMin, uMax, vMin
            ], 2);

            charGeometry.uvsNeedUpdate = true;

            const mySprite = new THREE.Mesh(charGeometry, charMaterial);

            // Adjust the position of each character based on its index and spacing
            mySprite.position.x = i * (this.charWidth/2);

            textGroup.add(mySprite);
        }

        return textGroup;
    }
}
