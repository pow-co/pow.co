import React from 'react';
import Sketch from 'react-p5';

const CircleSketch = ({ tags, maxDifficulty }) => {
  const spheres = [];
  let mouseX = p5.mouseX;
  let mouseY = p5.mouseY;

  const setup = (p5, canvasParentRef) => {
    if (typeof window !== 'undefined') {
      p5.createCanvas(p5.windowWidth, p5.windowHeight).parent(canvasParentRef);
      p5.noStroke();

      tags.forEach((tag) => {
        const position = p5.createVector(
          p5.random(-p5.width, p5.width),
          p5.random(-p5.height, p5.height),
          p5.random(-p5.width / 2, p5.width / 2)
        );
        const radius = p5.map(tag.difficulty, 0, maxDifficulty, 5, 50);
        const color = p5.color(p5.random(50), p5.random(250));
        spheres.push({ position, radius, color, tag: tag.tag });
      });
    }
  };

  const draw = (p5) => {
    //p5.clear();
    p5.background(150, 150, 150);

    const target = p5.createVector(mouseX, mouseY);

    spheres.forEach((sphere) => {
      const movement = p5.createVector(
        (target.x - sphere.position.x) * 0.01,
        (target.y - sphere.position.y) * 0.01,
        (target.z - sphere.position.z) * 0.01
      );

      // Gradually move the sphere towards the target position
      sphere.position.lerp(target, 0.00005);

      p5.push();
      p5.translate(sphere.position.x, sphere.position.y, sphere.position.z);
      p5.noStroke();
      //p5.fill(sphere.color, 50, 50);
      p5.fill(sphere.radius * 10);
      p5.ellipse(sphere.position.x/2, sphere.position.y/2, sphere.radius * 15);
      p5.fill(255 / sphere.radius * 2);  // Use white color for text
      p5.textSize(16);
      p5.text(`${sphere.tag}: ${sphere.radius.toFixed(2)}`, sphere.position.x/2 - sphere.radius, sphere.position.y/2);
      p5.pop();
      //p5.translate(p5.windowWidth/2, p5.windowHeight/2);
      p5.rotate(p5.frameCount * 0.00001);
      //p5.rotate(p5.frameCount * 0.000001);
    });
  };

  const windowResized = (p5) => {
    p5.resizeCanvas(p5.windowWidth, p5.windowHeight);
  };

  const mouseMoved = (p5) => {
    mouseX = p5.mouseX;
    mouseY = p5.mouseY;
  };

  return (
    <Sketch setup={setup} draw={draw} windowResized={windowResized} mouseMoved={mouseMoved} />
  );
};

export default CircleSketch;
