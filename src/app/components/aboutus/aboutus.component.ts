// import { Component,ElementRef,model,OnInit,ViewChild } from '@angular/core';
// import * as THREE from 'three';
// import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';
// import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';

// import { Router } from '@angular/router';

// @Component({
//   selector: 'app-aboutus',
//   standalone: true,
//   imports: [],
//   templateUrl: './aboutus.component.html',
//   styleUrl: './aboutus.component.css'
// })
// export class AboutusComponent implements OnInit {
//   @ViewChild('rendererContainer', { static: true }) rendererContainer!: ElementRef;

//   constructor() {}

//   ngOnInit(): void {
//     this.initThreeJS();
//   }

//   initThreeJS(): void {
//     // Scene, Camera, Renderer
//     const scene = new THREE.Scene();
//     const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
//     const renderer = new THREE.WebGLRenderer({ antialias: true });
//     renderer.setSize(window.innerWidth, window.innerHeight);
//     renderer.setPixelRatio(window.devicePixelRatio);
//     this.rendererContainer.nativeElement.appendChild(renderer.domElement);

     
//     scene.background = new THREE.Color(0xffffff);
//      // Add ambient light
//      const ambientLight = new THREE.AmbientLight(0x404040); // Soft white light
//      scene.add(ambientLight);
 
//      // Add directional light
//      const directionalLight = new THREE.DirectionalLight(0xffffff, 2.0); // White light with intensity of 1.0
//      directionalLight.position.set(7, 7, 5).normalize();
//      scene.add(directionalLight);
 
//      // Add hemisphere light
//      const hemisphereLight = new THREE.HemisphereLight(0xffffbb, 0x089820, 3); // Sky color, ground color, intensity
//      scene.add(hemisphereLight);
      
//     // Add Lighting
//     const light = new THREE.DirectionalLight(0xffffff, 3.5);
//     light.position.set(10, 10, 10);
//     scene.add(light);

//     // Load GLB model
//     const loader = new GLTFLoader();
//     loader.load('/assets/models/royal.glb', (gltf) => {
//       const model = gltf.scene as THREE.Group;
      
//       scene.add(gltf.scene);
  
//     });
  

//     // Camera position
//     camera.position.z = 5;

//     const controls = new OrbitControls(camera, renderer.domElement);
//     // Animation loop
//     const animate = () => {
//       requestAnimationFrame(animate);
//       renderer.render(scene, camera);
//     };

//     animate();
//   }
// }

import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import * as THREE from 'three';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';

@Component({
  selector: 'app-aboutus',
  standalone: true,
  imports: [],
  templateUrl: './aboutus.component.html',
  styleUrls: ['./aboutus.component.css']
})
export class AboutusComponent implements OnInit {
  @ViewChild('rendererContainer', { static: true }) rendererContainer!: ElementRef;

  constructor() {}

  ngOnInit(): void {
    this.initThreeJS();
  }

  initThreeJS(): void {
    // Scene, Camera, Renderer
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
    const renderer = new THREE.WebGLRenderer({ antialias: true });
    renderer.setSize(window.innerWidth / 2, window.innerHeight); // Adjust size to fit half of the screen
    renderer.setPixelRatio(window.devicePixelRatio);
    this.rendererContainer.nativeElement.appendChild(renderer.domElement);

    scene.background = new THREE.Color(0xffffff);

    // Add ambient light
    const ambientLight = new THREE.AmbientLight(0x404040); // Soft white light
    scene.add(ambientLight);

    // Add directional light
    const directionalLight = new THREE.DirectionalLight(0xffffff, 2.0); // White light with intensity of 2.0
    directionalLight.position.set(7, 7, 5).normalize();
    scene.add(directionalLight);

    // Add hemisphere light
    const hemisphereLight = new THREE.HemisphereLight(0xffffbb, 0x089820, 3); // Sky color, ground color, intensity
    scene.add(hemisphereLight);

    // Add additional directional light
    const light = new THREE.DirectionalLight(0xffffff, 3.5);
    light.position.set(10, 10, 10);
    scene.add(light);

    // Load GLB model
    const loader = new GLTFLoader();
    loader.load('/assets/models/royal.glb', (gltf) => {
      const model = gltf.scene as THREE.Group;

      // Position the model on the left side
      model.position.set(0, 0, 0); // Adjust this value based on your scene

      // Scale the model if needed
      model.scale.set(2.5,2.5,2.5); // Adjust scale as needed

      scene.add(model);
    });

    // Adjust the camera position for a better view
    camera.position.set(0, 1, 5); // Adjust camera position

    // Set up controls for rotating the model
    const controls = new OrbitControls(camera, renderer.domElement);
    controls.enableDamping = true; // Smooth controls
    controls.dampingFactor = 0.25; // Control damping
    controls.enableZoom = true; // Enable zooming

    // Animation loop
    const animate = () => {
      requestAnimationFrame(animate);
      controls.update(); // Update controls
      renderer.render(scene, camera);
    };

    animate();
  }
}

