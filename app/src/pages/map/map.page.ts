import { Component } from '@angular/core';
import * as THREE from 'three';

import { CONSTANTS } from '../../constants/app.constants';

import { ResourcesLoader } from '../../services/resourcesLoader/resourcesLoader.service';

@Component({
	moduleId: module.id,
	templateUrl: './resources/map.page.html'
})
export class MapPage {

	private scene    : THREE.Scene     = null;
	private camera   : THREE.Camera    = null;
	private renderer : THREE.Renderer  = null;

	constructor(private resourceLoader : ResourcesLoader) { }

	ngOnInit() {
		this.scene = new THREE.Scene();
		this.camera = new THREE.PerspectiveCamera(
			CONSTANTS.CAMERA.FRUSTUM,
			CONSTANTS.CAMERA.ASPECT_RATIO,
			CONSTANTS.CAMERA.NEAR,
			CONSTANTS.CAMERA.FAR
		);
		this.renderer = new THREE.WebGLRenderer();
		this.renderer.setSize(window.innerWidth, window.innerHeight);

		// DANGEROUS
		document.getElementsByClassName('scene')[0].appendChild(this.renderer.domElement);

		this.resourceLoader.getImage('app/assets/img/map.png').then((image) => {
			
			let texture = new THREE.Texture();

			texture.image = image;
			texture.needsUpdate = true;

			let geometry = new THREE.PlaneGeometry(
				texture.image.naturalWidth, 
				texture.image.naturalHeight, 
			32);

			let material = new THREE.MeshBasicMaterial({
				map: texture,
				side: THREE.DoubleSide
			});

			let map = new THREE.Mesh(geometry, material);

			this.scene.add(map);
		});

		this.camera.position.z = 2200;

		let self = this;


		/*-- JavaScript injection --*/
		(function animate() {
			requestAnimationFrame(animate);
			self.renderer.render(self.scene, self.camera);
		})();
	}
}