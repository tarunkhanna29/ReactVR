// Auto-generated content.
// This file contains the boilerplate to set up your React app.
// If you want to modify your application, start in "index.vr.js"

// Auto-generated content.
import {VRInstance} from 'react-vr-web';
import {Module} from 'react-vr-web';
import * as THREE from 'three';

function init(bundle, parent, options) {
  const scene = new THREE.Scene();
  const cubeModule = new CubeModule();  
  const vr = new VRInstance(bundle, 'WelcomeToVR', parent, {
    // Add custom options here
	cursorVisibility: 'visible',
	nativeModules: [ cubeModule ],
	scene: scene,
    ...options,
  });
  
  const cube = new THREE.Mesh(
	new THREE.BoxGeometry(1, 1, 1),
	new THREE.MeshBasicMaterial()
  );
  cube.position.z = -4;
  scene.add(cube);
  
  cubeModule.init(cube);
  
  var textureLoader = new THREE.TextureLoader();
  textureLoader.load('../static_assets/chess-world.jpg', function(texture) {
	texture.mapping = THREE.UVmapping;
	scene.background = texture; //This background is behind the background set by Pano in index.vr.js
  });
  
  torusCamera = new THREE.CubeCamera(.1, 100, 256);
  torusCamera.renderTarget.texture.minFilter = THREE.LinearMipMapLinearFilter;
  scene.add(torusCamera);
  
  cubeCamera = new THREE.CubeCamera(.1, 100, 256);
  cubeCamera.renderTarget.texture.minFilter = THREE.LinearMipMapLinearFilter;
  scene.add(cubeCamera);
  
  materialTorus = new THREE.MeshBasicMaterial({
	  envMap: torusCamera.renderTarget.texture
  });
  materialCube = new THREE.MeshBasicMaterial({
	  envMap: cubeCamera.renderTarget.texture
  });
  
  torus = new THREE.Mesh(new THREE.TorusKnotBufferGeometry(2, .6, 100, 25), materialTorus);
  torus.position.z = -10;
  torus.position.x = 1;
  scene.add(torus);
  
  cubeMesh = new THREE.Mesh(new THREE.BoxGeometry(1, 1, 1), materialCube);
  cubeMesh.position.z = -4;
  scene.add(cubeMesh);
  
  renderFrame = 0;
  
    vr.render = function(timestamp) {
    const seconds = timestamp / 1000;
	cube.position.x = 0 + (1 * (Math.cos(seconds)));
	cube.position.y = 0.2 + (1 * Math.abs(Math.sin(seconds)));
	torus.rotation.x += 0.01;
	torus.rotation.y += 0.02;
	torus.visible = false;
	torusCamera.position.copy(torus.position);
	torusCamera.update(vr.player.renderer, scene);
	materialTorus.envMap = torusCamera.renderTarget.texture;
	torus.visible = true;
	
	cubeMesh.position.x = 0 + (1 * (Math.cos(seconds)));
	cubeMesh.position.y = 0.2 + (1 * Math.abs(Math.sin(seconds)));
	cubeMesh.position.y = 0.2 + (1 * Math.sin(seconds));
	cubeMesh.visible = false;
	cubeCamera.position.copy(cubeMesh.position);
	cubeCamera.update(vr.player.renderer, scene);
	materialCube.envMap = cubeCamera.renderTarget.texture;
	cubeMesh.visible = true;
  };
  
  // Begin the animation loop
  vr.start();
  return vr;
}

window.ReactVR = {init};

export default class CubeModule extends Module {
	constructor() {
		super('CubeModule');
	}
	init(cube) {
		this.cube = cube;
	}
	changeCubeColor(color) {
		this.cube.material.color = new THREE.Color(color);
	}
}