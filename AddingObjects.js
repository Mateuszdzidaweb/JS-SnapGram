// Creating object form the class



document.getElementById("AddBaloon").addEventListener("click", function(e){
  
    const baloon1 = new Baloon(context, 100, 250, "red", undefined, undefined,50);
    baloon1.fillStyleRed = 255;
  
    canvasObjects.add(baloon1);
  });


