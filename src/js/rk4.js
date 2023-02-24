// Imports
import { sumArray } from "./sumArray"
import { multiplyArray } from "./multiplyArray"

function rk4(diffEquation, z0, h, clock) {
    let z

    let k1 = diffEquation(z0, clock)
    let k2 = diffEquation(sumArray(z0, multiplyArray(k1, (h / 2))), clock)
    let k3 = diffEquation(sumArray(z0, multiplyArray(k2, (h / 2))), clock)
    let k4 = diffEquation(sumArray(z0, multiplyArray(k3, h)), clock)

    // Next step
    z = (sumArray(z0,
        multiplyArray(
            sumArray(
                sumArray(k1, multiplyArray(k2, 2)),
                sumArray(k4, multiplyArray(k3, 2))
            ),
            (h / 6)
        )
    )
    )

    return z;

}

export { rk4 }