import React from 'react';
import Sketch from 'react-p5';

const CircleSketch = () => {
  const spheres = [];
  const numSpheres = 100;
  let mouseX = p5.mouseX;
  let mouseY = p5.mouseY;

  const setup = (p5, canvasParentRef) => {
    if (typeof  window !== 'undefined') {
      p5.createCanvas(p5.windowWidth, p5.windowHeight).parent(canvasParentRef);
      p5.noStroke();

      for (let i = 0; i < numSpheres; i++) {
        const position = p5.createVector(
          p5.random(-p5.width, p5.width),
          p5.random(-p5.height, p5.height),
          p5.random(-p5.width / 2, p5.width / 2)
        );
        const radius = p5.random(5, 50);
        const color = p5.color(p5.random(50), p5.random(250));
        spheres.push({ position, radius, color });
      }
    }
  };


  const draw = (p5) => {
    p5.clear();

    const target = p5.createVector(mouseX, mouseY);

    for (let i = 0; i < spheres.length; i++) {
      const sphere = spheres[i];

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
      p5.fill(sphere.color, 50, 50);
      p5.ellipse(sphere.radius, sphere.radius, sphere.radius);
      p5.pop();
      p5.rotate(p5.frameCount * 0.000001);
    }
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
