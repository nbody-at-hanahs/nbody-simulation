import { verlet } from './physics';

const G = 6.67408 * 10 ** -4

export function naiveNBody(mass, position, velocity, acceleration) {
  let newPos = []
  let newVel = []
  let newAcc = []

  for (let i = 0; i < mass.length; i++) {
    let posX = position[3 * i];
    let posY = position[3 * i + 1];
    let posZ = position[3 * i + 2];

    let accX = acceleration[3 * i];
    let accY = acceleration[3 * i + 1];
    let accZ = acceleration[3 * i + 2];

    let newAccX = accX, newAccY = accY, newAccZ = accZ;

    for (let j = 0; j < mass.length; j++) {
      if (i != j) {
        let posOppX = position[3 * j];
        let posOppY = position[3 * j + 1];
        let posOppZ = position[3 * j + 2];

        let [newAccLocalX, newAccLocalY, newAccLocalZ] = gravitation(posX, posY, posZ, posOppX, posOppY, posOppZ, mass[j]);

        newAccX += newAccLocalX
        newAccY += newAccLocalY
        newAccZ += newAccLocalZ
      }
    }


    // console.log(newAccX, newAccY, newAccZ);

    let next = verlet(
      posX, posY, posZ,
      velocity[3 * i], velocity[3 * i + 1], velocity[3 * i + 2],
      accX, accY, accZ,
      newAccX, newAccY, newAccZ,
      0.0001
    )

    // for (let k = 0; k < next.length; k += 6) {
    newPos.push(next[0])
    newPos.push(next[1])
    newPos.push(next[2])

    newVel.push(next[3])
    newVel.push(next[4])
    newVel.push(next[5])
    // }

    // for (let k = 0; k < next.length; k++) {
    newAcc.push(newAccX)
    newAcc.push(newAccY)
    newAcc.push(newAccZ)
    // }
  }

  return [newPos, newVel, newAcc]
}

function gravitation(pos1X, pos1Y, pos1Z, pos2X, pos2Y, pos2Z, massOpp) {
  let dist = Math.sqrt((pos1X - pos2X) ** 2 + (pos1Y - pos2Y) ** 2 + (pos1Z - pos2Z) ** 2);
  let acc = G * massOpp / dist ** 2;
  let accX = acc * -(pos1X - pos2X) / dist;
  let accY = acc * -(pos1Y - pos2Y) / dist;
  let accZ = acc * -(pos1Z - pos2Z) / dist;

  // let dirX = (pos2X - pos1X) / Math.abs(pos2X - pos1X);
  // let dirX = (pos2X - pos1X) / dist;
  // let dirY = (pos2Y - pos1Y) / dist;
  // let dirZ = (pos2Z - pos1Z) / dist;
  // let dirY = (pos2Y - pos1Y) / Math.abs(pos2Y - pos1Y);
  // let dirZ = (pos2Z - pos1Z) / Math.abs(pos2Z - pos1Z);
  return [accX, accY, accZ];
}