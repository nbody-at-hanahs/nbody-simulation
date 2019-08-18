PARTICLE_NUM = 1000;
COORD_MIN = -32768;
COORD_MAX = 32767;
particles = [];

function randInt(min, max) {
  return Math.floor(Math.random() * (max - min)) + min;
}

function initSimulator() {
  for (let i = 0; i < PARTICLE_NUM; ++i)
    particles.push([randInt(COORD_MIN, COORD_MAX), randInt(COORD_MIN, COORD_MAX),
                    randInt(COORD_MIN, COORD_MAX)]);
  console.log(particles);
}

initSimulator();
