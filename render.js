/* L-system implementation
 * Alireza Forouzandeh Nezhad -- a.forouzandeh@ut.ac.ir
 * June 2021
 */

function parseGrammar(maxDepth, axiom, grammar) {    
    var parsed = axiom;
    // iterate over axiom
    for (var depth = 0; depth < maxDepth; depth++) {
        var nextDepth = '';
        //console.log('Depth:' + depth + ' Parsed: '+parsed);
        for (var i = 0; i < parsed.length; i++) {
            var currentChar = parsed.charAt(i);
            if(currentChar in grammar) {
                nextDepth += grammar[currentChar];
            } else {
                nextDepth += currentChar;
            }
        }
        parsed = nextDepth;
    }
    return parsed;

}

function reRender() {
    // Check for empty fields 
    var depth = $('#depth').val();
    if(depth == "") {
        alert('Error: Depth is empty !');
        return;   
    }
    var angle = $('#angle').val();
    if(angle == "") {
        alert('Error: Angle is empty !');
        return;   
    }
    var axiom = $('#axiom').val();
    if(axiom == "") {
        alert('Error: Axiom is empty !');
        return;   
    }

    var rule0Name = $('#rule0Name').val();
    var rule1Name = $('#rule1Name').val();
    var rule2Name = $('#rule2Name').val();
    var rule0 = $('#rule0').val();
    var rule1 = $('#rule1').val();
    var rule2 = $('#rule2').val();

    // Process grammar (convert tree to a single string)
    // hence we won't have any recursion when rendering

    var grammar = {}

    if(rule0Name != "") { 
        grammar[rule0Name] = rule0;
    }

    if(rule1Name != "") {
        grammar[rule1Name] = rule1;
    }

    if(rule2Name != "") {
        grammar[rule2Name] = rule2;
    }

    var parsed = parseGrammar(depth, axiom, grammar);

    alert('Successfuly parsed : {'+parsed+'}');



}

function updatePreset() {
    var preset = $('#preset').find(':selected').text();
    if(preset == "Custom") {
        $('#depth').val('');
        $('#angle').val('');
        $('#axiom').val('');
        $('#rule0Name').val('');
        $('#rule0').val('');
        $('#rule1Name').val('');
        $('#rule1').val('');
        $('#rule2Name').val('');
        $('#rule2').val('');
    } else if(preset == "Plant") {
        $('#depth').val('5');
        $('#angle').val('22');
        $('#axiom').val('F');
        $('#rule0Name').val('F');
        $('#rule0').val('C0FF-[C1-F+F+F]+[C2+F-F-F]');
        $('#rule1Name').val('');
        $('#rule1').val('');
        $('#rule2Name').val('');
        $('#rule2').val('');
    } else if(preset == "Serpiensky") {
        $('#depth').val('6');
        $('#angle').val('120');
        $('#axiom').val('F-G-G');
        $('#rule0Name').val('F');
        $('#rule0').val('F-G+F+G-F');
        $('#rule1Name').val('G');
        $('#rule1').val('GG');
        $('#rule2Name').val('');
        $('#rule2').val('');
    } else if(preset == "Example 1") {
        $('#depth').val('6');
        $('#angle').val('90');
        $('#axiom').val('A');
        $('#rule0Name').val('A');
        $('#rule0').val('AB');
        $('#rule1Name').val('B');
        $('#rule1').val('A');
        $('#rule2Name').val('');
        $('#rule2').val('');
    }else {
        alert('Error: undefined preset');
    }
}

// const renderer = new THREE.WebGLRenderer({ antialiasing: true });
// renderer.setSize( window.innerWidth, window.innerHeight );
// document.getElementById("renderBox").appendChild( renderer.domElement );

// const camera = new THREE.PerspectiveCamera( 45, window.innerWidth / window.innerHeight, 1, 500 );
// camera.position.set( 0, 0, 100 );
// camera.lookAt( 0, 0, 0 );
// const controls = new THREE.OrbitControls( camera, renderer.domElement );
// const scene = new THREE.Scene();
			
// var lineMaterial = new THREE.LineBasicMaterial({ color: 0x00ff00 });
// t = 1;
// let startVector = new THREE.Vector3(
//     3.14 * Math.cos(t),
//     3.14 * Math.sin(t),
//     3 * t
// );
// let endVector = new THREE.Vector3(
//     3.14 * Math.cos(t + 10),
//     3.14 * Math.sin(t + 10),
//     3 * t
// );
// let end2 = new THREE.Vector3(
//     3.14 * Math.cos(t + 20),
//     3.14 * Math.sin(t + 20),
//     3 * t
// );

// let linePoints = [];
// linePoints.push(startVector, endVector, end2);

// var tubeGeometry = new THREE.TubeGeometry(
//     new THREE.CatmullRomCurve3(linePoints),
//     512,// path segments
//     1,// THICKNESS
//     8, //Roundness of Tube
//     false //closed
// );

// let line = new THREE.Line(tubeGeometry, lineMaterial);
// scene.add(line);
// controls.update();

// const animate = function () {
//     requestAnimationFrame( animate );
//     controls.update();
// 	renderer.render( scene, camera );
// };

// animate();


function initSky() {

    // Add Sky
    sky = new THREE.Sky();
    sky.scale.setScalar( 450000 );
    scene.add( sky );
    sun = new THREE.Vector3();
    const uniforms = sky.material.uniforms;
	uniforms[ 'turbidity' ].value = 10;
	uniforms[ 'rayleigh' ].value = 3;
	uniforms[ 'mieCoefficient' ].value = 0.005;
	uniforms[ 'mieDirectionalG' ].value = 0.7;

	const phi = THREE.MathUtils.degToRad( 89 );
	const theta = THREE.MathUtils.degToRad( 180 );
	sun.setFromSphericalCoords( 1, phi, theta );
    uniforms[ 'sunPosition' ].value.copy( sun );
	renderer.toneMappingExposure = renderer.toneMappingExposure;

    renderer.render( scene, camera );
}
/* 
function render() {
    
    renderer.render( scene, camera );
    stats.update();
} */


const animate = function () {
    requestAnimationFrame( animate );
    controls.update();
	renderer.render( scene, camera );
    stats.update();
};




camera = new THREE.PerspectiveCamera( 60, window.innerWidth / window.innerHeight, 100, 2000000 );
camera.position.set( -500, 500, 500 );

scene = new THREE.Scene();
scene.background = new THREE.Color( 0xffffff );

const helper = new THREE.GridHelper( 2000, 100 );
				helper.position.y = - 199;
				helper.material.opacity = 0.25;
				helper.material.transparent = true;
scene.add( helper );

renderer = new THREE.WebGLRenderer({ antialiasing: true });
renderer.setPixelRatio( window.devicePixelRatio );
renderer.setSize( window.innerWidth, window.innerHeight );
renderer.outputEncoding = THREE.sRGBEncoding;
renderer.toneMapping = THREE.ACESFilmicToneMapping;
renderer.toneMappingExposure = 0.5;
document.body.appendChild( renderer.domElement );

const controls = new THREE.OrbitControls( camera, renderer.domElement );
//controls.addEventListener( 'change', render );
//controls.maxPolarAngle = Math.PI / 2;
controls.enableZoom = true;
controls.enablePan = true;


var stats = new Stats();
stats.showPanel(0); // 0: fps, 1: ms, 2: mb, 3+: custom
document.body.appendChild( stats.dom );




initSky();

//render();
animate();