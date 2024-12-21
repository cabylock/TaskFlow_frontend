let flashcards = [];
let currentCardIndex = 0;

document.getElementById("add-button").addEventListener("click", function () {
  document.querySelector(".add-form").style.display = "block";
});

document.getElementById("save-button").addEventListener("click", function () {
  let front = document.getElementById("front-input").value;
  let back = document.getElementById("back-input").value;

  if (front && back) {
    flashcards.push({ front: front, back: back });
    document.querySelector(".add-form").style.display = "none";
    document.getElementById("front-input").value = "";
    document.getElementById("back-input").value = "";

    // Chuyển đến từ vựng mới thêm vào và cập nhật giao diện
    currentCardIndex = flashcards.length - 1;
    updateFlashcard();
  }
});

// Khi xóa từ vựng
document.getElementById("delete-button").addEventListener("click", function () {
  if (flashcards.length > 0) {
    flashcards.splice(currentCardIndex, 1); // Xóa từ vựng tại chỉ mục hiện tại
    if (currentCardIndex >= flashcards.length) {
      currentCardIndex = flashcards.length - 1; // Cập nhật lại chỉ mục nếu đã xóa hết
    }
    updateFlashcard(); // Cập nhật ngay lập tức sau khi xóa
  }
});

// Cập nhật thẻ flashcard
function updateFlashcard() {
  if (flashcards.length > 0) {
    document.getElementById("front-text").innerHTML =
      flashcards[currentCardIndex].front;
    document.getElementById("back-text").innerHTML =
      flashcards[currentCardIndex].back;
    document.getElementById("card-number").innerHTML =
      currentCardIndex + 1 + "  ";
    document.getElementById("card-number-back").innerHTML =
      currentCardIndex + 1 + "  ";
  } else {
    document.getElementById("front-text").innerHTML = "Không có từ vựng nào!";
    document.getElementById("back-text").innerHTML = "";
    document.getElementById("card-number").innerHTML = "";
    document.getElementById("card-number-back").innerHTML = "";
  }
}

// Đổi mặt thẻ flashcard
document.getElementById("flip-button").addEventListener("click", function () {
  let flashcard = document.querySelector(".flashcard");
  flashcard.classList.toggle("flip");
});

// Chuyển sang thẻ tiếp theo
document.getElementById("next-button").addEventListener("click", function () {
  if (currentCardIndex < flashcards.length - 1) {
    currentCardIndex++;
    updateFlashcard();
  }
});

// Quay lại thẻ trước
document.getElementById("previous-button")
.addEventListener("click", function () {
    if (currentCardIndex > 0) {
      currentCardIndex--;
      updateFlashcard();
    }
  });
let questions = [];
let currentQuestionIndex = 0;

// Lưu câu hỏi
document.getElementById("save-question-button").addEventListener("click", function () {
    const question = document.getElementById("question-input").value;
    const answerA = document.getElementById("answer-A-input").value;
    const answerB = document.getElementById("answer-B-input").value;
    const answerC = document.getElementById("answer-C-input").value;
    const answerD = document.getElementById("answer-D-input").value;
    const correctAnswer = document.getElementById("correct-answer-input").value;

    if (
      !question ||!answerA ||!answerB ||!answerC ||!answerD ||!correctAnswer
    ) {
      showToast("fail","Please fill in all fields!");
      return;
    }

    questions.push({
      question: question,
      answers: [answerA, answerB, answerC, answerD],
      correctAnswer: correctAnswer,
    });

    // Đặt currentQuestionIndex về câu hỏi cuối cùng trong mảng sau khi thêm câu hỏi mới
    currentQuestionIndex = questions.length - 1;

    // Làm sạch các trường input sau khi lưu
    document.getElementById("question-input").value = "";
    document.getElementById("answer-A-input").value = "";
    document.getElementById("answer-B-input").value = "";
    document.getElementById("answer-C-input").value = "";
    document.getElementById("answer-D-input").value = "";
    document.getElementById("correct-answer-input").value = "";

    showToast("","Question saved successfully!");
    updateQuiz(); // Cập nhật quiz sau khi thêm câu hỏi mới
  });

// Xóa câu hỏi hiện tại
document.getElementById("delete-question-button").addEventListener("click", function () {
    if (questions.length > 0) {
      questions.splice(currentQuestionIndex, 1); // Xóa câu hỏi tại vị trí hiện tại
      if (currentQuestionIndex >= questions.length) {
        currentQuestionIndex = questions.length - 1; // Cập nhật chỉ số câu hỏi
      }
      updateQuiz(); // Cập nhật quiz ngay lập tức sau khi xóa
    }
  });

// Cập nhật câu hỏi hiển thị
function updateQuiz() {
  if (questions.length > 0 && currentQuestionIndex < questions.length) {
    const currentQuestion = questions[currentQuestionIndex];
    document.getElementById("question-text").innerHTML =
      `<strong>${currentQuestionIndex + 1}. </strong>` +
      currentQuestion.question;
    document.getElementById("answer-A-button").innerText =
      "A. " + currentQuestion.answers[0];
    document.getElementById("answer-B-button").innerText =
      "B. " + currentQuestion.answers[1];
    document.getElementById("answer-C-button").innerText =
      "C. " + currentQuestion.answers[2];
    document.getElementById("answer-D-button").innerText =
      "D. " + currentQuestion.answers[3];
    document.getElementById("result-text").innerText = "";
  } else {
    document.getElementById("question-text").innerText =
      "Không có câu hỏi nào, vui lòng thêm câu hỏi!";
    document.getElementById("answer-A-button").innerText = "";
    document.getElementById("answer-B-button").innerText = "";
    document.getElementById("answer-C-button").innerText = "";
    document.getElementById("answer-D-button").innerText = "";
  }
}

// Kiểm tra đáp án của người dùng
document.getElementById("answer-A-button").addEventListener("click", function () {
  checkAnswer("A");
});

document.getElementById("answer-B-button").addEventListener("click", function () {
  checkAnswer("B");
});

document.getElementById("answer-C-button").addEventListener("click", function () {
  checkAnswer("C");
});

document.getElementById("answer-D-button").addEventListener("click", function () {
  checkAnswer("D");
});

// Kiểm tra đáp án của người dùng
function checkAnswer(answer) {
  const currentQuestion = questions[currentQuestionIndex];

  // Kiểm tra xem đáp án có đúng hay không
  if (answer === currentQuestion.correctAnswer) {
    document.getElementById("result-text").innerText =
      "Chúc mừng, bạn đã chọn đúng!";
  } else {
    document.getElementById(
      "result-text"
    ).innerText = `Sai rồi! Đáp án đúng là ${currentQuestion.correctAnswer}.`;
  }
}

// Điều hướng câu hỏi
document.getElementById("next-question-button").addEventListener("click", function () {
    if (currentQuestionIndex < questions.length - 1) {
      currentQuestionIndex++;
      updateQuiz(); // Cập nhật quiz khi chuyển qua câu hỏi tiếp theo
    } else {
      showToast("","You've reached the end of the quiz!");
    }
  });

document.getElementById("prev-question-button").addEventListener("click", function () {
    if (currentQuestionIndex > 0) {
      currentQuestionIndex--;
      updateQuiz(); // Cập nhật quiz khi quay lại câu hỏi trước
    }
  });
