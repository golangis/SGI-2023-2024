import { GUI } from "three/addons/libs/lil-gui.module.min.js";
import { MyApp } from "./MyApp.js";
import { MyContents } from "./MyContents.js";

/**
    This class customizes the gui interface for the app
*/
class MyGuiInterface {
	/**
	 *
	 * @param {MyApp} app The application object
	 */
	constructor(app) {
		this.app = app;
		this.datgui = new GUI();
		this.contents = null;
	}

	/**
	 * Set the contents object
	 * @param {MyContents} contents the contents objects
	 */
	setContents(contents) {
		this.contents = contents;
	}

	/**
	 * Initialize the gui interface
	 */
	init() {
		const cameraFolder = this.datgui.addFolder("Camera");
		cameraFolder
			.add(this.app, "activeCameraName", this.app.cameraKeys)
			.name("Active camera");
		cameraFolder.open();

		this.wireframeActivated = false;
		
		const wireframeFolder = this.datgui.addFolder("Wireframe");
		wireframeFolder.add(this, 'wireframeActivated').name('Activate Wireframes').onChange((value) => this.contents.activateWireframes(value));
		wireframeFolder.open();

		const lightFolder = this.datgui.addFolder('Control Lights')
		for (const light of this.contents.sceneBuilder.lights){
			lightFolder.add(light, 'visible').name(light.typeLight + '-' + light.name);
			lightFolder.addColor(light, 'color').name('Change color')
			
		}
	}
		


}

export { MyGuiInterface };
