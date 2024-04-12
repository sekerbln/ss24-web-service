
function factorial(n){
    if (n < 0) {
        throw new Error('Factorial is only defined for positive integer numbers.')
    } else if (n === 0) {
        return 1;
    } else {
        return factorial(n - 1) * n;
    }
}

function product(n, term = k => k, initial=1){
    let result = term(initial);
    for(let i = initial + 1; i < n; i++){
        result *= term(i)
    }
    return result;
}

export {factorial, product}
