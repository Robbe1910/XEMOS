import { Component } from '@angular/core';
import * as THREE from "three";
import {OBJLoader} from "three/examples/jsm/loaders/OBJLoader";
import {OrbitControls} from "three/examples/jsm/controls/OrbitControls";

@Component({
  selector: 'app-esp32',
  templateUrl: './esp32.component.html',
  styleUrls: ['./esp32.component.scss']
})
export class Esp32Component {
  constructor() {
    THREE.Cache.enabled = false;
    this.scene = new THREE.Scene();
    this.renderer = new THREE.WebGLRenderer();
  }

  scene: THREE.Scene;
  renderer: THREE.WebGLRenderer;

  ngOnInit(): void {
    this.createThreeJsBox(this.scene, this.renderer);

  }

  ngOnDestroy()
  {
    this.removeAllObjectsFromScene(this.scene);
    this.disposeScene(this.scene); // Liberar recursos de la escena

    this.renderer.dispose(); // Liberar recursos del renderizador
    this.renderer.forceContextLoss(); // Forzar la pérdida del contexto WebGL
  }

  private removeAllObjectsFromScene(scene: any) {
    while (scene.children.length > 0) {
      const child = scene.children[0];
      scene.remove(child);
    }
  }

  private disposeScene(scene: THREE.Scene) {
    scene.traverse((obj) => {
      if (obj instanceof THREE.Mesh) {
        // Liberar geometrías y materiales
        obj.geometry.dispose();
        if (obj.material instanceof THREE.Material) {
          obj.material.dispose();
        } else if (Array.isArray(obj.material)) {
          obj.material.forEach((material) => material.dispose());
        }
      }
    });
  }

  createThreeJsBox(scene: any, renderer: any): void {
    const canvas = document.getElementById('canvas-box');
    const loader = new OBJLoader();

    let object;

    loader.load(
      // resource URL
      'assets/models/esp.obj',
      // called when resource is loaded
      function ( object ) {
        object.scale.setScalar(0.01);
        object.rotation.x = -0.2;
        object.rotation.z = 0;
        object.rotation.y = 0;
        object.position.x = 0;
        object.position.y = 0.1;
        object.position.z = -0.2;

        scene.add( object );

        const axesHelper = new THREE.AxesHelper( 10 );
        //scene.add( axesHelper );

      },
      // called when loading is in progresses
      function ( xhr ) {

        //console.log( ( xhr.loaded / xhr.total * 100 ) + '% loaded' );

      },
      // called when loading has errors
      function ( error ) {

        //console.log( 'An error happened' );

      }
    );


    const ambientLight = new THREE.AmbientLight(0xffffff, 0.5);
    scene.add(ambientLight);

    const pointLight = new THREE.PointLight(0xffffff, 0.5);
    pointLight.position.x = 2;
    pointLight.position.y = 2;
    pointLight.position.z = 2;
    scene.add(pointLight);


    const camera = new THREE.PerspectiveCamera(
      15,
      4 / 4,
      0.001,
      1000
    );
    camera.position.z = 30;
    scene.add(camera);

    if (!canvas) {
      return;
    }

    renderer = new THREE.WebGLRenderer({
      canvas: canvas,
      alpha: true
    });
    renderer.setClearColor(0xe232222, 0);
    renderer.setSize( 4000, 4000, false);


    const controls = new OrbitControls( camera, renderer.domElement );

    var boundingBox = new THREE.Box3();

    // set camera to rotate around center of object

    controls.autoRotate = true
    controls.autoRotateSpeed = 0.4
    controls.update();


    const clock = new THREE.Clock();

    const animateGeometry = () => {
      const elapsedTime = clock.getElapsedTime();

      // Render
      renderer.render(scene, camera);

      // Call tick again on the next frame
      window.requestAnimationFrame(animateGeometry);
    };

    animate();

    function animate() {

      requestAnimationFrame( animate );

      // required if controls.enableDamping or controls.autoRotate are set to true
      controls.update();

      renderer.render( scene, camera );

    }

  }
}
