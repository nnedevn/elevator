'use strict';

let ElevatorCtrl = (function () {

	function ElevatorCtrl() {
		this.travelSpeed = 1; //sec
		this.loadUnloadTime = 3; //sec
		this.destinationFloor = 0;
		this.destinationsList = [];
		this.callbacks = [];

		this.elevator = {
			direction: 0,
			currentFloor: 0
		};

		ElevatorCtrl.prototype.addCallback = function (callback) {
			this.callbacks.push(callback);
			return this;
		};
		// TODO: ElevatorCtrl.prototype.removeCallback (callback){}

		ElevatorCtrl.prototype.refresh = function () {
			fireEvent(this, 'floor'); //to be changed
			return this;
		};
		ElevatorCtrl.prototype.buttonPress = function (floor) {
			cl('The floor pushed is: ' + floor);
			floor = Number(floor);
			// cl('destination list before push' + this.destinationsList);
			if (!isContainedInArray(floor, this.destinationsList)) {
				this.destinationsList.push(floor);
			}
			cl('destinationsList contains: ' + this.destinationsList);
			// cl('destination list after push' + this.destinationsList);
			moveElevator(this);

			return this;
		};

		function moveElevator(ctrl) { //to be renamed

			cl('Current floor is: ' + ctrl.elevator.currentFloor);
			if (typeof ctrl.destinationsList === 'undefined' || ctrl.destinationsList.length === 0) {
				cl('destination array is undefined or empty');
				//Hmmmmm not good but works for now.
				window.clearInterval(ctrl.elevator.timer);
				ctrl.elevator.timer = null;
				return;
			}
			cl('Now heading to floor: ' + ctrl.destinationsList[0]);

			if (ctrl.destinationsList[0] === ctrl.elevator.currentFloor) {
				window.clearInterval(ctrl.elevator.timer);
				ctrl.elevator.timer = null;
				fireEvent(ctrl, 'arrived');
				ctrl.elevator.direction = 0;
				cl('Arrived at ' + ctrl.elevator.currentFloor + ' floor');
				ctrl.destinationsList.shift();
				ctrl.refresh();

			}

			if (ctrl.elevator.currentFloor < ctrl.destinationsList[0]) {
				cl('we\'re heading up');
				fireEvent(ctrl, 'up');
				ctrl.elevator.direction = +1;
				ctrl.elevator.currentFloor += 1;
				ctrl.refresh();
			}

			if (ctrl.elevator.currentFloor > ctrl.destinationsList[0]) {
				cl('we\'re heading down');
				fireEvent(ctrl, 'down');
				ctrl.elevator.direction = -1;
				ctrl.elevator.currentFloor -= 1;
				ctrl.refresh();
			}

			if (!ctrl.elevator.timer) {
				ctrl.elevator.timer = setInterval(function () {
					moveElevator(ctrl);
				}, ctrl.travelSpeed * 1000);
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
		Takes in a input number and an array and returns TRUE if the number is contained withing the array
		@param {number} floor
		@param {array} destinationsList
		*/
		function isContainedInArray(floor, destinationsList) { //NOT DONE

			if (floor === null || destinationsList === null) {
				cl('sanitization error, either floor or array are null');
				//maybe some cheching, a throw statement?
				return;
			}

			for (let i = 0; i < destinationsList.length; i++) {
				if (floor === destinationsList[i]) {
					return true;
				} else {
					return false;
				}
			}
		}

		return this;
	}

	return ElevatorCtrl; //not this!!!
})();

function moveImage(ctrl, event) {
	cl(ctrl.currentFloor);
	$('#elevator-img').appendTo($('#' + 'floor-number-' + ctrl.currentFloor));
}

function highliteDirection(ctrl, event) {

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
	}
}

function displayCurrentFloor(ctrl, event) {
	if (event === 'floor') {
		cl(ctrl);
		$('#current-floor-indicator').html(ctrl.currentFloor);
	}
}

function clearFloorSelection(ctrl, event){
		if (event === 'arrived'){
			$('#floor-number-' + ctrl.currentFloor).removeClass('active');
			//find the button that has a value of current floor
			//remove the active class.

		}
}
let lift = new ElevatorCtrl();

lift.addCallback(moveImage)
	.addCallback(highliteDirection)
	.addCallback(displayCurrentFloor)
	.addCallback(clearFloorSelection);


$(function init() {

	$('#elevator-panel button').click(function () {
		$(this).addClass('active');
		lift.buttonPress($(this).val());
		lift.refresh();
	});
});


//---------

function cl(param) {
	console.log(param);
}
