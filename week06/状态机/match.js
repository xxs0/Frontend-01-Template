function match(string) {
    let state = start;
    for(let i of string) {
        state = state(i);
    }
    return state === end;
}

function start(i) {
    if (i === 'a') {
        return foundA;
    } else {
        return start;
    }
}

function end(i) {
    return end;
}

function foundA(i) {
    if (i === 'b') {
        return foundB;
    } else {
        return start(i);
    }
}

function foundB(i) {
    if (i === 'a') {
        return found2A;
    } else {
        return start(i);
    }
}

function found2A(i) {
    if (i === 'b') {
        return found2B;
    } else {
        return start(i);
    }
}

function found2B(i) {
    if (i === 'a') {
        return found3A;
    } else {
        return start(i);
    }
}

function found3A(i) {
    if (i === 'b') {
        return found3B;
    } else {
        return start(i);
    }
}

function found3B(i) {
    if (i === 'x') {
        return end;
    } else {
        return found2B(i);
    }
}
match('ababbababx') // false
match('abc ababx abababababx') // true