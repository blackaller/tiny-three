// based on http://threejs.org/examples/#canvas_particles_waves

var SEPARATION = 100, AMOUNTX = 50, AMOUNTY = 50;

var container, stats;
var camera, scene, renderer;

var particles, particle, count = 0;

var mouseX = 0, mouseY = 0;

var windowHalfX = window.innerWidth / 2;
var windowHalfY = window.innerHeight / 2;

init();
animate();

function init() {

	container = document.createElement( 'div' );
	document.body.appendChild( container );

	camera = new THREE.PerspectiveCamera( 75, window.innerWidth / window.innerHeight, 1, 10000 );
	camera.position.z = 1000;
	scene = new THREE.Scene();

	particles = new THREE.Geometry();
	var PI2 = Math.PI * 2;

		
	var pMaterialGold = new THREE.SpriteCanvasMaterial( {
		color: 0xffd700,
		program: function ( context ) {
			context.beginPath();
			//context.arc( 0, 0, 9.5, 0, PI2, true );
			context.fillRect(0,0,25,25);
			context.fill();
		}

	} );

	var pMaterialPink = new THREE.SpriteCanvasMaterial( {
		color: 0xff0077,
		program: function ( context ) {
			context.beginPath();
			//context.arc( 0, 0, 9.5, 0, PI2, true );
			context.fillRect(0,0,25,25);
			context.fill();
		}

	} );

                                                          
	
	var i = 0;
	for ( var ix = 0; ix < AMOUNTX; ix ++ ) {
		for ( var iy = 0; iy < AMOUNTY; iy ++ ) {
			if ( (ix + iy) % 3 == 0 )
				particle = particles[ i ++ ] = new THREE.Sprite( pMaterialPink );
			else
				particle = particles[ i ++ ] = new THREE.Sprite( pMaterialGold );

			particle.position.x = ix * SEPARATION - ( ( AMOUNTX * SEPARATION ) / 2 );
			particle.position.z = iy * SEPARATION - ( ( AMOUNTY * SEPARATION ) / 2 );
			particle.scale.multiplyScalar( Math.random() + 0.5 );
			scene.add( particle );

		}
	}

	renderer = new THREE.CanvasRenderer();
	renderer.setClearColor( 0x03003d );
	renderer.setSize( window.innerWidth, window.innerHeight );
	container.appendChild( renderer.domElement );

	stats = new Stats();
	stats.domElement.style.position = 'absolute';
	stats.domElement.style.top = '0px';
	container.appendChild( stats.domElement );

	document.addEventListener( 'mousemove', onDocumentMouseMove, false );
	document.addEventListener( 'touchstart', onDocumentTouchStart, false );
	document.addEventListener( 'touchmove', onDocumentTouchMove, false );

	//

	window.addEventListener( 'resize', onWindowResize, false );

}
function onWindowResize() {

	windowHalfX = window.innerWidth / 2;
	windowHalfY = window.innerHeight / 2;

	camera.aspect = window.innerWidth / window.innerHeight;
	camera.updateProjectionMatrix();

	renderer.setSize( window.innerWidth, window.innerHeight );

}


function onDocumentMouseMove( event ) {

	mouseX = event.clientX - windowHalfX;
	mouseY = event.clientY - windowHalfY;

}

function onDocumentTouchStart( event ) {

	if ( event.touches.length === 1 ) {

		event.preventDefault();

		mouseX = event.touches[ 0 ].pageX - windowHalfX;
		mouseY = event.touches[ 0 ].pageY - windowHalfY;

	}

}

function onDocumentTouchMove( event ) {

	if ( event.touches.length === 1 ) {

		event.preventDefault();

		mouseX = event.touches[ 0 ].pageX - windowHalfX;
		mouseY = event.touches[ 0 ].pageY - windowHalfY;

	}

}


function animate() {

	requestAnimationFrame( animate );

	render();
	stats.update();

}

function render() {
	camera.position.x += ( mouseX - camera.position.x ) * .05;
	camera.position.y += ( - mouseY - camera.position.y ) * .05;
	camera.lookAt( scene.position );
	var i = 0;
	
	for ( var ix = 0; ix < AMOUNTX; ix ++ ) {
		for ( var iy = 0; iy < AMOUNTY; iy ++ ) {
			particle = particles[ i++ ];
			particle.position.y = ( 10/Math.sin( ( ix + count ) * 0.5 ) * 100 ) + ( 10/Math.sin( ( iy + count ) * 0.5 ) * 100 );
			particle.position.x = ( 10/Math.sin( ( ix + count ) * 1.5 ) * 150 ) + ( 10/Math.sin( ( iy + count ) * 1.5 ) * 150 );
			//particle.scale.x = particle.scale.y = ( Math.sin( ( ix + count ) * 0.3 ) + 1 ) * 4 +
				//( Math.sin( ( iy + count ) * 0.5 ) + 1 ) * 4;
		}
	}
	
	//camera.position.x = Math.floor(Math.cos( count ) * 50);
	//camera.position.z = Math.floor(Math.cos( count ) * 5);
	//camera.position.y = Math.floor(Math.sin( count ) * 5);
	
	renderer.render( scene, camera );
	count += 0.001;
	}