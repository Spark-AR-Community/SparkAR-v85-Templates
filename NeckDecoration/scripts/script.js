const Scene = require('Scene');
const Patches = require('Patches');
const Reactive = require('Reactive');
const FaceTracking = require('FaceTracking');
const DeviceMotion = require('DeviceMotion');
const Diagnostics = require('Diagnostics');

// Get first tracked face
const face0 = FaceTracking.face(0);

//
// Load assets
//
Promise.all([
	Scene.root.findFirst('bustA'),
	Scene.root.findFirst('bustB'),
	Scene.root.findFirst('bustC'),
]).then(onReady);

//
// Function runned when assets are loaded
//
function onReady(assets) {
	// Notice how the loaded items are stored in the
	// assets varaible and in the orderd the was added
	// to the Promise.all() array above. Arrays always starts on 0.
	const bustA = assets[0];
	const bustB = assets[1];
	const bustC = assets[2];

	const bustAtra = bustA.transform.toSignal();
	const bustBtra = bustB.transform.toSignal();
	const bustCtra = bustC.transform.toSignal();

	const faceTra = face0.cameraTransform.applyTo(bustAtra).applyTo(bustBtra).applyTo(bustCtra);

	const FaceOffset = Reactive.point(0,0,0.535);
	const neckPos = faceTra.position.add(FaceOffset).expSmooth(70);

	Patches.inputs.setVector('neck', neckPos);
}
