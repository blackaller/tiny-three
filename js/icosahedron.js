// Inspired by http://codepen.io/alvarobyrne/pen/HIGoa

var container, stats;
var camera, scene, projector, renderer, Ico, Ico2, Ico3, cubemap;

var PI2 = Math.PI * 2;


var mouse = { x: 0, y: 0 }, INTERSECTED;

init();
animate();

function init() {

  container = document.createElement( 'div' );
  document.body.appendChild( container );
/*
<<<<<<< HEAD
  camera = new THREE.PerspectiveCamera( 20, window.innerWidth / window.innerHeight, 1, 10000 );
  camera.position.set( 0, 0, 2000 );
=======
*/
  camera = new THREE.PerspectiveCamera( 38, window.innerWidth / window.innerHeight, 0.1, 10000 );
  camera.position.set( 500, 0, 2000 ); // original is 0
//>>>>>>> 56d4debccd54672638e527ded81e8f5eda75bea7


  scene = new THREE.Scene();
  scene.position.x = 350; // original 0

  projector = new THREE.Projector();

  renderer = new THREE.WebGLRenderer({antialias: false});


  renderer.setClearColor( 0x03003d );
  renderer.setSize( window.innerWidth, window.innerHeight );
  container.appendChild( renderer.domElement );

  // urls of the images, one per half axis
  var urls = [
    'textures/cube/roxy/px.jpg',
    'textures/cube/roxy/nx.jpg',
    'textures/cube/roxy/py.jpg',
    'textures/cube/roxy/ny.jpg',
    'textures/cube/roxy/pz.jpg',
    'textures/cube/roxy/nz.jpg'
  ];

  // wrap it up into the object that we need
  cubemap = THREE.ImageUtils.loadTextureCube(urls);

  // set the format, likely RGB unless you've gone crazy
  cubemap.format = THREE.RGBFormat;


  // Material
  var pinkMat = new THREE.MeshPhongMaterial({
    color      :  new THREE.Color("rgb(30,0,30)"),
    emissive   :  new THREE.Color("rgb(30,0,30)"),
    specular   :  new THREE.Color("rgb(100,0,60)"),
    shininess  :  10,
    shading    :  THREE.FlatShading,
    transparent: 1,
    opacity    : 1,
    envMap     : cubemap,
    reflectivity :0.1,
    combine    : THREE.MixOperation
    
  });

  var L1 = new THREE.PointLight( 0xff0066, 2);
  L1.position.z = 200;
  L1.position.y = 300;
  L1.position.x = 400;
  scene.add(L1);

  var L2 = new THREE.PointLight( 0xff, 2);
  L2.position.z = 100;
  L2.position.y = 500;
  L2.position.x = -600;
  scene.add(L2);

  // IcoSphere -> THREE.IcosahedronGeometry(80, 1) 1-4
/*<<<<<<< HEAD
  Ico = new THREE.Mesh(new THREE.IcosahedronGeometry(150,1), pinkMat); // 125
=======*/
  Ico = new THREE.Mesh(new THREE.IcosahedronGeometry(225,1), pinkMat);
//>>>>>>> 56d4debccd54672638e527ded81e8f5eda75bea7
  Ico.rotation.z = 0.5;
  scene.add(Ico);


/*<<<<<<< HEAD
  Ico2 = new THREE.Mesh(new THREE.IcosahedronGeometry(250,1), pinkMat); // 175
=======*/
  Ico2 = new THREE.Mesh(new THREE.IcosahedronGeometry(475,1), pinkMat);
//>>>>>>> 56d4debccd54672638e527ded81e8f5eda75bea7
  Ico2.position.x = 0;
  //Ico2.material.side = THREE.DoubleSide;
  scene.add(Ico2);

/*<<<<<<< HEAD
  Ico3 = new THREE.Mesh(new THREE.IcosahedronGeometry(150,1), pinkMat); // 125
=======*/
  Ico3 = new THREE.Mesh(new THREE.IcosahedronGeometry(225,1), pinkMat);
//>>>>>>> 56d4debccd54672638e527ded81e8f5eda75bea7
  scene.add(Ico3);


  stats = new Stats();
  stats.domElement.style.position = 'absolute';
  stats.domElement.style.top = '0px';
  //container.appendChild( stats.domElement );

  document.addEventListener( 'mousemove', onDocumentMouseMove, false );

  //

  window.addEventListener( 'resize', onWindowResize, false );

}

function onWindowResize() {

  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();

  renderer.setSize( window.innerWidth, window.innerHeight );

}

function onDocumentMouseMove( event ) {

  event.preventDefault();

}

//

function animate() {

  requestAnimationFrame( animate );

  render();
  stats.update();
 
  
  Ico.rotation.x += 2/400;
  Ico.rotation.y += 2/600;

  Ico2.rotation.x -= 2/600;
  Ico2.rotation.y -= 2/400;

  Ico3.rotation.x += 2/400;
  Ico3.rotation.y += 2/600;

}

var radius = 400;
var theta = 0;

function render() {
  theta += 0.25;
  Ico.position.z = radius * 4 * Math.cos( THREE.Math.degToRad( theta ) );
  Ico.position.x = radius * Math.sin( THREE.Math.degToRad( theta ) );
  Ico.position.y = radius/3 * Math.sin( THREE.Math.degToRad( theta/4 ) );

  Ico3.position.z = radius * 3 * Math.sin( THREE.Math.degToRad( 180 + theta/2 ) );
  Ico3.position.x = radius * Math.cos( THREE.Math.degToRad( 180 + theta/2 ) );
  Ico3.position.y = radius * Math.cos( THREE.Math.degToRad( 180 + theta ) );
  // rotate camera
 

  camera.position.x = 1500 * Math.sin( THREE.Math.degToRad( theta ) );
  camera.position.y = 1000 * Math.cos( THREE.Math.degToRad( theta ) );
  camera.position.z = 1500 * Math.cos( THREE.Math.degToRad( theta ) );

  camera.lookAt( scene.position );

  camera.updateMatrixWorld();
  

/*<<<<<<< HEAD
  red   = 35 // 50 // Math.floor(Math.sin(theta/4 + 0) * 127 + 128);
  green = 0 // Math.floor(Math.sin(theta/20 + 1) * 127 + 128);
  blue  = 20 // Math.floor(Math.cos(theta/52 + 2) * 127); // + 128;
=======*/
  red   = 37 // Math.floor(Math.sin(theta/4 + 0) * 127 + 128);
  green = 0 // Math.floor(Math.sin(theta/20 + 1) * 127 + 128);
  blue  = 24 // Math.floor(Math.cos(theta/52 + 2) * 127); // + 128;
//>>>>>>> 56d4debccd54672638e527ded81e8f5eda75bea7


  //renderer.setClearColor( "rgb(" + red + "," + green + "," + blue + ")" );
  renderer.setClearColor( "rgb(" + red + ","+ green + "," +  blue + ")" );
  renderer.setSize( window.innerWidth, window.innerHeight );
  renderer.render( scene, camera );

}