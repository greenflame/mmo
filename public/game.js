var scene = null;
var camera = null;
var renderer = null;

var materials = {
  'grass': null,
  'water': null,
  'sand': null
};

var socket = null;
var players = {};
var playerId = null;

function loadTexture(loader, resource) {
  return new Promise(function(resolve, reject) {
    loader.load(
      resource,
      function(texture) {
        resolve(texture);
      },
      function(xhr) {
        console.log(resource + ': ' +(xhr.loaded / xhr.total * 100) + '% loaded');
      },
      function(err) {
        reject(err);
      }
    );
  });
}

function loadTextures() {
  var keys = [];
  for (var key in materials) {
    if (materials.hasOwnProperty(key)) {
      keys.push(key);
    }
  }

  return Promise.resolve().then(function() {
    var loader = new THREE.TextureLoader();

    var loaders = keys.map(function(key) {
      return loadTexture(loader, 'textures/' + key + '.png');
    });

    return Promise.all(loaders);

  }).then(function(textures) {

    for (var i = 0; i < keys.length; i++) {
      textures[i].magFilter = THREE.NearestFilter;
      textures[i].minFilter = THREE.NearestFilter;

      materials[keys[i]] = new THREE.MeshBasicMaterial({
        map: textures[i]
      });
    }

  });
}

function initScene() {
  scene = new THREE.Scene();
  camera = new THREE.PerspectiveCamera(45, window.innerWidth / window.innerHeight , 0.1, 1000);
  renderer = new THREE.WebGLRenderer();

  // Renderer
  renderer.setClearColor('white');
  renderer.setSize(window.innerWidth, window.innerHeight);
  $("#gl-out").append(renderer.domElement);

  // Axes
  var axes = new THREE.AxisHelper(20);
  scene.add(axes);

  // Camera
  camera.position.x = 0;
  camera.position.y = 0;
  camera.position.z = 20;
  camera.lookAt(scene.position);
}

function initTerrain() {
  var geometry = new THREE.PlaneGeometry(1, 1);
  var object = new THREE.Mesh(geometry, materials.grass);
  object.position.x = 0;
  object.position.y = 0;
  object.position.z = 0;
  scene.add(object);

  setInterval(function() {
    object.position.x += 0.01;
  }, 10);
}

function initController() {
  $(document).keypress(function(event) {
    var isMoved = false;

    if (event.which === 97) {   // Left
      isMoved = true;
      players[playerId].position.x -= 1;
    }
    if (event.which === 100) {  // Right
      isMoved = true;
      players[playerId].position.x += 1;
    }
    if (event.which === 119) {  // Up
      isMoved = true;
      players[playerId].position.y += 1;
    }
    if (event.which === 115) {  // Down
      isMoved = true;
      players[playerId].position.y -= 1;
    }

    if (isMoved) {
      socket.emit('playerMoved', players[playerId].position);
    }
  });
}

function createGeometryForPlayer(id) {
  var playerGeometry = new THREE.PlaneGeometry(1, 1);
  var playerMesh = new THREE.Mesh(playerGeometry, materials.sand);
  playerMesh.position.x = players[id].position.x;
  playerMesh.position.y = players[id].position.y;
  playerMesh.position.z = 0.1;
  scene.add(playerMesh);
  players[id].mesh = playerMesh;
}

function updateGeometryForPlayer(id) {
  players[id].mesh.position.x = players[id].position.x;
  players[id].mesh.position.y = players[id].position.y;

  if (id == playerId) {
    camera.position.x = players[id].position.x;
    camera.position.y = players[id].position.y;
  }
}

function deleteGeometryForPlayer(id) {
  scene.remove(players[id].mesh);
}

function connectToServer() {
  socket = io();

  socket.on('serverState', function(state) {
    console.log('Server state accepted');

    playerId = state.id;
    state.players.forEach(function(player) {
      players[player.id] = player;
      createGeometryForPlayer(player.id);
    });

    console.log(players);

    socket.on('playerConnected', function(player) {
      players[player.id] = player;
      createGeometryForPlayer(player.id);
      console.log(players);
    });

    socket.on('playerDisconnected', function(id) {
      deleteGeometryForPlayer(id);
      delete players[id];
      console.log(players);
    });

    socket.on('playerMoved', function(motion) {
      players[motion.playerId].position = motion.newPos;
      updateGeometryForPlayer(motion.playerId);
      console.log(players);
    });
  });
}

function init() {
  return loadTextures()
    .then(function() {
      console.log('Textures loaded');
      initScene();
    }).then(function() {
      console.log('Scene initialized');
      initTerrain();
    }).then(function() {
      console.log('Terrain initialized');
      connectToServer();
    }).then(function() {
      console.log('Connected to server');
      initController();
    }).then(function() {
      console.log('Controller initialized');
    });
}

function loop() {s
  requestAnimationFrame(loop);
  renderer.render(scene, camera);
}

$(function() {
  init().then(function() {
    loop();
    console.log('Render loop started');
  });
});