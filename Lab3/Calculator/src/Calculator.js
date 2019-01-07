import { fromEvent, merge, pipe, subscribe } from "rxjs";
import * as Observable from "rxjs";
import { mapTo, scan, startWith } from "rxjs/operators";
import "./calc.css";

function Calculator(){
    const gridContainer = document.createElement("div");
    var buttons = ["(",")","±","/","7","8","9","*","4","5","6","-","1","2","3","+","0","."];
    const display = Display();
    const calcbtn = Button("=");
    const clrbtn = Button("C");
    var pmbtn = document.createElement("button");
    gridContainer.className = "grid-container";
    gridContainer.appendChild(display);
    for(let i = 0; i < buttons.length; i++)
    {
      if(buttons[i] == "±")
      {
        pmbtn = Button(buttons[i]);
        gridContainer.appendChild(pmbtn);
      }
      else {
        var btn = Button(buttons[i]);
        gridContainer.appendChild(btn);
      }
      run(display, btn, calcbtn, clrbtn, pmbtn, buttons);
    }


    let keypressed = Observable.fromEvent(document, "keydown");
    keypressed.subscribe(function(){
      let key = event.keyCode;
      console.log(key);
      if(event.keyCode == 8)//backspace delete
         {
          AggString = AggString.substring(0,AggString.length - 1);
          display.innerHTML = AggString;
        }
        else if(event.shiftKey)
        {
          if(event.keyCode == 57)
          {
            AggString += "(";
            display.innerHTML = AggString;
          }
          else if(event.keyCode == 48)
          {
            AggString += ")";
            display.innerHTML = AggString;
          }
          else if(event.keyCode == 56)
          {
            AggString += "*";
            display.innerHTML = AggString;
          }
          else if(event.keyCode == 187)
          {
            AggString += "+";
            display.innerHTML = AggString;
          }
        }
        else if(numbercodes.includes(event.keyCode))
        {
          AggString += String.fromCharCode(event.keyCode);
          display.innerHTML = AggString;
        }
        else if(event.keyCode == 191)
        {
          AggString += "/";
          display.innerHTML = AggString;
        }
        else if(event.keyCode == 189)
        {
          AggString += "-";
          display.innerHTML = AggString;
        }
        else if(event.keyCode == 67)//C function for deleting
        {
          AggString = "";
          display.innerHTML = "";
        }
        else if(event.keyCode == 13 || event.keyCode == 187)//call calculation function to calculate string
        {
          if(AggString == "")
          {
              display.innerHTML = "";
              alert("enter a valid equation");
          }
          else
          {
              try
              {
                answer = eval(AggString);
                display.innerHTML = answer;
                AggString = answer;
              }
              catch(e)
              {
                if(e instanceof SyntaxError)
                {
                  alert("error in calculation");
                  AggString = "";
                  display.innerHTML = "";
                }
              }
          }
        }
    });


    gridContainer.appendChild(clrbtn);
    gridContainer.appendChild(calcbtn);

    return gridContainer;
}

var numbercodes = [48, 49, 50, 51, 52, 53, 54, 55, 56, 57];
var operators = ["+", "-", "*", "/", "(", ")"]
var AggString = "";
var answer;

function run(display, btn, calcbtn, clrbtn, pmbtn, buttons) {
     merge(
        fromEvent(btn, "click").pipe(mapTo(val => ({ value: AggString += btn.value }))),
        fromEvent(clrbtn, "click").pipe(mapTo(val => ({ value: AggString = "" }))),
     )
        .pipe(
            scan((acc, update) => update(acc))
        )
        .subscribe(val => {
            display.innerHTML = AggString;
        });
        //equals button pressed
      let calcpressed = Observable.fromEvent(calcbtn, "click");
        calcpressed.subscribe(function(){
          equalTo(display);
        });
        //negation button pressed
      let pmpressed = Observable.fromEvent(pmbtn, "click");
      pmpressed.subscribe(function(){
        for(let i=0; i<AggString.length; i++)
        {
          var char = AggString[i];
          if(operators.includes(char));
          {
            console.log(AggString);
            AggString += "*(-1)"
            equalTo(display);
          }
        }
        AggString = AggString * (-1);
        display.innerHTML = AggString;
      });
}

function equalTo(display)
{
  try
  {
    answer = eval(AggString);
    display.innerHTML = answer;
    AggString = answer;
  }
  catch(e)
  {
    if(e instanceof SyntaxError)
    {
      alert("error in calculation");
      AggString = "";
      display.innerHTML = "";
    }
  }
}

function Display() {
    const display = document.createElement("div");
    display.className = "screen";
    display.type = "text";
    display.placeholder = "0";
    display.readonly = "readonly";
    display.style.textAlign = "right";
    return display;
}
function Button(label) {
    const button = document.createElement("button");
    button.innerText = label;
    button.value = label;
    return button;
}

export default Calculator;
