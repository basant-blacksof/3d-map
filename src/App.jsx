import React, { useEffect, useRef, useState } from 'react';
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
let Globe, scene, controls;

const App = () => {
  const canvasRef = useRef(null);
  const [currCountry, setCurrCountry] = useState({ country: india, id: 0 });

  useEffect(() => {
    // Sizes
    const sizes = {
      width: 600,
      height: 600,
    };

    // Create Globe
    Globe = new ThreeGlobe()
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
    scene = new THREE.Scene();
    scene.background = new THREE.Color(0xffffff);
    scene.add(Globe);

    scene.add(new THREE.AmbientLight(0xbbbbbb, 1.3));

    // Camera
    const camera = new THREE.PerspectiveCamera(45, sizes.width / sizes.height, 1, 300);
    camera.position.z = 270;
    camera.updateProjectionMatrix();

    // Controls
    controls = new OrbitControls(camera, renderer.domElement);
    controls.autoRotate = true;
    // controls.autoRotateSpeed = 4;
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
      requestAnimationFrame(animate);
    };

    animate();
  }, []);

  useEffect(() => {
    controls.reset();
    // controls.autoRotate = false;

    Globe.hexPolygonColor((e) => {
      if (currCountry.country.includes(e.properties.ISO_A3)) {
        return highlightedColor;
      } else return defaultColor;
    });

    Globe.hexPolygonsData([]);
    setTimeout(() => {
      Globe.hexPolygonsData(countries.features);
    }, 0);

    switch (currCountry.id) {
      case 0:
        Globe.rotation.x = 0.3;
        Globe.rotation.y = -1.5;
        break;

      case 1:
        Globe.rotation.x = 0.1;
        Globe.rotation.y = -0.5;
        break;

      case 2:
        Globe.rotation.x = 0;
        Globe.rotation.y = 1;
        break;

      default:
        break;
    }
  }, [currCountry]);

  function hoverHandler(country, id) {
    setCurrCountry({ country, id });
  }

  return (
    <>
      <div className='world-map'>
        <div>
          <div
            onMouseEnter={() => {
              hoverHandler(india, 0);
            }}
          >
            india
          </div>
          <div
            onMouseEnter={() => {
              hoverHandler(africa, 1);
            }}
          >
            africa
          </div>
          <div
            onMouseEnter={() => {
              hoverHandler(westerns, 2);
            }}
          >
            westerns
          </div>
        </div>
        <canvas ref={canvasRef}></canvas>
      </div>
    </>
  );
};

export default App;
