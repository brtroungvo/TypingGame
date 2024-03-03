// Brandon Vo
// 922607254
// brtroungvo

const randomQuoteUrl = 'https://api.quotable.io/random';
const quote = document.getElementById('quote');
const textbox = document.getElementById('textbox');
var startTimer = false;
//var wordCount = 0;
var correctCount = 0;
var incorrectCount = 0;

// gets a randomquote and checks if the fetch worked or not. returns random quote and converts it to json and then gets data
function getRandomQuote() {
    return fetch(randomQuoteUrl)
        .then(result => {
            if (result.ok) {
                console.log('Connected :D');
                return result.json();             // take result and turn into a json file, return it
            } else {
                console.log('Disconnected :(');
            }
        })
        .then(data => data.content);              // takes result.json and gets the data from it
}

async function prepRandomQuote() {
    quote.innerText = '';
    
    // Makes each character into a span so that we can color them individually (green or red)
    // Does this 2 times so that there is more to type
    for (let i = 0; i < 2; i++) {
        const nextQuote = await getRandomQuote();
        nextQuote.split('').forEach(character =>{
            const charEdit = document.createElement('span');
            charEdit.innerText = character;
            quote.appendChild(charEdit);
        });       

        // adds a space between each sentence. It needs to be a span in order to be detected by the eventlistener above used to determine correctness
        const space = document.createElement('span');  
        space.innerText = " ";
        quote.appendChild(space);
    }
    
    quote.removeChild(quote.lastChild); // removes space after the period from last sentence
    textbox.value = '';               // to clear text from the userinput
}


if (isIndexPage==true) {
    prepRandomQuote();
}

// Checks if the timer has already started and if we're on the index page
// If this triggers without being on the index page then it would cause an error
if (startTimer == false && isIndexPage == true) 
{
    startTimer = true;
    textbox.addEventListener('input', () => timer(), {once: true});
}

// Reduces timer by 1 for every 1000 ms (1 second)
function timer(){
    var sec = 30;
    var timer = setInterval(function(){
        if (sec < 0) {
            clearInterval(timer);

            // if (wordCount<0){
            //     wordCount=0;
            // }

            // Stores wpm and accuracy to local storage in order to not wipe them when using location.replace()
            accStorage = localStorage.setItem('acc','Accuracy: '+ ((correctCount/(correctCount+incorrectCount))*100).toFixed(2) + "%");
            //wpmStorage = localStorage.setItem('wpm','Words Per Minute: ' + (wordCount)*2);
            location.replace("stats.html");
        }
        else if (sec <= 9){
            document.getElementById('timer').innerHTML='00:0'+sec;
            sec--;
        }
        else if (sec >= 10) {
            document.getElementById('timer').innerHTML='00:'+sec;
            sec--;
        }

    }, 1000);
}

if (isIndexPage == false){
    document.getElementById('accuracy').innerHTML = localStorage.getItem("acc");
    //document.getElementById('wpm').innerHTML = localStorage.getItem("wpm");
    localStorage.clear();
}

// for the restart button
document.getElementById('restart').addEventListener('click', function(){
    if (isIndexPage==true){
        prepRandomQuote();
    }
    else {
        location.replace("index.html");
    }
});

// Code for getting user input and checking its correctness
if (isIndexPage == true){

    textbox.addEventListener('input', () => {

        const quoteArray = quote.querySelectorAll('span');
        const textArray = textbox.value.split('');

        // if any character is incorrect, the correct boolean will be false and the quote will stay the same
        let correct = true;
        quoteArray.forEach((charSpan, index) => {
            const char = textArray[index];
            if (char == null) {
                charSpan.classList.remove('correct');
                charSpan.classList.remove('incorrect');
                correct = false;
            }
            else if (char === charSpan.innerText) {
                charSpan.classList.add('correct');
                charSpan.classList.remove('incorrect');
                correct = true;
                correctCount++;
                
                // if (char == ' ') {                       Couldnt get WPM to work
                //     wordCount++;
                //     console.log(wordCount);
                // }
            }
            else {
                console.log("else");
                charSpan.classList.remove('correct');
                charSpan.classList.add('incorrect');
                correct = false;
                incorrectCount++;
            }
        })

        //wordCount--;
        if (correct) prepRandomQuote();
    })
}