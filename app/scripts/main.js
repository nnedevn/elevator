'use strict';

let ElevatorCtrl = (function () {

	function ElevatorCtrl() {
		this.travelSpeed = 1; //sec
		this.loadUnloadSpeed = 3; //sec
		this.currentSpeed = 3;
		this.destinationFloor = 0;
		this.destinationsList = [];
		this.callbacks = [];

		this.elevator = {
			direction: 0,
			currentFloor: 0
		};
/**
 * Takes in a callback and pushes it to the callbacks array
 * @param {function} callback
*/
		ElevatorCtrl.prototype.addCallback = function (callback) {
			this.callbacks.push(callback);
			return this;
		};
		// TODO: ElevatorCtrl.prototype.removeCallback (callback){}

/** Generates an event and returns the constructor
*/
		ElevatorCtrl.prototype.refresh = function () {
			fireEvent(this, 'floor'); //TODO to be changed
			return this;
		};

/** Pushes the value of the button presses to the queue array (destinationsList[])
 * @param {(string|number)} floor
*/
		ElevatorCtrl.prototype.buttonPress = function (floor) {
			floor = Number(floor);
			if (!isContainedInArray(floor, this.destinationsList)) {
				this.destinationsList.push(floor);
			}
			console.log('destinationsList contains: ' + this.destinationsList);

			if (this.destinationsList.length === 1) {
				//ensure the move funciton is not called every time the button is pressed,
				//thus ignoring the timers.
				moveElevator(this);
				//console.log('Array length is: ' + this.destinationsList.length);
			}
			return this;
		};

/** The elevator's beahviour.
 * @param {object} ctrl
*/
		function moveElevator(ctrl) { //to be renamed

			console.log('Current floor is: ' + ctrl.elevator.currentFloor);

			console.log('Now heading to floor: ' + ctrl.destinationsList[0]);

			if (ctrl.elevator.currentFloor < ctrl.destinationsList[0]) {
				fireEvent(ctrl, 'up');
				ctrl.elevator.direction = +1;
				ctrl.elevator.currentFloor += 1;
				ctrl.refresh();
			}

			if (ctrl.elevator.currentFloor > ctrl.destinationsList[0]) {
				fireEvent(ctrl, 'down');
				ctrl.elevator.direction = -1;
				ctrl.elevator.currentFloor -= 1;
				ctrl.refresh();
			}

			if (ctrl.destinationsList[0] === ctrl.elevator.currentFloor) {
				window.clearInterval(ctrl.elevator.timer);
				ctrl.elevator.timer = null;
				fireEvent(ctrl, 'arrived');
				ctrl.elevator.direction = 0;
				ctrl.destinationsList.shift();
				ctrl.refresh();
			}
			// TODO: Optimize.
			if (!ctrl.elevator.timer) {
        if (ctrl.elevator.direction === 0) {
					setTimeout(function () {
						ctrl.elevator.timer = setInterval(function () {
							moveElevator(ctrl);
							//console.log('The timer speed is: ' + ctrl.currentSpeed);
						}, 1000);
					}, 3000);
				} else {
					ctrl.travelSpeed = Number(ctrl.currentSpeed);
					ctrl.elevator.timer = setInterval(function () {
						moveElevator(ctrl);
						//console.log('The timer speed is: ' + ctrl.currentSpeed);
					}, 1000);
				}
			}

			if (ctrl.destinationsList.length === 0) {
				window.clearInterval(ctrl.elevator.timer);
				ctrl.elevator.timer = null;
			}
		}

		/*Sends the elevator's controller and an 'event' to all the callbacks
		 @param {obj} ctrl
		 @param {String} event
		 */
		function fireEvent(ctrl, event) {
			for (let i = 0; i < ctrl.callbacks.length; i++) {
				ctrl.callbacks[i](ctrl.elevator, event);
			}
		}

		/*
		 * Takes in a input number and an array and returns TRUE if the number is contained withing the array
		 * @param {number} floor
		 * @param {array} destinationsList
		 * @returns {boolean}
		 */
		function isContainedInArray(floor, destinationsList) { //NOT DONE

			if (floor === null || destinationsList === null) {
				console.log('Error! Floor or array are null');
				return;
			}
			if ((destinationsList.indexOf(floor)) === -1) {
				return false;
			} else {
				return true;

			}
		}
		return this;
	}

	return ElevatorCtrl; //not this!!!
})();

/** Takes the controller and appends the image to the div with an id that matches the current floor
 * @param {object} ctrl
*/
function moveImage(ctrl) {
	$('#elevator-img').appendTo($('#' + 'floor-number-' + ctrl.currentFloor));
}

/** Listenes to the events generated in moveElevator() and changes the UI accordingly
 * @param {Object} ctrl
 * @param {String} event}
 */
function uiBegaviour(ctrl, event) { 
	if (event === 'floor') {
		$('#current-floor-indicator').html(ctrl.currentFloor);
		console.log('direction: ' + ctrl.direction);
	}
	if (event === 'up') {
		$('#up-indicator').addClass('active');
		$('#current-floor-indicator').removeClass('active');
	}
	if (event === 'down') {
		$('#down-indicator').addClass('active');
		$('#current-floor-indicator').removeClass('active');
	}
	if (event === 'arrived') {
		$('#up-indicator, #down-indicator').removeClass('active');
		$('#current-floor-indicator').addClass('active');
		//moved from clearFloorSelection
		$('#elevator-panel-button-number-' + ctrl.currentFloor).removeClass('active');

		// let ding = new Audio('http://soundbible.com/grab.php?id=1441&type=mp3');
		// ding.play();
	}
}

let lift = new ElevatorCtrl();

lift.addCallback(moveImage)
	.addCallback(uiBegaviour);
// possible switchImage. Open and closed doors.

$(function init() {

	$('#elevator-panel button, #floor-panel ul li button').click(function () {
		$(this).addClass('active');
		lift.buttonPress($(this).val());

	});
});
