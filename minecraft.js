noise.seed(Math.random());

var scene = new THREE.Scene();
var renderer = new THREE.WebGLRenderer();
renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);
var camera = new THREE.PerspectiveCamera(75, window.innerWidth / innerHeight, 0.1, 1000);

/*var groundBox = new THREE.BoxBufferGeometry(25, 1, 50);
var groundMesh = new THREE.MeshBasicMaterial({color : 0x00ff00});
var ground = new THREE.Mesh(groundBox, groundMesh);
scene.add(ground);
ground.position.y = -5;

var edges = new THREE.EdgesGeometry(groundBox);
var line = new THREE.LineSegments(edges, new THREE.LineBasicMaterial({color : 0x000000}));
scene.add(line);
line.position.y = -5;
*/
var autoJump = true;
function toggleAutoJump() {
    if(autoJump == true){
        autoJump = false;
        document.getElementById("autoJumpButton").innerHTML = `<h2>AutoJump : Off</h2>`;
    } else {
        autoJump = true;
        document.getElementById("autoJumpButton").innerHTML = `<h2>AutoJump : On</h2>`;
    }
}

function Block(x, y, z) {
    this.x = x;
    this.y = y;
    this.z = z;

    this.display = function() {
        var blockBox = new THREE.BoxBufferGeometry(5, 5, 5);
        var blockMesh = new THREE.MeshBasicMaterial({color : 0x00ff00});
        var block = new THREE.Mesh(blockBox, blockMesh);
        scene.add(block);
        block.position.x = this.x;
        block.position.y = this.y - 10;
        block.position.z = this.z;

        var edges = new THREE.EdgesGeometry(blockBox);
        var line = new THREE.LineSegments(edges, new THREE.LineBasicMaterial({color : 0x000000}));
        scene.add(line);
        line.position.x = this.x;
        line.position.y = this.y - 10;
        line.position.z = this.z;
    }
}

//var axesHelper = new THREE.AxesHelper( 5 );
//scene.add(axesHelper);

var blocks = [];
		var xoff = 0;
		var zoff = 0;
        var inc = 0.05;
        var amplitude = 50;
		for(var x = 0; x < 20; x++){
			xoff = 0;
			for(var z = 0; z < 20; z++){
				var v = Math.round(noise.perlin2(xoff, zoff) * amplitude / 5) * 5;
				blocks.push(new Block(x * 5, v, z * 5));
				xoff = xoff + inc;
			}
			zoff = zoff + inc;
        }
        
        for(var i = 0; i <blocks.length; i++) {
            blocks[i].display();
        }

        var keys = [];
        var canJump = true;
        document.addEventListener("keydown", function(e) {
            keys.push(e.key);
            if(e.key == " " && canJump == true) {
                ySpeed = -1.3;
                canJump = false;
            }
        });
        document.addEventListener("keyup", function(e) {
            var newArr = [];
            for(var i = 0; i < keys.length; i++) {
                if (keys[i] != e.key) {
                    newArr.push(keys[i]);
                }
            }
            keys = newArr;
        });

        var controls = new THREE.PointerLockControls(camera, document.body);
        document.body.addEventListener("click", function() {
            controls.lock();
        });
        controls.addEventListener("lock", function() {

        });
        controls.addEventListener("unlock", function() {

        });

    
var movingSpeed = 0.7;
var ySpeed = 0;
var acc = 0.08;
function update() {
    if(keys.includes("w")){
        controls.moveForward(movingSpeed);
        if(autoJump == false) {
            for(var i = 0; i < blocks.length; i++) {
                if(camera.position.x <= blocks[i].x + 2.5 && camera.position.x >= blocks[i].x - 2.5 && camera.position.z <= blocks[i].z + 2.5 && camera.position.z >= blocks[i].z - 2.5) {
                    if(camera.position.y == blocks[i].y - 2.5) {
                        controls.moveForward(-1 * movingSpeed)
                    }
                }
            }
        }
    }
    if(keys.includes("a")){
        controls.moveRight(-1 * movingSpeed);
        if(autoJump == false) {
            for(var i = 0; i < blocks.length; i++) {
                if(camera.position.x <= blocks[i].x + 2.5 && camera.position.x >= blocks[i].x - 2.5 && camera.position.z <= blocks[i].z + 2.5 && camera.position.z >= blocks[i].z - 2.5) {
                    if(camera.position.y == blocks[i].y - 2.5) {
                        controls.moveRight(movingSpeed)
                    }
                }
            }
        }
    }
    if(keys.includes("s")){
        controls.moveForward(-1 * movingSpeed);
        if(autoJump == false) {
            for(var i = 0; i < blocks.length; i++) {
                if(camera.position.x <= blocks[i].x + 2.5 && camera.position.x >= blocks[i].x - 2.5 && camera.position.z <= blocks[i].z + 2.5 && camera.position.z >= blocks[i].z - 2.5) {
                    if(camera.position.y == blocks[i].y - 2.5) {
                        controls.moveForward(movingSpeed)
                    }
                }
            }
        }
    }
    if(keys.includes("d")){
        controls.moveRight(movingSpeed);
        if (autoJump == false) {
            for(var i = 0; i < blocks.length; i++) {
                if(camera.position.x <= blocks[i].x + 2.5 && camera.position.x >= blocks[i].x - 2.5 && camera.position.z <= blocks[i].z + 2.5 && camera.position.z >= blocks[i].z - 2.5) {
                    if(camera.position.y == blocks[i].y - 2.5) {
                        controls.moveRight(-1 * movingSpeed)
                    }
                }
            }
        }
    }

    camera.position.y = camera.position.y - ySpeed;
    ySpeed = ySpeed + acc;

    for(var i = 0; i < blocks.length; i++) {
        if(camera.position.x <= blocks[i].x + 2.5 && camera.position.x >= blocks[i].x - 2.5 && camera.position.z <= blocks[i].z + 2.5 && camera.position.z >= blocks[i].z - 2.5) {
            if(camera.position.y <= blocks[i].y + 2.5 && camera.position.y >= blocks[i].y - 2.5) {
                camera.position.y = blocks[i].y + 2.5;
                ySpeed = 0;
                canJump = true;
                break;
            }
        }
    }
}

window.addEventListener("resize", function() {
    renderer.setSize(window.innerWidth, window.innerHeight);
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
});

function render() {
    renderer.render(scene, camera);
}

function GameLoop() {
    requestAnimationFrame(GameLoop);
    update();
    render();
}

GameLoop();