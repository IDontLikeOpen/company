import WebGLView from "./webgl/WebGLView";
import GUIView from "./gui/GUIView";
import { TweenLite } from "gsap/TweenMax";
import { TweenMax } from "gsap/TweenMax";

export default class App {
  constructor() {}

  init() {
    this.initWebGL();
    this.initGUI();

    this.addListeners();
    this.animate();
    this.resize();

    // mouse vars

    this.cursor = document.querySelector(".cursor");
    this.follower = document.querySelector(".cursor-follower");

    this.posX = 0;
    this.posY = 0;

    this.mouseX = 0;
    this.mouseY = 0;

    this.nowY = null;
    this.startY = 0;
    this.target = null;

    this.isMobile = screen.width < 850 ? true : false;
    this.isIphone =
      window.navigator.userAgent.includes("iPhone") &&
      screen.height === 736 &&
      screen.width === 414
        ? document.body.classList.add("isPlus")
        : "";
    !window.navigator.userAgent.includes("iPhone") &&
    screen.height < 850 &&
    screen.width < 850
      ? (this.android = true)
      : "";
    (screen.width === 375 && screen.height === 812) ||
    (screen.height === 375 &&
      screen.width === 812 &&
      window.navigator.userAgent.includes("iPhone"))
      ? document.body.classList.add("isX")
      : "";
    this.isMac = window.navigator.userAgent.includes("Macintosh") ? 900 : 200;

    if (!this.isMobile) {
      this.morphingHover = {
        targets: ".cursor-follower path",
        d: [
          {
            value:
              "M3 25C3 19.1652 5.31785 13.5695 9.44365 9.44365C13.5695 5.31785 19.1652 3 25 3C30.8348 3 36.4306 5.31785 40.5564 9.44365C44.6822 13.5695 47 19.1652 47 25C47 30.8348 44.6822 36.4306 40.5564 40.5564C36.4306 44.6822 30.8348 47 25 47C19.1652 47 13.5695 44.6822 9.44365 40.5564C5.31785 36.4306 3 30.8348 3 25Z",
          },
          {
            value:
              "M1.5 21C1.5 15.1652 2.11834 11.1696 6.24414 7.04375C10.3699 2.91795 16.6652 1 22.5 1C32.5 2.5 31.8742 5.8742 36 10C40.1258 14.1258 45.7441 17.209 45.7441 23.0438C45.7441 28.8785 39.2441 35.0438 37.7441 36.5438C33.6183 40.6696 29.5789 42.0438 23.7441 42.0438C17.9094 42.0438 12.6258 39.6258 8.5 35.5C4.3742 31.3742 2 28.5 1.5 21Z",
          },
          {
            value:
              "M1.99981 19.9436C1.99981 14.1089 -0.682773 11.5694 3.44303 7.44365C7.56883 3.31785 13.1646 1.44365 18.9994 1.44365C24.8341 1.44365 28.8736 3.31785 32.9994 7.44365C37.1252 11.5694 40.9994 14.1089 40.9994 19.9436C40.9994 25.7784 37.1252 29.3178 32.9994 33.4436C28.8736 37.5694 24.8341 41.9436 18.9994 41.9436C13.1646 41.9436 7.56883 39.6258 3.44303 35.5C-0.682773 31.3742 1.99981 25.7784 1.99981 19.9436Z",
          },
          {
            value:
              "M1.5 20C1.5 14.1652 3.87345 10.6258 7.99925 6.49997C12.125 2.37417 17.6652 1.49996 23.5 1.49996C29.3348 1.49996 32.4298 0.317823 36.5556 4.44362C40.6814 8.56942 39.5 14.1652 39.5 20C39.5 25.8347 38.6258 25.3742 34.5 29.5C30.3742 33.6258 25.8335 37.5 19.9988 37.5C14.164 37.5 11.1258 33.6258 7 29.5C2.8742 25.3742 1.5 25.8347 1.5 20Z",
          },
          {
            value:
              "M3 25C3 19.1652 5.31785 13.5695 9.44365 9.44365C13.5695 5.31785 19.1652 3 25 3C30.8348 3 36.4306 5.31785 40.5564 9.44365C44.6822 13.5695 47 19.1652 47 25C47 30.8348 44.6822 36.4306 40.5564 40.5564C36.4306 44.6822 30.8348 47 25 47C19.1652 47 13.5695 44.6822 9.44365 40.5564C5.31785 36.4306 3 30.8348 3 25Z",
          },
        ],
        easing: "easeOutQuad",
        duration: 5000,
        loop: true,
      };

      this.morphingOver = {
        targets: ".cursor-follower path",
        d: [
          {
            value:
              "M3 25C3 19.1652 5.31785 13.5695 9.44365 9.44365C13.5695 5.31785 19.1652 3 25 3C30.8348 3 36.4306 5.31785 40.5564 9.44365C44.6822 13.5695 47 19.1652 47 25C47 30.8348 44.6822 36.4306 40.5564 40.5564C36.4306 44.6822 30.8348 47 25 47C19.1652 47 13.5695 44.6822 9.44365 40.5564C5.31785 36.4306 3 30.8348 3 25Z",
          },
          {
            value:
              "M3 25C3 19.1652 5.31785 13.5695 9.44365 9.44365C13.5695 5.31785 19.1652 3 25 3C30.8348 3 36.4306 5.31785 40.5564 9.44365C44.6822 13.5695 47 19.1652 47 25C47 30.8348 44.6822 36.4306 40.5564 40.5564C36.4306 44.6822 30.8348 47 25 47C19.1652 47 13.5695 44.6822 9.44365 40.5564C5.31785 36.4306 3 30.8348 3 25Z",
          },
        ],
        easing: "easeOutQuad",
        duration: 5000,
        autoplay: false,
        loop: false,
      };

      this.shapeActive = [
        {
          value:
            "M3 25C3 19.1652 5.31785 13.5695 9.44365 9.44365C13.5695 5.31785 19.1652 3 25 3C30.8348 3 36.4306 5.31785 40.5564 9.44365C44.6822 13.5695 47 19.1652 47 25C47 30.8348 44.6822 36.4306 40.5564 40.5564C36.4306 44.6822 30.8348 47 25 47C19.1652 47 13.5695 44.6822 9.44365 40.5564C5.31785 36.4306 3 30.8348 3 25Z",
        },
        {
          value:
            "M1.5 21C1.5 15.1652 2.11834 11.1696 6.24414 7.04375C10.3699 2.91795 16.6652 1 22.5 1C32.5 2.5 31.8742 5.8742 36 10C40.1258 14.1258 45.7441 17.209 45.7441 23.0438C45.7441 28.8785 39.2441 35.0438 37.7441 36.5438C33.6183 40.6696 29.5789 42.0438 23.7441 42.0438C17.9094 42.0438 12.6258 39.6258 8.5 35.5C4.3742 31.3742 2 28.5 1.5 21Z",
        },
        {
          value:
            "M1.99981 19.9436C1.99981 14.1089 -0.682773 11.5694 3.44303 7.44365C7.56883 3.31785 13.1646 1.44365 18.9994 1.44365C24.8341 1.44365 28.8736 3.31785 32.9994 7.44365C37.1252 11.5694 40.9994 14.1089 40.9994 19.9436C40.9994 25.7784 37.1252 29.3178 32.9994 33.4436C28.8736 37.5694 24.8341 41.9436 18.9994 41.9436C13.1646 41.9436 7.56883 39.6258 3.44303 35.5C-0.682773 31.3742 1.99981 25.7784 1.99981 19.9436Z",
        },
        {
          value:
            "M1.5 20C1.5 14.1652 3.87345 10.6258 7.99925 6.49997C12.125 2.37417 17.6652 1.49996 23.5 1.49996C29.3348 1.49996 32.4298 0.317823 36.5556 4.44362C40.6814 8.56942 39.5 14.1652 39.5 20C39.5 25.8347 38.6258 25.3742 34.5 29.5C30.3742 33.6258 25.8335 37.5 19.9988 37.5C14.164 37.5 11.1258 33.6258 7 29.5C2.8742 25.3742 1.5 25.8347 1.5 20Z",
        },
        {
          value:
            "M3 25C3 19.1652 5.31785 13.5695 9.44365 9.44365C13.5695 5.31785 19.1652 3 25 3C30.8348 3 36.4306 5.31785 40.5564 9.44365C44.6822 13.5695 47 19.1652 47 25C47 30.8348 44.6822 36.4306 40.5564 40.5564C36.4306 44.6822 30.8348 47 25 47C19.1652 47 13.5695 44.6822 9.44365 40.5564C5.31785 36.4306 3 30.8348 3 25Z",
        },
      ];

      this.shapeInactive = [
        {
          value: document
            .querySelector(".cursor-follower path")
            .getAttribute("d"),
        },
        {
          value:
            "M3 25C3 19.1652 5.31785 13.5695 9.44365 9.44365C13.5695 5.31785 19.1652 3 25 3C30.8348 3 36.4306 5.31785 40.5564 9.44365C44.6822 13.5695 47 19.1652 47 25C47 30.8348 44.6822 36.4306 40.5564 40.5564C36.4306 44.6822 30.8348 47 25 47C19.1652 47 13.5695 44.6822 9.44365 40.5564C5.31785 36.4306 3 30.8348 3 25Z",
        },
      ];

      this.activeMorph = {
        targets: ".cursor-follower path",
        d: this.shapeInactive,
        easing: "easeOutQuad",
        duration: 3000,
        autoplay: false,
        loop: false,
      };

      this.morph = anime(this.activeMorph);

      this.scaleB = 1;

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

      this.morphSlideshow = anime({
        targets: ".morph path",
        d: [
          {
            value:
              "M36.7143 25.9999C39.5714 26.9046 43.381 26.3571 45 28.5C46.619 30.5952 49.5 32.4048 49.5 35.5C49.5 39.8809 47.4286 44.119 44 46.5C40.619 48.8333 32.381 51.9999 25.8571 51.9999H0V1.99989L23.5 1.99994C29.5952 1.99994 35.2619 -0.333403 38.5 1.99993C41.7857 4.33326 45 8.21417 45 12.2142C45 14.6427 43.6905 17.5952 42.5 19.4999C41.3571 21.4047 38.8095 24.9046 36.7143 25.9999ZM11.5 10.7142V22.4999H23C25.8571 22.4999 28.0238 21.9999 29.5 20.9999C30.9762 19.9999 35 16.5 34.5 14C34 11.5 32 11 30 11C27.4431 11 25.8571 10.7142 23 10.7142H11.5ZM25 43.2856C28.0476 43.2856 30.3333 42.7856 31.8571 41.7856C33.4286 40.7856 38.5 37.5952 38.5 35.5C38.5 31.3571 31.1429 30.9285 25 30.9285H11.5V43.2856H25Z",
          },
          {
            value:
              "M38.5 21.9999C41.3571 22.9046 44.381 24.8571 46 27C47.5 29 49.5 31.9048 49.5 35C49.5 39.3809 47.4286 43.619 44 46C40.619 48.3333 32.381 51.4999 25.8571 51.4999H0V1.49988L23.5 1.49993C29.5952 1.49993 35.2619 -0.833408 38.5 1.49993C41.7857 3.83326 45 7.71416 45 11.7142C45 14.1427 43.6905 17.0952 42.5 18.9999C41.3571 20.9047 40.5952 20.9046 38.5 21.9999ZM11.5 10.2142V21.9999L23.5 20.5C26.5 20 28.5238 18.4629 30 17.4629C31.4762 16.4629 35 16 34.5 13.5C34 11 32 10.5 30 10.5C27.4431 10.5 25.8571 10.2142 23 10.2142H11.5ZM25 42.7856C28.0476 42.7856 32.9762 40 34.5 39C36.0714 38 38.5 34.5952 38.5 32.5C38.5 28.3571 32 28 25.8571 28L11.5 30.4285V42.7856H25Z",
          },
          {
            value:
              "M39 30.0001C41.8571 30.9049 44.881 32.8574 46.5 35.0002C48 37.0003 50 39.905 50 43.0002C50 47.3812 47.9286 51.6193 44.5 54.0002C41.119 56.3336 32.881 59.5001 26.3571 59.5001H0.5L8.5 1.50013L32 1.50018C38.0952 1.50018 43.7619 -0.833164 47 1.50017C50.2857 3.8335 45.5 15.7144 45.5 19.7144C45.5 22.143 44.1905 25.0954 43 27.0002C41.8571 28.9049 41.0952 28.9049 39 30.0001ZM20 10.5002L12 30.0001L24 28.5002C27 28.0002 29.0238 26.4631 30.5 25.4631C31.9762 24.4631 33.5 23.4631 35 21.5002C36.5 19.5373 40.5 11.9631 38.5 10.5002C36.4363 8.99072 33 8.71186 30 9.46313L20 10.5002ZM25.5 50.7858C32 50.5 36 46 37.5 44.4631C39 42.5 39 40.5239 39 38.4287C39 34.2858 31.6429 33.9998 26 35.5L12 38.4287V50.7858H25.5Z",
          },
          {
            value:
              "M36.7143 24C39.5714 24.9048 41.8095 26.4286 43.4286 28.5714C45.0476 30.6667 45.8571 33.2619 45.8571 36.3571C45.8571 40.7381 44.1429 44.119 40.7143 46.5C37.3333 48.8333 32.381 50 25.8571 50H0V0H24.4286C30.5238 0 35.1905 1.16667 38.4286 3.5C41.7143 5.83333 43.3571 9 43.3571 13C43.3571 15.4286 42.7619 17.5952 41.5714 19.5C40.4286 21.4048 38.8095 22.9048 36.7143 24ZM11.5 8.71429V20.5H23C25.8571 20.5 28.0238 20 29.5 19C30.9762 18 31.7143 16.5238 31.7143 14.5714C31.7143 12.6191 30.9762 11.1667 29.5 10.2143C28.0238 9.21429 25.8571 8.71429 23 8.71429H11.5ZM25 41.2857C28.0476 41.2857 30.3333 40.7857 31.8571 39.7857C33.4286 38.7857 34.2143 37.2381 34.2143 35.1429C34.2143 31 31.1429 28.9286 25 28.9286H11.5V41.2857H25Z",
          },
        ],
        easing: "easeOutQuad",
        duration: 6000,
        direction: "alternate",
        loop: true,
      });
    }

    this.scrolling = false;
    this.height = this.isMobile ? screen.height : window.innerHeight;
    this.changed = false;
    this.opacity = 0;
    this.currentScrollPosition = 0;
    this.currentTouchPosition = screen.height;
    this.screens = document.querySelectorAll(".showcase").length;
    this.currentScreen = 0;
    this.timer = null;
    this.portfolio = document.querySelectorAll(".slideshow img");
    this.portfolioCurrent = 0;
    this.direction = "";
    this.currTarget = null;
    this.servicesOpen = false;
    this.menu = false;
    if (this.isMobile)
    {
      this.services = document.querySelector(".overlay .services-drop");
      this.listServices = document.querySelector(".overlay ul.services");
    } else {
      this.services = document.querySelector(".desk .services-drop");
      this.listServices = document.querySelector(".desk ul.services");
    }
  }

