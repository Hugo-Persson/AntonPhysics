var m1;
var m2;
var initialV2;
var isBlockCollision;
function startSimulation(e) {
    e.preventDefault();
    isBlockCollision = true;
    // Define input variables
    m1 = Number(document.querySelector("#m1").value);
    var v1 = 0;
    m2 = Number(document.querySelector("#m2").value);
    var v2 = Number(document.querySelector("#v2").value);
    initialV2 = v2;
    var collisionCount = 0;
    while (true) {
        // Point of no more collision is when both objects have an positive velocity and object2 has higher speed than object1
        if (v1 >= 0 && v2 >= 0 && v2 >= v1) {
            // Might be problem if a velocity becomes zero but that should be impossible right?
            break;
        }
        var collisionSpeeds = calculateCollisionAndSpeed(v1, v2);
        v1 = collisionSpeeds.vp1;
        v2 = collisionSpeeds.vp2;
        collisionCount += 1;
    }
    document.querySelector("#collisionCount").innerHTML =
        "Collision count: " + collisionCount;
}
function calculateCollisionAndSpeed(v1, v2) {
    if (isBlockCollision) {
        isBlockCollision = false;
        return calculateSpeedPostCollision(v1, v2);
    }
    else {
        isBlockCollision = true;
        return {
            vp1: -v1,
            vp2: v2
        };
    }
    // Return time and post speeds
}
function calculateSpeedPostCollision(v1, v2) {
    var vL = m1 * v1 + m2 * v2 - m1 * v2 + m1 * v1;
    var vp1;
    var vp2;
    vp2 = vL / (m1 + m2);
    vp1 = v2 + vp2 - v1;
    return {
        vp1: vp1,
        vp2: vp2
    };
}
