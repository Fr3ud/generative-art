const canvasSketch = require('canvas-sketch');
const { lerp } = require('canvas-sketch-util/math');
const random = require('canvas-sketch-util/random');
const palettes = require('nice-color-palettes');

random.setSeed(random.getRandomSeed());
console.log(random.getSeed());

const settings = {
  suffix: random.getSeed(),
  dimensions: [ 2048, 2048 ],
};

const sketch = () => {
  const colorCount = random.rangeFloor(1, 5);
  const palette = random.pick(palettes).slice(0, colorCount);

  const createGrid = () => {
    const points = [];
    const count = 30;

    for (let x = 0; x < count; x++) {
      for (let y = 0; y < count; y++) {
        const u = count <= 1 ? 0.5 : x / (count - 1);
        const v = count <= 1 ? 0.5 : y / (count - 1);
        const radius = Math.abs(random.noise2D(u, v)) * 0.2;

        points.push({
          radius,
          rotation: random.noise2D(u, v),
          position: [u, v],
          color: random.pick(palette),
        });
      }
    }

    return points;
  };


  const points = createGrid().filter(() => random.value() > 0.5);

  return ({ context, width, height }) => {
    const margin = width * 0.175;

    context.fillStyle = 'white';
    context.fillRect(0, 0, width, height);

    points.forEach((data) => {
      const {
        position,
        rotation,
        radius,
        color
      } = data;

      const [u, v] = position;

      const x = lerp(margin, width - margin, u);
      const y = lerp(margin, height - margin, v);

      // context.beginPath();
      // context.arc(x, y, radius * width, 0, Math.PI * 2);
      // context.fillStyle = color;
      // context.fill();

      context.save();

      context.fillStyle = color;
      context.font = `${radius * width}px "Futura"`;
      context.translate(x, y);
      context.rotate(rotation);
      context.fillText('=', 0, 0);

      context.restore();
    });
  };
};

canvasSketch(sketch, settings);

/**
 * NOTES
 *
 * canvas-sketch sketch.js --open
 *
 * NOISE
 * const v = noise2D(x, y); // value is in -1..1 range
 * const n = v * 0.5 + 0.5; // map to 0..1 range
 * const L = Math.floor(n * 100); // turn into a percentage
 * const hsl = `0, 0%, ${L}%)`; //get color value
 *
 * const frequency = 5.0; // frequency of the noise signal
 * const v = noise2D = (x * frequency, y * frequency);
 */
