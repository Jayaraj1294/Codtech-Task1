let baseScore = 0;
let score = 0;
const minPasswordLength = 8;
const complexity = document.querySelector("#complexity");
const passwordInput = document.querySelector("#password");
passwordInput.addEventListener("keyup", checkVal); //checkVal function will be called whenever there is a keyup event on our passwordInput element.
let num = {
    excess: 0,
    upper: 0,
    numbers: 0,
    symbols: 0
};
let bonus = {
    excess: 3,
    upper: 4,
    numbers: 5,
    symbols: 5,
    combo: 0,
    onlyLower: 0,
    onlyNumber: 0,
    uniqueChars: 0,
    repetition: 0
};

function checkRepetition(strPassword) {
    return /([a-z0-9]{3,})\1/.test(strPassword);
}

function analyzeString(strPassword) {
    let charPassword = strPassword.split("");
    for (i = 0; i < charPassword.length; i++) {
        if (charPassword[i].match(/[A-Z]/g)) { //for checking whether the password contains uppercase letters and increment values accordingly.
            num.upper++;
        }
        if (charPassword[i].match(/[0-9]/g)) { //for checking whether the password contains numbers and increment values accordingly.
            num.numbers++;
        }
        if (charPassword[i].match(/(.*[!,@,#,$,%,^,&,*,?,_,~])/g)) { //for checking whether the password contains symbols and increment values accordingly.
            num.symbols++;
        }
    }
    num.excess = charPassword.length - minPasswordLength;

    if (num.upper && num.numbers && num.symbols) {
        bonus.combo = 25;
    }
    else if (
        (num.upper && num.numbers) ||
        (num.upper && num.symbols) ||
        (num.numbers && num.symbols)
    ) {
        bonus.combo = 15;
    }
    if (strPassword.match(/^[\sa-z]+$/)) { //for detecting whether it contains only lowercase letters and assign values accordingly.
        bonus.onlyLower = -15;
    }
    if (strPassword.match(/^[\s0-9]+$/)) { //for detecting whether it contains only numbers and assign values accordingly.
        bonus.onlyNumber = -35;
    }

/* Following code is used for converting the characters into lowercase and 
then calculating the number of unique characters in the password and assigning the vlue for uniqueChars accordingly. */ 

    let lcPassword = strPassword.toLowerCase();
    let uniqueChars = new Set(lcPassword).size;

    if (uniqueChars <= 3) {
        bonus.uniqueChars = -Number.MAX_VALUE;
        document.querySelector("p.message").innerHTML="Too few unique characters.";
    }
    else if (uniqueChars >= 3 && uniqueChars < 6) {
        bonus.uniqueChars = -5 *(36 - uniqueChars * uniqueChars);
    }
    else {
        bonus.uniqueChars = 0;
        document.querySelector("p.message").innerHTML = "";
    }

    if (checkRepetition(strPassword)) {
        bonus.repetition = -50;
    }
    else {
        bonus.repetition = 0;
    }
}

function updateComplexity(message,removeClasses,addClass) {   //updateComplxity makes the chages the elements selected by the outputResult.
    complexity.innerHTML = message;
    complexity.classList.remove(...removeClasses);
    complexity.classList.add(addClass);
}
function outputResult(strPassword) {   //outputResult determines the updates to made at the div such as the message, the classes to be removed and added
    let removeClasses = ["weak", "strong", "stronger", "strongest"];
    if (passwordInput.value == "") {
        updateComplexity("Enter a random value", removeClasses, "default");
    }
    else if (strPassword < minPasswordLength) {
        updateComplexity(`Minimum ${minPasswordLength} characters required`, removeClasses, "weak");
    }
    else if (score < 50) {
        updateComplexity("Weak!", removeClasses, "weak");
    }
    else if (score >= 50 && score < 75) {
        updateComplexity("Average!", removeClasses, "strong");
    }
    else if (score >= 75 && score < 100) {
        updateComplexity("Strong!", removeClasses, "stronger");
    }
    else if (score >= 100) {
        updateComplexity("Secure!", removeClasses, "strongest");
    }

    //The following code is to print the break down point in the table.

    document.querySelector("#details").innerHTML = `Base Score :<span class="value">${baseScore}</span><br />    
    Length Bonus :<span class="value">${num.excess * bonus.excess} [${num.excess} x ${bonus.excess}]</span><br />
    Uppper case Bonus :<span class="value">${num.upper * bonus.upper} [${num.upper} x ${bonus.upper}]</span><br />
    Number Bonus :<span class="value">${num.numbers * bonus.numbers} [${num.numbers} x ${bonus.numbers}]</span><br />
    Symbol Bonus :<span class="value">${num.symbols * bonus.symbols} [${num.symbols} x ${bonus.symbols}]</span><br />
    Combination Bonus :<span class="value">${bonus.combo}</span><br />
    Lower case only penalty :<span class="value">${bonus.onlyLower}</span><br />
    Numbers only penalty :<span class="value">${bonus.onlyNumber}</span><br />
    Repeating patterns penalty :<span class="value">${bonus.repetition}</span><br />
    Total Score:<span class="value">${score}</span><br />`;
}
function calcComplexity() {
    score = baseScore +
    num.excess * bonus.excess +
    num.upper * bonus.upper +
    num.numbers * bonus.numbers +
    num.symbols * bonus.symbols +
    bonus.combo +
    bonus.onlyLower +
    bonus.onlyNumber +
    bonus.uniqueChars + bonus.repetition;

 if (score < 0) {
    score = 0;
 }
}

function checkVal() {
    let strPassword = passwordInput.value;
    init();
    if (strPassword.length >= minPasswordLength) {
        baseScore = 50;
        analyzeString(strPassword);
        calcComplexity();
        }
        else {
            baseScore = 0;
        }
    outputResult(strPassword);
}
function init() {
    num.excess = 0;
    num.upper = 0;
    num.numbers = 0;
    num.symbols = 0;
    bonus.combo = 0;
    bonus.onlyLower = 0;
    bonus.onlyNumber = 0;
    bonus.uniqueChars = 0;
    bonus.repetition = 0;
    baseScore = 0;
    score = 0;
    document.querySelector("p.message").innerHTML = "";
}