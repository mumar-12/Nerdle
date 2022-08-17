function nextInt(i) {
    return Math.floor(Math.random() * i);
}

function padStrNum(num, desiredLength) {
    let result = num + "";
    while(result.length < desiredLength) {
        result = "0" + result;
    }

    return result;
}

function generateAnswer()  {
    let eqSignPosition = nextInt(3) + 4; // exclusive upper bound
    let numOperators = (eqSignPosition == 4)? 1 : nextInt(2) + 1;
    let operatorIndex = 0;
    let op = '';
    switch(eqSignPosition) {
    case 4:
        operatorIndex = nextInt(2) + 1;
        op = nextInt(4) + 2;
        switch(operatorIndex) {
        case 1: //X_XX=XXX
            while(true) {
                let n1 = nextInt(10);
                let n2 = nextInt(100);
                let answer = apply(op, n1, n2);
                
                if (answer > 0 && answer < 1000) {
                    let res = n1 + operatorString(op) + padStrNum(n2, 2) + "=" + padStrNum(answer,3);
                    if (checkZeroCondition(res)) {
                        return res;
                    }
                }
            }
        case 2: //XX_X=XXX
            while(true) {
                let n1 = nextInt(100);
                let n2 = nextInt(10);
                let answer = apply(op,n1,n2);
                
                if (answer > 0 && answer < 1000) {
                    let res = padStrNum(n1, 2) + operatorString(op) + n2 + "=" + padStrNum(answer,3);
                    if (checkZeroCondition(res)) {
                        return res;
                    }
                }
            }
        default:
            error("Game Logic Error");
        }
    case 5:
        if (numOperators == 1) { 
            operatorIndex = nextInt(3) + 1; // might f up
            op = nextInt(4) + 2; // might f up as well
            switch(operatorIndex) {
            case 1: //X_XXX=XX
                while(true) {
                    let n1 = nextInt(10);
                    let n2 = nextInt(1000);
                    let answer = apply(op, n1, n2);
                    
                    if (answer > 0 && answer < 100) {
                        let res = n1 + operatorString(op) + padStrNum(n2, 3) + "=" + padStrNum(answer,2);

                        if (checkZeroCondition(res)) {
                            return res;
                        }
                    }
                }
            case 2: //XX_XX=XX
                while(true) {
                    let n1 = nextInt(100);
                    let n2 = nextInt(100);
                    let answer = apply(op,n1,n2);
            
                    if (answer > 0 && answer < 100) {
                        let res = padStrNum(n1,2) + operatorString(op) + padStrNum(n2, 2) + "=" + padStrNum(answer,2);

                        if (checkZeroCondition(res)) {
                            return res;
                        }
                    }
                }
            case 3: //XXX_X=XX
                while(true) {
                    let n1 = nextInt(1000);
                    let n2 = nextInt(10);
                    let answer = apply(op,n1,n2);
                    
                    if (answer > 0 && answer < 100) {
                        let res = padStrNum(n1, 3) + operatorString(op) + padStrNum(n2, 1) + "=" + padStrNum(answer,2);

                        if (checkZeroCondition(res)) {
                            return res;
                        }
                    }
                }
            }
        } else { // locations determined, 1 digit each -> X_X_X=XX
            let firstOp = nextInt(4) + 2;
            let secondOp = nextInt(4) + 2;
            while(true) {
                let n1 = nextInt(10);
                let n2 = nextInt(10);
                let n3 = nextInt(10);
                if (secondOp/2 > firstOp/2) {
                    let secondTerm = apply(secondOp,n2,n3);
                    if (secondTerm < 0) {
                        continue;
                    }
                    let answer = apply(firstOp, n1, secondTerm);
                    if (answer > 0 && answer < 100) {
                        let res = padStrNum(n1, 1) + operatorString(firstOp) + padStrNum(n2, 1) +  operatorString(secondOp) + padStrNum(n3, 1) + "=" + padStrNum(answer,2);

                        if (checkZeroCondition(res)) {
                            return res;
                        }
                    }
                } else { 
                    let firstTerm = apply(firstOp,n1,n2);
                    if (firstTerm < 0) {
                        continue;
                    }
                    let answer = apply(secondOp, firstTerm, n3);
                    if (answer > 0 && answer < 100) {
                        let res = padStrNum(n1, 1) + operatorString(firstOp) + padStrNum(n2, 1) +  operatorString(secondOp) + padStrNum(n3, 1) + "=" + padStrNum(answer,2);

                        if (checkZeroCondition(res)) {
                            return res;
                        }
                    }
                }

            }
        }
    case 6:
        if (numOperators == 1) {
            operatorIndex = nextInt(2) + 2; // might f up
            op = nextInt(4) + 2; // might f up in addition to the previous possible fing up
            switch(operatorIndex) {
            case 2: //XX_XXX=X
                while(true) {
                    let n1 = nextInt(100);
                    let n2 = nextInt(1000);
                    let answer = apply(op, n1, n2);
                    if (answer > 0 && answer < 10) {
                        let res = padStrNum(n1, 2) + operatorString(op) + padStrNum(n2, 3) + "=" + padStrNum(answer,1);

                        if (checkZeroCondition(res)) {
                            return res;
                        }
                    }
                }
            case 3: //XXX_XX=X
                while(true) {
                    let n1 = nextInt(1000);
                    let n2 = nextInt(100);
                    let answer = apply(op,n1,n2);
                    if (answer > 0 && answer < 10) {
                        let res = padStrNum(n1, 3) + operatorString(op) + padStrNum(n2, 2) + "=" + padStrNum(answer,1);

                        if (checkZeroCondition(res)) {
                            return res;
                        }
                    }
                }
            }
        } else {// numOperators = 2
            let firstOp = nextInt(4) + 2, secondOp = nextInt(4) + 2;
            let firstOpIndex = nextInt(2) + 1;
            if (firstOpIndex == 2) { //determined second index -> XX_X_X=X
                while(true) {
                    let n1 = nextInt(100);
                    let n2 = nextInt(10);
                    let n3 = nextInt(10);
                    if (secondOp/2 > firstOp/2) {
                        let secondTerm = apply(secondOp,n2,n3);
                        if (secondTerm < 0) {
                            continue;
                        }
                        let answer = apply(firstOp, n1, secondTerm);
                        if (answer > 0 && answer < 10) {
                            let res = padStrNum(n1, 2) + operatorString(firstOp) + padStrNum(n2, 1) +  operatorString(secondOp) + padStrNum(n3, 1) + "=" + padStrNum(answer,1);

                            if (checkZeroCondition(res)) {
                                return res;
                            }
                        }
                    } else { 
                        let firstTerm = apply(firstOp,n1,n2);
                        if (firstTerm < 0) {
                            continue;
                        }
                        let answer = apply(secondOp, firstTerm, n3);
                        if (answer > 0 && answer < 10) {
                            let res = padStrNum(n1, 2) + operatorString(firstOp) + padStrNum(n2, 1) +  operatorString(secondOp) + padStrNum(n3, 1) + "=" + padStrNum(answer,1);

                            if (checkZeroCondition(res)) {
                                return res;
                            }
                        }
                    }
                }
            } else {
                let secondOpIndex = nextInt(2) + 3;
                switch (secondOpIndex) {
                case 3: //X_X_XX=X
                    while(true) {
                        let n1 = nextInt(10);
                        let n2 = nextInt(10);
                        let n3 = nextInt(100);
                        if (secondOp/2 > firstOp/2) {
                            let secondTerm = apply(secondOp,n2,n3);
                            if (secondTerm < 0) {
                                continue;
                            }
                            let answer = apply(firstOp, n1, secondTerm);
                            if (answer > 0 && answer < 10) {
                                let res = padStrNum(n1, 1) + operatorString(firstOp) + padStrNum(n2, 1) +  operatorString(secondOp) + padStrNum(n3, 2) + "=" + padStrNum(answer,1);

                                if (checkZeroCondition(res)) {
                                    return res;
                                }
                            }
                        } else { 
                            let firstTerm = apply(firstOp,n1,n2);
                            if (firstTerm < 0) {
                                continue;
                            }
                            let answer = apply(secondOp, firstTerm, n3);
                            if (answer > 0 && answer < 10) {
                                let res = padStrNum(n1, 1) + operatorString(firstOp) + padStrNum(n2, 1) +  operatorString(secondOp) + padStrNum(n3, 2) + "=" + padStrNum(answer,1);

                                if (checkZeroCondition(res)) {
                                    return res;
                                }
                            }
                        }
                    }
                case 4: //X_XX_X=X
                    while(true) {
                        let n1 = nextInt(10); //--------------------------------------------------------
                        let n2 = nextInt(100);  //--------------------------------------------------------
                        let n3 = nextInt(10);  //--------------------------------------------------------
                        if (secondOp/2 > firstOp/2) {
                            let secondTerm = apply(secondOp,n2,n3);
                            if (secondTerm < 0) {
                                continue;
                            }
                            let answer = apply(firstOp, n1, secondTerm);
                            if (answer > 0 && answer < 10) {
                                let res = padStrNum(n1, 1) + operatorString(firstOp) + padStrNum(n2, 2) +  operatorString(secondOp) + padStrNum(n3, 1) + "=" + padStrNum(answer,1);

                                if (checkZeroCondition(res)) {
                                    return res;
                                }
                            }
                        } else { 
                            let firstTerm = apply(firstOp,n1,n2);
                            if (firstTerm < 0) {
                                continue;
                            }
                            let answer = apply(secondOp, firstTerm, n3);
                            if (answer > 0 && answer < 10) {
                                let res = padStrNum(n1, 1) + operatorString(firstOp) + padStrNum(n2, 2) +  operatorString(secondOp) + padStrNum(n3, 1) + "=" + padStrNum(answer,1);

                                if (checkZeroCondition(res)) {
                                    return res;
                                }
                            }
                        }
                    }

                }
            }
        }
    }
    return "ok";
}



