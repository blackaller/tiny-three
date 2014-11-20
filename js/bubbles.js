// variation of http://threejs.org/examples/#canvas_interactive_particles

var container, stats;
var camera, scene, projector, renderer;

var PI2 = Math.PI * 2;

var programFill = function ( context ) {

	context.beginPath();
	context.arc( 0, 0, 0.5, 0, PI2, true );
	// context.fillRect(-0.125, -0.125, 100, 0.25);
	context.fillRect(-0.5, -0.5, 1, 1);
	context.fill();

}

var programStroke = function ( context ) {

	context.lineWidth = 0.025;
	context.beginPath();
	context.arc( 0, 0, 0.5, 0, PI2, true );
	// context.fillRect(-0.125, -0.125, 100, 0.25);
	// context.strokeRect(-0.5, -0.5, 1, 1);
	context.fill();
	// context.stroke();

}

var mouse = { x: 0, y: 0 }, INTERSECTED;

init();
animate();

function init() {

	container = document.createElement( 'div' );
	document.body.appendChild( container );

	camera = new THREE.PerspectiveCamera( 70, window.innerWidth / window.innerHeight, 1, 10000 );
	camera.position.set( 0, 300, 500 );

	scene = new THREE.Scene();

	for ( var i = 0; i < 1000; i ++ ) {

		var particle = new THREE.Sprite( new THREE.SpriteCanvasMaterial( { color: 0xffd700, program: programStroke } ) ); // Math.random() * 0xff0000 + 
		particle.position.x = Math.random() * 800 - 400;
		particle.position.y = Math.random() * 800 - 400;
		particle.position.z = Math.random() * 800 - 400;
		particle.scale.x = particle.scale.y = Math.random() * 10 + 30;
		scene.add( particle );

	}

	projector = new THREE.Projector();

	renderer = new THREE.CanvasRenderer();


	renderer.setClearColor( 0x03003d );
	renderer.setSize( window.innerWidth, window.innerHeight );
	container.appendChild( renderer.domElement );

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

	mouse.x = ( event.clientX / window.innerWidth ) * 2 - 1;
	mouse.y = - ( event.clientY / window.innerHeight ) * 2 + 1;

}

//

function animate() {

	requestAnimationFrame( animate );

	render();
	stats.update();

}

var radius = 600;
var theta = 0;

function render() {

	// rotate camera

	theta += 0.01;

	camera.position.x = radius * Math.sin( THREE.Math.degToRad( theta ) );
	camera.position.y = radius * Math.cos( THREE.Math.degToRad( theta ) );
	camera.position.z = radius * Math.sin( THREE.Math.degToRad( theta ) );
	camera.lookAt( scene.position );

	// find intersections

	camera.updateMatrixWorld();

	var vector = new THREE.Vector3( mouse.x, mouse.y, 0.5 );
	projector.unprojectVector( vector, camera );

	var raycaster = new THREE.Raycaster( camera.position, vector.sub( camera.position ).normalize() );

	var intersects = raycaster.intersectObjects( scene.children );

	if ( intersects.length > 0 ) {

		if ( INTERSECTED != intersects[ 0 ].object ) {

			if ( INTERSECTED ) INTERSECTED.material.program = programStroke;

			INTERSECTED = intersects[ 0 ].object;
			// INTERSECTED.material.program = programFill;
			INTERSECTED.material= new THREE.SpriteCanvasMaterial( { color: 0xff0080, program: programStroke } );

		}

	} else {

		if ( INTERSECTED ) {
			// INTERSECTED.material.program = programStroke;
			INTERSECTED.material = new THREE.SpriteCanvasMaterial( { color: 0xffd700, program: programStroke } );
		}
		INTERSECTED = null;

	}

	renderer.render( scene, camera );

}