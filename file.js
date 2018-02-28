var correct = true;
var array = new Array();
var firstRow = [];
var stackFormationTable = [];
var stackOperation = [];
var stackOfElements = [];
var stackResult = [];
var stackString = [];
var myString;
var num = 0;
var arrayNumbers = new Array();
var table = document.createElement("table");

function createStackString()
{
    stackString.push('(((!B)->(A->B))->(!A))');
    stackString.push('B&A|C');
    stackString.push('B|A&C');
    stackString.push('((P~Q)~R)');
    stackString.push('((P->Q)|(P->(Q&P)))');
    stackString.push('(!(P->(P->(Q~Q))))');
    stackString.push('(((!P)->P)->(R|Q))');
    stackString.push('((((P->R)&(Q->S))&((!P)|(!S)))->((!P)|(!Q)))');
    stackString.push('((A&B)~((!A)|(!C)))');
    stackString.push('(Q->((P|R)->(R->(!Q))))');
    stackString.push('(->((!A)->B))');
    stackString.push('!B');
    stackString.push('(!C)');
    stackString.push('a&c');
    stackString.push('A!B');
    stackString.push('(A->B&C)');
    stackString.push('(!(!C))');
    stackString.push('-A');
    stackString.push('(A->)');
    stackString.push('(!(A&(!A)))->(B~C)');
    stackString.push('(((A->B)->(!B))->(!A))');
    pull();
    myString = stackString[arrayNumbers.pop()];
    document.getElementById('logic').innerHTML = myString;
}

function pull()
{
    for(i = 0; i < stackString.length; i++) {
        arrayNumbers.push(i);
    }
}

function refresh()
{
    if(arrayNumbers.length != 0) {
        myString = stackString[arrayNumbers.pop()];
        document.getElementById('logic').innerHTML = myString;
    }
    else
        pull();
}

function newRefresh()
{
    if(document.getElementById('text').value != '')
    {
        myString = document.getElementById('text').value;
        document.getElementById('logic').innerHTML = myString;
    }
}

function getPriority(s)
{
    var number;

    if(s == '~')
        number = 1;
    else if(s == '>')
        number = 2;
    else if(s == '|')
        number = 3;
    else if(s == '&')
        number = 4;
    return number;
}

function isUnaryOperation(operation)
{
    if(operation == '!')
        return true;
    else
        return false;
}

function equivalence(one, two)
{
    var result;

    if((one == '1' && two == '1') || (one == '0' && two == '0'))
    {
        result = '1';
    }
    else if((one == '1' && two == '0') || (one == '0' && two == '1'))
    {
        result = '0'
    }

    return result;
}

function implication(one, two)
{
    var result;

    if((one == '1' && two == '1') || (one == '0' && two == '0')|| (one == '0' && two == '1'))
    {
        result = '1';
    }
    else if((one == '1' && two == '0') )
    {
        result = '0'
    }

    return result;
}

function conjunction(one, two)
{
    var result;

    if((one == '1' && two == '1'))
    {
        result = '1';
    }
    else if((one == '1' && two == '0') || (one == '0' && two == '0')|| (one == '0' && two == '1') )
    {
        result = '0'
    }

    return result;
}

function disjunction(one, two)
{
    var result;

    if((one == '1' && two == '1') || (one == '1' && two == '0') || (one == '0' && two == '1'))
    {
        result = '1';
    }
    else if( (one == '0' && two == '0'))
    {
        result = '0'
    }

    return result;
}

function negation(one)
{
    var result;

    if(one == '0')
    {
        result = '1';
    }
    else if(one == '1')
    {
        result = '0';
    }

    return result;
}

