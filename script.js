// 계산기 기능
function appendCalc(value) {
    let display = document.getElementById('calcDisplay');
    if (display.innerText === '0') {
        display.innerText = value;
    } else {
        display.innerText += value;
    }
}

function calculate() {
    let display = document.getElementById('calcDisplay');
    let expression = display.innerText;
    expression = expression.replace(/×/g, '*').replace(/÷/g, '/').replace(/−/g, '-');
    try {
        let result = eval(expression);
        display.innerText = result;
    } catch {
        alert('잘못된 수식입니다.');
        display.innerText = '0';
    }
}

function clearCalc() {
    document.getElementById('calcDisplay').innerText = '0';
}

// 타이머 기능
let timerInterval;
let remainingTime = 600; // 10분 = 600초
let isPaused = true;

function startTimer() {
    if (!isPaused) return; // 이미 실행 중이면 무시
    isPaused = false;
    timerInterval = setInterval(() => {
        if (remainingTime <= 0) {
            clearInterval(timerInterval);
            alert('시간이 종료되었습니다!');
            playSound();
            return;
        }
        remainingTime--;
        updateTimerDisplay();
    }, 1000);
}

function pauseTimer() {
    isPaused = true;
    clearInterval(timerInterval);
}

function resetTimer() {
    isPaused = true;
    clearInterval(timerInterval);
    remainingTime = 600;
    updateTimerDisplay();
}

function updateTimerDisplay() {
    let minutes = String(Math.floor(remainingTime / 60)).padStart(2, '0');
    let seconds = String(remainingTime % 60).padStart(2, '0');
    document.getElementById('timer').innerText = `${minutes}:${seconds}`;
}

function playSound() {
    let audio = new Audio('alarm.mp3'); // 알람 소리 파일 경로
    audio.play();
}

// 퀴즈 제출 기능
function submitQuiz() {
    let userAnswers = {
        lu: [],
        lr: [],
        di: [],
        cm: []
    };

    // 언어이해 답안 수집
    for (let i = 1; i <= 15; i++) {
        let options = document.getElementsByName('lu_q' + i);
        collectAnswers(options, userAnswers.lu);
    }

    // 언어추리 답안 수집
    for (let i = 1; i <= 15; i++) {
        let options = document.getElementsByName('lr_q' + i);
        collectAnswers(options, userAnswers.lr);
    }

    // 자료해석 답안 수집
    for (let i = 1; i <= 15; i++) {
        let options = document.getElementsByName('di_q' + i);
        collectAnswers(options, userAnswers.di);
    }

    // 창의수리 답안 수집
    for (let i = 1; i <= 15; i++) {
        let options = document.getElementsByName('cm_q' + i);
        collectAnswers(options, userAnswers.cm);
    }

    // 정답 입력 받기
    let correctAnswers = {};
    correctAnswers.lu = prompt('언어이해 영역의 정답을 순서대로 입력하세요 (15자리)');
    correctAnswers.lr = prompt('언어추리 영역의 정답을 순서대로 입력하세요 (15자리)');
    correctAnswers.di = prompt('자료해석 영역의 정답을 순서대로 입력하세요 (15자리)');
    correctAnswers.cm = prompt('창의수리 영역의 정답을 순서대로 입력하세요 (15자리)');

    // 유효성 검사
    // if (!validateAnswers(correctAnswers.lu, 15) ||
    //     !validateAnswers(correctAnswers.lr, 15) ||
    //     !validateAnswers(correctAnswers.di, 15) ||
    //     !validateAnswers(correctAnswers.cm, 15)) {
    //     alert('모든 영역의 정답은 각각 15자리여야 합니다.');
    //     return;
    // }

    // 채점하기
    let results = {
        lu: { wrongCount: 0, wrongNumbers: [],},
        lr: { wrongCount: 0, wrongNumbers: [],},
        di: { wrongCount: 0, wrongNumbers: [],},
        cm: { wrongCount: 0, wrongNumbers: [],}
    };

    gradeSection(userAnswers.lu, correctAnswers.lu, results.lu);
    gradeSection(userAnswers.lr, correctAnswers.lr, results.lr);
    gradeSection(userAnswers.di, correctAnswers.di, results.di);
    gradeSection(userAnswers.cm, correctAnswers.cm, results.cm);

    // 결과 표시
    displayResults(results);
}

function collectAnswers(options, answerArray) {
    let answered = false;
    for (let option of options) {
        if (option.checked) {
            answerArray.push(option.value);
            answered = true;
            break;
        }
    }
    if (!answered) {
        answerArray.push('0'); // 선택 안 함
    }
}

function validateAnswers(answers, expectedLength) {
    return answers && answers.length === expectedLength;
}

function gradeSection(userAnswers, correctAnswers, result) {
    result.correctAnswers = [];
    for (let i = 0; i < userAnswers.length; i++) {
        if (userAnswers[i] !== correctAnswers[i]) {
            result.wrongCount++;
            result.wrongNumbers.push(i + 1);
            result.correctAnswers.push(correctAnswers[i]); // 정답 저장
        }
    }
}

function displayResults(results) {
    let resultText = '';

    for (let section in results) {
        let sectionName = '';
        switch (section) {
            case 'lu':
                sectionName = '언어이해';
                break;
            case 'lr':
                sectionName = '언어추리';
                break;
            case 'di':
                sectionName = '자료해석';
                break;
            case 'cm':
                sectionName = '창의수리';
                break;
        }

        resultText += `<h3>${sectionName}</h3>`;
        resultText += `틀린 개수: ${results[section].wrongCount}개<br>`;
        resultText += `틀린 번호: ${results[section].wrongNumbers.join(', ')}<br>`;
        resultText += `정답 : ${results[section].correctAnswers}<br><br>`;
    }

    document.getElementById('resultText').innerHTML = resultText;
    document.getElementById('resultArea').style.display = 'block';
}