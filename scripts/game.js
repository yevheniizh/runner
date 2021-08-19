const game = new (function () {
  const game = this;
  let scene,
    camera,
    renderer,
    keys = {},
    events = {
      keydown: null,
      keyup: null,
      keypress: null,
    };

  const v = (this.v = (x, y, z) => {
    return new THREE.Vector3(x, y, z);
  });

  game.on = (event_name, processor) => {
    events[event_name] = processor;
  };

  const addCube = (this.addCube = (conf) => {
    const geometry = new THREE.BoxGeometry();
    const material = new THREE.MeshBasicMaterial({ color: conf.color });
    let cube = new THREE.Mesh(geometry, material);
    cube.position.copy(conf.position);
    scene.add(cube);
    return cube;
  });

  game.getCamera = () => {
    return camera;
  };

  const call_event = (event, args) => {
    if (events[event]) events[event](args);
  };

  const animate = (this.animate = () => {
    call_event('keydown', keys);

    renderer.render(scene, camera);
    requestAnimationFrame(animate);
  });

  this.init = () => {
    scene = new THREE.Scene();
    camera = new THREE.PerspectiveCamera(
      75,
      window.innerWidth / window.innerHeight,
      0.1,
      100
    );
    renderer = new THREE.WebGLRenderer();
    renderer.setSize(window.innerWidth, window.innerHeight);

    window.addEventListener('keydown', (event) => {
      if (!keys[event.code]) {
        keys[event.code] = true;
        call_event('keypress', keys);
      }
    });
    window.addEventListener('keyup', (event) => {
      keys[event.code] = false;
      call_event('keyup', keys);
    });

    document.body.appendChild(renderer.domElement);
    animate();
  };
})();
