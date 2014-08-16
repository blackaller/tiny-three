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

  camera = new THREE.PerspectiveCamera( 20, window.innerWidth / window.innerHeight, 1, 10000 );
  camera.position.set( 0, 0, 2000 );

  scene = new THREE.Scene();

  projector = new THREE.Projector();

  renderer = new THREE.WebGLRenderer({antialias: false});


  renderer.setClearColor( 0x03003d );
  renderer.setSize( window.innerWidth, window.innerHeight );
  container.appendChild( renderer.domElement );

  // urls of the images, one per half axis
  var urls = [
    'textures/cube/skybox/px.jpg',
    'textures/cube/skybox/nx.jpg',
    'textures/cube/skybox/py.jpg',
    'textures/cube/skybox/ny.jpg',
    'textures/cube/skybox/pz.jpg',
    'textures/cube/skybox/nz.jpg'
  ],

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
  Ico = new THREE.Mesh(new THREE.IcosahedronGeometry(125,1), pinkMat);
  Ico.rotation.z = 0.5;
  scene.add(Ico);


  Ico2 = new THREE.Mesh(new THREE.IcosahedronGeometry(175,1), pinkMat);
  Ico2.position.x = 0;
  //Ico2.material.side = THREE.DoubleSide;
  scene.add(Ico2);

  Ico3 = new THREE.Mesh(new THREE.IcosahedronGeometry(125,1), pinkMat);
  scene.add(Ico3);


  stats = new Stats();
  stats.domElement.style.position = 'absolute';
  stats.domElement.style.top = '0px';
  container.appendChild( stats.domElement );

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
 
  
  Ico.rotation.x += 2/200;
  Ico.rotation.y += 2/400;

  Ico2.rotation.x -= 2/500;
  Ico2.rotation.y -= 2/300;

  Ico3.rotation.x += 2/200;
  Ico3.rotation.y += 2/400;

}

var radius = 400;
var theta = 0;

function render() {
  theta += 0.5;
  Ico.position.z = radius * 4 * Math.cos( THREE.Math.degToRad( theta ) );
  Ico.position.x = radius * Math.sin( THREE.Math.degToRad( theta ) );
  Ico.position.y = radius/3 * Math.sin( THREE.Math.degToRad( theta/4 ) );

  Ico3.position.z = radius * 2 * Math.sin( THREE.Math.degToRad( 180 + theta/2 ) );
  Ico3.position.x = radius * Math.cos( THREE.Math.degToRad( 180 + theta/2 ) );
  Ico3.position.y = radius * Math.cos( THREE.Math.degToRad( 180 + theta ) );
  // rotate camera
 

  camera.position.x = 1500 * Math.sin( THREE.Math.degToRad( theta ) );
  //camera.position.y = 1000 * Math.cos( THREE.Math.degToRad( theta ) );
  camera.position.z = 1500 * Math.cos( THREE.Math.degToRad( theta ) );
  camera.lookAt( scene.position );

  camera.updateMatrixWorld();
  

  red   = 50 // Math.floor(Math.sin(theta/4 + 0) * 127 + 128);
  green = 0 // Math.floor(Math.sin(theta/20 + 1) * 127 + 128);
  blue  = Math.floor(Math.cos(theta/52 + 2) * 127); // + 128;


  //renderer.setClearColor( "rgb(" + red + "," + green + "," + blue + ")" );
  renderer.setClearColor( "rgb(" + red + ","+ green + "," +  blue + ")" );
  renderer.render( scene, camera );

}