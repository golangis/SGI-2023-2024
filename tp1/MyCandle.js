import * as THREE from "three";

/**
    This class customizes the gui interface for the app
*/
class MyCandle {
    constructor(candleRadius, candleHeight, candleMaterial, flameMaterial, cakeHeight) {

        this.candleRadius = candleRadius || 0.01;
        this.candleHeight = candleHeight || 0.1;
        this.cakeHeight = cakeHeight || 0.35;

        this.candleMaterial = candleMaterial || new THREE.MeshBasicMaterial({ color: "#f5d20c" });
        this.flameMaterial = flameMaterial || new THREE.MeshBasicMaterial({ color: "#de7009" });
        
    }

    buildCandle() {

        // Create candle
        let candle = new THREE.CylinderGeometry(this.candleRadius, this.candleRadius, this.candleHeight);
        let candleMesh = new THREE.Mesh(candle, this.candleMaterial);
        candleMesh.position.set(0, this.candleHeight/2 + this.cakeHeight/2, 0);

        // Create Flame

        let flame = new THREE.ConeGeometry(this.candleRadius, 0.015);
        let flameMesh = new THREE.Mesh(flame, this.flameMaterial);
        flameMesh.position.set(0, this.candleHeight/2 + 0.015, 0);

        candleMesh.add(flameMesh);

        return candleMesh;
    }

    
}

export { MyCandle };
