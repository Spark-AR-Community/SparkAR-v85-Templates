const Animation = require('Animation');
const FaceTracking = require('FaceTracking');
const Scene = require('Scene');

//
// Load assets
//
Promise.all([
	Scene.root.findFirst('pizzas_123'),
	Scene.root.findFirst('pizzas_456'),
	Scene.root.findFirst('pizzas_789'),
]).then(onReady);

//
// Function runned when assets are loaded
//
function onReady(assets) {
	// Notice how the loaded items are stored in the
	// assets varaible and in the orderd the was added
	// to the Promise.all() array above. Arrays always 
	// starts on 0.
	const pizzaWheel0 = assets[0];
	const pizzaWheel1 = assets[1];
	const pizzaWheel2 = assets[2];

	// Check if face is in image and if the mouth is open.
	const mouthIsOpen = FaceTracking.face(0).mouth.openness.gt(0.3).and(FaceTracking.count.gt(0));

	// Hide pizzas if moth is not open.
	pizzaWheel0.hidden = pizzaWheel1.hidden = pizzaWheel2.hidden = mouthIsOpen.not();

	// Animation for pizzas
	const wheelDriver = Animation.timeDriver({durationMilliseconds: 2500, loopCount: Infinity});
	const wheelSampler = Animation.samplers.linear(0, -Math.PI*2);

	// Apply animation signal to the pizza wheels
	pizzaWheel0.transform.rotationX = Animation.animate(wheelDriver, wheelSampler);
	pizzaWheel1.transform.rotationX = Animation.animate(wheelDriver, wheelSampler);
	pizzaWheel2.transform.rotationX = Animation.animate(wheelDriver, wheelSampler);

	// Evvent Listener to detect when mouth is open or not.
	mouthIsOpen.monitor().subscribe( (evt) =>  {
		if (evt.newValue == true) {
			// Run animation if mouth is open
			wheelDriver.start();
		} else {
			// Stop animation ig moth is NOT open.
			wheelDriver.stop();
			wheelDriver.reset();
		}
	});
}
