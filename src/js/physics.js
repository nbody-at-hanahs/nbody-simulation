export function verlet(x0, y0, z0, vx0, vy0, vz0, ax0, ay0, az0, new_ax, new_ay, new_az, dt) {
  // Velocity
  let vx = vx0 + ((ax0 + new_ax) / 2) * dt;
  let vy = vy0 + ((ay0 + new_ay) / 2) * dt;
  let vz = vz0 + ((az0 + new_az) / 2) * dt;

  // Position
  let x = x0 + vx * dt + (0.5) * ax0 * (dt) * (dt);
  let y = y0 + vy * dt + (0.5) * ay0 * (dt) * (dt);
  let z = z0 + vz * dt + (0.5) * az0 * (dt) * (dt);

  return [x, y, z, vx, vy, vz];
}