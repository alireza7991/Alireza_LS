/* L-system implementation
 * Alireza Forouzandeh Nezhad -- a.forouzandeh@ut.ac.ir
 * June 2021
 */

function parseGrammar(maxDepth, axiom, grammar) {    
    var parsed = axiom;
    // iterate over axiom
    for (var depth = 0; depth < maxDepth; depth++) {
        var nextDepth = '';
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

var tree;

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

    //alert('Successfuly parsed : {'+parsed+'}');

    scene.remove(tree);
    tree = new THREE.Object3D();

    var textureLoader = new THREE.TextureLoader();
    var branchMaterialBrown = new THREE.MeshBasicMaterial({color: '#5e2605'});
    var branchMaterialGreen = new THREE.MeshBasicMaterial({color: 'green'});
    var branchMaterialBlack = new THREE.MeshBasicMaterial({color: 'black'});

    var state = {
        bRadius : 0.75,
        bLength : 20,
        bReduction : 0.05,
        bMinRadius : 0.1,
        position : new THREE.Vector3( 0, 0, 0 ),
        rotation : new THREE.Quaternion(),
        color: 0
    }

    var stateStack = [];
    
    for(var i = 0; i < parsed.length; i++) {
        var char = parsed.charAt(i);
        if(char == "F" || char == "G") {
          var transform = new THREE.Quaternion();
          transform.multiply(state.rotation);
          var position = new THREE.Vector3(0.0, state.bLength/2, 0.0);
          position.applyQuaternion(state.rotation);
          state.position.add(position);
          var geometry = new THREE.CylinderBufferGeometry(state.bRadius, state.bRadius, state.bLength, 16);
          var material;
          if(state.color == '0') {
            material = branchMaterialGreen;
          } else if(state.color == '1') {
            material = branchMaterialBrown;
          } else if(state.color == '2') {
            material = branchMaterialBlack;
          }
          var branch = new THREE.Mesh(geometry, material);
          branch.quaternion.copy(state.rotation);
          branch.position.copy(state.position);
    
          state.position.add(position);
          branch.castShadow = true;
          tree.add(branch);
        }
        if(char >= '0' && char <= '9') {
            state.color = char;
        }
        if(char == "+") {
          state.rotation.multiply( new THREE.Quaternion().setFromAxisAngle(new THREE.Vector3(0, 0, 1), angle * Math.PI/180 ));
        }
        if(char == "-") {
          state.rotation.multiply( new THREE.Quaternion().setFromAxisAngle(new THREE.Vector3(0, 0, 1), -angle * Math.PI/180 ));
        }
        if(char == "^") {
          state.rotation.multiply( new THREE.Quaternion().setFromAxisAngle(new THREE.Vector3(0, 1, 0), -angle * Math.PI/180 ));
        }
        if(char == "v") {
          state.rotation.multiply( new THREE.Quaternion().setFromAxisAngle(new THREE.Vector3(0, 1, 0), angle * Math.PI/180 ));
        }
        if(char == "<") {
          state.rotation.multiply( new THREE.Quaternion().setFromAxisAngle(new THREE.Vector3(1, 0, 0), -angle * Math.PI/180 ));
        }
        if(char == ">") {
          state.rotation.multiply( new THREE.Quaternion().setFromAxisAngle(new THREE.Vector3(1, 0, 0), angle * Math.PI/180 ));
        }
        if(char == "[") {
          stateStack.push(cloneState(state));
          state.bRadius = (state.bRadius - state.bReduction) > state.bMinRadius ? (state.bRadius - state.bReduction) : state.bRadius;
        }
        if(char == "]") {
          state = cloneState(stateStack.pop());
        }
  
      }    
      tree.castShadow = true;
      
      scene.add(tree);

}

function cloneState(state) {
    return {
      bRadius : state.bRadius,
      bLength : state.bLength,
      bReduction : state.bReduction,
      bMinRadius : state.bMinRadius,
      position : new THREE.Vector3().copy(state.position),
      rotation : new THREE.Quaternion().copy(state.rotation),
      color: state.color
    }
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
    } else if(preset == "2D Colored Plant") {
        $('#depth').val('4');
        $('#angle').val('22');
        $('#axiom').val('F');
        $('#rule0Name').val('F');
        $('#rule0').val('1FF-[0-F+F+F]+[0+F-F-F]');
        $('#rule1Name').val('');
        $('#rule1').val('');
        $('#rule2Name').val('');
        $('#rule2').val('');
    } else if(preset == "3D Plant 1") {
        $('#depth').val('3');
        $('#angle').val('22');
        $('#axiom').val('F');
        $('#rule0Name').val('F');
        $('#rule0').val('FF-[-F+F+F]>[>F<F<F]<[<F>F<F]+[+F-F-F]');
        $('#rule1Name').val('');
        $('#rule1').val('');
        $('#rule2Name').val('');
        $('#rule2').val('');
    } else if(preset == "3D Colored Plant 1") {
        $('#depth').val('3');
        $('#angle').val('22');
        $('#axiom').val('F');
        $('#rule0Name').val('F');
        $('#rule0').val('1FF-0[-F+F+F]>[>F<F<F]<[<F>F<F]+[+F-F-F]');
        $('#rule1Name').val('');
        $('#rule1').val('');
        $('#rule2Name').val('');
        $('#rule2').val('');
    } else if(preset == "2D Serpiensky") {
        $('#depth').val('5');
        $('#angle').val('120');
        $('#axiom').val('F-G-G');
        $('#rule0Name').val('F');
        $('#rule0').val('F1-G+0F+G2-F');
        $('#rule1Name').val('G');
        $('#rule1').val('GG');
        $('#rule2Name').val('');
        $('#rule2').val('');
    }else {
        alert('Error: undefined preset');
    }
}

