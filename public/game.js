let a = new Promise((res, rej) => {
  res('he');
});

a.then(() => {
  console.log('yra');
});


let f = Promise.coroutine(function*() {
  yield a;
});

f();


$(() => {
  let scene = new THREE.Scene();
  let camera = new THREE.PerspectiveCamera(45, window.innerWidth / window.innerHeight , 0.1, 1000);
  let renderer = new THREE.WebGLRenderer();

  // Renderer
  renderer.setClearColor('white');
  renderer.setSize(window.innerWidth, window.innerHeight);

  // Scene
  let axes = new THREE.AxisHelper(20);
  scene.add(axes);


  // instantiate a loader
  let loader = new THREE.TextureLoader();

  // load a resource
  loader.load(
    // resource URL
    'textures/sand.png',
    // Function when resource is loaded
    function ( texture ) {
      console.log('yeah');

      texture.magFilter = THREE.NearestFilter;
      texture.minFilter = THREE.NearestFilter;

      // do something with the texture
      let material = new THREE.MeshBasicMaterial( {
        map: texture
      } );


      let geometry = new THREE.PlaneGeometry(10, 10);

//                    let texture = THREE.ImageUtils.loadTexture( "grass.jpg");
//                    let material = new THREE.MeshLambertMaterial({ map : texture });

      let object = new THREE.Mesh(geometry,material);
      object.position.x = 0;
      object.position.y = 0;
      object.position.z = 0;
      scene.add(object);

      // Camera
      camera.position.x = -30;
      camera.position.y = 40;
      camera.position.z = 30;
      camera.lookAt(scene.position);

      // Render
      $("#gl-out").append(renderer.domElement);
      renderer.render(scene, camera);
    },
    // Function called when download progresses
    function ( xhr ) {
      console.log( (xhr.loaded / xhr.total * 100) + '% loaded' );
    },
    // Function called when download errors
    function ( xhr ) {
      console.log( 'An error happened' );
    }
  );
});
