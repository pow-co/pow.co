import React from 'react';
import Sketch from 'react-p5';
import { useRouter } from 'next/router'


const CircleSketch = ({ tags, maxDifficulty }) => {
  const spheres = [];
  const router = useRouter();
  const SIZE_FACTOR = 10;
  let mouseX = 0;
  let mouseY = 0;

  const setup = (p5, canvasParentRef) => {
    if (typeof window !== 'undefined') {
      p5.createCanvas(p5.windowWidth * 2, p5.windowHeight * 2).parent(canvasParentRef);
      p5.noStroke();
  
      const sortedTags = [...tags].sort((a, b) => b.difficulty - a.difficulty);
  
      let maxRadiusSoFar = p5.map(sortedTags[0].difficulty, 0, maxDifficulty, 5, 25);
  
      sortedTags.forEach((tag, index) => {
        const radius = p5.map(tag.difficulty, 0, maxDifficulty, 5, 20);
        const color = p5.color(p5.random(50), p5.random(250));
  
        const angle = (index / sortedTags.length) * 90 * (p5.PI);
        const distance = maxRadiusSoFar * (radius/2);  // Add radius to distance
        
        const x = p5.width + p5.cos(angle) * distance;
        const y = p5.height + p5.sin(angle) * distance;
  
        const position = p5.createVector(x, y);
  
        // Now add the current radius to maxRadiusSoFar
        maxRadiusSoFar += radius;
  
        spheres.push({ position, radius, color, tag: tag.tag });
      });
    }
  };

  const draw = (p5) => {
    //p5.clear();
    //p5.background(220, 240, 240);
    p5.background(50);

    const target = p5.createVector(mouseX, mouseY);

    spheres.forEach((sphere) => {
      const movement = p5.createVector(
        (target.x - sphere.position.x) * 0.01,
        (target.y - sphere.position.y) * 0.01,
        (target.z - sphere.position.z) * 0.01
      );
    
      // Gradually move the sphere towards the target position
      //sphere.position.lerp(target, 0.0001);


      p5.push();
      p5.translate(sphere.position.x/2, sphere.position.y/2);
      //p5.rotate(p5.frameCount * sphere.radius/10000);
      p5.noStroke();
      //p5.fill(sphere.color, 50, 50);
      p5.stroke(0);
      
      //p5.ellipse(sphere.position.x/2 - (sphere.radius/SIZE_FACTOR), sphere.position.y/2, sphere.radius * SIZE_FACTOR);
      //p5.noStroke();
      //p5.fill(sphere.radius * 2, sphere.radius * 4, sphere.radius * 10);
      //p5.noStroke();
      //p5.strokeWeight(;
      //p5.stroke(sphere.radius * 2, sphere.radius * 4, sphere.radius * 10);
      p5.fill(250, 250, 250);
      p5.ellipse(0, 0, sphere.radius * SIZE_FACTOR);
      //p5.fill(200, 50, 50);
      p5.fill(250, 250, 255 / sphere.radius * 5);  // Use white color for text
      p5.stroke(0);
      p5.strokeWeight(sphere.radius/5);
      p5.textSize(sphere.radius * 2);
      p5.text(`${sphere.tag}`, - sphere.radius * 2, 0);
      p5.pop();
      //p5.text(`${sphere.tag}: ${sphere.radius.toFixed(2)}`, sphere.position.x/2 - sphere.radius, sphere.position.y/2);
      //p5.translate(p5.windowWidth/2, p5.windowHeight/2);
      
      //p5.rotate(p5.frameCount * 0.000001);
    });
  };

  const windowResized = (p5) => {
    p5.resizeCanvas(p5.windowWidth, p5.windowHeight);
  };

  const mouseMoved = (p5) => {
    mouseX = p5.mouseX;
    mouseY = p5.mouseY;
    p5.text(`${mouseX}, ${mouseY}`, p5.mouseX, p5.mouseY);
    //p5.ellipse(p5.mouseX, p5.mouseY, 10);
  };

  const mouseClicked = (p5) => {
    console.log("Clicked! Mouse X: ", p5.mouseX, " Mouse Y: ", p5.mouseY);
    p5.noFill();
    for (let sphere of spheres) {
      // Check if the mouse click is within the sphere
      const d = p5.dist(p5.mouseX, p5.mouseY, sphere.position.x/2, sphere.position.y/2);
      if (d < sphere.radius * SIZE_FACTOR / 2) {
        console.log("Clicked on sphere: ", sphere.tag);
         const win = window.open(`/topics/${sphere.tag}`, "_blank");
         if (win) {
           win.focus();
         }
        //router.push(`/topics/${sphere.tag}`);
        break;
      }
    }
  };

  return (
    <Sketch setup={setup} draw={draw} mouseMoved={mouseMoved} mouseClicked={mouseClicked} />
  );
};

export default CircleSketch;
