'use strict';

let ElevatorCtrl = (function () {
	function ElevatorCtrl() {
		this.travelSpeed = 1; //sec
		this.loadUnloadSpeed = 3; //sec
		this.currentSpeed = 1;
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
		 *@returns {Object}
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
			if (this.destinationsList.length === 1) { //ensures the move funciton is not called every time the button is pressed, thus firing the moveElevator function regardless of the timers.
				moveElevator(this);
			}
			return this;
		};

		/** The elevator's beahviour.
		 * @param {object} ctrl
		 */
		function moveElevator(ctrl) { //to be renamed
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
			// TODO: Refactor and optimize.
			if (!ctrl.elevator.timer) {
				if (ctrl.elevator.direction === 0) {
					setTimeout(function () {
						ctrl.elevator.timer = setInterval(function () {
							moveElevator(ctrl);
						}, 1000);
					}, 2000); // setTimeout + setInterval = 3sec
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

		/**Sends the Ctrl's elevator property and an 'event' to all the registered callbacks
		 * @param {obj} ctrl
		 * @param {String} event
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
	return ElevatorCtrl;
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
function uiBehaviour(ctrl, event) {
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
		$('#elevator-panel-button-number-' + ctrl.currentFloor).removeClass('active');
		$('#floor-panel').find('button[value=' + ctrl.currentFloor + ']').removeClass('active');
		let ding = new Audio('http://soundbible.com/grab.php?id=1441&type=mp3');
		ding.play();
	}
}

let lift = new ElevatorCtrl();

/** Register the callback functions.
 */
lift.addCallback(moveImage)
	.addCallback(uiBehaviour);
// possible switchImage. Open and closed doors.

/** Initiates the elevator by sending the value attribute of the button pressed to the lyft object.
 *ds
 */
$(function init() {

	$('#elevator-panel button, #floor-panel button').click(function () {
		$(this).addClass('active');
		lift.buttonPress($(this).val());

	});
});
