let m1: number;
let m2: number;

let s1: number = 30;
let s2: number = 50;

let initialV2: number;

function startSimulation(e) {
  e.preventDefault();

  // Define input variables
  m1 = Number((<HTMLInputElement>document.querySelector("#m1")).value);
  let v1 = 0;
  m2 = Number((<HTMLInputElement>document.querySelector("#m2")).value);
  let v2 = Number((<HTMLInputElement>document.querySelector("#v2")).value);

  initialV2 = v2;
  // Create an array of every collision, time and and speed post collision
  let collisions: Array<CollisionData> = [];
  let currentEllapsedTime = 0;
  while (true) {
    // Point of no more collision is when both objects have an positive velocity and object2 has higher speed than object1
    if (v1 >= 0 && v2 >= 0 && v2 >= v1) {
      // Might be problem if a velocity becomes zero but that should be impossible right?
      break;
    }
    let collision = calculatePointOfCollision(v1, v2);
    v1 = collision.vp1;
    v2 = collision.vp2;
    currentEllapsedTime += collision.time;
    collisions.push({
      vp1: v1,
      vp2: v2,
      time: currentEllapsedTime,
      s1: s1,
      s2: s2,
    });
    //if (collisions.length > 10) break;
  }

  document.querySelector("#collisionCount").innerHTML =
    "Collision count: " + collisions.length;
  +"   See log for details";
  animateCollision(collisions);
  console.log("Collisions", collisions);
}

function animateCollision(collisions: Array<CollisionData>) {
  const el = document.querySelector("#simulationCanvas");
  // @ts-ignore
  new bootstrap.Collapse(el, { show: true });
  const ctx = (<HTMLCanvasElement>(
    document.querySelector("#simulationCanvas canvas")
  )).getContext("2d");

  ctx.globalCompositeOperation = "destination-over";
  ctx.clearRect(0, 0, 300, 300); // clear canvas

  ctx.fillStyle = "rgba(0, 0, 0, 0.4)";
  ctx.strokeStyle = "rgba(0, 153, 255, 0.4)";
  ctx.save();
  //ctx.translate(150, 150);

  ctx.fillStyle = "rgba(235, 64, 52,1)";
  ctx.fillRect(30, 135, -10, 10);
  ctx.fillStyle = "rgba(17, 187, 217,1)";
  ctx.fillRect(50, 135, 10, 10);

  animateBetweenPoints(30, 50, 0, initialV2, collisions[0].time, ctx);
  collisions.map((e, index) => {
    setTimeout(() => {
      console.log("First collision");
      ctx.fillStyle = "rgba(235, 64, 52,1)";
      ctx.clearRect(0, 0, 300, 300); // clear canvas
      ctx.fillRect(e.s1, 135, -10, 10);

      ctx.fillStyle = "rgba(17, 187, 217,1)";
      ctx.fillRect(e.s2, 135, 10, 10);

      let lastTime = 0;
      if (index !== 0) {
        lastTime = collisions[index - 1].time;
      }

      animateBetweenPoints(e.s1, e.s2, e.vp1, e.vp2, e.time - lastTime, ctx);
    }, e.time * 1000);
  });
  ctx.beginPath();
  ctx.moveTo(0, 0);
  ctx.lineTo(0, 150);
  ctx.stroke();
}

function animateBetweenPoints(
  s1,
  s2,
  v1,
  v2,
  time,
  ctx: CanvasRenderingContext2D
) {
  let i = 0.05;
  let startTime = Date.now();
  while (i < time) {
    setTimeout(() => {
      const ellapsedTime = (Date.now() - startTime) / 1000; // Can not use i cause of scope issue

      ctx.fillStyle = "rgba(235, 64, 52,1)";
      ctx.clearRect(0, 0, 300, 300); // clear canvas
      ctx.fillRect(s1 + v1 * ellapsedTime, 135, -10, 10);

      ctx.fillStyle = "rgba(17, 187, 217,1)";
      ctx.fillRect(s2 + v2 * ellapsedTime, 135, 10, 10);
    }, i * 1000);

    i += 0.05;
  }
}

function calculatePointOfCollision(v1, v2): CollisionData {
  let timeUntilWallCollision = -1;
  let timeUntilBlockCollision = -1;

  if (v1 < 0) {
    // s1 + v1*t = 0;
    // t= -s1/v1  - gonna be positive
    timeUntilWallCollision = -s1 / v1;
  }

  // s1 = s2
  // s1 = s1 +v1*t
  // s2 = s2+v2*t
  // s1+v1*t = s2 + v2*t
  // s1-s2 = t(v2-v1)
  // t = (s1-s2)/(v2-v1)

  timeUntilBlockCollision = (s1 - s2) / (v2 - v1);

  if (
    timeUntilWallCollision == -1 ||
    timeUntilBlockCollision < timeUntilBlockCollision
  ) {
    s1 = s1 + v1 * timeUntilBlockCollision;
    s2 = s2 + v2 * timeUntilBlockCollision;

    const postCollisionSpeeds = calculateSpeedPostCollision(v1, v2);

    return {
      time: timeUntilBlockCollision,
      ...postCollisionSpeeds,
      s1: 0,
      s2: 0,
    };
  } else {
    s1 = 0;
    s2 = s2 + v2 * timeUntilWallCollision;

    return { time: timeUntilBlockCollision, vp1: -v1, vp2: v2, s1: 0, s2: 0 };
  }

  // Return time and post speeds
}

function calculateSpeedPostCollision(v1, v2): Vector2 {
  const vL = m1 * v1 + m2 * v2 - m1 * v2 + m1 * v1;

  let vp1;
  let vp2;

  vp2 = vL / (m1 + m2);

  vp1 = v2 + vp2 - v1;

  return { vp1: vp1, vp2: vp2 };
}

interface Vector2 {
  vp1: number;
  vp2: number;
}
interface CollisionData {
  time: number;
  vp1: number;
  vp2: number;
  s1: number;
  s2: number;
}