function showAnswer()
{
    var stackAnswer = [];

    while(stackOfElements.length != 0)
    {
        if (stackOfElements[stackOfElements.length-1].match(/[01]/g)){
            stackAnswer.push(stackOfElements.pop());
        }
        else if (stackOfElements[stackOfElements.length-1].match(/[~>&|]/g)) {

            var one = stackAnswer.pop();
            var two = stackAnswer.pop();

            switch(stackOfElements[stackOfElements.length-1]) {
                case '~': {
                    stackAnswer.push(equivalence(two, one));
                    break;
                }
                case '>':
                {
                    stackAnswer.push(implication(two, one));
                    break;
                }
                case '&':
                {
                    stackAnswer.push(conjunction(two, one));
                    break;
                }
                case '|':
                {
                    stackAnswer.push(disjunction(two, one));
                    break;
                }
            }

            stackOfElements.pop();
        }
        else if(isUnaryOperation(stackOfElements[stackOfElements.length-1]))
        {
            var one = stackAnswer.pop();
            stackAnswer.push(negation(one));
            stackOfElements.pop();
        }
    }

    return stackAnswer[0];
}

function findSymbols(element, massiv)
{
    if (massiv.length == 0) {
        massiv.push(element);
    }
    else {
        if(massiv.indexOf(element) == -1)
        {
            massiv.push(element);
        }
    }
}

function doBinary(number, numElements, stackValue)
{
    while(Math.floor(number/2)!=0)
    {
        stackValue.push(number%2);
        number = Math.floor(number/2);
    }

    stackValue.push(number%2);

    while(stackValue.length < numElements)
    {
        stackValue.push(0);
    }

    return stackValue;
}

function doClearStack(stack)
{
    while(stack.length!=0)
    {
        stack.pop()
    }
}

function buildStackOfElements(newStr)
{
    for (i = 0; i < newStr.length; i++) {

        if (newStr[i] == '(') {
            stackOperation.push(newStr[i]);
        }
        else if (newStr[i] == ')') {

            num = 0;

            while (stackOperation.length != 0 && stackOperation[stackOperation.length - 1] != '(') {
                num++;
                stackOfElements.push(stackOperation.pop());
            }
            stackOperation.pop();

            if(num > 1) {
                correct = false;
                break;
            }
        }
        else if (newStr[i].match(/[A-Z]/g) || newStr[i].match(/[01]/g)) {

            if(!newStr[i].match(/[01]/g))
                findSymbols(newStr[i], array);

            stackOfElements.push(newStr[i]);
        }
        else if (newStr[i].match(/[~>&|]/g)) {

            while (stackOperation.length != 0 && (stackOperation[stackOperation.length - 1].match(/~>&|/g))
            && getPriority(newStr[i]) < getPriority(stackOperation[stackOperation.length - 1])) {
                stackOfElements.push(stackOperation.pop());
            }
            stackOperation.push(newStr[i]);
        }
        else if (isUnaryOperation(newStr[i])) {
            stackOperation.push(newStr[i]);
        }
    }

    stackOfElements.reverse();
}

function createTable(numRows, numCol)
{
    firstRow.push('Результат');

    for(i = array.length - 1; i >= 0; i--)
    {
        firstRow.push(array[i]);
    }

    for (var i = 0; i <= numRows; i++) {

        var newRow = table.insertRow(i);

        for (var j = 0; j <= numCol; j++) {

            var newCell = newRow.insertCell(j);

            if (i == 0 && j >= 0) {
                if(j == numCol){
                    newCell.className = 'yellow';
                }
                newCell.innerHTML = firstRow.pop();
                newCell.width = 50;
            }
            else {
                var number = stackFormationTable.pop();
                newCell.innerHTML = number;
                if(j == numCol)
                {
                    newCell.className = 'yellow';
                    stackResult.push(number);
                }
            }
        }
    }
    document.body.appendChild(table);
}

