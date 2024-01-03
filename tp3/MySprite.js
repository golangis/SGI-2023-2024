import * as THREE from "three";


export class MySprite {
    constructor(charGiven) {
        // Chars ordered as in sprite sheet
        this.characters = ' !"#$%&\'()*+,-./0123456789:;<=>?@ABCDEFGHIJKLMNOPQRSTUVWXYZ[\]^_`abcdefghijklmnopqrstuvwxyz{|}~';
        this.charGiven = charGiven;
        // Some measures needed to grab the correct char
        this.charWidth = 102;
        this.charHeight = 102;
        this.numColumns = 10;
        const totalCharacters = 95;
        
        const charIndex = this.characters.indexOf(charGiven);


        // The used sprite sheet url
        this.spriteUrl = "textures/sprite_sheet.png";

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
console.log(charGeometry.attributes.uv.array)
        charGeometry.attributes.uv = new THREE.Float32BufferAttribute( [
            uMin, vMax, uMax, vMax, uMin, vMin, uMax, vMin
        ], 2);

        charGeometry.uvsNeedUpdate = true;

        this.mesh = new THREE.Mesh(charGeometry, charMaterial);

        // this.mesh.userData.char = this.characters[index];    
        return this.mesh

    }

}