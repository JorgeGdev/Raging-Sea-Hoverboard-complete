import * as THREE from 'three'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js'
import GUI from 'lil-gui'
import waterVertexShader from './shaders/water/vertex.glsl'
import waterFragmentShader from './shaders/water/fragment.glsl'
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js'
import { DRACOLoader } from 'three/examples/jsm/loaders/DRACOLoader.js'



/**
 * Base
 */
// Debug
const gui = new GUI({ width: 340 })
const debugObject = {}

// Canvas
const canvas = document.querySelector('canvas.webgl')

// Scene
const scene = new THREE.Scene()


//AXES HELPER


// const axesHelper = new THREE.AxesHelper()
// axesHelper.position.y = 0.25
// scene.add(axesHelper)




//LOADING MODELS

//const dracoloader = new DRACOLoader()
//dracoloader.setDecoderPath("/draco/")
const gltfloader = new GLTFLoader()
//gltfloader.setDRACOLoader(dracoloader)





let hoverboard = null
let mixer = null

gltfloader.load(
    "./models/hoverboard/scene.gltf",

    (gltf) =>
    {

        mixer = new THREE.AnimationMixer(gltf.scene)
        const action = mixer.clipAction(gltf.animations[0])
        action.play()




      



        hoverboard = gltf.scene
        scene.add(hoverboard)

        hoverboard.scale.set(0.4, 0.4, 0.4)
        hoverboard.rotation.y = 2

    },

    
    


)
const hoverboardlight = new THREE.DirectionalLight( 0xFFFFFF, 2 );
hoverboardlight.position.set(-0.62, 0, 1.08)
hoverboardlight.target.position.set(1.84, 2.16, -0.62);
scene.add( hoverboardlight );
scene.add(hoverboardlight.target)

// // Añadir control para la intensidad de la luz
// const lightFolder = gui.addFolder('Directional Light');
// lightFolder.add(hoverboardlight, 'intensity', 0, 2).name('Intensity').listen();

// // Añadir control para la posición de la luz
// lightFolder.add(hoverboardlight.position, 'x', -10, 10).name('Position X').listen();
// lightFolder.add(hoverboardlight.position, 'y', 0, 20).name('Position Y').listen();
// lightFolder.add(hoverboardlight.position, 'z', -10, 10).name('Position Z').listen();

// // Añadir control para la posición del target
// lightFolder.add(hoverboardlight.target.position, 'x', -10, 10).name('Target X').listen();
// lightFolder.add(hoverboardlight.target.position, 'y', -10, 10).name('Target Y').listen();
// lightFolder.add(hoverboardlight.target.position, 'z', -10, 10).name('Target Z').listen();

// lightFolder.open();  // Abre el folder por defecto para mayor visibilidad




// const helper = new THREE.DirectionalLightHelper( hoverboardlight, 0.25 );
// scene.add( helper );
/**
 * Water
 */
// Geometry
const waterGeometry = new THREE.PlaneGeometry(2, 2, 512, 512)
waterGeometry.deleteAttribute("normal")
waterGeometry.deleteAttribute("uv")

// Colors
debugObject.depthColor = '#ff4000'
debugObject.surfaceColor = '#151c37'

gui.addColor(debugObject, 'depthColor').onChange(() => { waterMaterial.uniforms.uDepthColor.value.set(debugObject.depthColor) })
gui.addColor(debugObject, 'surfaceColor').onChange(() => { waterMaterial.uniforms.uSurfaceColor.value.set(debugObject.surfaceColor) })

// Material
const waterMaterial = new THREE.ShaderMaterial({
    vertexShader: waterVertexShader,
    fragmentShader: waterFragmentShader,
    uniforms:
    {
        uTime: { value: 0 },
        
        uBigWavesElevation: { value: 0.2 },
        uBigWavesFrequency: { value: new THREE.Vector2(4, 1.5) },
        uBigWavesSpeed: { value: 0.75 },

        uSmallWavesElevation: { value: 0.15 },
        uSmallWavesFrequency: { value: 3 },
        uSmallWavesSpeed: { value: 0.2 },
        uSmallIterations: { value: 4 },

        uDepthColor: { value: new THREE.Color(debugObject.depthColor) },
        uSurfaceColor: { value: new THREE.Color(debugObject.surfaceColor) },
        uColorOffset: { value: 0.925 },
        uColorMultiplier: { value: 1 }
    }
})

