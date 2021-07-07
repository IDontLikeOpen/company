import WebGLView from "./webgl/WebGLView";
import BackgroundParticles from "./background/BackgroundParticles";
import { TweenLite } from "gsap/TweenMax";
import { TweenMax } from "gsap/TweenMax";

export default class App {
  constructor() {}

  init() {
    this.initWebGL();
    this.addListeners();
    this.animate();
    this.resize();

    this.regmail = /^(([^<>()\[\]\\.,;:\s@{}"]{1,63}(\.[^<>()\[\]\\.,;:\s@"]{1,64})*)|(".{1,64}"))[^{}$%^&*()#.+=-]@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}]\.)|(([a-zA-Z0-9]+\.)+[a-zA-Z]{2,5}))$/;
    this.regname = /^[a-zA-Zа-яА-ЯЁё']*$|^[a-zA-Zа-яА-ЯЁё']+(?:\s[a-zA-Zа-яА-ЯЁё']+){1,}$/;
    this.regFirstChar = /^[a-zA-Z]*$/;
    this.valid = false;

    // document.querySelector("#WebGL-output") ? this.initKnot() : "";

    this.overlay = false;
    // mouse vars

    // this.cursor = document.querySelector(".cursor");
    // this.follower = document.querySelector(".cursor-follower");

    this.isMain = document.body.classList.contains("main");

    this.burger = document.querySelector(".burgerLeft");
    this.burgerTop = document
      .querySelector(".burgerLeft")
      .getBoundingClientRect().top;
    this.main = document.querySelector(".overlay .menu-top li:nth-child(2)");
    this.isMobile = screen.width < 920 ? true : false;

    if (!this.isMobile) {
      this.posX = 0;
      this.posY = 0;

      this.mouseX = 0;
      this.mouseY = 0;

      this.isMac = window.navigator.userAgent.includes("Macintosh") ? 900 : 50;
      this.isMac === 50 ? document.body.classList.add("Win") : "";

      this.slideshowOn = null;
      this.morphSlideshow = null;

      // MAIN PAGE
      if (this.isMain) {
        document
          .querySelector("svg.morph")
          .setAttribute("width", `${window.innerWidth}`);
        document
          .querySelector("svg.morph")
          .setAttribute("height", `${window.innerHeight}`);
        document
          .querySelector("svg.morph")
          .setAttribute(
            "viewBox",
            `0 0 ${window.innerWidth} ${window.innerHeight}`
          );
      }

      this.services = document.querySelector(".desk .services-drop");
      this.listServices = document.querySelector(".desk ul.services");
    } else {
      this.nowY = null;
      this.startY = 0;

      window.navigator.userAgent.includes("iPhone") &&
      screen.height === 736 &&
      screen.width === 414
        ? document.body.classList.add("isPlus")
        : "";
      window.navigator.userAgent.includes("iPhone")
        ? document.body.classList.add("iphone")
        : "";
      if (
        !window.navigator.userAgent.includes("iPhone") &&
        screen.height < 850 &&
        screen.width < 850
      ) {
        this.android = true;
        document.body.classList.add("androidPhone");
      }
      (screen.width === 375 && screen.height === 812) ||
      (screen.height === 375 &&
        screen.width === 812 &&
        window.navigator.userAgent.includes("iPhone"))
        ? document.body.classList.add("isX")
        : "";

      this.currentScrollPosition = 0;
      this.currentTouchPosition = screen.height;

      this.services = document.querySelector(".overlay .services-drop");
      this.listServices = document.querySelector(".overlay ul.services");
    }
    //

    // this.morphingHover = {
    //   targets: ".cursor-follower path",
    //   d: [
    //     {
    //       value:
    //         "M3 25C3 19.1652 5.31785 13.5695 9.44365 9.44365C13.5695 5.31785 19.1652 3 25 3C30.8348 3 36.4306 5.31785 40.5564 9.44365C44.6822 13.5695 47 19.1652 47 25C47 30.8348 44.6822 36.4306 40.5564 40.5564C36.4306 44.6822 30.8348 47 25 47C19.1652 47 13.5695 44.6822 9.44365 40.5564C5.31785 36.4306 3 30.8348 3 25Z",
    //     },
    //     {
    //       value:
    //         "M1.5 21C1.5 15.1652 2.11834 11.1696 6.24414 7.04375C10.3699 2.91795 16.6652 1 22.5 1C32.5 2.5 31.8742 5.8742 36 10C40.1258 14.1258 45.7441 17.209 45.7441 23.0438C45.7441 28.8785 39.2441 35.0438 37.7441 36.5438C33.6183 40.6696 29.5789 42.0438 23.7441 42.0438C17.9094 42.0438 12.6258 39.6258 8.5 35.5C4.3742 31.3742 2 28.5 1.5 21Z",
    //     },
    //     {
    //       value:
    //         "M1.99981 19.9436C1.99981 14.1089 -0.682773 11.5694 3.44303 7.44365C7.56883 3.31785 13.1646 1.44365 18.9994 1.44365C24.8341 1.44365 28.8736 3.31785 32.9994 7.44365C37.1252 11.5694 40.9994 14.1089 40.9994 19.9436C40.9994 25.7784 37.1252 29.3178 32.9994 33.4436C28.8736 37.5694 24.8341 41.9436 18.9994 41.9436C13.1646 41.9436 7.56883 39.6258 3.44303 35.5C-0.682773 31.3742 1.99981 25.7784 1.99981 19.9436Z",
    //     },
    //     {
    //       value:
    //         "M1.5 20C1.5 14.1652 3.87345 10.6258 7.99925 6.49997C12.125 2.37417 17.6652 1.49996 23.5 1.49996C29.3348 1.49996 32.4298 0.317823 36.5556 4.44362C40.6814 8.56942 39.5 14.1652 39.5 20C39.5 25.8347 38.6258 25.3742 34.5 29.5C30.3742 33.6258 25.8335 37.5 19.9988 37.5C14.164 37.5 11.1258 33.6258 7 29.5C2.8742 25.3742 1.5 25.8347 1.5 20Z",
    //     },
    //     {
    //       value:
    //         "M3 25C3 19.1652 5.31785 13.5695 9.44365 9.44365C13.5695 5.31785 19.1652 3 25 3C30.8348 3 36.4306 5.31785 40.5564 9.44365C44.6822 13.5695 47 19.1652 47 25C47 30.8348 44.6822 36.4306 40.5564 40.5564C36.4306 44.6822 30.8348 47 25 47C19.1652 47 13.5695 44.6822 9.44365 40.5564C5.31785 36.4306 3 30.8348 3 25Z",
    //     },
    //   ],
    //   easing: "easeOutQuad",
    //   duration: 5000,
    //   loop: true,
    // };

    // this.morphingOver = {
    //   targets: ".cursor-follower path",
    //   d: [
    //     {
    //       value:
    //         "M3 25C3 19.1652 5.31785 13.5695 9.44365 9.44365C13.5695 5.31785 19.1652 3 25 3C30.8348 3 36.4306 5.31785 40.5564 9.44365C44.6822 13.5695 47 19.1652 47 25C47 30.8348 44.6822 36.4306 40.5564 40.5564C36.4306 44.6822 30.8348 47 25 47C19.1652 47 13.5695 44.6822 9.44365 40.5564C5.31785 36.4306 3 30.8348 3 25Z",
    //     },
    //     {
    //       value:
    //         "M3 25C3 19.1652 5.31785 13.5695 9.44365 9.44365C13.5695 5.31785 19.1652 3 25 3C30.8348 3 36.4306 5.31785 40.5564 9.44365C44.6822 13.5695 47 19.1652 47 25C47 30.8348 44.6822 36.4306 40.5564 40.5564C36.4306 44.6822 30.8348 47 25 47C19.1652 47 13.5695 44.6822 9.44365 40.5564C5.31785 36.4306 3 30.8348 3 25Z",
    //     },
    //   ],
    //   easing: "easeOutQuad",
    //   duration: 5000,
    //   autoplay: false,
    //   loop: false,
    // };

    // this.shapeActive = [
    //   {
    //     value:
    //       "M3 25C3 19.1652 5.31785 13.5695 9.44365 9.44365C13.5695 5.31785 19.1652 3 25 3C30.8348 3 36.4306 5.31785 40.5564 9.44365C44.6822 13.5695 47 19.1652 47 25C47 30.8348 44.6822 36.4306 40.5564 40.5564C36.4306 44.6822 30.8348 47 25 47C19.1652 47 13.5695 44.6822 9.44365 40.5564C5.31785 36.4306 3 30.8348 3 25Z",
    //   },
    //   {
    //     value:
    //       "M1.5 21C1.5 15.1652 2.11834 11.1696 6.24414 7.04375C10.3699 2.91795 16.6652 1 22.5 1C32.5 2.5 31.8742 5.8742 36 10C40.1258 14.1258 45.7441 17.209 45.7441 23.0438C45.7441 28.8785 39.2441 35.0438 37.7441 36.5438C33.6183 40.6696 29.5789 42.0438 23.7441 42.0438C17.9094 42.0438 12.6258 39.6258 8.5 35.5C4.3742 31.3742 2 28.5 1.5 21Z",
    //   },
    //   {
    //     value:
    //       "M1.99981 19.9436C1.99981 14.1089 -0.682773 11.5694 3.44303 7.44365C7.56883 3.31785 13.1646 1.44365 18.9994 1.44365C24.8341 1.44365 28.8736 3.31785 32.9994 7.44365C37.1252 11.5694 40.9994 14.1089 40.9994 19.9436C40.9994 25.7784 37.1252 29.3178 32.9994 33.4436C28.8736 37.5694 24.8341 41.9436 18.9994 41.9436C13.1646 41.9436 7.56883 39.6258 3.44303 35.5C-0.682773 31.3742 1.99981 25.7784 1.99981 19.9436Z",
    //   },
    //   {
    //     value:
    //       "M1.5 20C1.5 14.1652 3.87345 10.6258 7.99925 6.49997C12.125 2.37417 17.6652 1.49996 23.5 1.49996C29.3348 1.49996 32.4298 0.317823 36.5556 4.44362C40.6814 8.56942 39.5 14.1652 39.5 20C39.5 25.8347 38.6258 25.3742 34.5 29.5C30.3742 33.6258 25.8335 37.5 19.9988 37.5C14.164 37.5 11.1258 33.6258 7 29.5C2.8742 25.3742 1.5 25.8347 1.5 20Z",
    //   },
    //   {
    //     value:
    //       "M3 25C3 19.1652 5.31785 13.5695 9.44365 9.44365C13.5695 5.31785 19.1652 3 25 3C30.8348 3 36.4306 5.31785 40.5564 9.44365C44.6822 13.5695 47 19.1652 47 25C47 30.8348 44.6822 36.4306 40.5564 40.5564C36.4306 44.6822 30.8348 47 25 47C19.1652 47 13.5695 44.6822 9.44365 40.5564C5.31785 36.4306 3 30.8348 3 25Z",
    //   },
    // ];

    // this.shapeInactive = [
    //   {
    //     value: document
    //       .querySelector(".cursor-follower path")
    //       .getAttribute("d"),
    //   },
    //   {
    //     value:
    //       "M3 25C3 19.1652 5.31785 13.5695 9.44365 9.44365C13.5695 5.31785 19.1652 3 25 3C30.8348 3 36.4306 5.31785 40.5564 9.44365C44.6822 13.5695 47 19.1652 47 25C47 30.8348 44.6822 36.4306 40.5564 40.5564C36.4306 44.6822 30.8348 47 25 47C19.1652 47 13.5695 44.6822 9.44365 40.5564C5.31785 36.4306 3 30.8348 3 25Z",
    //   },
    // ];

    // this.activeMorph = {
    //   targets: ".cursor-follower path",
    //   d: this.shapeInactive,
    //   easing: "easeOutQuad",
    //   duration: 2000,
    //   autoplay: false,
    //   loop: false,
    // };

    this.isMac === 900
      ? // this.morph = anime(this.activeMorph)
        ""
      : "";

    this.scrolling = false;
    this.height = this.isMobile ? screen.height : window.innerHeight;

    this.screens = document.querySelectorAll(".showcase").length;
    this.currentScreen = 0;
    this.timer = null;
    this.portfolio = document.querySelectorAll(".slideshow img");
    this.portfolioCurrent = 0;
    this.direction = "";
    // this.currTarget = null;
    this.servicesOpen = false;
    this.menu = false;
  }

  initWebGL() {
    this.webgl = new WebGLView(this);
    document
      .querySelector(".container")
      .appendChild(this.webgl.renderer.domElement);
  }

  initBcg() {
    this.bcg = new BackgroundParticles(this);
  }

  initKnot() {
    var scene = new THREE.Scene();

    // create a camera, which defines where we're looking at.
    var camera = new THREE.PerspectiveCamera(
      45,
      window.innerWidth / window.innerHeight,
      0.1,
      1000
    );

    // create a render and set the size
    var webGLRenderer = new THREE.WebGLRenderer();
    webGLRenderer.setClearColor(new THREE.Color(0xffffff, 1.0));
    webGLRenderer.setSize(window.innerWidth, window.innerHeight);
    webGLRenderer.shadowMapEnabled = true;

    // position and point the camera to the center of the scene
    camera.position.x = -30;
    camera.position.y = 40;
    camera.position.z = 130;
    camera.lookAt(new THREE.Vector3(10, 0, 0));

    // add the output of the renderer to the html element
    document
      .querySelector("#WebGL-output")
      .appendChild(webGLRenderer.domElement);

    // call the render function
    var step = 0;

    var knot;

    // setup the control gui
    var controls = new (function () {
      // we need the first child, since it's a multimaterial
      this.radius = 60;
      this.tube = 28.2;
      this.radialSegments = 500;
      this.tubularSegments = 10;
      this.p = 5;
      this.q = 4;
      this.heightScale = 4;
      this.asParticles = true;
      this.rotate = true;

      this.redraw = function () {
        // remove the old plane
        if (knot) scene.remove(knot);
        // create a new one
        var geom = new THREE.TorusKnotGeometry(
          controls.radius,
          controls.tube,
          Math.round(controls.radialSegments),
          Math.round(controls.tubularSegments),
          Math.round(controls.p),
          Math.round(controls.q),
          controls.heightScale
        );

        if (controls.asParticles) {
          knot = createParticleSystem(geom);
        } else {
          knot = createMesh(geom);
        }

        // add it to the scene.
        scene.add(knot);
      };
    })();

    controls.redraw();

    render();

    // from THREE.js examples
    function generateSprite() {
      var canvas = document.createElement("canvas");
      canvas.width = 16;
      canvas.height = 16;

      var context = canvas.getContext("2d");
      var gradient = context.createRadialGradient(
        canvas.width / 2,
        canvas.height / 2,
        0,
        canvas.width / 2,
        canvas.height / 2,
        canvas.width / 2
      );
      gradient.addColorStop(0, "rgba(4,92,252,1)");
      gradient.addColorStop(0.2, "rgba(37,112,252,1)");
      gradient.addColorStop(0.4, "rgba(112,159,250,1)");
      gradient.addColorStop(1, "rgba(145,179,250,0.1)");

      context.fillStyle = gradient;
      context.fillRect(0, 0, canvas.width, canvas.height);

      var texture = new THREE.Texture(canvas);
      texture.needsUpdate = true;
      return texture;
    }

    function createParticleSystem(geom) {
      var material = new THREE.ParticleBasicMaterial({
        color: 0xffffff,
        size: 3,
        transparent: true,
        // blending: THREE.AdditiveBlending,
        map: generateSprite(),
      });

      var system = new THREE.ParticleSystem(geom, material);
      system.sortParticles = true;
      return system;
    }

    function createMesh(geom) {
      // assign two materials
      var meshMaterial = new THREE.MeshNormalMaterial({});
      meshMaterial.side = THREE.DoubleSide;

      // create a multimaterial
      var mesh = THREE.SceneUtils.createMultiMaterialObject(geom, [
        meshMaterial,
      ]);

      return mesh;
    }

    function render() {
      // if (controls.rotate) {
      knot.rotation.x = step += 0.001;
      // }

      // render using requestAnimationFrame
      requestAnimationFrame(render);
      webGLRenderer.render(scene, camera);
    }
  }

  addListeners() {
    this.handlerAnimate = this.animate.bind(this);
    window.addEventListener("resize", this.resize.bind(this));

    if (screen.width > 850) {
      window.addEventListener("mousemove", this.mouseMove.bind(this));
      if (document.body.classList.contains("main")) {
        window.addEventListener("wheel", e => {
          if (this.servicesOpen) {
            this.deactivateServices();
          }
          if (!this.scrolling) {
            if (
              (e.deltaY > 0 && this.currentScreen + 1 === this.screens) ||
              (e.deltaY < 0 && this.currentScreen - 1 === -1)
            ) {
              return;
            } else {
              e.deltaY < 0 ? (this.direction = "Top") : (this.direction = "");
              this.scrolling = true;
              document
                .querySelector(".pagination span.curr-page")
                .classList.add("invisible");
              document.querySelectorAll(`.reveal, .revealTop`).forEach(el => {
                if (
                  el.classList.contains(`reveal`) ||
                  el.classList.contains(`revealTop`)
                ) {
                  el.classList.contains(`reveal`)
                    ? el.classList.remove(`reveal`)
                    : "";
                  el.classList.contains(`revealTop`)
                    ? el.classList.remove(`revealTop`)
                    : "";
                  el.classList.add(`unreveal${this.direction}`);
                }
              });
              document.body.classList.add("stop-scroll");
              console.log(this.currentScreen !== 3);
              if (this.currentScreen !== 3) {
                console.log("here");
                e.deltaY > 0 ? this.webgl.next() : this.webgl.prev();
              }
              setTimeout(() => {
                this.currentScreen += e.deltaY > 0 ? 1 : -1;
                document
                  .querySelector(`.showcase.visible`)
                  .classList.remove("visible");
                document
                  .querySelector(`.container${this.currentScreen + 1}`)
                  .classList.add("visible");
                document.body.classList.remove("stop-scroll");
                this.scrolling = false;
                document
                  .querySelectorAll(
                    `.container${this.currentScreen + 1} h2, .container${
                      this.currentScreen + 1
                    } p, .container${
                      this.currentScreen + 1
                    } button, .container${
                      this.currentScreen + 1
                    } .ux-name, .container${
                      this.currentScreen + 1
                    } .ux-content, .container${
                      this.currentScreen + 1
                    } .contact-form`
                  )
                  .forEach(el => {
                    el.classList.contains("unreveal")
                      ? el.classList.remove("unreveal")
                      : "";
                    el.classList.contains("unrevealTop")
                      ? el.classList.remove("unrevealTop")
                      : "";
                    el.classList.add(`reveal${this.direction}`);
                  });
                document
                  .querySelector(".pagination span.curr-page")
                  .classList.remove("invisible");
                document.querySelector(".pagination span.curr-page").innerHTML =
                  this.currentScreen + 1;
                if (this.currentScreen == 3 && this.timer == null) {
                  this.slideshowOn = TweenMax.to(
                    document.querySelector(".morph-path"),
                    0.016,
                    {
                      repeat: -1,
                      onRepeat: () => {
                        this.posX += (this.mouseX - this.posX) / 12;
                        this.posY += (this.mouseY - this.posY) / 12;

                        TweenMax.set(document.querySelector(".morph-path"), {
                          css: {
                            x: this.posX,
                            y: this.posY,
                            scale: 5,
                          },
                        });
                      },
                    }
                  );
                  this.morphSlideshow = anime({
                    targets: ".morph .morph-path",
                    d: [
                      {
                        value:
                          "M 36.714 24 C 39.571 24.905 41.809 26.429 43.429 28.571 C 45.048 30.667 45.857 33.262 45.857 36.357 C 45.857 40.738 44.143 44.119 40.714 46.5 C 37.333 48.833 32.381 50 25.857 50 L 0 50 L 0 0 L 24.429 0 C 30.524 0 35.191 1.167 38.429 3.5 C 41.714 5.833 43.357 9 43.357 13 C 43.357 15.429 42.762 17.595 41.571 19.5 C 40.429 21.405 38.809 22.905 36.714 24 Z M 11.5 8.714 L 11.5 20.5 L 23 20.5 C 25.857 20.5 28.024 20 29.5 19 C 30.976 18 31.714 16.524 31.714 14.571 C 31.714 12.619 30.976 11.167 29.5 10.214 C 28.024 9.214 25.857 8.714 23 8.714 L 11.5 8.714 Z M 25 41.286 C 28.048 41.286 30.333 40.786 31.857 39.786 C 33.429 38.786 34.214 37.238 34.214 35.143 C 34.214 31 31.143 28.929 25 28.929 L 11.5 28.929 L 11.5 41.286 L 25 41.286 Z",
                      },
                      {
                        value:
                          "M 36.714 25 C 39.571 25.905 41.809 27.429 43.429 29.571 C 45.048 31.667 42 33.905 42 37 C 42 41.381 44.143 45.119 40.714 47.5 C 37.333 49.833 32.524 49 26 49 L 0 51 L 0 1 L 27 0 C 33.095 0 32.762 4.667 36 7 C 39.286 9.333 43.357 10 43.357 14 C 43.357 16.429 40.691 18.095 39.5 20 C 38.357 21.905 38.809 23.905 36.714 25 Z M 11.5 9.714 L 11.5 21.5 L 23 21.5 C 25.857 21.5 28.024 21 29.5 20 C 30.976 19 31.714 17.524 31.714 15.571 C 31.714 13.619 30.976 12.167 29.5 11.214 C 28.024 10.214 25.857 9.714 23 9.714 L 11.5 9.714 Z M 25 42.286 C 28.048 42.286 30.333 41.786 31.857 40.786 C 33.429 39.786 34.214 38.238 34.214 36.143 C 34.214 32 31.143 29.929 25 29.929 L 11.5 29.929 L 11.5 42.286 L 25 42.286 Z",
                      },
                      {
                        value:
                          "M 36.714 26 C 39.571 26.905 43.381 26.357 45 28.5 C 46.619 30.595 49.5 32.405 49.5 35.5 C 49.5 39.881 47.429 44.119 44 46.5 C 40.619 48.833 32.381 52 25.857 52 L 0 52 L 0 2 L 23.5 2 C 29.595 2 35.262 -0.333 38.5 2 C 41.786 4.333 45 8.214 45 12.214 C 45 14.643 43.691 17.595 42.5 19.5 C 41.357 21.405 38.809 24.905 36.714 26 Z M 11.5 10.714 L 11.5 22.5 L 23 22.5 C 25.857 22.5 28.024 22 29.5 21 C 30.976 20 35 16.5 34.5 14 C 34 11.5 32 11 30 11 C 27.443 11 25.857 10.714 23 10.714 L 11.5 10.714 Z M 25 43.286 C 28.048 43.286 30.333 42.786 31.857 41.786 C 33.429 40.786 38.5 37.595 38.5 35.5 C 38.5 31.357 31.143 30.928 25 30.928 L 11.5 30.928 L 11.5 43.286 L 25 43.286 Z",
                      },
                      {
                        value:
                          "M 38.5 22 C 41.357 22.905 44.381 24.857 46 27 C 47.5 29 49.5 31.905 49.5 35 C 49.5 39.381 47.429 43.619 44 46 C 40.619 48.333 32.381 51.5 25.857 51.5 L 0 51.5 L 0 1.5 L 23.5 1.5 C 29.595 1.5 35.262 -0.833 38.5 1.5 C 41.786 3.833 45 7.714 45 11.714 C 45 14.143 43.691 17.095 42.5 19 C 41.357 20.905 40.595 20.905 38.5 22 Z M 11.5 10.214 L 11.5 22 L 23.5 20.5 C 26.5 20 28.524 18.463 30 17.463 C 31.476 16.463 35 16 34.5 13.5 C 34 11 32 10.5 30 10.5 C 27.443 10.5 25.857 10.214 23 10.214 L 11.5 10.214 Z M 25 42.786 C 28.048 42.786 32.976 40 34.5 39 C 36.071 38 38.5 34.595 38.5 32.5 C 38.5 28.357 32 28 25.857 28 L 11.5 30.428 L 11.5 42.786 L 25 42.786 Z",
                      },
                      {
                        value:
                          "M 39 30 C 41.857 30.905 44.881 32.857 46.5 35 C 48 37 50 39.905 50 43 C 50 47.381 47.929 51.619 44.5 54 C 41.119 56.334 32.881 59.5 26.357 59.5 L 0.5 59.5 L 8.5 1.5 L 32 1.5 C 38.095 1.5 43.762 -0.833 47 1.5 C 50.286 3.833 45.5 15.714 45.5 19.714 C 45.5 22.143 44.191 25.095 43 27 C 41.857 28.905 41.095 28.905 39 30 Z M 20 10.5 L 12 30 L 24 28.5 C 27 28 29.024 26.463 30.5 25.463 C 31.976 24.463 33.5 23.463 35 21.5 C 36.5 19.537 40.5 11.963 38.5 10.5 C 36.436 8.991 33 8.712 30 9.463 L 20 10.5 Z M 25.5 50.786 C 32 50.5 36 46 37.5 44.463 C 39 42.5 39 40.524 39 38.429 C 39 34.286 31.643 34 26 35.5 L 12 38.429 L 12 50.786 L 25.5 50.786 Z",
                      },
                      {
                        value:
                          "M 36.714 24 C 39.571 24.905 41.809 26.429 43.429 28.571 C 45.048 30.667 45.857 33.262 45.857 36.357 C 45.857 40.738 44.143 44.119 40.714 46.5 C 37.333 48.833 32.381 50 25.857 50 L 0 50 L 0 0 L 24.429 0 C 30.524 0 35.191 1.167 38.429 3.5 C 41.714 5.833 43.357 9 43.357 13 C 43.357 15.429 42.762 17.595 41.571 19.5 C 40.429 21.405 38.809 22.905 36.714 24 Z M 11.5 8.714 L 11.5 20.5 L 23 20.5 C 25.857 20.5 28.024 20 29.5 19 C 30.976 18 31.714 16.524 31.714 14.571 C 31.714 12.619 30.976 11.167 29.5 10.214 C 28.024 9.214 25.857 8.714 23 8.714 L 11.5 8.714 Z M 25 41.286 C 28.048 41.286 30.333 40.786 31.857 39.786 C 33.429 38.786 34.214 37.238 34.214 35.143 C 34.214 31 31.143 28.929 25 28.929 L 11.5 28.929 L 11.5 41.286 L 25 41.286 Z",
                      },
                    ],
                    easing: "easeOutQuad",
                    duration: 8000,
                    direction: "alternate",
                    loop: true,
                  });
                  this.slideshow();
                } else if (this.timer !== null && this.currentScreen !== 3) {
                  TweenMax.killAll();
                  anime.remove(".morph .morph-path");
                  this.morphSlideshow.pause();
                  this.morphSlideshow.remove();
                  this.morphSlideshow = null;

                  let locOpacity = 0.5;
                  TweenLite.to(document.body, 0.15, {
                    onUpdate: () => {
                      locOpacity += 0.08;
                      document.body.style.background = `auto`;
                    },
                  });
                  TweenLite.to(document.body, 0.15, {
                    delay: 0.15,
                    onUpdate: () => {
                      clearInterval(this.timer);
                      this.timer = null;
                      if (
                        document
                          .querySelector(".slideshow")
                          .classList.contains("visible")
                      ) {
                        document
                          .querySelector(".slideshow")
                          .classList.remove("visible");
                        document
                          .querySelector(".slideshow")
                          .classList.add("invisible");
                      }
                      document.body.style.background = `auto`;
                    },
                  });
                  setTimeout(() => {
                    e.deltaY > 0 ? this.webgl.next() : this.webgl.prev();
                  }, 50);
                }
              }, 1200);
            }
          } else {
            return;
          }
        });
      } else if (document.body.classList.contains("about-us")) {
        window.addEventListener("wheel", e => {
          // this.webgl.next(3);
          // setTimeout(() => {
          //   !this.bcg ? this.initBcg() : ''
          // }, 3000);
        });
      }

      // document
      //   .querySelectorAll("a, button, .menu-top .desk ul.services li")
      //   .forEach(el => {
      //     el.addEventListener("mouseenter", this.mouseEnter.bind(this));
      //     el.addEventListener("mouseleave", this.mouseLeave.bind(this));
      //   });

      document.querySelectorAll("button").forEach(el => {
        el.addEventListener("click", e => {
          e.stopPropagation();
          if (!el.classList.contains("active")) {
            !el.classList.contains("active") ? el.classList.add("active") : "";
            setTimeout(() => {
              el.classList.contains("active")
                ? el.classList.remove("active")
                : "";
            }, 1000);
          }
        });
      });

      // if (!window.navigator.userAgent.includes("Macintosh")) {
      //   TweenMax.to(document.querySelector(".cursor-follower"), 0.016, {
      //     repeat: -1,
      //     onRepeat: () => {
      //       this.posX += (this.mouseX - this.posX) / 9;
      //       this.posY += (this.mouseY - this.posY) / 9;

      //       TweenMax.set(document.querySelector(".cursor-follower"), {
      //         css: {
      //           left: this.posX,
      //           top: this.posY,
      //         },
      //       });

      //       TweenMax.set(document.querySelector(".cursor"), {
      //         css: {
      //           left: this.mouseX,
      //           top: this.mouseY,
      //         },
      //       });
      //     },
      //   });
      // }

      document
        .querySelector(".desk .services-drop")
        .addEventListener("mouseenter", this.unrollServices.bind(this));

      window.addEventListener("click", e => {
        if (this.servicesOpen) {
          this.deactivateServices();
        }
        document.querySelector(".overlay_get-in-touch.active")
          ? document
              .querySelector(".overlay_get-in-touch.active")
              .classList.remove("active")
          : "";
        document.querySelector(".some.rollDown")
          ? document
              .querySelector(".some.rollDown")
              .classList.remove("rollDown")
          : "";
        document.querySelectorAll("button").forEach(el => {
          el.classList.contains("active") ? el.classList.remove("active") : "";
        });
      });

      document
        .querySelectorAll(".menu-top .desk ul.services li")
        .forEach(el => el.addEventListener("click", this.no.bind(this)));
      document
        .querySelector(".overlay_bcg")
        .addEventListener("click", this.no.bind(this));
    } else {
      window.orientation === 90 || window.orientation === -90
        ? document.body.classList.add("rotated")
        : "";
      window.addEventListener("orientationchange", () => {
        if (
          document.body.classList.contains("rotated") &&
          !(window.orientation === 90 || window.orientation === -90)
        ) {
          document.body.classList.remove("rotated");
        } else {
          document.body.classList.add("rotated");
          if (document.body.classList.contains("android")) {
            document.body.classList.remove("android");
            document.querySelectorAll("input").forEach(el => el.blur());
            document.body.classList.remove("stop-scroll");
          }
        }
      });
      if (document.body.classList.contains("main")) {
        document.addEventListener(
          "touchmove",
          e => this.ScrollMobile(e),
          false
        );
        document.addEventListener(
          "touchstart",
          e => this.ScrollStart(e),
          false
        );
      }

      // document.querySelector(".overlay").addEventListener("touchmove", () => {
      //   console.log(document.querySelector(".overlay .menu-top").getBoundingClientRect().height < screen.height - this.burger.getBoundingClientRect().height, ' 1');
      //   console.log(screen.height - document.querySelector(".overlay .menu-top").getBoundingClientRect().height, ' 2');
      //   console.log(document.querySelector(".overlay .menu-top").getBoundingClientRect().height, ' 3');
      //   if (
      //     document.querySelector(".overlay .menu-top").getBoundingClientRect()
      //       .height <
      //     screen.height - this.burger.getBoundingClientRect().height
      //   )
      //     return;
      //   // console.log(this.main.getBoundingClientRect().top, " main");
      //   // console.log(this.burgerTop, " burg");
      //   console.log(this.main.getBoundingClientRect().top - this.burgerTop,' ',this.main.getBoundingClientRect().top - this.burgerTop < 20);
      //   if ( this.main.getBoundingClientRect().top - this.burgerTop < 20 ) {
      //     !this.burger.classList.contains('invisible') ? this.burger.classList.add('invisible') : ''
      //     this.burger.classList.contains('visible') ? this.burger.classList.remove('visible') : ''
      //     setTimeout(() => {
      //       !this.burger.classList.contains('none') && (this.main.getBoundingClientRect().top - this.burgerTop < 20)? this.burger.classList.add('none') : ''
      //     }, 300);
      //   } else {
      //     this.burger.classList.contains('none') ? this.burger.classList.remove('none') : ''
      //     this.burger.classList.contains('invisible') ? this.burger.classList.remove('invisible') : ''
      //     !this.burger.classList.contains('visible') ? this.burger.classList.add('visible') : ''
      //   }
      // });

      document
        .querySelector(".burger")
        .addEventListener("click", this.unrollBurger.bind(this));

      document
        .querySelector(".overlay .services-drop")
        .addEventListener("click", this.unrollServices.bind(this));

      window.addEventListener("touchstart", e => {
        if (this.menu) {
          if (this.servicesOpen) {
            this.deactivateServices();
          }
          document.querySelector(".plate").classList.remove("active");
          setTimeout(() => {
            document.querySelector(".overlay").classList.add("invisible");
          }, 100);
          document.querySelector(".overlay").classList.contains("rollDown")
            ? document.querySelector(".overlay").classList.remove("rollDown")
            : "";
          document.querySelector(".overlay").classList.add("rollUp");
          this.menu = false;
        }
      });

      document
        .querySelectorAll(".overlay .menu-top li, .overlay, .burger")
        .forEach(el => el.addEventListener("touchstart", this.no.bind(this)));

      document.querySelectorAll("input").forEach(el =>
        el.addEventListener("focus", () => {
          if (!document.body.classList.contains("rotated")) {
            document.body.classList.add("android");
            document.body.classList.add("stop-scroll");
          }
        })
      );

      document.querySelectorAll("input").forEach(el =>
        el.addEventListener("blur", () => {
          this.refreshCSS();
          if (!document.body.classList.contains("rotated")) {
            document.body.classList.remove("android");
            document.body.classList.remove("stop-scroll");
          }
        })
      );

      document.querySelectorAll("button").forEach(el => {
        el.addEventListener("touchstart", e => {
          e.stopPropagation();
          el.addEventListener("click", e => {
            e.stopPropagation();
            if (!el.classList.contains("active")) {
              !el.classList.contains("active")
                ? el.classList.add("active")
                : "";
              setTimeout(() => {
                el.classList.contains("active")
                  ? el.classList.remove("active")
                  : "";
              }, 1000);
            }
          });
        });
      });
    }

    document.querySelectorAll("input[name='name']").forEach(el =>
      el.addEventListener("change", e => {
        console.log(el.parentElement.previousElementSibling);
        if (
          (el.value !== "" && el.value.trim() === "") ||
          (el.value !== "" &&
            (el.value.trim().length > 30 || el.value.trim().length < 2))
        ) {
          this.valid = false;
          this.setErrMessage(
            el,
            "Your input must be between 2 and 30 characters"
          );
        } else if (el.value !== "" && !this.regname.test(el.value.trim())) {
          this.valid = false;
          this.setErrMessage(el, "Your input is invalid. Check please");
        } else {
          this.valid = true;
          this.setErrMessage(el,'')
        }
      })
    );

    document.querySelectorAll("input[name='email']").forEach(el =>
      el.addEventListener("change", () => {
        if (
          (el.value !== "" && el.value.trim() === "") ||
          (el.value !== "" && el.value.trim().length < 5)
        ) {
          this.valid = false;
        } else if (
          el.value !== "" &&
          (!this.regmail.test(el.value.trim()) ||
            this.regCyr.test(el.value.trim()) ||
            el.value.trim().includes("-@") ||
            !this.regFirstChar.test(el.value.trim()[0]))
        ) {
          this.setErrMessage(el, "Your input is invalid. Check please");
          this.valid = false;
        } else {
          this.valid = true;
          this.setErrMessage(el,'')
        }
      })
    );

    document.querySelectorAll("input[name='mess']").forEach(el =>
      el.addEventListener("change", () => {
        if (
          (el.value !== "" && el.value.trim() === "") ||
          (el.value !== "" &&
            (el.value.trim().length > 1000 || el.value.trim().length < 2))
        ) {
          this.valid = false;

          this.setErrMessage(
            el,
            "Your input must be between 2 and 1000 characters"
          );
        } else {
          this.valid = true;
          this.setErrMessage(el,'')
        }
      })
    );

document.querySelectorAll('.sender').forEach(el=>el.addEventListener('click',()=>{
}))

    document
      .querySelector(".container1 button")
      .addEventListener("click", this.getInTouch.bind(this));

    document.querySelector("header button").addEventListener("click", () => {
      console.log("here");
      this.overlay = true;
      document.querySelector(".overlay_get-in-touch").classList.add("active");
      !document.body.classList.contains("stop-scroll")
        ? document.body.classList.add("stop-scroll")
        : "";
    });

    document.querySelector(".cross").addEventListener("click", () => {
      this.overlay = false;
      document
        .querySelector(".overlay_get-in-touch")
        .classList.remove("active");
      document.body.classList.remove("stop-scroll");
    });

    const el = this.webgl.renderer.domElement;
  }

  animate() {
    this.update();
    this.draw();
    this.raf = requestAnimationFrame(this.handlerAnimate);
  }

  // ---------------------------------------------------------------------------------------------
  // PUBLIC
  // ---------------------------------------------------------------------------------------------

  update() {
    if (this.webgl) this.webgl.update();
  }

  draw() {
    if (this.webgl) this.webgl.draw();
  }

  // ---------------------------------------------------------------------------------------------
  // EVENT HANDLERS
  // ---------------------------------------------------------------------------------------------

  resize() {
    if (this.webgl) {
      this.webgl.resize();
    }
    // window.innerWidth > 850 ? this.refreshCSS() : "";
  }

  no(e) {
    e.stopPropagation();
  }

  setErrMessage(el, mess) {
    el.parentElement.previousElementSibling.innerHTML = mess;
  }

  slideshow(e) {
    if (!document.querySelector(".slideshow").classList.contains("visible")) {
      document.querySelector(".slideshow").classList.contains("invisible")
        ? document.querySelector(".slideshow").classList.remove("invisible")
        : "";
      document.querySelector(".slideshow").classList.add("visible");
    }
    this.timer = setInterval(() => {
      let opacity = 0;
      this.portfolio.forEach(el => (el.style.opacity = 0));
      TweenLite.to(document.querySelector("main"), 1, {
        onUpdate: () => {
          opacity < 1 ? (opacity += 0.09) : "";
          this.portfolio[this.portfolioCurrent].style.opacity = opacity;
        },
      });
      TweenLite.to(document.querySelector("main"), 0.5, {
        delay: 4,
        onUpdate: () => {
          opacity > 0 ? (opacity -= 0.05) : "";
          this.portfolio[this.portfolioCurrent].style.opacity = opacity;
        },
      });

      this.portfolioCurrent === this.portfolio.length - 1
        ? (this.portfolioCurrent = 0)
        : this.portfolioCurrent++;
    }, 4500);
  }

  ScrollStart(e) {
    if (this.menu || this.overlay) return;
    this.currentScrollPosition = e.touches[0].clientY;
    this.startY = e.touches[0].clientY;
    if (e.touches[0].clientX < screen.width / 2 && this.servicesOpen) {
      this.deactivateServices();
    }
  }

  ScrollMobile(e) {
    if (this.menu || this.overlay) return;
    this.nowY = e.touches[0].clientY;
    if (this.scrolling) {
      return;
    } else if (
      (this.startY > this.nowY && this.currentScreen + 1 === this.screens) ||
      (this.startY < this.nowY && this.currentScreen - 1 === -1) ||
      this.startY === this.nowY
    ) {
      return;
    } else {
      let direction = this.startY > this.nowY ? 1 : -1;
      this.startY > this.nowY
        ? (this.direction = "Top")
        : (this.direction = "");
      document.querySelectorAll(".reveal").forEach(el => {
        el.classList.remove("reveal");
        el.classList.add("unreveal");
      });
      document.querySelector(".screens").classList.add("stopped");
      this.scrolling = true;
      document.body.classList.add("stop-scroll");
      setTimeout(() => {
        let currContainer = document.querySelector(
          `.container${this.currentScreen + 1}`
        );
        currContainer.classList.contains("visible")
          ? currContainer.classList.remove("visible")
          : "";
        this.currentScreen += direction;

        currContainer = document.querySelector(
          `.container${this.currentScreen + 1}`
        );

        currContainer.classList.contains("invisible")
          ? currContainer.classList.remove("invisible")
          : "";
        currContainer.classList.add("visible");
        document
          .querySelectorAll(
            `.container${this.currentScreen + 1} h2, .container${
              this.currentScreen + 1
            } p, .container${this.currentScreen + 1} button, .container${
              this.currentScreen + 1
            } .ux-name, .container${
              this.currentScreen + 1
            } .ux-content, .container${this.currentScreen + 1} .contact-form`
          )
          .forEach(el => {
            el.classList.contains("unreveal")
              ? el.classList.remove("unreveal")
              : "";
            el.classList.add("reveal");
          });
        document.querySelector(".screens").classList.remove("stopped");
        this.scrolling = false;
        setTimeout(() => {
          document.body.classList.remove("stop-scroll");
        }, 2200);
        direction === 1 ? this.webgl.next() : this.webgl.prev();
        if (this.currentScreen == 3 && this.timer == null) {
          this.slideshow();
        } else if (this.timer !== null && this.currentScreen !== 3) {
          let locOpacity = 0.5;
          TweenLite.to(document.body, 0.5, {
            onUpdate: () => {
              locOpacity += 0.09;
              document.body.style.background = `auto`;
            },
          });
          TweenLite.to(document.body, 0.5, {
            delay: 0.5,
            onUpdate: () => {
              clearInterval(this.timer);
              this.timer = null;
              if (
                document
                  .querySelector(".slideshow")
                  .classList.contains("visible")
              ) {
                document
                  .querySelector(".slideshow")
                  .classList.remove("visible");
                document.querySelector(".slideshow").classList.add("invisible");
              }
            },
          });
        }
      }, 1000);
    }
  }

  mouseMove(e) {
    this.mouseX = e.clientX;
    this.mouseY = e.clientY;
    // if (this.currTarget) {
    //   setTimeout(() => {
    //     this.currTarget ? this.mouseLeave() : "";
    //   }, 600);
    // }
  }

  // mouseEnter(e) {
  // this.activeMorph.d = this.shapeActive;
  // this.morph = anime(this.activeMorph);
  // this.activeMorph = anime(this.morphingHover);
  // this.cursor.classList.add("active");
  // this.follower.classList.add("active");
  // this.currTarget = e.target.getBoundingClientRect();
  // }

  // mouseLeave() {
  //   if (
  //     this.mouseX > this.currTarget.x &&
  //     this.mouseX < this.currTarget.x + this.currTarget.width &&
  //     this.mouseY > this.currTarget.y &&
  //     this.mouseY < this.currTarget.y + this.currTarget.height
  //   ) {
  //     return;
  //   }
  //   this.currTarget = null;
  //   this.activeMorph.loop = false;
  //   this.activeMorph.duration = 0;
  //   this.morph = anime(this.activeMorph);
  //   this.cursor.classList.remove("active");
  //   this.follower.classList.remove("active");
  // }

  unrollBurger() {
    if (!this.menu) {
      document.querySelector(".plate").classList.add("active");
      document.querySelector(".overlay").classList.remove("invisible");
      document.querySelector(".overlay").classList.contains("rollUp")
        ? document.querySelector(".overlay").classList.remove("rollUp")
        : "";
      document.querySelector(".some").classList.contains("rollUp")
        ? document.querySelector(".some").classList.remove("rollUp")
        : "";
      document.querySelector(".overlay").classList.add("rollDown");
      document.querySelector(".some").classList.add("rollDown");
      this.menu = true;
    } else {
      document.querySelector(".plate").classList.remove("active");
      setTimeout(() => {
        document.querySelector(".overlay").classList.add("invisible");
      }, 190);
      this.servicesOpen ? this.deactivateServices() : "";
      setTimeout(() => {
        if (
          this.services.classList.contains("inactive") &&
          this.listServices.classList.contains("inactive")
        ) {
          this.services.classList.remove("inactive");
          this.listServices.classList.remove("inactive");
        }
      }, 400);
      document.querySelector(".overlay").classList.contains("rollDown")
        ? document.querySelector(".overlay").classList.remove("rollDown")
        : "";
      document.querySelector(".overlay").classList.add("rollUp");
      document.querySelector(".some").classList.contains("rollDown")
        ? document.querySelector(".some").classList.remove("rollDown")
        : "";
      document.querySelector(".some").classList.add("rollUp");
      this.menu = false;
    }
  }

  unrollServices() {
    if (this.servicesOpen) {
      this.deactivateServices();
    } else {
      this.activateServices();
    }
  }

  deactivateServices() {
    this.services.classList.remove("active");
    this.listServices.classList.remove("active");
    this.services.classList.add("inactive");
    this.listServices.classList.add("inactive");
    this.servicesOpen = false;
  }

  activateServices() {
    this.services.classList.contains("inactive")
      ? this.services.classList.remove("inactive")
      : "";
    this.listServices.classList.contains("inactive")
      ? this.listServices.classList.remove("inactive")
      : "";
    this.services.classList.add("active");
    this.listServices.classList.add("active");
    this.servicesOpen = true;
  }

  refreshCSS() {
    let links = document.getElementsByTagName("link");
    for (let i = 0; i < links.length; i++) {
      if (links[i].getAttribute("rel")) {
        if (
          links[i].getAttribute("rel") === "stylesheet" &&
          links[i].getAttribute("href")
        ) {
          let href = links[i].getAttribute("href").split("?")[0];
          let newHref = href + "?version=" + new Date().getMilliseconds();
          links[i].setAttribute("href", newHref);
        }
      }
    }
  }

  getInTouch() {
    if (this.servicesOpen) {
      this.deactivateServices();
    }
    this.direction = "";
    if (this.isMobile) {
      document.querySelectorAll(".reveal").forEach(el => {
        el.classList.remove("reveal");
        el.classList.add("unreveal");
      });
      document.querySelector(".screens").classList.add("stopped");
      this.scrolling = true;
      document.body.classList.add("stop-scroll");
      setTimeout(() => {
        let currContainer = document.querySelector(
          `.container${this.currentScreen + 1}`
        );
        currContainer.classList.contains("visible")
          ? currContainer.classList.remove("visible")
          : "";
        this.currentScreen = 4;

        currContainer = document.querySelector(
          `.container${this.currentScreen + 1}`
        );

        currContainer.classList.contains("invisible")
          ? currContainer.classList.remove("invisible")
          : "";
        currContainer.classList.add("visible");
        document
          .querySelectorAll(
            `.container${this.currentScreen + 1} h2, .container${
              this.currentScreen + 1
            } p, .container${this.currentScreen + 1} button, .container${
              this.currentScreen + 1
            } .ux-name, .container${
              this.currentScreen + 1
            } .ux-content, .container${this.currentScreen + 1} .contact-form`
          )
          .forEach(el => {
            el.classList.contains("unreveal")
              ? el.classList.remove("unreveal")
              : "";
            el.classList.add("reveal");
          });
        document.querySelector(".screens").classList.remove("stopped");
        this.scrolling = false;
        setTimeout(() => {
          document.body.classList.remove("stop-scroll");
        }, 2200);
        this.webgl.next(4);
        if (this.timer !== null && this.currentScreen !== 3) {
          let locOpacity = 0.5;
          TweenLite.to(document.body, 0.5, {
            onUpdate: () => {
              locOpacity += 0.09;
              document.body.style.background = `rgba(255,255,255,${locOpacity})`;
            },
          });
          TweenLite.to(document.body, 0.5, {
            delay: 0.5,
            onUpdate: () => {
              clearInterval(this.timer);
              this.timer = null;
              if (
                document
                  .querySelector(".slideshow")
                  .classList.contains("visible")
              ) {
                document
                  .querySelector(".slideshow")
                  .classList.remove("visible");
                document.querySelector(".slideshow").classList.add("invisible");
              }
            },
          });
        }
      }, 1000);

      return;
    }
    if (!this.scrolling) {
      this.scrolling = true;
      document
        .querySelector(".pagination span.curr-page")
        .classList.add("invisible");
      document.querySelectorAll(`.reveal, .revealTop`).forEach(el => {
        if (
          el.classList.contains(`reveal`) ||
          el.classList.contains(`revealTop`)
        ) {
          el.classList.contains(`reveal`) ? el.classList.remove(`reveal`) : "";
          el.classList.contains(`revealTop`)
            ? el.classList.remove(`revealTop`)
            : "";
          el.classList.add(`unreveal${this.direction}`);
        }
      });
      document.body.classList.add("stop-scroll");
      setTimeout(() => {
        this.currentScreen = 4;
        this.webgl.next(4);
        document.querySelector(`.showcase.visible`).classList.remove("visible");
        document
          .querySelector(`.container${this.currentScreen + 1}`)
          .classList.add("visible");
        document.body.classList.remove("stop-scroll");
        this.scrolling = false;
        document
          .querySelectorAll(
            `.container${this.currentScreen + 1} h2, .container${
              this.currentScreen + 1
            } p, .container${this.currentScreen + 1} button, .container${
              this.currentScreen + 1
            } .ux-name, .container${
              this.currentScreen + 1
            } .ux-content, .container${this.currentScreen + 1} .contact-form`
          )
          .forEach(el => {
            el.classList.contains("unreveal")
              ? el.classList.remove("unreveal")
              : "";
            el.classList.contains("unrevealTop")
              ? el.classList.remove("unrevealTop")
              : "";
            el.classList.add(`reveal${this.direction}`);
          });
        document
          .querySelector(".pagination span.curr-page")
          .classList.remove("invisible");
        document.querySelector(".pagination span.curr-page").innerHTML =
          this.currentScreen + 1;
        if (this.timer !== null && this.currentScreen !== 3) {
          let locOpacity = 0.5;
          TweenLite.to(document.body, 0.5, {
            onUpdate: () => {
              locOpacity += 0.08;
              document.body.style.background = `rgba(255,255,255,${locOpacity})`;
            },
          });
          TweenLite.to(document.body, 0.7, {
            delay: 0.5,
            onUpdate: () => {
              clearInterval(this.timer);
              this.timer = null;
              if (
                document
                  .querySelector(".slideshow")
                  .classList.contains("visible")
              ) {
                document
                  .querySelector(".slideshow")
                  .classList.remove("visible");
                document.querySelector(".slideshow").classList.add("invisible");
              }
            },
          });
        }
      }, 1000);
    }
  }
}
