import React, { useEffect, useRef } from 'react';
import * as THREE from 'three';
import ThreeGlobe from 'three-globe';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';
import { markerData } from './utils/markers';
import countries from './utils/globe-data-min.json';

import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/dist/ScrollTrigger';

import { africa, india, westerns } from './utils/highlighted-countries';

const defaultColor = 'rgba(0, 0, 0, 0.4)';
const highlightedColor = 'rgb(235, 131, 52)';
let init = true;

gsap.registerPlugin(ScrollTrigger);

const Earth = () => {
  const canvasRef = useRef(null);
  const containerRef = useRef(null);

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
      .hexPolygonMargin(0.6)
      .hexPolygonColor((e) => {
        if (india.includes(e.properties.ISO_A3)) {
          return 'rgb(235, 131, 52)';
        } else return 'rgba(0,0,0, 0.4)';
      });

    const globeMaterial = Globe.globeMaterial({
      transparent: true,
      opacity: 0.2,
    });
    globeMaterial.color = new THREE.Color(0xffffff);

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
    controls.rotateSpeed = 1;
    controls.zoomSpeed = 1;
    controls.enableZoom = false;
    controls.minPolarAngle = Math.PI / 3.5;
    controls.maxPolarAngle = Math.PI - Math.PI / 3;

    // Animation
    const animate = () => {
      controls.update();
      renderer.render(scene, camera);
      requestAnimationFrame(animate);
    };

    animate();

    function scrollHandler(e) {
      e.preventDefault();
      e.stopPropagation();

      // Globe.hexPolygonsData([])
      // console.log(Globe.rotation.y)

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

          // to reset map points otherwise it caches the points and distort the map view
          if (init) {
            Globe.hexPolygonsData([]);
            setTimeout(() => {
              Globe.hexPolygonsData(countries.features);
            }, 0);
          } else {
            init = false;
          }
        } else {
          window.scrollBy(0, 150);
        }

        //! uncomment this if animation does't work properly
        // scene.remove(Globe);
        // scene.add(Globe);
      }

      if (e.deltaY < -10) {
        if (Globe.rotation.y > -0.35) {
          Globe.hexPolygonColor((e) => {
            if (africa.includes(e.properties.ISO_A3)) {
              return highlightedColor;
            } else return defaultColor;
          });

          Globe.rotation.y -= 0.2;
          Globe.rotation.x += 0.03;
          // console.log('object', e.deltaY, Globe.rotation.y);
        } else if (Globe.rotation.y >= -1.3) {
          Globe.hexPolygonColor((e) => {
            if (['IND'].includes(e.properties.ISO_A3)) {
              return highlightedColor;
            } else return defaultColor;
          });
          Globe.rotation.y -= 0.15;
          Globe.rotation.x += 0.06;
        } else {
          window.scrollBy(0, -150);
        }
      }
      // console.log(Globe.rotation.y, Globe.rotation.x)

      // setTimeout(() => {
      //   Globe.hexPolygonsData(countries.features)
      // }, 0)
    }

    setTimeout(() => {
      Globe.hexPolygonResolution(3);
    }, 1000);

    // canvasRef.current.addEventListener('wheel', scrollHandler)

    // const selector = gsap.utils.selector(canvasRef)
    const ctx = gsap.context(() => {
      // const articles = selector('article')
      // articles.forEach((elem, index) => {
      gsap.fromTo(
        canvasRef.current,
        { opacity: 0.2 },
        {
          opacity: 1,
          onStart: () => {
            // setViewIndex(index)
            console.log('scrolled');
          },
          scrollTrigger: {
            trigger: canvasRef.current,
            start: 'top 50%',
            // end: 'bottom 50%',
            markers: false,
            toggleActions: 'play reverse play reverse',
          },
        },
      );
      // })
    }, containerRef);

    return () => {
      canvasRef.current.removeEventListener('wheel', scrollHandler);
      ctx.revert();
    };
  }, []);

  return (
    <>
      <div ref={containerRef} className='flex items-center justify-center py-8'>
        <canvas ref={canvasRef}></canvas>
      </div>
    </>
  );
};

export default Earth;

// ! section

// https://github.com/blacksof-dev/iitpl.git

// import React from 'react';
// import map from 'assets/home/map.png';
// import one from 'assets/home/no01.svg';
// import two from 'assets/home/no02.svg';
// import three from 'assets/home/no03.svg';
// import Earth from './earth/Earth';

// const cards = [
//   {
//     text: 'Export to 20 countries in Southeast Asia, Western Europe, Latin America, Africa, Middle East',
//     icon: one,
//     id: 'one',
//   },
//   {
//     text: 'Subsidiaries in Indonesia, Brazil, Russia and Singapore',
//     icon: two,
//     id: 'two',
//   },
//   {
//     text: 'Manufacturing in Asia and Europe',
//     icon: three,
//     id: 'three',
//   },
// ];

// export default function Map() {
//   return (
//     <section className="blade-top-padding blade-bottom-padding-lg ">
//       <section className="">
//         <div className="pt-16">
//           <div className="w-container-lg  grid gap-3">
//             <h3 className="font-medium pb-2 text-black text-center">
//               A step towards global Footprint of excellence
//             </h3>
//             <h5 className="font-regular text-black text-center">
//               We’re on a path to elevating cardiovascular care on a global
//               scale.
//             </h5>
//           </div>
//         </div>

//         <div className="w-container-lg">
//           <div className="">
//             {/* <img
//               src={map}
//               alt="Map showing locations in which Innvolution is present"
//             /> */}
//             {/* {window.innerWidth > 680 ? <Earth /> : */}
//               <img
//               src={map}
//               alt="Map showing locations in which Innvolution is present"
//             />
//             {/* } */}
//           </div>
//         </div>

//         <div className="border-b-1 border-t-1 pt-10 lg:pt-0 border-solid border-gray ">
//           <div className="w-container border-l-1 border-r-1 border-solid border-gray">
//             <div className="grid grid-cols-1 lg:grid-cols-3 lg:divide-x-1 gap-y-8  divide-solid divide-gray ">
//               {cards.map((elem, index) => {
//                 const { id, text, icon } = elem
//                 return <Card id={id} key={id} text={text} icon={icon} />
//               })}
//             </div>
//           </div>
//         </div>
//       </section>
//     </section>
//   )
// }

// function Card({ id, text, icon }: { id: string, text: string, icon: string }) {
//   return (
//     <article className='   p-3 md:p-6 lg:p-8 xl:p-10'>
//       <div id={id} className='pb-16 pt-2 '>
//         <img src={icon} loading='lazy' className=' h-12 2xl:h-16' alt={text} />
//       </div>
//       <div className='pb-5'>
//         <h5 className='font-medium'> {text} </h5>
//       </div>
//     </article>
//   );
// }
