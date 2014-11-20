var container, stats;
var camera, scene, projector, renderer, Ico, Ico2, Ico3, cubemap;

var PI2 = Math.PI * 2;

var uniforms1, uniforms2;

var clock = new THREE.Clock();


var mouse = { x: 0, y: 0 }, INTERSECTED;

init();
animate();

function init() {

  container = document.createElement( 'div' );
  document.body.appendChild( container );
  // 32
  camera = new THREE.PerspectiveCamera( 72, window.innerWidth / window.innerHeight, 0.1, 10000 );
  camera.position.set( 500, 0, 0 ); // original is 0

  scene = new THREE.Scene();
  scene.position.x = 350; // original 0

  projector = new THREE.Projector();

  renderer = new THREE.WebGLRenderer({antialias: false});


  renderer.setClearColor( 0xff0066 );
  renderer.setSize( window.innerWidth, window.innerHeight );
  container.appendChild( renderer.domElement );


  uniforms1 = {
          time: { type: "f", value: 1.0 },
          resolution: { type: "v2", value: new THREE.Vector2() }
        };

        uniforms2 = {
          time: { type: "f", value: 1.0 },
          resolution: { type: "v2", value: new THREE.Vector2() },
          texture: { type: "t", value: THREE.ImageUtils.loadTexture( "textures/disturb.jpg" ) }
        };

        uniforms2.texture.value.wrapS = uniforms2.texture.value.wrapT = THREE.RepeatWrapping;

        var params = [
          [ 'fragment_shader1', uniforms1 ],
          [ 'fragment_shader2', uniforms2 ],
          [ 'fragment_shader3', uniforms1 ],
          [ 'fragment_shader4', uniforms1 ]
        ];

  
  var shaderMaterial0 = new THREE.ShaderMaterial( {

            uniforms: params[ 0 ][ 1 ],
            vertexShader: document.getElementById( 'vertexShader' ).textContent,
            fragmentShader: document.getElementById( params[ 0 ][ 0 ] ).textContent

            } );

  var shaderMaterial1 = new THREE.ShaderMaterial( {

            uniforms: params[ 1 ][ 1 ],
            vertexShader: document.getElementById( 'vertexShader' ).textContent,
            fragmentShader: document.getElementById( params[ 1 ][ 0 ] ).textContent

            } );

  var shaderMaterial2 = new THREE.ShaderMaterial( {

            uniforms: params[ 2 ][ 1 ],
            vertexShader: document.getElementById( 'vertexShader' ).textContent,
            fragmentShader: document.getElementById( params[ 2 ][ 0 ] ).textContent

            } );

  // urls of the images, one per half axis
  var urls = [
    'textures/cube/rainbow/px.jpg',
    'textures/cube/rainbow/nx.jpg',
    'textures/cube/rainbow/py.jpg',
    'textures/cube/rainbow/ny.jpg',
    'textures/cube/rainbow/pz.jpg',
    'textures/cube/rainbow/nz.jpg'
  ];

  // wrap it up into the object that we need
  cubemap = THREE.ImageUtils.loadTextureCube(urls);

  // set the format, likely RGB unless you've gone crazy
  cubemap.format = THREE.RGBFormat;

var reflection = THREE.ImageUtils.loadTextureCube( [ 'textures/disturb.jpg', 'textures/disturb.jpg', 'textures/disturb.jpg', 'textures/disturb.jpg', 'textures/disturb.jpg', 'textures/disturb.jpg' ] );
  // Material
  var pinkMat = new THREE.MeshPhongMaterial({
    color      :  new THREE.Color("rgb(255,00,000)"),
    emissive   :  new THREE.Color("rgb(000,255,000)"),
    specular   :  new THREE.Color("rgb(000,000,255)"),
    shininess  :  1,
    shading    :  THREE.FlatShading,
    transparent: 1,
    opacity    : 1,
    envMap     : reflection,
    reflectivity :1,
    combine    : THREE.MixOperation
    
  });


   // Skybox
    var shader = THREE.ShaderLib[ "cube" ];
    shader.uniforms[ "tCube" ].value = cubemap;

    var skyMaterial = new THREE.ShaderMaterial( {

      fragmentShader: shaderMaterial0.fragmentShader,
      vertexShader: shaderMaterial0.vertexShader,
      uniforms: shaderMaterial0.uniforms,
      depthWrite: false,
      side: THREE.BackSide

    } );

  var skybox = new THREE.Mesh( new THREE.BoxGeometry( 2600, 2600, 2600 ), skyMaterial );
  
  
  var L1 = new THREE.PointLight( 0xffffff, 1);
  L1.position.z = 200;
  L1.position.y = 300;
  L1.position.x = 400;
  scene.add(L1);

  var L2 = new THREE.PointLight( 0xffffff, 1);
  L2.position.z = 100;
  L2.position.y = 500;
  L2.position.x = -600;
  scene.add(L2);



  // IcoSphere -> THREE.IcosahedronGeometry(80, 1) 1-4
  Ico = new THREE.Mesh(new THREE.IcosahedronGeometry(325,1), pinkMat);
  Ico.rotation.z = 0.5;
  scene.add(Ico);


  Ico2 = new THREE.Mesh(new THREE.IcosahedronGeometry(325,1), pinkMat);
  Ico2.position.x = 0;
  //Ico2.material.side = THREE.DoubleSide;
  scene.add(Ico2);

  Ico3 = new THREE.Mesh(new THREE.IcosahedronGeometry(325,1), pinkMat);
  scene.add(Ico3);

  Ico4 = new THREE.Mesh(new THREE.IcosahedronGeometry(325,1), pinkMat);
  scene.add(Ico4);

  scene.add(skybox);


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

  Ico4.rotation.x += 2/600;
  Ico4.rotation.y += 2/400;

}

