/* global THREE */

"use strict";
// * Initialize webGL
const canvas = document.getElementById("myCanvas");
const renderer = new THREE.WebGLRenderer({
  canvas,
  antialias: true
});
renderer.setClearColor('#ffffff');    // set background color
renderer.setSize(window.innerWidth, window.innerHeight);
renderer.shadowMap.enabled = true;
renderer.shadowMapSoft = true;
renderer.shadowMapType = THREE.PCFSoftShadowMap;
// Create a new Three.js scene with camera and light
const scene = new THREE.Scene();
//scene.add(new THREE.AxesHelper());
const camera = new THREE.PerspectiveCamera(45, canvas.width / canvas.height,0.1, 1000);

window.addEventListener("resize", function () {
  renderer.setSize(window.innerWidth, window.innerHeight);
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
});
camera.position.set(0, -5.5, 3);
camera.lookAt(scene.position);

scene.add(new THREE.AmbientLight(0xd6d6d7));

const light = new THREE.SpotLight(0XFFFFFF);
scene.add(light);
light.position.set(0, 0, 6);
light.intensity = 0.5;
light.castShadow = true; // default false
light.shadow.mapSize.width = 10000;
light.shadow.mapSize.height = 10000;
light.penumbra = 1;



const Colors = {
  groundCeiling: 0x858585,
  lampe: 0xffff00,
  Cabel: 0x000000,
  Table: 0x346100,
  Legs: 0x4F2229,
};
const groundCeilingSize = {
  X: 10,
  Y: 10,
};

const lampeCabelSize = {
  raduisCabel: .005,
  longCabel: 1.3,
  raduisLampe: .07,
};
// to create ground
function createground() {
  const geometryGround = new THREE.PlaneGeometry(groundCeilingSize.X,
     groundCeilingSize.Y);
  const materialGround = new THREE.MeshPhongMaterial({ color: Colors.groundCeiling });
  const ground = new THREE.Mesh(geometryGround, materialGround);
  ground.receiveShadow = true;
  scene.add(ground);
}



// to create ceiling and lampe
function createCeiling() {
  const geometryCeiling = new THREE.PlaneGeometry(groundCeilingSize.X, groundCeilingSize.Y);
  const geometryCable = new THREE.CylinderGeometry(lampeCabelSize.raduisCabel, 
    lampeCabelSize.raduisCabel,
     lampeCabelSize.longCabel, 32);
  const geometryLampe = new THREE.SphereGeometry(lampeCabelSize.raduisLampe, 32, 16);

  const materialLampe = new THREE.MeshBasicMaterial({ color: Colors.lampe });
  const materialCable = new THREE.MeshBasicMaterial({ color: Colors.Cabel });
  const materialCeiling = new THREE.MeshBasicMaterial({ color: Colors.groundCeiling });

  const ceiling = new THREE.Mesh(geometryCeiling, materialCeiling);
  const cable = new THREE.Mesh(geometryCable, materialCable);
  const lampe = new THREE.Mesh(geometryLampe, materialLampe);
  //position the lampe with the cable
  cable.rotation.x = Math.PI / 2;
  cable.position.set(0, 0, 2.85);
  ceiling.position.set(0, 0, 3.5);
  lampe.position.set(0, 0, 2.2);

  scene.add(ceiling);
  scene.add(cable);
  scene.add(lampe);
}



const TableGeometry = {
  long: 2.35,
  frameHigh: 0.1,
  width: 1.32,
  frameWidth: 0.11,
  planX: 1.099,
  planY: 2.3,

};
const TablePosition = {
  frameLongX: 0.605,
  frameLongY: 0,
  frameLongZ: 1.03,
  frameShortX: 0,
  frameShortY: 1.205,
  frameShortZ: 1.03,
  planX: 0,
  planY: 0,
  planZ: 1.01,
};
// to create the table with legs
function createTable() {

  const materialTable = new THREE.MeshPhongMaterial({ color: Colors.Table });
  //create table walls
  for (let i = 0; i < 2; i++) {
    let minusl = -1;
    if (i == 1) {
      minusl = minusl * -1;
    }
    const geometryHigh = new THREE.BoxGeometry(TableGeometry.frameWidth,
       TableGeometry.long, TableGeometry.frameHigh);
    const geometrywidth = new THREE.BoxGeometry(TableGeometry.width, 
      TableGeometry.frameWidth, TableGeometry.frameHigh);

    const frameLong = new THREE.Mesh(geometryHigh, materialTable);
    const frameShort = new THREE.Mesh(geometrywidth, materialTable);

    frameLong.position.set(TablePosition.frameLongX * minusl,
       TablePosition.frameLongY, TablePosition.frameLongZ);
    frameShort.position.set(TablePosition.frameShortX, 
      TablePosition.frameShortY * minusl, TablePosition.frameShortZ);
    //enable shadow
    frameLong.receiveShadow = true;
    frameShort.receiveShadow = true;
    frameShort.castShadow = true;
    frameLong.castShadow = true;

    scene.add(frameLong);
    scene.add(frameShort);
  }
  //create the plane of the table and enable shadow
  const geometryPlane = new THREE.BoxGeometry(TableGeometry.planX, TableGeometry.planY, 0.001);
  const planeTable = new THREE.Mesh(geometryPlane, materialTable);
  planeTable.position.set(TablePosition.planX, TablePosition.planY, TablePosition.planZ);
  planeTable.receiveShadow = true;
  planeTable.castShadow = true;
  scene.add(planeTable);


  // create table lags
  const legsGeometry = {
    X: 0.1,
    Y: 0.1,
    Z: 1,
  };
  const legsPosition = {
    X: 0.5,
    Y: 1,
    Z: legsGeometry.Z * 0.5,
  };
  const geometryLegs = new THREE.BoxGeometry(legsGeometry.X, legsGeometry.Y, legsGeometry.Z);
  const materialLegs = new THREE.MeshPhongMaterial({ color: Colors.Legs });
  // position of table legs
  for (let i = 0; i < 4; i++) {
    const leg = new THREE.Mesh(geometryLegs, materialLegs);
    if (i == 0) {
      leg.position.set(legsPosition.X, legsPosition.Y, legsPosition.Z);
    }
    if (i == 1) {
      leg.position.set(-1 * legsPosition.X, legsPosition.Y, legsPosition.Z);
    }
    if (i == 2) {
      leg.position.set(-1 * legsPosition.X, -1 * legsPosition.Y, legsPosition.Z);
    }
    if (i == 3) {
      leg.position.set(legsPosition.X, -1 * legsPosition.Y, legsPosition.Z);
    }
    leg.castShadow = true;
    scene.add(leg);
  }
}

