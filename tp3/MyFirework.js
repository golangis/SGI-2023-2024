import * as THREE from 'three'

class MyFirework {

    constructor(app, scene) {
        this.app = app
        this.scene = scene

        this.done = false
        this.dest = []

        this.vertices = null
        this.colors = null
        this.geometry = null
        this.points = null


        this.material = new THREE.PointsMaterial({
            size: 0.1,
            color: 0x0f0fff,
            opacity: 1,
            vertexColors: true,
            transparent: true,
            depthTest: false,
        })

        this.height = 20
        this.speed = 60

        this.launch()

    }

    /**
     * compute particle launch
     */

    launch() {
        let numParticles = 1; // You can adjust the number of particles in the launch
        for (let i = 0; i < numParticles; i++) {
            let color = new THREE.Color();
            color.setHSL(THREE.MathUtils.randFloat(0, 1), 1, 0.9); // Random hue
            let colors = [color.r, color.g, color.b];

            let x = THREE.MathUtils.randFloat(-5, 5);
            let y = THREE.MathUtils.randFloat(this.height * 0.5, this.height * 2);
            let z = THREE.MathUtils.randFloat(-5, 5);
            this.dest.push(x, y, z);

            this.vertices = [0, 0, 0];

            this.geometry = new THREE.BufferGeometry();
            this.geometry.setAttribute('position', new THREE.BufferAttribute(new Float32Array(this.vertices), 3));
            this.geometry.setAttribute('color', new THREE.BufferAttribute(new Float32Array(colors), 3));

            this.points = new THREE.Points(this.geometry, this.material);
            this.points.castShadow = true;
            this.points.receiveShadow = true;

            this.app.scene.add(this.points);
        }

        console.log("firework launched");
    }

    /**
     * compute explosion
     * @param {*} vector 
     */
    explode(origin, n, rangeBegin, rangeEnd) {
        // Remove existing points from the scene
        this.app.scene.remove(this.points);

        // Reset arrays and variables
        this.dest = [];
        this.vertices = [];
        this.colors = [];

        // Create a new BufferGeometry
        this.geometry = new THREE.BufferGeometry();

        // Set the range for randomization
        let range = rangeEnd - rangeBegin;

        // Generate random points
        for (let i = 0; i < n; i++) {
            // Generate a random color
            let color = new THREE.Color();
            color.setHSL(THREE.MathUtils.randFloat(0.1, 0.9), 1, 0.9);
            this.colors.push(color.r, color.g, color.b);

            // Generate random offsets within the specified range
            let x_dif = getRandomOffset(range, rangeBegin);
            let y_dif = getRandomOffset(range, rangeBegin);
            let z_dif = getRandomOffset(range, rangeBegin);

            // Update vertices and destinations
            this.vertices.push(origin[0], origin[1], origin[2]);
            this.dest.push(origin[0] + x_dif, origin[1] + y_dif, origin[2] + z_dif);
        }

        // Set position and color attributes for the geometry
        this.geometry.setAttribute('position', new THREE.BufferAttribute(new Float32Array(this.vertices), 3));
        this.geometry.setAttribute('color', new THREE.BufferAttribute(new Float32Array(this.colors), 3));

        // Create new Points object with the updated geometry and material
        this.points = new THREE.Points(this.geometry, this.material);

        // Set shadow properties
        this.points.castShadow = true;
        this.points.receiveShadow = true;

        // Add the new points to the scene
        this.app.scene.add(this.points);

        // Function to get random offset within the specified range
        function getRandomOffset(range, rangeBegin) {
            let offset = THREE.MathUtils.randFloat(-range, range);
            return offset < 0 ? offset - rangeBegin : offset + rangeBegin;
        }

    }
    /**
     * cleanup
     */
    reset() {
        console.log("firework reseted")
        this.app.scene.remove(this.points)
        this.dest = []
        this.vertices = null
        this.colors = null
        this.geometry = null
        this.points = null
    }

    /**
     * update firework
     * @returns 
     */
    update() {

        // do only if objects exist
        if (this.points && this.geometry) {
            let verticesAtribute = this.geometry.getAttribute('position')
            let vertices = verticesAtribute.array
            let count = verticesAtribute.count

            // lerp particle positions 
            let j = 0
            for (let i = 0; i < vertices.length; i += 3) {
                vertices[i] += (this.dest[i] - vertices[i]) / this.speed
                vertices[i + 1] += (this.dest[i + 1] - vertices[i + 1]) / this.speed
                vertices[i + 2] += (this.dest[i + 2] - vertices[i + 2]) / this.speed
            }
            verticesAtribute.needsUpdate = true

            // only one particle?
            if (count === 1) {
                //is YY coordinate higher close to destination YY? 
                if (Math.ceil(vertices[1]) > (this.dest[1] * 0.95)) {
                    // add n particles departing from the location at (vertices[0], vertices[1], vertices[2])
                    this.explode(vertices, 80, this.height * 0.05, this.height * 0.8)
                    return
                }
            }

            // are there a lot of particles (aka already exploded)?
            if (count > 1) {
                // fade out exploded particles 
                this.material.opacity -= 0.05
                this.material.needsUpdate = true
            }

            // remove, reset and stop animating 
            if (this.material.opacity <= 0) {
                this.reset()
                this.done = true
                return
            }
        }
    }
}

export { MyFirework }