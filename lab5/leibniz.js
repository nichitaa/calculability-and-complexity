// Leibniz formula for π
// π/4=arctan(1/2)+arctan(1/3) 
// https://en.wikipedia.org/wiki/Leibniz_formula_for_%CF%80

const leibnizPi = n => {
    // n = 100 will return pi with 200 digits 
    // so converting to big int and divide in half
    n = BigInt(n) / BigInt(2);

    let arg1 = BigInt(100) ** ++n * BigInt(2);
    let arg2 = arg1 - arg1 / BigInt(3);

    let inc1 = BigInt(1);
    let inc2 = BigInt(1);

    let pi = BigInt(0);

    while (inc2 !== BigInt(0)) {
        inc2 = arg1 + arg2;

        // update pi sum
        pi = pi + inc2 / inc1;

        // update args
        arg1 = arg1 / BigInt(-4);
        arg2 = arg2 / BigInt(-9);
        inc1 = inc1 + BigInt(2);
    }

    // chop the last 5 digits to have the same result and precision as 
    // previous method
    return pi / (BigInt(10) ** BigInt(5));

};

module.exports = leibnizPi;