function boxColors(guess) {
    let result = [0,0,0,0,0,0,0,0];
    let copy = "";


    for (let i = 0; i < 8; i++) {
        if (guess[i] === answer.substring(i,i+1)) {
            result[i] = 2;
            copy += "!"
        } else {
            copy += answer.substring(i, i+1);
        }
    }

    // do the yellowss
    for (let i = 0; i < 8; i++) {
        if (result[i] != 2 && copy.indexOf(guess[i]) != -1) {
            result[i] = 1;
        }
    }

    return result;
}

function operatorString(op) {
    switch(op) {
    case 2:
        return "+";
    case 3:
        return "-";
    case 4:
        return "*";
    case 5:
        return "/";
    }
    return "";
}

function checkZeroCondition(s) {
    let LIMIT = 3;
    let count = 0; 
    
    for (let i = 0; i < s.length; i++) {
        if (s.substring(i,i+1) === "0") {
            count++;
        }
    }
    return count <= LIMIT;
}

function checkValidity(guess) {
    if (sanityCheck(guess) != 1) {
        return sanityCheck(guess);
    }
    let nums = [];
    let ops = [];
    let RHS = parse(guess, nums, ops);
    if (interpret(nums, ops, RHS) == true) {
        return 1; 
    } else {
        return 0;
    }
}

