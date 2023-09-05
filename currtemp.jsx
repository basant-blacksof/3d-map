import React, { useEffect, useRef } from 'react';
import * as THREE from 'three';
import ThreeGlobe from 'three-globe';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';
import { markerData } from './utils/markers';
import countries from './utils/globe-data-min.json';
// import countries from './utils/countries.json';

import './App.css';
import { africa, india, westerns } from './utils/highlighted-countries';

const defaultColor = 'rgba(0, 0, 0, 0.4)';
const highlightedColor = 'rgb(235, 131, 52)';
// const highlightedColorWithOpacity = (opacity) => `rgba(235, 131, 52, ${opacity})`;
let init = true;

const App = () => {
  const canvasRef = useRef(null);

  useEffect(() => {
    // Sizes
    const sizes = {
      width: window.innerWidth < 680 ? window.innerWidth : window.innerWidth - 100,
      height: window.innerWidth < 680 ? window.innerWidth : 600,
    };

    // Create Globe
    const Globe = new ThreeGlobe()
      .showAtmosphere(false)
      .ringsData(markerData)
      .ringColor('ringColor')
      .ringMaxRadius('maxR')
      .ringPropagationSpeed('propagationSpeed')
      .ringRepeatPeriod('repeatPeriod')
      .ringResolution(64)
      .pointsData(markerData)
      .pointAltitude(0.002)
      .pointColor('color')
      .pointRadius('radius')
      .pointResolution(64)
      .hexPolygonsData(countries.features)
      .hexPolygonResolution(0)
      .hexPolygonMargin(0.5)
      .hexPolygonColor((e) => {
        if (india.includes(e.properties.ISO_A3)) {
          return highlightedColor;
        } else return defaultColor;
      });

    const globeMaterial = Globe.globeMaterial({ transparent: true, opacity: 0.2 });
    globeMaterial.color = new THREE.Color(0xffffff);
    // globeMaterial.opacity = 0.7;

    Globe.rotation.x = 0.3;
    Globe.rotation.y = -1.35;

    // Renderer
    const renderer = new THREE.WebGLRenderer({
      canvas: canvasRef.current,
    });
    renderer.setSize(sizes.width, sizes.height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

    // Scene
    const scene = new THREE.Scene();
    scene.background = new THREE.Color(0xffffff);
    scene.add(Globe);

    scene.add(new THREE.AmbientLight(0xbbbbbb, 1.3));

    // scene.rotation.y = -1.35;
    // scene.rotation.x = 0.3;

    // Camera
    const camera = new THREE.PerspectiveCamera(45, sizes.width / sizes.height, 1, 300);
    camera.position.z = 270;
    camera.updateProjectionMatrix();

    // Controls
    const controls = new OrbitControls(camera, renderer.domElement);
    controls.enableDamping = true;
    controls.dynamicDampingFactor = 0.01;
    controls.enablePan = true;
    controls.minDistance = 101;
    controls.maxDistance = 370;
    controls.rotateSpeed = 0.8;
    controls.zoomSpeed = 1;
    controls.enableZoom = false;
    controls.minPolarAngle = Math.PI / 3.5;
    controls.maxPolarAngle = Math.PI - Math.PI / 3;

    setTimeout(() => {
      Globe.hexPolygonResolution(3);
    }, 1000);

    // Animation
    const animate = () => {
      controls.update();
      renderer.render(scene, camera);

      Globe.rotation.y += 0.015;
      // if ((Globe.rotation.y % 0.35).toFixed(2) === (0.1).toFixed(2)) {
      //   console.log('done');
      // }

      console.log(Globe.rotation.y);

      if (Globe.rotation.y < 0) {
        // Globe.hexPolygonsData([]);
        // setTimeout(() => {
        //   Globe.hexPolygonsData(countries.features);
        // }, 0);
        // Globe.hexPolygonColor((e) => {
        //   if (africa.includes(e.properties.ISO_A3)) {
        //     return highlightedColor;
        //   } else return defaultColor;
        // });
      } else if (Globe.rotation.y < 1.4) {
        // Globe.hexPolygonsData([]);
        // setTimeout(() => {
        //   Globe.hexPolygonsData(countries.features);
        // }, 0);
        // Globe.hexPolygonColor((e) => {
        //   if (westerns.includes(e.properties.ISO_A3)) {
        //     return highlightedColor;
        //   } else return defaultColor;
        // });
      } else {
        scene.rotation.y = -1.35;
      }

      requestAnimationFrame(animate);
    };

    animate();

    function scrollHandler(e) {
      e.preventDefault();
      e.stopPropagation();
      // console.log(canvasRef.current.scrollTop);

      // Globe.hexPolygonsData([])
      // console.log(Globe.rotation.y)
      // console.log(canvasRef.current.getBoundingClientRect());
      const { top, height } = canvasRef.current.getBoundingClientRect();
      const scrollFactor = (top + height) / 4;

      if (e.deltaY > 10) {
        if (Globe.rotation.y < -0.35) {
          Globe.hexPolygonColor((e) => {
            if (africa.includes(e.properties.ISO_A3)) {
              return highlightedColor;
            } else return defaultColor;
          });

          Globe.rotation.y += 0.15;
          Globe.rotation.x -= 0.05;
        } else if (Globe.rotation.y < 1.09) {
          Globe.hexPolygonColor((e) => {
            if (westerns.includes(e.properties.ISO_A3)) {
              return highlightedColor;
            } else return defaultColor;
          });

          Globe.rotation.y += 0.2;

          Globe.rotation.x -= 0.03;

          // to reset map points
          if (init) {
            Globe.hexPolygonsData([]);
            setTimeout(() => {
              Globe.hexPolygonsData(countries.features);
            }, 0);
          } else {
            init = false;
          }
        } else {
          window.scrollBy(0, e.deltaY);
        }
        // !scale up the globe
        // else if (Globe.scale.x < 2.74) {
        //   Globe.scale.x += 0.15;
        //   Globe.scale.y += 0.15;
        //   Globe.scale.z += 0.15;
        // }

        //! uncomment this if animation does't work properly
        // scene.remove(Globe);
        // scene.add(Globe);
      }

      if (e.deltaY < -10) {
        // !scale down the globe
        // if (Globe.scale.x > 1) {
        //   Globe.scale.x -= 0.15;
        //   Globe.scale.y -= 0.15;
        //   Globe.scale.z -= 0.15;
        //   return;
        // }

        if (Globe.rotation.y > -0.35) {
          Globe.hexPolygonColor((e) => {
            if (africa.includes(e.properties.ISO_A3)) {
              return highlightedColor;
            } else return defaultColor;
          });

          Globe.rotation.y -= 0.2;
          Globe.rotation.x += 0.03;
        } else if (Globe.rotation.y >= -1.3) {
          Globe.hexPolygonColor((e) => {
            if (india.includes(e.properties.ISO_A3)) {
              return highlightedColor;
            } else return defaultColor;
          });
          Globe.rotation.y -= 0.15;
          Globe.rotation.x += 0.06;
        } else {
          window.scrollBy(0, e.deltaY);
        }
      }
      // console.log(Globe.rotation.y, Globe.rotation.x)

      // setTimeout(() => {
      //   Globe.hexPolygonsData(countries.features)
      // }, 0)
    }

    // document.addEventListener('scroll', scrollHandler);
    // canvasRef.current.addEventListener('mouseover', scrollHandler);

    // !new code starts here to handle scroll
    let isMouseOverCanvas = false;
    let mouseX = 0;
    let mouseY = 0;

    // Function to handle mousemove event
    function handleMouseMove(event) {
      const canvas = canvasRef.current;
      if (!canvas) return;

      // console.log(event);

      // Get the position of the canvas element
      // const canvasRect = canvas.getBoundingClientRect();

      // Get the current mouse coordinates
      mouseX = event.clientX;
      mouseY = event.clientY;

      // Check if the mouse is over the canvas
      // if (
      //   mouseX >= canvasRect.left &&
      //   mouseX <= canvasRect.right &&
      //   mouseY >= canvasRect.top &&
      //   mouseY <= canvasRect.bottom
      // ) {
      //   isMouseOverCanvas = true;
      // } else {
      //   isMouseOverCanvas = false;
      // }
    }

    // Function to handle scroll event
    function handleScroll(e) {
      e.preventDefault();
      // e.stopPropagation();

      // window.scrollTo(window.scrollX, window.scrollY);

      const canvas = canvasRef.current;
      if (!canvas) return;

      // Get the position of the canvas element
      const canvasRect = canvas.getBoundingClientRect();

      if (
        mouseX >= canvasRect.left &&
        mouseX <= canvasRect.right &&
        mouseY >= canvasRect.top &&
        mouseY <= canvasRect.bottom
      ) {
        isMouseOverCanvas = true;
      } else {
        isMouseOverCanvas = false;
      }

      // Check if the canvas is in the viewport and the mouse is over the canvas
      if (canvasRect.top <= window.innerHeight && canvasRect.bottom >= 0 && isMouseOverCanvas) {
        // window.scrollTo(window.scrollX, window.scrollY);
        // window.scroll(window.scrollX, window.scrollY);
        console.log(
          // e.target.scrollingElement.scrollTop,
          // document.documentElement.scrollTop,
          window.scrollY,
        );
      }
    }

    // Add event listener for mousemove
    document.addEventListener('mousemove', handleMouseMove);

    // Add event listener for scroll
    window.addEventListener('scroll', handleScroll);

    // !new code for handle scroll ends here
    canvasRef.current.addEventListener('wheel', scrollHandler);

    return () => {
      document.removeEventListener('scroll', handleScroll);
      document.removeEventListener('mousemove', handleMouseMove);

      canvasRef.current.removeEventListener('wheel', scrollHandler);
    };
  }, []);

  return (
    <>
      <div className='world-map'>
        <h1>sample text</h1>
        <h1>sample text</h1>
        <h1>sample text</h1>
        <h1>sample text</h1>
        <h1>sample text</h1>
        <h1>sample text</h1>
        <h1>sample text</h1>
        <h1>sample text</h1>
        <h1>sample text</h1>

        <canvas ref={canvasRef}></canvas>

        <h1>sample text</h1>
        <h1>sample text</h1>
        <h1>sample text</h1>
        <h1>sample text</h1>
        <h1>sample text</h1>
        <h1>sample text</h1>
        <h1>sample text</h1>
        <h1>sample text</h1>
        <h1>sample text</h1>
      </div>
    </>
  );
};

export default App;