var radius = 500;
var theta = 0;

function render() {
  var delta = clock.getDelta();

        uniforms1.time.value += delta * 5;
        uniforms2.time.value = clock.elapsedTime;

  theta += 1 ;
  Ico.position.z = radius * 4 * Math.cos( THREE.Math.degToRad( theta ) );
  Ico.position.x = radius * Math.sin( THREE.Math.degToRad( theta ) );
  Ico.position.y = radius * 3 * Math.sin( THREE.Math.degToRad( theta/4 ) );

  Ico3.position.z = radius * 3 * Math.sin( THREE.Math.degToRad( 180 + theta/2 ) );
  Ico3.position.x = radius * Math.cos( THREE.Math.degToRad( 180 + theta/6 ) );
  Ico3.position.y = radius * Math.cos( THREE.Math.degToRad( 200 + theta ) );

  Ico4.position.z = radius * 2 * Math.cos( THREE.Math.degToRad( 270 + theta/2 ) );
  Ico4.position.x = radius * Math.cos( THREE.Math.degToRad( 270 + theta/8 ) );
  Ico4.position.y = radius * 2 * Math.sin( THREE.Math.degToRad( 200 + theta ) );



  // rotate camera

  camera.position.x = 1000 * Math.sin( THREE.Math.degToRad( theta ) );
  camera.position.y = -1000 * Math.cos( THREE.Math.degToRad( theta ) );
  camera.position.z = 1000 * Math.cos( THREE.Math.degToRad( theta ) );

  //camera.lookAt( scene.position );
  camera.lookAt( Ico3.position );


  camera.updateMatrixWorld();
  

  //red   =  255; // Math.floor(Math.cos(theta/3) * 127 + 128);
  //green =  Math.floor(Math.sin(theta/20) * 127 + 128);
  //blue  =  Math.floor(Math.cos(theta/30) * 127 + 128); // + 128;


  //renderer.setClearColor( "rgb(" + red + "," + green + "," + blue + ")" );
  //renderer.setClearColor( "rgb(" + red + ","+ green + "," +  blue + ")" );
  renderer.setSize( window.innerWidth, window.innerHeight );
  renderer.render( scene, camera );

}