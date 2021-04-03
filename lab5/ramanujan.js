// Ramanujan’s Formula for π
// 1π=√89801∞∑n=0(4n)!(n!)4×26390n+11033964n
// https://crypto.stanford.edu/pbc/notes/pi/ramanujan.html

const ramanujanPi = (n) => {
    n = BigInt(n);
    let i = BigInt(1);

    // calculate the terms of the sequence with the decimal point shifted right n places (using BigInts)
    let x = BigInt(3) * (BigInt(10) ** n);

    let pi = x;

    while (x > 0) {

        x = x * i / ((i + BigInt(1)) * BigInt(4));

        pi += x / (i + BigInt(2));

        i += BigInt(2);

    }

    // return pi with chopped off the last 3 digits
    return pi / (BigInt(10) ** BigInt(3));

};

module.exports = ramanujanPi;