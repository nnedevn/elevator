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

    ElevatorCtrl.prototype.addCallback = function (callback) {
      this.callbacks.push(callback);
      return this;
    };
    // TODO: ElevatorCtrl.prototype.removeCallback (callback){}

    ElevatorCtrl.prototype.refresh = function () {
      fireEvent(this, 'floor'); //TODO to be changed
      return this;
    };
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

    function moveElevator(ctrl) { //to be renamed

      console.log('Current floor is: ' + ctrl.elevator.currentFloor);

      console.log('Now heading to floor: ' + ctrl.destinationsList[0]);

      if (ctrl.elevator.currentFloor < ctrl.destinationsList[0]) {
        // cl('we\'re heading up');

        fireEvent(ctrl, 'up');
        ctrl.elevator.direction = +1;
        ctrl.elevator.currentFloor += 1;

        ctrl.refresh();
      }

      if (ctrl.elevator.currentFloor > ctrl.destinationsList[0]) {
        // cl('we\'re heading down');

        fireEvent(ctrl, 'down');
        ctrl.elevator.direction = -1;
        ctrl.elevator.currentFloor -= 1;

        ctrl.refresh();
      }

      if (ctrl.destinationsList[0] === ctrl.elevator.currentFloor ) {
        window.clearInterval(ctrl.elevator.timer);
        ctrl.elevator.timer = null;
        fireEvent(ctrl, 'arrived');
        ctrl.elevator.direction = 0;
        ctrl.destinationsList.shift();
        ctrl.refresh();

      }


      if (!ctrl.elevator.timer ) {
        if(ctrl.elevator.direction === 0 ){
          setTimeout(function (){
            ctrl.currentSpeed = Number(ctrl.currentSpeed);
            ctrl.elevator.timer = setInterval(function () {
              moveElevator(ctrl);
              //console.log('The timer speed is: ' + ctrl.currentSpeed);
            }, 1000);
          }, 3000);
        } else {
          ctrl.currentSpeed = Number(ctrl.currentSpeed);
          ctrl.elevator.timer = setInterval(function () {
            moveElevator(ctrl);
            //console.log('The timer speed is: ' + ctrl.currentSpeed);
          }, 1000);
        }
      }

      if (ctrl.destinationsList.length === 0 ){
        window.clearInterval(ctrl.elevator.timer);
        ctrl.elevator.timer = null;
      }


      //if (typeof ctrl.destinationsList === 'undefined' || ctrl.destinationsList.length === 0) {
      //  console.log('Error: destination array is undefined or empty');
      //  //Hmmmmm not good but works for now.
      //  window.clearInterval(ctrl.elevator.timer);
      //  ctrl.elevator.timer = null;
      //  return;
      //}

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
        console.log('sanitization error, either floor or array are null');
        //maybe some cheching, a throw statement?
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

function moveImage(ctrl, event) {

  $('#elevator-img').appendTo($('#' + 'floor-number-' + ctrl.currentFloor));
}

function highlitedDirection(ctrl, event) {

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
    // let ding = new Audio('http://soundbible.com/grab.php?id=1441&type=mp3');
    // ding.play();
  }
}

function displayCurrentFloor(ctrl, event) {
  if (event === 'floor') {
    $('#current-floor-indicator').html(ctrl.currentFloor);
    console.log('direction: ' + ctrl.direction);
  }
}

function clearFloorSelection(ctrl, event) {
  if (event === 'arrived') {
    $('#button-number-' + ctrl.currentFloor).removeClass('active');
  }
}
let lift = new ElevatorCtrl();

lift.addCallback(moveImage)
    .addCallback(highlitedDirection)
    .addCallback(displayCurrentFloor)
    .addCallback(clearFloorSelection);

$(function init() {

  $('#elevator-panel button, #floor-panel ul li button').click(function () {
    $(this).addClass('active');
    lift.buttonPress($(this).val());

  });
});


// cl($('#floor-panel ul li').val() + ' value');


// let list = [1,2,3,4,5];
// let item = 3;
//
// cl(list.indexOf(item));
// if (list.indexOf(item) === -1 || list.indexOf(item) === list.indexOf(item) +-1 ){
// 	list.push(item);
// }
// cl(list);
// });


//---------
