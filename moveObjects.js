// Moving Objects/ Selecting Objects

let draggedCanvasObject = null
canvas.addEventListener("mousedown", dragStart);
canvas.addEventListener("mousemove", dragMove);
canvas.addEventListener("mouseup", dragEnd);
canvas.addEventListener("dblclick", selectObject);


function dragStart(e){
const canvasRect = canvas.getBoundingClientRect();
const x = e.clientX - canvasRect.left;
const y = e.clientY - canvasRect.top;

console.log("mosue down at coordinates ", x,y);

const canvasObjectsReversed = Array.from(canvasObjects).reverse();

for(let canvasObject of canvasObjectsReversed){
  if(canvasObject.constantsPoints(x,y)){
    canvasObject.alpha = 0.5;
    canvasObject.x = x;
    canvasObject.y = y;

    /////
    //Move dragged object 
    canvasObjects.delete(canvasObject);
    canvasObjects.add(canvasObject);

    draggedCanvasObject = canvasObject;
    break;
  }
}
}

function dragMove(e){
  if (draggedCanvasObject === null){
    return;
  }
const canvasRect = canvas.getBoundingClientRect();
const x = e.clientX - canvasRect.left;
const y = e.clientY - canvasRect.top;

console.log("Mouse move at cordinates", x,y);

draggedCanvasObject.x = x;
draggedCanvasObject.y = y;
}

function dragEnd(e){
  if(draggedCanvasObject === null){
    return;
  }
  draggedCanvasObject.alpha = 1;
  draggedCanvasObject = null;
}


function selectObject(e){
  const canvasRect = canvas.getBoundingClientRect();
  const x = e.clientX - canvasRect.left;
  const y = e.clientY - canvasRect.top;
  
  console.log("mosue down at coordinates ", x,y);
  
  const canvasObjectsReversed = Array.from(canvasObjects).reverse();
  
  for(let canvasObject of canvasObjectsReversed){
    if(canvasObject.constantsPoints(x,y)){
      canvasObject.x = x;
       canvasObject.y = y;
        canvasObject.alpha = 0.4;
      
    }
    if(canvasObject.alpha === 0.4){
    document.getElementById("Baloon1Blue").addEventListener("click", function(e){
     
      canvasObject.fillStyle = "blue";
      canvasObject.alpha = 1;
   
    });
    
    document.getElementById("Baloon1Green").addEventListener("click", function(e){
     
      canvasObject.fillStyle = "green";
      canvasObject.alpha = 1;

    });
       
  }
  break;
  }
  
}