// based on http://threejs.org/examples/#canvas_geometry_panorama

var camera, scene, renderer;

var texture_placeholder,
isUserInteracting = false,
onMouseDownMouseX = 0, onMouseDownMouseY = 0,
lon = 90, onMouseDownLon = 0,
lat = 0, onMouseDownLat = 0,
phi = 0, theta = 0,
target = new THREE.Vector3();

init();
animate();

function init() {

	var container, mesh;

	container = document.createElement('div');
	document.body.appendChild(container);

	camera = new THREE.PerspectiveCamera( 50, window.innerWidth / window.innerHeight, 1, 1100 );

	scene = new THREE.Scene();

	texture_placeholder = document.createElement( 'canvas' );
	texture_placeholder.width = 128;
	texture_placeholder.height = 128;

	var context = texture_placeholder.getContext( '2d' );
	context.fillStyle = 'rgb( 200, 200, 200 )';
	context.fillRect( 0, 0, texture_placeholder.width, texture_placeholder.height );

	// cubemap texture by <a href="http://www.zfight.com
	var materials = [

		loadTexture( 'textures/cube/roxy/px.jpg' ), // right
		loadTexture( 'textures/cube/roxy/nx.jpg' ), // left
		loadTexture( 'textures/cube/roxy/py.jpg' ), // top
		loadTexture( 'textures/cube/roxy/ny.jpg' ), // bottom
		loadTexture( 'textures/cube/roxy/pz.jpg' ), // back
		loadTexture( 'textures/cube/roxy/nz.jpg' )  // front

	];

	mesh = new THREE.Mesh( new THREE.BoxGeometry( 300, 300, 300, 7, 7, 7 ), new THREE.MeshFaceMaterial( materials ) );
	mesh.scale.x = - 1;
	scene.add( mesh );

	renderer = new THREE.CanvasRenderer();
	renderer.setSize( window.innerWidth, window.innerHeight );

	container.appendChild( renderer.domElement );

	document.addEventListener( 'mousedown', onDocumentMouseDown, false );
	document.addEventListener( 'mousemove', onDocumentMouseMove, false );
	document.addEventListener( 'mouseup', onDocumentMouseUp, false );
	document.addEventListener( 'mousewheel', onDocumentMouseWheel, false );

	document.addEventListener( 'touchstart', onDocumentTouchStart, false );
	document.addEventListener( 'touchmove', onDocumentTouchMove, false );

	//

	window.addEventListener( 'resize', onWindowResize, false );

}

function onWindowResize() {

	camera.aspect = window.innerWidth / window.innerHeight;
	camera.updateProjectionMatrix();

	renderer.setSize( window.innerWidth, window.innerHeight );

}

function loadTexture( path ) {

	var texture = new THREE.Texture( texture_placeholder );
	var material = new THREE.MeshBasicMaterial( { map: texture, overdraw: 0.5 } );

	var image = new Image();
	image.onload = function () {

		texture.image = this;
		texture.needsUpdate = true;

	};
	image.src = path;

	return material;

}

function onDocumentMouseDown( event ) {

	event.preventDefault();

	isUserInteracting = true;

	onPointerDownPointerX = event.clientX;
	onPointerDownPointerY = event.clientY;

	onPointerDownLon = lon;
	onPointerDownLat = lat;

}

function onDocumentMouseMove( event ) {

	if ( isUserInteracting === true ) {

		lon = ( onPointerDownPointerX - event.clientX ) * 0.1 + onPointerDownLon;
		lat = ( event.clientY - onPointerDownPointerY ) * 0.1 + onPointerDownLat;

	}

}

function onDocumentMouseUp( event ) {

	isUserInteracting = false;

}
// Let's disable this
function onDocumentMouseWheel( event ) {

	//camera.fov -= event.wheelDeltaY * 0.05;
	//camera.updateProjectionMatrix();

}


function onDocumentTouchStart( event ) {

	if ( event.touches.length == 1 ) {

		event.preventDefault();

		onPointerDownPointerX = event.touches[ 0 ].pageX;
		onPointerDownPointerY = event.touches[ 0 ].pageY;

		onPointerDownLon = lon;
		onPointerDownLat = lat;

	}

}

function onDocumentTouchMove( event ) {

	if ( event.touches.length == 1 ) {

		event.preventDefault();

		lon = ( onPointerDownPointerX - event.touches[0].pageX ) * 0.1 + onPointerDownLon;
		lat = ( event.touches[0].pageY - onPointerDownPointerY ) * 0.1 + onPointerDownLat;

	}

}

function animate() {

	requestAnimationFrame( animate );
	update();

}

function update() {

	if ( isUserInteracting === false && false) {

		lon += 0.1;

	}

	lat = Math.max( - 85, Math.min( 85, lat ) );
	phi = THREE.Math.degToRad( 90 - lat );
	theta = THREE.Math.degToRad( lon );

	target.x = 500 * Math.sin( phi ) * Math.cos( theta );
	target.y = 500 * Math.cos( phi );
	target.z = 500 * Math.sin( phi ) * Math.sin( theta );

	camera.lookAt( target );

	renderer.render( scene, camera );

}