const planeNormal = new THREE.Vector3(0, 0, 1);

let spheres = [];
let ballPos = {
  x: [],
  y: [],
  z: [],
};
let ballSpeed = {
  x: [],
  y: [],
  z: [],
};
// to create n balls
function creatBalls(BallNumber) {
  const geometryBall = new THREE.SphereGeometry(ballRadius, 50, 50);
  for (let i = 0; i < BallNumber; i++) {
    let texture = new THREE.TextureLoader().load('PoolBallSkins/Ball' + (i + 8) + '.jpg');
    // immediately use the texture for material creation
    const materialball = new THREE.MeshPhongMaterial({ map: texture });
    const sphere = new THREE.Mesh(geometryBall, materialball);
    sphere.castShadow = true;
    sphere.receiveShadow = true;
    sphere.matrixAutoUpdate = false;
    //to give balls random speeds and random positions
    ballSpeed[i] = new THREE.Vector3(getRandomFloat(0.7, -0.7, 1),
     getRandomFloat(0.8, -0.8, 1), 0);
    ballPos[i] = new THREE.Vector3(getRandomFloat(0.4, -0.4, 1),
     getRandomFloat(-0.7, 0.7, 1), TablePosition.planZ + ballRadius);
    spheres.push(sphere);
    scene.add(sphere);
  }
}





// to friction the speed of each ball drops by "frictionTime" each second here 20% see below
function friction(IndexBall, frictionTime) {
  ballSpeed[IndexBall].x = ballSpeed[IndexBall].x -
   ballSpeed[IndexBall].x * (frictionTime / 60);
  ballSpeed[IndexBall].y = ballSpeed[IndexBall].y -
   ballSpeed[IndexBall].y * (frictionTime / 60);
}

// Reflection at the table walls with "frictionReflection" value here 20% see below
function reflectionCushions(IndexBall, frictionReflection) {
// to save the rest of the ball speed after reflection
  let speedAfterReflection = 1 - frictionReflection;
  // Reflection at the table walls
  if (ballPos[IndexBall].x > (TableGeometry.planX / 2 - ballRadius)) {
    ballSpeed[IndexBall].x = -Math.abs(ballSpeed[IndexBall].x) * speedAfterReflection;
  }
  if (ballPos[IndexBall].y > (TableGeometry.planY / 2 - ballRadius)) {
    ballSpeed[IndexBall].y = -Math.abs(ballSpeed[IndexBall].y) * speedAfterReflection;
  }
  if (ballPos[IndexBall].x < -(TableGeometry.planX / 2 - ballRadius)) {
    ballSpeed[IndexBall].x = -ballSpeed[IndexBall].x * speedAfterReflection;
  }
  if (ballPos[IndexBall].y < -(TableGeometry.planY / 2 - ballRadius)) {
    ballSpeed[IndexBall].y = -ballSpeed[IndexBall].y * speedAfterReflection;
  }
}



const computerClock = new THREE.Clock();
// to move all balls on the table 
function MoveBalls(BallNumber, frictionTime, frictionReflection) {
  const h = computerClock.getDelta();  // important: call before getElapsedTime!!!

  for (let i = 0; i < BallNumber; i++) {
    reflectionCushions(i, frictionReflection)
    friction(i, frictionTime);

   //roll the balls without sliding
    ballPos[i].add(ballSpeed[i].clone().multiplyScalar(h));

    const om = ballSpeed[i].length() / ballRadius;
    const axis = planeNormal.clone().cross(ballSpeed[i]).normalize();
    const dR = new THREE.Matrix4().makeRotationAxis(axis, om * h);
    spheres[i].matrix.premultiply(dR);
    spheres[i].matrix.setPosition(ballPos[i]);

  }
}


//frictions values
const frictions = {
  Time: 0.2,
  ReflectionWalls: 0.2,
  ReflectionBalls: 0.3,
};
const ballRadius = 0.05;
const BallsNumber = 8;
creatBalls(BallsNumber);
createground();
createCeiling();
createTable();

const controls = new THREE.TrackballControls(camera, renderer.domElement);
function render() {
  requestAnimationFrame(render);
  MoveBalls(BallsNumber, frictions.Time, frictions.ReflectionWalls);
  controls.update();
  renderer.render(scene, camera);
}
render();

//random function with min and max value
function getRandomFloat(min, max, decimals) {
  const str = (Math.random() * (max - min) + min).toFixed(decimals);
  return parseFloat(str);
}