  initWebGL() {
    this.webgl = new WebGLView(this);
    document
      .querySelector(".container")
      .appendChild(this.webgl.renderer.domElement);
  }

  initGUI() {
    this.gui = new GUIView(this);
  }

  addListeners() {
    this.handlerAnimate = this.animate.bind(this);

    window.addEventListener("resize", this.resize.bind(this));
    if (screen.width > 850) {

  if(document.querySelector('.main-page')){
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
          e.deltaY > 0 ? this.webgl.next() : this.webgl.prev();
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
                `.container${this.currentScreen + 1} h1, .container${
                  this.currentScreen + 1
                } p, .container${this.currentScreen + 1} button, .container${
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
              this.slideshow();
            } else if (this.timer !== null && this.currentScreen !== 3) {
              let locOpacity = 0.5;
              TweenLite.to(document.body, 0.3, {
                onUpdate: () => {
                  locOpacity += 0.08;
                  document.body.style.background = `auto`;
                },
              });
              TweenLite.to(document.body, 0.3, {
                delay: 0.3,
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
            }
          }, this.isMac);
        }
      } else {
        return;
      }
    });
  }

      window.addEventListener("mousemove", this.mouseMove.bind(this));

      document.querySelectorAll("a, button").forEach(el => {
        el.addEventListener("mouseenter", this.mouseEnter.bind(this));
        el.addEventListener("mouseleave", this.mouseLeave.bind(this));
      });
    
        document.querySelectorAll("button").forEach(el => {
          el.addEventListener("click", e => {
            e.stopPropagation();
            if (!el.classList.contains("active")) {
              el.classList.add("active");
              setTimeout(() => {
                el.classList.remove("active");
              }, 50);
            }
          });
        });
      
      TweenMax.to(document.querySelector(".cursor-follower"), 0.016, {
        repeat: -1,
        onRepeat: () => {
          this.posX += (this.mouseX - this.posX) / 9;
          this.posY += (this.mouseY - this.posY) / 9;

          TweenMax.set(document.querySelector(".cursor-follower"), {
            css: {
              left: this.posX,
              top: this.posY,
            },
          });

          TweenMax.set(document.querySelector(".cursor"), {
            css: {
              left: this.mouseX,
              top: this.mouseY,
            },
          });
        },
      });

      TweenMax.to(document.querySelector(".morph-path"), 0.016, {
        repeat: -1,
        onRepeat: () => {
          this.posX += (this.mouseX - this.posX) / 12;
          this.posY += (this.mouseY - this.posY) / 12;

          TweenMax.set(document.querySelector(".morph-path"), {
            css: {
              x: this.posX,
              y: this.posY,
              scale: this.scaleB,
            },
          });
        },
      });

      document
      .querySelector(".desk .services-drop")
      .addEventListener("mouseenter", this.unrollServices.bind(this));
      

      window.addEventListener("click", e => {
        if (this.servicesOpen) {
          this.deactivateServices();
        }
          document.querySelectorAll("button").forEach(el => {
            el.classList.contains("active") ? el.classList.remove("active") : "";
          });
      });

      document
      .querySelectorAll(".menu-top .desk ul.services li")
      .forEach(el => el.addEventListener("click", this.no.bind(this)));

    } else {
      window.orientation === 90 || window.orientation === -90
            ? document.body.classList.add("rotated")
            : "";
        window.addEventListener("orientationchange", function (event) {
      if (document.body.classList.contains("rotated")) {
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
    
    document.addEventListener("touchmove", e => this.ScrollMobile(e), false);
    document.addEventListener("touchstart", e => this.ScrollStart(e), false);

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
          if (!document.body.classList.contains("rotated")) {
            document.body.classList.remove("android");
            document.body.classList.remove("stop-scroll");
          }
        })
      );
    }

    document
      .querySelector("header button")
      .addEventListener("click", this.getInTouch.bind(this));

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
    if (this.webgl) this.webgl.resize();
  }

  no(e) {
    e.stopPropagation();
  }

  switchPage() {

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
    if (this.menu) return;
    this.currentScrollPosition = e.touches[0].clientY;
    this.startY = e.touches[0].clientY;
    if (e.touches[0].clientX < screen.width / 2 && this.servicesOpen) {
      this.deactivateServices();
    }
  }

  ScrollMobile(e) {
    if (this.menu) return;
    this.nowY = e.touches[0].clientY;
    if (this.scrolling) {
      return;
    } else if (
      (this.startY > this.nowY && this.currentScreen + 1 === this.screens) ||
      (this.startY < this.nowY && this.currentScreen - 1 === -1)
    ) {
      return;
    } else {
      let direction = this.startY > this.nowY ? 1 : -1;
      this.startY > this.nowY ? (this.direction = "Top") : (this.direction = "");
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
            `.container${this.currentScreen + 1} h1, .container${
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
    this.currTarget ? this.mouseLeave() : "";
  }

  mouseEnter(e) {
    this.activeMorph.d = this.shapeActive;
    this.morph = anime(this.activeMorph);
    this.activeMorph = anime(this.morphingHover);
    this.cursor.classList.add("active");
    this.follower.classList.add("active");
    this.currTarget = e.target.getBoundingClientRect();
  }

  mouseLeave() {
    if (
      this.mouseX > this.currTarget.x &&
      this.mouseX < this.currTarget.x + this.currTarget.width &&
      this.mouseY > this.currTarget.y &&
      this.mouseY < this.currTarget.y + this.currTarget.height
    ) {
      return;
    }
    this.currTarget = null;
    this.activeMorph.loop = false;
    this.activeMorph.duration = 0;
    this.morph = anime(this.activeMorph);
    this.cursor.classList.remove("active");
    this.follower.classList.remove("active");
  }

  unrollBurger() {
    if (!this.menu) {
      document.querySelector(".plate").classList.add("active");
      document.querySelector(".overlay").classList.remove("invisible");
      document.querySelector(".overlay").classList.contains("rollUp")
        ? document.querySelector(".overlay").classList.remove("rollUp")
        : "";
      document.querySelector(".overlay").classList.add("rollDown");
      this.menu = true;
    } else {
      document.querySelector(".plate").classList.remove("active");
      setTimeout(() => {
        document.querySelector(".overlay").classList.add("invisible");
      }, 190);
      document.querySelector(".overlay").classList.contains("rollDown")
        ? document.querySelector(".overlay").classList.remove("rollDown")
        : "";
      document.querySelector(".overlay").classList.add("rollUp");
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
            `.container${this.currentScreen + 1} h1, .container${
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
            `.container${this.currentScreen + 1} h1, .container${
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
