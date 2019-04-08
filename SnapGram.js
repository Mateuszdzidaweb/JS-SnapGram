console.clear();

const canvas = document.getElementById("canvas");
const video = document.createElement("video");
const context = canvas.getContext("2d");

let constraints = {
    video: true,
    audio: false
  };

  //Camera

  navigator.mediaDevices.getUserMedia(constraints).then((stream) => {
    // This part of the "promise", like a callback, is
    // called when the stream becomes available
    console.log("Success - here's the stream: ", stream);
    
    // Connect the video object to the stream
    video.srcObject = stream;
    
    // Tell the video object to start playing once it's ready
    video.addEventListener("loadedmetadata", () => {
      video.play();
    });
    
    
  }).catch((error) => {
    // This part of the "promise", like a callback, is
    // called if there is an error (e.g. no camera, user denies)
    console.log("An error occurred: ", error);
    
  });


  //Animation loop to show camera in real time
  
let lastTime = Date.now();

// Called very rapidly to carry out animations
function animationLoop(){
    // 0. Schedule the next run of this function
    requestAnimationFrame(animationLoop);
    
  
    // 1. Clear the Canvas
    context.clearRect(0, 0, canvas.width, canvas.height);
  
    
    // 2. Calculate Changes
    // Calculate the difference, in seconds, between when the
    // loop last ran and now.
  const diffSeconds = (Date.now() - lastTime) / 1000;
  
  	// Store the current time as lastTime, so that next time the loop
    // is called we have a reference point to calculate diffSeconds from
  lastTime = Date.now();
    
    // Only if some time has passsed...
    if(diffSeconds > 0){
        // NEW: 3. Loop to apply animations and redraw
        for(const canvasObject of canvasObjects){
          canvasObject.applyAnimation(diffSeconds);
          canvasObject.draw();
        }
    } 

}
const canvasObjects = new Set();
animationLoop();

const webcam = new Webcam(context,300,250);
canvasObjects.add(webcam);



// NEW: Function to apply a filter
 function applyFilter(){
    // Read each pixel out of canvas
    // Array representing, r then g then b values for each pixel
    let imageData = context.getImageData( 0, 0, canvas.width, canvas.height);
    let dataArray = imageData.data;
    console.log('fillter apply');
  
    
    // Loop over each pixel
    for(let i = 0, l = dataArray.length; i < l ; i += 4){
      // dataArray [i] = Red
      // dataArray [i+1] = Green
      // dataArray [i+2] = Blue
      // dataArray [i+3] = Alpha
      
      // Invert the colours by altering the r, g, b values
      dataArray[i] = 255 - dataArray[i];
      dataArray[i + 1] = 255 - dataArray[i + 1];
      dataArray[i + 2] = 255 - dataArray[i + 2];
      
      
    }
    // Write the data back to canvas
    context.putImageData(imageData, 0 , 0);
  }










  