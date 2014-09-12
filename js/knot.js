// based on http://aerotwist.com/tutorials/create-your-own-environment-maps/
// and http://threejs.org/examples/#canvas_geometry_panorama

var container, stats;
var camera, scene, projector, renderer, cubemap, torus, wemo;

var wemomeshes = [];

var PI2 = Math.PI * 2;
var time = 0;
var ORIGIN = new THREE.Vector3();

var mouse = { x: 0, y: 0 }, INTERSECTED;

init();
animate();

function init() {

  container = document.createElement( 'div' );
  document.body.appendChild( container );

  camera = new THREE.PerspectiveCamera( 20, window.innerWidth / window.innerHeight, 1, 10000 );
  camera.position.set( 0, 0, 5000 );

  scene = new THREE.Scene();

  projector = new THREE.Projector();

  renderer = new THREE.WebGLRenderer({antialias: false});


  renderer.setClearColor( 0x03003d );
  renderer.setSize( window.innerWidth, window.innerHeight );
  container.appendChild( renderer.domElement );

  // urls1 cubemap texture by <a href="http://www.zfight.com
  var urls1 = [
    'textures/cube/skybox/px.jpg',
    'textures/cube/skybox/nx.jpg',
    'textures/cube/skybox/py.jpg',
    'textures/cube/skybox/ny.jpg',
    'textures/cube/skybox/pz.jpg',
    'textures/cube/skybox/nz.jpg'
  ];

  // urls2 cubemap texture from http://aerotwist.com/tutorials/create-your-own-environment-maps/
  var urls2 = [
    'textures/cube/canary/pos-x.png',
    'textures/cube/canary/neg-x.png',
    'textures/cube/canary/pos-y.png',
    'textures/cube/canary/neg-y.png',
    'textures/cube/canary/pos-z.png',
    'textures/cube/canary/neg-z.png'
  ];

  var cubemap = THREE.ImageUtils.loadTextureCube(urls1);
  cubemap.format = THREE.RGBFormat;

  // Skybox
  var shader = THREE.ShaderLib[ "cube" ];
  shader.uniforms[ "tCube" ].value = cubemap;

  var material = new THREE.ShaderMaterial( {

    fragmentShader: shader.fragmentShader,
    vertexShader: shader.vertexShader,
    uniforms: shader.uniforms,
    depthWrite: false,
    side: THREE.BackSide

  } );

  var skybox = new THREE.Mesh( new THREE.BoxGeometry( 700, 700, 700 ), material );

  var ambient = new THREE.AmbientLight( 0xffffff );
  scene.add(ambient);

  var pointLight = new THREE.PointLight( 0xffffff, 2 );
  scene.add( pointLight );

  var reflectionMaterial = new THREE.MeshBasicMaterial({
    color: 0xcccccc,
    envMap: cubemap
  });



  var loader = new THREE.JSONLoader(),
        callbackKey = function(geometry) {createScene(geometry,  0, 0, 0, 5, reflectionMaterial)};
        loader.load("geometry/wemo-3d-1.js", callbackKey);

 torus = new THREE.Mesh(
    new THREE.TorusKnotGeometry(55,20,110),
    reflectionMaterial
  );

  //scene.add(torus);
  scene.add(wemo);
  scene.add(camera);
  scene.add(skybox);

  /*
  stats = new Stats();
  stats.domElement.style.position = 'absolute';
  stats.domElement.style.top = '0px';
  container.appendChild( stats.domElement );
  *

  document.addEventListener( 'mousemove', onDocumentMouseMove, false );

  //

  window.addEventListener( 'resize', onWindowResize, false );


  function createScene(geometry, x, y, z, scale) {
        wemo = new THREE.Mesh(geometry, reflectionMaterial);
        wemo.position.set(x, y, z);
        wemo.scale.set(scale, scale, scale);
        wemomeshes.push(wemo);
        scene.add(wemo);
      }
}



function onWindowResize() {

  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();

  renderer.setSize( window.innerWidth, window.innerHeight );

}

function onDocumentMouseMove( event ) {

  event.preventDefault();

}

function animate() {
  requestAnimationFrame( animate );
  render();
  //stats.update();
  //torus.rotation.x += 2/400;
  //torus.rotation.y += 2/600;
  //wemo.rotation.x += 1/1200;
  wemo.rotation.y += 1/500;

}


function render() {
  time += 0.0005;

  camera.position.x = Math.sin(time) * 400;
  camera.position.z = Math.cos(time) * 400;
  camera.lookAt(ORIGIN);
  renderer.render(scene,camera);

}