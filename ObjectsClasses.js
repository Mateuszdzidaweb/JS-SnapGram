// Creating objects classes from Drawable class

class Drawable {

    // Lots of constructor parameters with sensible defaults = more useful
    constructor(context, x = 0, y = 0, fillStyle = "#000", strokeStyle = "transparent", lineWidth = 0) {
        this.context = context;
        if (!(this.context instanceof CanvasRenderingContext2D)) {
            throw new Error("You must provide a valid canvas context to Drawables.");
        }

        this.x = x;
        this.y = y;
        this.fillStyle = fillStyle;
        this.strokeStyle = strokeStyle;
        this.lineWidth = lineWidth;
        this.rotation = 0;
        this.alpha = 1;

        this.fillStyleRed = 0;
        this.fillStyleblue = 0;
        this.fillStyleGreen = 0;

        this.deltas = new Map();
        this.limits = {
            max: new Map(),
            min: new Map()
        };
    }

    // The method to call when drawing
    draw() {
        // SAVE context
        this.context.save();

        // TRANSLATE to where we want to start drawing
        this.context.translate(this.x, this.y);
        this.context.rotate(this.rotation);

        // CONFIGURE the context with colours and widths
        this.context.fillStyle = this.fillStyle;
        this.context.strokeStyle = this.strokeStyle;
        this.context.lineWidth = this.lineWidth;

        this.context.globalAlpha = this.alpha;

        // This is where the drawing would happen.
        // And will in subclasses!
    }


    // This method should be called when a shape has finished drawing
    // It will restore the context back to where it was before drawing started
    afterDraw() {

        // RESTORE the context (undo translate, colours, width changes)
        this.context.restore();
    }

    // Method to tell a Drawable to apply any applicable animations, based on how much time has passed
    applyAnimation(secondsElapsed) {
        // Loop over all deltas
        for (const [propertyName, valueChangePerSecond] of this.deltas) {
            // Calculate how much to change the amount by (change amount = change per second * seconds passed)
            const changeAmount = secondsElapsed * valueChangePerSecond;

            // Apply the change
            // e.g. this["x"] += 0.5;
            this[propertyName] += changeAmount;


            // Have we exceeded a maximum here?
            if (this.limits.max.has(propertyName)) {
                this[propertyName] = Math.min(this[propertyName], this.limits.max.get(propertyName));

            }

            // Have we gone under a minimum here?
            if (this.limits.min.has(propertyName)) {
                this[propertyName] = Math.max(this[propertyName], this.limits.min.get(propertyName));
            }
        }
    }

    // NEW: Save class name, and properties to an object, and return a JSON representation of that object.
}


class Rectangle extends Drawable {

    // Compared to drawable, also accepts width and height 
    constructor(context, x = 0, y = 0, fillStyle = "#000", strokeStyle = "transparent", lineWidth = 0, deltas = new Map(), width = 100, height = 100) {

        // Call through to super - with the parameters it expects
        super(context, x, y, fillStyle, strokeStyle, lineWidth);

        // Save the additional properties
        this.width = width;
        this.height = height;
    }

    // Override draw to provide actual rectangle drawing
    draw() {

        // Call super's draw method to do all of the set-up
        super.draw();

        // Now do the rectangle drawing
        // We can draw *around* point 0,0 because we have already translated to the desired x,y coordinate
        this.context.fillRect(this.width / -2, this.height / -2, this.width, this.height);
        this.context.strokeRect(this.width / -2, this.height / -2, this.width, this.height);

        // Remember, subclasses must call afterDraw to do cleanup (restore the translates done)
        super.afterDraw();
    }
    //Constants for moving Object
    constantsPoints(x, y) {
        console.log("Does this rectangle:", this);
        console.log("Contain this cordinates", x, y);

        if (x >= this.x - this.width / 2) {
            // console.log("Click is to right hand side of left line");
            if (y >= this.y - this.height / 2) {
                if (x <= this.x + this.width / 2) {
                    if (y <= this.y + this.height / 2) {
                        return true;
                    }
                }
            }
        }
        return false;
    }
}



class Webcam extends Rectangle {
    constructor(context, x = 0, y = 0, strokeStyle = "transparent", lineWidth = 0, width = 600, height = 500) {
        super(context, x, y, undefined, strokeStyle, lineWidth);

        this.width = width;
        this.height = height;


    }
    draw() {
        super.draw();
        //this.context.drawImage(video, this.x, this.y, this.width, this.height);
        // this.context.drawImage(video, this.width / -2, this.height / -2, this.width, this.height);

        this.context.drawImage(video, this.x - this.width / 2, this.y - this.height / 2, this.width, this.height);

        let filterButton = document.getElementById('filter');

        // Apply filter/ Not working under the button!
        filterButton.onclick = function () {
            applyFilter();
        }
    
        super.afterDraw();
    }
}


