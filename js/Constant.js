var Constant = {
  win: 2048,
  
  startTiles: 2,
  hiddenOpacity: 0.08,
  fullOpacity: 1.0,
  probOfLow: 0.5,
  probOfSuck: window.location.href.endsWith("?hard=true") ? 0.09 : 0,
  suck: 0,
  addThisTile: {0: 2, 1: 4},
  numDirections: 6,
  
  //animation
  duration: 200,
  actuateTimeout: 200,
  
  //scene/render/camera stuff
  fov: 75,
  nearPlane: 0.1,
  farPlane: 2500,
  initCam: {x:7, y:23, z:35},
  backgroundColor: 0xcdc0b4,
  
  cubeSize: 7,
  gridSize: 3,
  
  sphereRadius: 1,
  sphereSegments: 32,
  sphereColor: 0x000000,
  
  globalOrigin: {x:0, y:0, z:0},
  
  // Vectors representing tile movement
  vectorMap: {
    0: { x: 0,  y: 1, z: 0 }, // up
    1: { x: 1,  y: 0, z: 0 },  // right
    2: { x: 0,  y: -1, z: 0 },  // down
    3: { x: -1, y: 0, z: 0 },   // left
    4: { x: 0,  y: 0, z: 1}, //in
    5: { x: 0,  y: 0, z: -1} //out
  },
  
  gridColor: 0x000000,/*0xbbada0,*/
  tileColor: 0xff0000,
  textColor: 0xff0000,
  
  tileLineWidth: 10,
  
  tileColorMap: {
    0:0xeee4da,
    2:0xeee4da,
    4:0xede0c8,
    8:0xf2b179,
    16:0xf59563,
    32:0xf67c5f,
    64:0xf65e3b,
    128:0xedcf72,
    256:0xedcc61,
    512:0xedc850,
    1024:0xedc53f,
    2048:0xedc22e,
    'super':0x3c3a32
    
  },
  
  textColorMap: {
    0:0xff0000,
    2:0x000000,
    4:0x000000,
    8:0xf9f6f2,
    16:0xf9f6f2,
    32:0xf9f6f2,
    64:0xf9f6f2,
    128:0xf9f6f2,
    256:0xf9f6f2,
    512:0xf9f6f2,
    1024:0xf9f6f2,
    2048:0xf9f6f2,
    'super':0xf9f6f2
    
  },
  
  highStringLength: 5,
  getTextSize: { //string length -> text size
           1: 5,
           2: 4,
           3: 3,
           4: 2,
           5: 1
          },          
  renderFont: "helvetiker",
  fontHeight: 1
};
