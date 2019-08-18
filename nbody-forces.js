GRID_SIZE = 65536;
PARTICLE_NUM = 1000;
particles = [];

function randInt(max) {
    return Math.floor(Math.random() * (max));
}

function initSimulator() {
    for (let i = 0; i < PARTICLE_NUM; ++i)
        particles.push([randInt(GRID_SIZE), randInt(GRID_SIZE), randInt(GRID_SIZE)]);
}
