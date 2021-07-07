import { OBJLoader } from 'three/examples/js/loaders/OBJLoader'
import { TweenLite } from "gsap/TweenMax";

export default class BackgroundParticles {

	constructor(app) {
    this.app = app;
    
    this.mouseX = 0
    this.mouseY = 0;
    this.angle = 0;
    this.radius = 500;
  
    this.windowHalfX = window.innerWidth / 2;
    this.windowHalfY = window.innerHeight / 2;
  
    this.SEPARATION = 10
    this.AMOUNTX = 95
    this.AMOUNTY = 106
    this.count;
  
    this.camera = new THREE.PerspectiveCamera(
      35,
      window.innerWidth / window.innerHeight,
      1,
      5000
    );
    this.camera.position.z = 950;
    this.camera.position.y = 1090;
    this.cameraZrot = { Zrot: this.camera.position.z };
  
    // scene
    this.scene = new THREE.Scene();
  
    this.animPropsForAll = [];
  
    // texture
    this.manager = new THREE.LoadingManager();
    this.manager.onProgress = function (item, loaded, total) {};
    this.manager1 = new THREE.LoadingManager();
    this.manager1.onProgress = function (item, loaded, total) {};
  
    // particles
    this.p_geom = new THREE.Geometry();
    this.p_geom.verticesNeedUpdate = true;
    this.p_geom.elementsNeedUpdate = true;
    this.p_geom.morphTargetsNeedUpdate = true;
    this.p_geom.uvsNeedUpdate = true;
    this.p_geom.normalsNeedUpdate = true;
    this.p_geom.colorsNeedUpdate = true;
    this.p_geom.tangentsNeedUpdate = true;
  
    this.p_material = new THREE.ParticleBasicMaterial({
      color: 0x045CFC,
      size: 3.5,
    });
  
    this.p = new THREE.ParticleSystem(this.p_geom, this.p_material);
  
    // model
    this.loader = new THREE.OBJLoader(this.manager);
    this.loader.load(
      "../src/img/s3.obj",
      (object) => {
        object.traverse((child) => {
          if (child instanceof THREE.Mesh) {
            let scale = 8;
            for (let i=0;i<child.geometry.attributes.position.array.length;i+=3){
                this.p_geom.vertices.push(new THREE.Vector3(child.geometry.attributes.position.array[i] * scale, child.geometry.attributes.position.array[i+1] * scale, child.geometry.attributes.position.array[i+2] * scale));
            }
          }
        });
        this.count = 0;
        this.scene.add(this.p);
      }
    );
  
    this.renderer = new THREE.WebGLRenderer({ alpha: true });
    this.renderer.setSize(window.innerWidth, window.innerHeight);
    this.renderer.setClearColor(0x000000, 0);
  
    document.querySelector(".particlehead").appendChild(this.renderer.domElement);
    document.querySelector(".particlehead").addEventListener("mousemove", this.onDocumentMouseMove.bind(this));
    window.addEventListener("resize", this.onWindowResize.bind(this));

    this.render();
    this.animate();
  }

  onWindowResize() {
    this.windowHalfX = window.innerWidth / 2;
    this.windowHalfY = window.innerHeight / 2;

    this.camera.aspect = window.innerWidth / window.innerHeight;
    this.camera.updateProjectionMatrix();

    this.renderer.setSize(window.innerWidth, window.innerHeight);
  }

  onDocumentMouseMove(event) {
    this.mouseX = (event.clientX - this.windowHalfX) / 2;
    this.mouseY = (event.clientY - this.windowHalfY) / 2;
  }

  animate () {
    TweenLite.ticker.addEventListener("tick",this.animate.bind(this), false, 100);

    this.render();
  };

  render () {
    // if (this.p_geom.vertices.length != 0) {
    //   this.p_geom.verticesNeedUpdate = true;
    // }
    // this.count += 0.1;
    // if (!this.loading) {
    //   this.camera.position.y += (-(this.mouseY * 0.5) - this.camera.position.y) * 0.09;

    //   this.camera.position.x = + this.radius * Math.cos(this.angle) + (this.mouseX * 0.05 - this.camera.position.x) * 0.05;
    //   this.camera.position.z = this.radius * Math.sin(this.angle)-300;
    //   this.angle += 0.001;
    // }

    this.camera.lookAt(this.scene.position);
    this.renderer.render(this.scene, this.camera);
  }
}