function initSky() {
    // Add Sky
    sky = new THREE.Sky();
    sky.scale.setScalar(450000);
    scene.add(sky);
    sun = new THREE.Vector3();
    const uniforms = sky.material.uniforms;
	uniforms['turbidity'].value = 10;
	uniforms['rayleigh'].value = 3;
	uniforms['mieCoefficient'].value = 0.005;
	uniforms['mieDirectionalG'].value = 0.7;
	const phi = THREE.MathUtils.degToRad(89.5);
	const theta = THREE.MathUtils.degToRad(180);
	sun.setFromSphericalCoords(1, phi, theta);
    uniforms['sunPosition'].value.copy(sun);
	renderer.toneMappingExposure = renderer.toneMappingExposure;
    renderer.render( scene, camera );
}

const animate = function () {
    requestAnimationFrame(animate);
    controls.update();
	renderer.render(scene, camera);
    stats.update();
};


camera = new THREE.PerspectiveCamera(60, window.innerWidth / window.innerHeight, 100, 2000000);
camera.position.set(-100, 400, 900);

scene = new THREE.Scene();
scene.background = new THREE.Color( 0xffffff );
const helper = new THREE.GridHelper( 2000, 100 );
				helper.position.y = 0;
				helper.material.opacity = 0.25;
				helper.material.transparent = true;
scene.add(helper);
renderer = new THREE.WebGLRenderer({ antialiasing: true });
renderer.setPixelRatio( window.devicePixelRatio );
renderer.setSize( window.innerWidth, window.innerHeight );
renderer.outputEncoding = THREE.sRGBEncoding;
renderer.toneMapping = THREE.ACESFilmicToneMapping;
renderer.toneMappingExposure = 0.5;
document.body.appendChild( renderer.domElement );
const controls = new THREE.OrbitControls( camera, renderer.domElement );
controls.enableZoom = true;
controls.enablePan = true;
var stats = new Stats();
stats.showPanel(0); // 0: fps, 1: ms, 2: mb, 3+: custom
document.body.appendChild( stats.dom );
initSky();
animate();