// gui.add(waterMaterial.uniforms.uBigWavesElevation, 'value').min(0).max(1).step(0.001).name('uBigWavesElevation')
// gui.add(waterMaterial.uniforms.uBigWavesFrequency.value, 'x').min(0).max(10).step(0.001).name('uBigWavesFrequencyX')
// gui.add(waterMaterial.uniforms.uBigWavesFrequency.value, 'y').min(0).max(10).step(0.001).name('uBigWavesFrequencyY')
// gui.add(waterMaterial.uniforms.uBigWavesSpeed, 'value').min(0).max(4).step(0.001).name('uBigWavesSpeed')

// gui.add(waterMaterial.uniforms.uSmallWavesElevation, 'value').min(0).max(1).step(0.001).name('uSmallWavesElevation')
// gui.add(waterMaterial.uniforms.uSmallWavesFrequency, 'value').min(0).max(30).step(0.001).name('uSmallWavesFrequency')
// gui.add(waterMaterial.uniforms.uSmallWavesSpeed, 'value').min(0).max(4).step(0.001).name('uSmallWavesSpeed')
// gui.add(waterMaterial.uniforms.uSmallIterations, 'value').min(0).max(5).step(1).name('uSmallIterations')

// gui.add(waterMaterial.uniforms.uColorOffset, 'value').min(0).max(1).step(0.001).name('uColorOffset')
// gui.add(waterMaterial.uniforms.uColorMultiplier, 'value').min(0).max(10).step(0.001).name('uColorMultiplier')

// Mesh
const water = new THREE.Mesh(waterGeometry, waterMaterial)
water.rotation.x = - Math.PI * 0.5
scene.add(water)

/**
 * Sizes
 */
const sizes = {
    width: window.innerWidth,
    height: window.innerHeight
}

window.addEventListener('resize', () =>
{
    // Update sizes
    sizes.width = window.innerWidth
    sizes.height = window.innerHeight

    // Update camera
    camera.aspect = sizes.width / sizes.height
    camera.updateProjectionMatrix()

    // Update renderer
    renderer.setSize(sizes.width, sizes.height)
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
})

/**
 * Camera
 */
// Base camera
const camera = new THREE.PerspectiveCamera(75, sizes.width / sizes.height, 0.1, 100)
camera.position.set(1, 1, 1)
scene.add(camera)

// Controls
const controls = new OrbitControls(camera, canvas)
controls.enableDamping = true

/**
 * Renderer
 */
const renderer = new THREE.WebGLRenderer({
    canvas: canvas
})
renderer.toneMapping = THREE.ACESFilmicToneMapping
renderer.setSize(sizes.width, sizes.height)
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))

/**
 * Animate
 */
const clock = new THREE.Clock()
let previousTime = 0

const tick = () =>
{
    const elapsedTime = clock.getElapsedTime()
    const deltaTime = elapsedTime - previousTime
    previousTime = elapsedTime

    // Water
    waterMaterial.uniforms.uTime.value = elapsedTime

    //MOVEMENT HOVERBOARD

    // Rotate objects
    if(hoverboard)
    {
        //hoverboard.rotation.x = - elapsedTime * 0.1
        hoverboard.rotation.x = Math.sin(elapsedTime * 2) * 0.25 
        hoverboard.rotation.z = Math.sin(elapsedTime ) * 0.15 
        hoverboard.rotation.y = Math.sin(elapsedTime  * 2) * 0.15 

    }

    //update mixer

    if(mixer !== null)
    {
        mixer.update(deltaTime)

    }




    // Update controls
    controls.update()

    // Render
    renderer.render(scene, camera)

    // Call tick again on the next frame
    window.requestAnimationFrame(tick)
}

tick()