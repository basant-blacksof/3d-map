const maxR = 4;
const propagationSpeed = 1;
const repeatPeriod = 1000;
const radius = 1.5;

const colorObj = {
  color: 'rgba(161,32,106,1)',
};

const color = {
  r: '161',
  g: '32',
  b: '106',
};

const colorInterpolator = (t) => `rgba(${color.r},${color.g},${color.b},${1 - t})`;

export const markerData = [
  // {
  //   name: "Boston",
  //   lat: 42,
  //   lng: -71,
  //   color: colorObj.color,
  //   maxR: maxR,
  //   propagationSpeed: propagationSpeed,
  //   repeatPeriod: repeatPeriod,
  //   ringColor: colorInterpolator,
  //   radius: radius
  // },
  {
    name: 'India',
    lat: 518,
    lng: -101,
    color: colorObj.color,
    maxR: maxR,
    propagationSpeed: propagationSpeed,
    repeatPeriod: repeatPeriod,
    ringColor: colorInterpolator,
    radius: radius,
  },
  // {
  //   name: "Shanghai",
  //   lat: 31,
  //   lng: 121,
  //   color: colorObj.color,
  //   maxR: maxR,
  //   propagationSpeed: propagationSpeed,
  //   repeatPeriod: repeatPeriod,
  //   ringColor: colorInterpolator,
  //   radius: radius
  // },
  // {
  //   name: "Singapore",
  //   lat: 1,
  //   lng: 103,
  //   color: colorObj.color,
  //   maxR: maxR,
  //   propagationSpeed: propagationSpeed,
  //   repeatPeriod: repeatPeriod,
  //   ringColor: colorInterpolator,
  //   radius: radius
  // },
  // {
  //   name: "UK",
  //   lat: 53,
  //   lng: -1,
  //   color: colorObj.color,
  //   maxR: maxR,
  //   propagationSpeed: propagationSpeed,
  //   repeatPeriod: repeatPeriod,
  //   ringColor: colorInterpolator,
  //   radius: radius
  // }
];