class Baloon extends Drawable{

    // Add a constructor
    constructor(context, x = 0, y = 0, fillStyle = "#000", strokeStyle = "transparent", lineWidth = 0, radius = 50, centerX = 0, centerY = 0){
    
      // Call through to super - with the parameters it expects
      super(context, x, y, fillStyle, strokeStyle, lineWidth);
      
      // Save the additional properties
      this.radius = radius;
      this.centerX = centerX;
      this.centerY = centerY;
      
      this.KAPPA = (4 * (Math.sqrt(2) - 1))/3;
      this.width = 0.0333;
      this.height = 0.4;
      this.TieWidth = 0.12;
      this.TieHeight = 0.10;
      this.TieCurve = 0.13;
    }
    
    draw(){
      super.draw();
      this.context.beginPath();
      
      // Prepare constants
      let centerX = this.centerX;
      let centerY = this.centerY;
      let radius = this.radius;
      
      let handleLength = this.KAPPA * radius;
      
      let widthDiff = (radius * this.width);
      let heightDiff = (radius * this.height);
      
      let balloonBottomY = centerY + radius + heightDiff;
      
      // Begin balloon path
      
  
      // Top Left Curve
      
      let topLeftCurveStartX = centerX - radius;
      let topLeftCurveStartY = centerY;
      
      let topLeftCurveEndX = centerX;
      let topLeftCurveEndY = centerY - radius;
      
      context.moveTo(topLeftCurveStartX, topLeftCurveStartY);
      context.bezierCurveTo(topLeftCurveStartX, topLeftCurveStartY - handleLength - widthDiff,
                              topLeftCurveEndX - handleLength, topLeftCurveEndY,
                              topLeftCurveEndX, topLeftCurveEndY);
                              
      // Top Right Curve
      
      let topRightCurveStartX = centerX;
      let topRightCurveStartY = centerY - radius;
      
      let topRightCurveEndX = centerX + radius;
      let topRightCurveEndY = centerY;
      
      context.bezierCurveTo(topRightCurveStartX + handleLength + widthDiff, topRightCurveStartY,
                              topRightCurveEndX, topRightCurveEndY - handleLength,
                              topRightCurveEndX, topRightCurveEndY);
                                          
      // Bottom Right Curve
      
      let bottomRightCurveStartX = centerX + radius;
      let bottomRightCurveStartY = centerY;
      
      let bottomRightCurveEndX = centerX;
      let bottomRightCurveEndY = balloonBottomY;
      
      context.bezierCurveTo(bottomRightCurveStartX, bottomRightCurveStartY + handleLength,
                              bottomRightCurveEndX + handleLength, bottomRightCurveEndY,
                              bottomRightCurveEndX, bottomRightCurveEndY);							
      
      // Bottom Left Curve
      
      let bottomLeftCurveStartX = centerX;
      let bottomLeftCurveStartY = balloonBottomY;
      
      let bottomLeftCurveEndX = centerX - radius;
      let bottomLeftCurveEndY = centerY;
      
      context.bezierCurveTo(bottomLeftCurveStartX - handleLength, bottomLeftCurveStartY,
                              bottomLeftCurveEndX, bottomLeftCurveEndY + handleLength,
                              bottomLeftCurveEndX, bottomLeftCurveEndY);
      
      this.context.fill();
      this.context.stroke();
      // End balloon 
  
      // Create balloon tie
      
      let halfTieWidth = (radius * this.TieWidth)/2;
      let TieHeight = (radius * this.TieHeight);
      let TieCurveHeight = (radius * this.TieCurve);
      
      context.beginPath();
      context.moveTo(centerX - 1, balloonBottomY);
      context.lineTo(centerX - halfTieWidth, balloonBottomY + TieHeight);
      context.quadraticCurveTo(centerX, balloonBottomY + TieCurveHeight,
                                  centerX + halfTieWidth, balloonBottomY + TieHeight);
                  context.lineTo(centerX + 1, balloonBottomY);
                  context.fill();
  
      super.afterDraw();
    }
    //Constants for moving the ballon
    constantsPoints(x,y){
      console.log("Does this Baloon:", this);
      console.log("Contain this cordinates", x,y);
  
    const xDiff = this.x-x;
    const yDiff = this.y-y;
  
    const distance = Math.sqrt (xDiff * xDiff + yDiff * yDiff);
    if(distance <= this.radius){
      
      return true;
    }
  
    return false
    }
  }
