import React from 'react';
import Sketch from 'react-p5';
import { useRouter } from 'next/router'


const MapSketch = ({ tags, maxDifficulty }) => {
  const spheres = [];
  const router = useRouter();
  const SIZE_FACTOR = 12;
  let mouseX = 0;
  let mouseY = 0;

  const setup = (p5, canvasParentRef) => {
    if (typeof window !== 'undefined') {
      let canvasScale = 1;

    //   p5.colorMode(p5.HSB, 100);
    //     for (let i = 0; i < p5.windowWidth; i+=10) {
    //         for (let j = 0; j < p5.windowHeight; j+=10) {
    //             p5.stroke(i, j, 100);
    //             p5.point(i, j);
    //         }
    //     }

      const screenWidth = window.innerWidth;
      console.log("screenWidth Before Switch ", screenWidth);

      switch (true) {
        case (screenWidth < 576):
          console.log("screenWidth ", screenWidth);
          canvasScale = 2.25;
          break;
        case (screenWidth >= 576 && screenWidth < 768):
          console.log("screenWidth ", screenWidth);
          canvasScale = 2;
          break;
        case (screenWidth >= 768 && screenWidth < 992):
          console.log("screenWidth ", screenWidth);
          canvasScale = 2;
          break;
        case (screenWidth >= 992 && screenWidth < 1200):
          console.log("screenWidth ", screenWidth);
          canvasScale = 1;
          break;
        case (screenWidth >= 1200):
          console.log("screenWidth ", screenWidth);
          canvasScale = 1;
          break;
        default:
          console.log("screenWidth ", screenWidth);
          console.log("This is default");
          canvasScale = 1;
      }
      console.log("canvasScale ", canvasScale);
      p5.createCanvas(p5.windowWidth * canvasScale, p5.windowHeight * 2).parent(canvasParentRef);
      p5.noStroke();
      p5.textFont('Times New Roman');

      let xPos = 10; // Keep track of the x position where the next square will be drawn
        let yPos = p5.windowHeight/20; // Keep track of the y position where the next square will be drawn
        let rowHeight = 0; // Keep track of the tallest square in the current row
  
      const sortedTags = [...tags].sort((a, b) => b.difficulty - a.difficulty);
    
      sortedTags.forEach((tag, index) => {
        //const side = p5.map(tag.difficulty, 0, maxDifficulty, p5.windowHeight/187.5, p5.windowHeight/54.375);
        const side = p5.map(tag.difficulty, 0, maxDifficulty, 5, 30);

        const color = p5.color(p5.random(50), p5.random(250));
      
        // Place squares in a grid-like structure
        if (xPos + side * SIZE_FACTOR > p5.width) {
            xPos = 10;
            yPos += rowHeight * SIZE_FACTOR + SIZE_FACTOR;
            rowHeight = 0;
        }
        const position = p5.createVector(xPos, yPos);
        spheres.push({ position, side, color, tag: tag.tag });
        xPos += side * SIZE_FACTOR + SIZE_FACTOR;
        rowHeight = Math.max(rowHeight, side);
      });
    }
  };

  const draw = (p5) => {
    //p5.clear();
    //noStroke();
    
    spheres.forEach((sphere) => {
        p5.push();
        p5.translate(sphere.position.x, sphere.position.y);
        //p5.stroke(0);
        p5.strokeWeight(4);
        //p5.fill(sphere.size / 2, sphere.size / 10, sphere.size * 10);
        p5.noStroke();
        p5.colorMode(p5.HSB, 100);
        for (let i = 0; i < sphere.side*2; i++) {
            for (let j = 0; j < sphere.side; j++) {
                p5.fill(i, j, 100);
                //p5.point(i, j);
            }
        }
        p5.rect(0, 0, sphere.side * SIZE_FACTOR, sphere.side * SIZE_FACTOR, 10);
        //p5.stroke(200, 200, 200);
        p5.stroke(0);
        p5.textSize(sphere.side * 2);
        p5.text(sphere.tag, sphere.side, sphere.side * 6);
        p5.pop();
  });
};

  const windowResized = (p5) => {
    p5.resizeCanvas(p5.windowWidth, p5.windowHeight);
  };

  const mouseMoved = (p5) => {
    mouseX = p5.mouseX;
    mouseY = p5.mouseY;
    //p5.text(`${mouseX}, ${mouseY}`, p5.mouseX, p5.mouseY);
    //p5.ellipse(p5.mouseX, p5.mouseY, 10);
  };

  const mouseClicked = (p5) => {
    console.log("Clicked! Mouse X: ", p5.mouseX, " Mouse Y: ", p5.mouseY);
    for (let sphere of spheres) {
        // Check if the mouse click is within the square
        const withinX = p5.mouseX >= sphere.position.x && p5.mouseX <= sphere.position.x + sphere.side * SIZE_FACTOR;
        const withinY = p5.mouseY >= sphere.position.y && p5.mouseY <= sphere.position.y + sphere.side * SIZE_FACTOR;
      
        if (withinX && withinY) {
          console.log("Clicked on square: ", sphere.tag);
          const win = window.open(`/topics/${sphere.tag}`, "_blank");
          if (win) {
            win.focus();
          }
          break;
        }
      }
  };

  return (
    <Sketch setup={setup} draw={draw} mouseMoved={mouseMoved} mouseClicked={mouseClicked} />
  );
};

export default MapSketch;