function parse(guess, nums, ops) {
    nums.push(0);
    for (let i = 0; i < guess.length; i++) {
        let c = guess[i];
        if (!isNaN(c)) {
            let numsIndex = ops.length;
            nums[numsIndex] = nums[numsIndex] * 10 + Number(c);
        } else {
            if (c === "=") {
                let RHS = "";
                for (let j = i + 1; j < guess.length; j++) {
                    RHS += guess[j];
                }
                return Number(RHS);
            } else {
                switch(c) {
                case '+':
                    ops.push(2);
                    break;
                case '-':
                    ops.push(3);
                    break;
                case '*':
                    ops.push(4);
                    break;
                case '/':
                    ops.push(5);
                    break;
                }
                nums.push(0);
            }
        }
    }
    return 42069;		
}

function interpret(nums, ops, RHS) {
    if (ops.length == 1) {
        return apply(ops[0], nums[0], nums[1]) == RHS;
    } else { // size is 2
        if (ops[1] / 2 > ops[0] / 2) {
            let firstNum = apply(ops[1], nums[1], nums[2]);
            return apply(ops[0], nums[0], firstNum) == RHS;
        } else {
            let firstNum = apply(ops[0], nums[0], nums[1]);
            return apply(ops[1], firstNum, nums[2]) == RHS;
        }
    }
}

function apply(op, num1, num2) {
    switch(op) {
    case 2:
        return num1 + num2;
    case 3:
        return num1 - num2;
    case 4:
        return num1 * num2;
    case 5:
        if (num2 == 0) {
            return -1;
        }
        let value = Math.floor(num1 / num2);
        if (value * num2 != num1) {
            return -1; // illegal division
        }
        return value;
    default:
        return -1;
    }
}

function sanityCheck(guess) {
    if (isNaN(guess[0])) {
        return -1;
    }
    let str = guess.join("");
    console.log(str);
    if (!str.includes('=')) {
        return -6;
    }
    let firstIndex = str.indexOf('=');
    if (firstIndex != str.lastIndexOf('=')) {
        return -2;
    }

    for (let i = firstIndex + 1; i < guess.length; i++) {
        if (isNaN(guess[i])) {
            return -3;
        }
    }

    let count = 0;

    console.log(firstIndex);
    for (let i = 1; i < firstIndex - 1; i++) {
        console.log(`guess[${i}] = ${guess[i]}`);
        console.log(`guess[${i+1}] = ${guess[i+1]}`);
        console.log(`----------------------------------`);
        if (isNaN(guess[i])) {
            count++;
        }
        if (isNaN(guess[i]) && isNaN(guess[i + 1])) { // two operators in a row
            return -5;
        }
    }

    if (count > 0) {
        return 1;
    } else {
        return -4;
    }
}



