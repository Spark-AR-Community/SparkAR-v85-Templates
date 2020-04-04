const D = require('Diagnostics');
const Scene = require('Scene');
const FaceTracking = require('FaceTracking');

// Load assets
//
Promise.all([
	// Using pattern to find left_springA_jnt and then select
	// all descendants of it. This should retrun 
	// left_springB_jnt to left_springF_jnt in an array
	Scene.root.findByPath('**/left_springA_jnt/**'),
	// the same for Right Spring
	Scene.root.findByPath('**/right_springA_jnt/**')
]).then(onReady)

//
// Function runned when assets are loaded
//
function onReady(assets) {
	// Notice how the loaded items are stored in the
	// assets varaible and in the orderd the was added
	// to the Promise.all() array above. Arrays always 
	// starts on 0.
	const leftSpringJoints = assets[0];
	const rightSpringJoints = assets[1];

	const faceSignalX = FaceTracking.face(0).cameraTransform.x.expSmooth(100);
	const faceSignalX2 = FaceTracking.face(0).cameraTransform.x.expSmooth(96);
	const faceSignalY = FaceTracking.face(0).cameraTransform.y.expSmooth(100);
	const faceSignalY2 = FaceTracking.face(0).cameraTransform.y.expSmooth(96);
	const scaleFactor = 3;

	// Since all the joints are in an array now, we can loop to apply 
	// the new rotation signal. Think of array as a list, and then the 
	// forEach method is basically saying for each item do something.
	// So this would be for each joint in the leftSpringJoints list (array)
	// do whats happening between the { }.
	leftSpringJoints.forEach( (joint) => {
		// Rotate X left and right spring base on head Y rotation
		joint.transform.rotationX = faceSignalY2.sub(faceSignalY).mul(scaleFactor);

		// Rotate Z left and right spring base on head X rotation
		joint.transform.rotationZ = faceSignalX2.sub(faceSignalX).mul(scaleFactor);
	});

	// The same goes for the springs in the right
	rightSpringJoints.forEach( (joint) => {
		// Rotate X left and right spring base on head Y rotation
		joint.transform.rotationX = faceSignalY2.sub(faceSignalY).mul(scaleFactor);

		// Rotate Z left and right spring base on head X rotation
		joint.transform.rotationZ = faceSignalX2.sub(faceSignalX).mul(scaleFactor);
	});
}