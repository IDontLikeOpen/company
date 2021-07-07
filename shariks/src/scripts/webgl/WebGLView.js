import "three";
import { TweenLite } from "gsap/TweenMax";

import InteractiveControls from "./controls/InteractiveControls";
import Particles from "./particles/Particles";

const glslify = require("glslify");

export default class WebGLView {
  constructor(app) {
    this.app = app;

    this.samples = [
      "images/sample-01.png",
      "images/sample-02.png",
      "images/sample-03.png",
      "images/sample-04.png",
      "images/sample-05.png",
    ];

    this.samplesMobile = [
      "images/sample-01-mob.png",
      "images/sample-02-mob.png",
      "images/sample-03-mob.png",
      "images/sample-04.png",
      "images/sample-05-mob.png",
    ]

    this.initThree();
    this.initParticles();
    this.initControls();

    this.goto(0);
  }

  initThree() {
    // scene
    this.scene = new THREE.Scene();

    // camera
    window.innerWidth > window.innerHeight
      ? (this.camera = new THREE.PerspectiveCamera(
          50,
          window.innerWidth / 2 / window.innerHeight,
          1,
          10000
        ))
      : (this.camera = new THREE.PerspectiveCamera(
          50,
          window.innerWidth / (window.innerHeight - window.innerHeight * 0.6),
          1,
          10000
        ));
    this.camera.position.z = 300;

    // renderer
    this.renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });

    // clock
    this.clock = new THREE.Clock(true);
  }

  initControls() {
    this.interactive = new InteractiveControls(
      this.camera,
      this.renderer.domElement
    );
  }

  initParticles() {
    this.particles = new Particles(this);
    this.scene.add(this.particles.container);
  }

  // ---------------------------------------------------------------------------------------------
  // PUBLIC
  // ---------------------------------------------------------------------------------------------

  update() {
    const delta = this.clock.getDelta();

    if (this.particles) this.particles.update(delta);
  }

  draw() {
    this.renderer.render(this.scene, this.camera);
  }

  goto(index) {
    screen.width<850 ? this.samples = this.samplesMobile : ''
    // init next
    if (this.currSample == null) this.particles.init(this.samples[index]);
    // hide curr then init next
    else {
      this.particles.hide(true,index).then(() => {
        this.particles.init(this.samples[index]);
      });
    }
    this.currSample = index;
  }

  next(i = null) {
    if (i) {
      if(i!==this.currSample) this.goto(i); else return
    } else {
      if (this.currSample < this.samples.length - 1) {
        this.goto(this.currSample + 1);
      } else this.goto(0);
    }
  }

  prev() {
    if (this.currSample > 0) {
      this.goto(this.currSample - 1);
    } else this.goto(this.samples.length - 1);
  }

  // ---------------------------------------------------------------------------------------------
  // EVENT HANDLERS
  // ---------------------------------------------------------------------------------------------

  resize() {
    if (!this.renderer) return;
    window.innerWidth > window.innerHeight ? (this.camera.aspect = window.innerWidth / 2 / window.innerHeight)
      : (this.camera.aspect =
          window.innerWidth / (window.innerHeight - window.innerHeight * 0.6));
    this.camera.updateProjectionMatrix();

    this.fovHeight =
      2 *
      Math.tan((this.camera.fov * Math.PI) / 180 / 2) *
      this.camera.position.z;

    window.innerWidth > window.innerHeight
      ? this.renderer.setSize(window.innerWidth / 2, window.innerHeight)
      : this.renderer.setSize(
          window.innerWidth,
          window.innerHeight - window.innerHeight * 0.6
        );

    if (this.interactive) this.interactive.resize();
    if (this.particles) this.particles.resize();
  }
}