function main(newStr)
{
    buildStackOfElements(newStr);

    var commonStack = [];

    for(i = 0; i < Math.pow(2, array.length); i++)
    {
        var stackValue = [];
        commonStack.push(doBinary(i, array.length, stackValue));
    }

    commonStack.reverse();

    for(k = 0; k < Math.pow(2, array.length); k++) {

        var oneSetOfValues = commonStack.pop();

        for (i = 0; i < array.length; i++)  {

            var oneValue = oneSetOfValues.pop().toString();
            stackFormationTable.push(oneValue);

            for (j = stackOfElements.length - 1; j >= 0; j--) {
                if (array[i] == stackOfElements[j]) {
                    stackOfElements[j] = oneValue;
                }
            }
        }
        stackFormationTable.push(showAnswer());
        buildStackOfElements(newStr);
    }

    if(correct) {

        stackFormationTable.reverse();
        createTable(Math.pow(2, array.length), array.length);
        var value = stackResult[stackResult.length - 1];

        var boolNeutral = false;

        for (i = stackResult.length - 1; i >= 0; i--) {

            if (stackResult[i] != value) {
                boolNeutral = true;
            }
        }

        if(boolNeutral)
            document.getElementById('out').innerHTML = 'Логическая формула <strong>является нейтральной.</strong>';
        else {
            document.getElementById('out').innerHTML = 'Логическая формула <strong>не является нейтральной.</strong>';
        }
    }
}

function deleteAll()
{
    doClearStack(stackOfElements);
    doClearStack(stackOperation);
    doClearStack(stackResult);
    doClearStack(stackFormationTable);
    doClearStack(array);
    doClearStack(ar);
}

function test()
{
    correct = true;
    var testImplication = true;
    str = myString;

    if(str.match(/[^01A-Z!&|\->~()]/g))
        correct = false;
    else {

        var newStr = str.split('');

        for (i = 0; i < newStr.length; i++) {
            if (newStr[i] == '>') {
                if (newStr[i - 1] == '-')
                    newStr[i - 1] = '';
                else {
                    testImplication = false;
                    break;
                }
            }
            else if (newStr[i] == '-' && newStr[i + 1] != '>') {
                testImplication = false;
                break;
            }
        }

        var stackOpenBracket = [];
        var stackCloseBracket = [];

        var n = 0;

        for (i = 0; i < newStr.length; i++) {
            if (newStr[i] == '(') {
                stackOpenBracket.push(newStr[i]);
            }
            else if (newStr[i] == ')') {
                stackCloseBracket.push(newStr[i]);
            }

            if (newStr[i].match(/[!~|>&]/g)) {
                n++;
            }
        }

        if ((testImplication == false) || (stackOpenBracket.length != stackCloseBracket.length) || (stackOpenBracket.length != n) ||
            str.match(/\)[!A-Z01]/g) || str.match(/[!|>~&]\)/g) || str.match(/\([\-~|&]/g) || str.match(/[A-Z01]\(/g) ||
            str.match(/\(([A-Z]|[01])*\)/g) || str.match(/\)\(/g) || str.match(/([A-Z]|[01]){2,}/g) || (str.indexOf(')') < str.indexOf('(')) ||
            str.match(/([A-Z]|[01])!([A-Z]|[01])/g)) {
            correct = false;
        }
        else {
            table.innerHTML = '';
            main(newStr);
        }
    }

    var elements = document.getElementsByName('a');
    document.getElementById('correct').innerHTML = '<strong>Ответ: </strong>';

    if(correct)
    {
        if(elements[0].checked)
            document.getElementById('correct').innerHTML += 'Правильно. Строка <strong>'+ myString  +'</strong> является формулой логики высказываний.';

        if(elements[1].checked)
            document.getElementById('correct').innerHTML += 'Неправильно. Строка <strong>'+ myString  +'</strong> является формулой логики высказываний.';
    }
    else
    {
        if(elements[0].checked)
            document.getElementById('correct').innerHTML += 'Неправильно. Строка <strong>'+ myString  +'</strong> не является формулой логики высказываний.';

        if(elements[1].checked)
            document.getElementById('correct').innerHTML += 'Правильно. Строка <strong>'+ myString  +'</strong> не является формулой логики высказываний.';

        table.innerHTML = '';
        document.getElementById('out').innerHTML = '';
    }

    deleteAll();
}