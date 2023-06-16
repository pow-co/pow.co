import React from 'react';
import Sketch from 'react-p5';

const CloudSketch = () => {
  const points = [];

  const setup = (p5, canvasParentRef) => {
    p5.createCanvas(p5.windowWidth, p5.windowHeight, p5.WEBGL).parent(canvasParentRef);
    //p5.noFill();
    //p5.stroke(0);
    //p5.strokeWeight(0.05);
  };

  const draw = (p5) => {
    p5.clear();
    const centerX = 0;
    const centerY = 0;
    const radius = p5.min(p5.width, p5.height) / 2.8;
    const angleOffset = p5.frameCount * 0.001;

    p5.rotateX(p5.PI / 3);
    p5.rotateZ(angleOffset/10);

    p5.beginShape(p5.POINTS);
    //p5.stroke(1);

    for (let i = 0; i < 720; i+=2) {
      const noiseVal = p5.noise(i * 0.01, p5.frameCount * 0.0025);
      const x = p5.cos(p5.radians(i)) * radius + p5.map(noiseVal, 0, 1, -10, 10);
      const y = p5.sin(p5.radians(i)) * radius + p5.map(noiseVal, 0, 1, -10, 10);
      const z = p5.map(noiseVal, 0, 1, -radius, radius);
      p5.fill(i*2);
      //p5.ellipse(x, y, 10);
      p5.vertex(x, y, z);
      p5.vertex(-x, -y, -z);
      p5.vertex(x/2, y/2, z/2);
      p5.vertex(-x/2, -y/2, -z/2);
      //p5.rect(x-100, y-100, 10, 10);
    }

    p5.endShape();

    if (points.length > 1500) {
      points.splice(0, 20);
    }
  };

  const windowResized = (p5) => {
    p5.resizeCanvas(p5.windowWidth, p5.windowHeight);
  };

  return (
    <Sketch setup={setup} draw={draw} windowResized={windowResized} />
  );
};

export default CloudSketch;
