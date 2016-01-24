'use strict';

var app = (function(){

var ElevatorCtrl = function(){
  this.floor = 0;
  this.direction = 0;
  this.queue = [];
  this.movingSpeed = 1;
  this.doorSpeed = 3;
  this.img = $('#elevator-img');
  this.callbacks = [];
  this.elevator = {
    direction: 0,
    curentFloor: []

  };
};

Elevator.prototype.addCallback = function (callback){
  this.callbacks.push(callback);
  return this;
};

Elevator.prototype.removeCallback = function (callback){
  for (let i=0; i<=this.callbacks.length;i++) {
    if (this.callbacks[i]===callback) {
      this.callbacks.splice(i,i);
    }
  }

};

var elev = new Elevator();

function moveElevator(destination){
  elev.img.appendTo($('#' + 'floor-number-' + destination));
}

function addDestination(floor){
  elev.queue.push(floor);
}


$(function init() {
  var button = $('#elevator-panel button');

  button.click(function(){
    $(this).addClass('active');

//FUNCTION TO CALL WITH THIS PARAM($(this).val());

  //  ON-CLICK TESTING

    var elevatorDestination = 'floor-number-'+ $(this).val();

    moveElevator($(this).val(), img);


  // END OF ONCLICK TESTING AREA
  });

//ON-LOAD TESTING

  var img = $('#elevator-img');

  elev.queue = [1,9,0];

//for (var i=0;i<elev.queue.length;i++){
//  moveElevator(elev.queue[i], img);
//}

//  END OF ON-LOAD TESTING
});

/*
* Takes is a destination floor and moves the elevator there
* */



function addDestination(floor){
  elev.queue.push(floor);
}


// TO BE DELETED AFTER DEV PHASE
function cl(param){
  return console.log(param);
}
