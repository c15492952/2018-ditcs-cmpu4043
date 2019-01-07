import * as Observable from "rxjs";
import "./style.css";
//Main function that is called from index.js
function Stopwatch(){
  const container = document.createElement("div");
  var canvas = document.createElement("canvas"); canvas.width="400"; canvas.height="400";
  const timer = document.createElement("timer"); timer.innerHTML ="<br>" + "0:0:0" + "<br>"; timer.style.font = "bold 20px arial,serif";
  const splits = document.createElement("splits"); splits.style.font = "bold 20px arial,serif";
  const startButton = Button("Start");
  const stopButton = Button("Stop");
  const clearButton = Button("Clear");
  const splitButton = Button("Split");
  let started = false;
  let time = 0;
  const timing = Observable.interval(100);
  for (let component of [canvas, timer, startButton, stopButton, clearButton, splitButton, splits]) {
      container.appendChild(component);
  }
  var ctx = canvas.getContext("2d");
  draw(ctx, canvas, 0);
  clicks(ctx, canvas, timer, timing, started, time, startButton, stopButton, clearButton, splitButton, splits);
  return container;
}

function clicks(ctx, canvas, timer, timing, started, time, startButton, stopButton, clearButton, splitButton, splits)
{
  //stream for if the timer is started or not
  const subscription = timing.subscribe(
  x => {
    if(!started) return;
    time++;
    draw(ctx, canvas, time);
    timer.innerHTML = "<br>" + Math.floor(time / 600) + ":" + Math.floor((time / 10) % 60) + ":" + (time % 10) + "<br>";
  });
  //starts the clock face and the digital timer
  const clickStartButton = Observable.fromEvent(startButton, "click");//start button clicked
  clickStartButton.subscribe(function(){
    started = true;//stop watch started
  });
  //stops the timing of the stopwatch where it is. waits here for the rest or sstart to be clicked again
  const clickStopButton = Observable.fromEvent(stopButton, "click");// stop button clicked
  clickStopButton.subscribe(function(){
    started = false; // stopwatch pauses
  });
  //clears the digital timer and resets the watch face to 0:0:0
  const clickClearButton = Observable.fromEvent(clearButton, "click");
  clickClearButton.subscribe(function(){
    started = false;
    time = 0;
    draw(ctx, canvas, time);
    timer.innerHTML = "<br>" + "0:0:0" + "<br>";
    splits.innerHTML = "";
  });
  //creates a list splits down the left side of the screen and breaks for a new line
  const clickSplitButton = Observable.fromEvent(splitButton, "click");
  clickSplitButton.subscribe(function(){
    splits.innerHTML += timer.innerHTML;
  });
}

function draw(ctx, canvas, time){
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  const faceSize = 199;
  const notchDistance = 0.98;
  // clock central red dot
  ctx.fillStyle = "red";
  ctx.beginPath();
  ctx.arc(faceSize, faceSize, 2, 0, 2 * Math.PI, true);
  ctx.fill();

  //draws the ouyer circle of the clock
  ctx.strokeStyle = "black";
  ctx.beginPath();
  ctx.arc(faceSize, faceSize, faceSize, 0, Math.PI * 2, true);
  ctx.arc(faceSize, faceSize, faceSize - 2, 0, Math.PI * 2, true);

  // draws the 12 longer notches around the clock face
  for (let i = 0; i < 12; i++) {
  let angle = i * (Math.PI * 2 / 12);
    const notchLength = faceSize * 0.15;
    ctx.moveTo(faceSize + faceSize * notchDistance * Math.cos(angle), faceSize + faceSize  * notchDistance * Math.sin(angle));
    ctx.lineTo(faceSize + (faceSize - notchLength) * notchDistance * Math.cos(angle), faceSize + (faceSize - notchLength) * notchDistance * Math.sin(angle));
    }

  // draws the 60 short notches around the clock face
  for (let i = 0; i < 60; i++) {
    let angle = i * (Math.PI * 2 / 60);
    const notchLength = faceSize * 0.07;
    ctx.moveTo(faceSize + faceSize * notchDistance * Math.cos(angle), faceSize + faceSize * notchDistance * Math.sin(angle));
    ctx.lineTo(faceSize + (faceSize - notchLength) * Math.cos(angle) * notchDistance, faceSize + (faceSize - notchLength) * Math.sin(angle) * notchDistance);
  }

  //draws shorter minute hand of the stopwatch
  let angle = (time / 600 / 60 - 0.25) * (Math.PI * 2);
  let notchLength = faceSize * 0.60;
  ctx.moveTo(faceSize, faceSize);
  ctx.lineTo(faceSize + notchLength * Math.cos(angle), faceSize + notchLength * Math.sin(angle));
  ctx.stroke();

  //draws red longer hand of the stopwatch
  ctx.strokeStyle = "red";
  ctx.beginPath();
  angle = (time / 10 / 60 - 0.25) * (Math.PI * 2);
  notchLength = faceSize * 0.8;
  ctx.moveTo(faceSize, faceSize);
  ctx.lineTo(faceSize + notchLength * Math.cos(angle), faceSize + notchLength * Math.sin(angle));
  ctx.stroke();
}
//function for making the buttons... Styled in CSS file
function Button(label) {
    const button = document.createElement("button");
    button.innerText = label;
    button.className = "buttonclass";
    return button;
}

export default Stopwatch;
