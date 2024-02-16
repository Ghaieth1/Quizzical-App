import { useEffect, useState } from "react";

const Questions = () => {
  const [questions, setQuestions] = useState([]);
  const [selectedAnswers, setSelectedAnswers] = useState(Array(10).fill(null));
  const [score, setScore] = useState(null);
  const [answersChecked, setAnswersChecked] = useState(false);

  useEffect(() => {
    fetchQuestions();
  }, []);

  const fetchQuestions = async () => {
    try {
      const response = await fetch(
        "https://opentdb.com/api.php?amount=5&category=21&difficulty=easy&type=multiple"
      );
      const data = await response.json();

      if (data.results) {
        setQuestions(
          data.results.map((question) => ({
            ...question,
            answers: shuffleArray(
              question.incorrect_answers.concat(question.correct_answer)
            ),
          }))
        );
      } else {
        console.error(
          "Erreur lors de la récupération des questions : les résultats ne sont pas présents dans la réponse de l'API."
        );
      }
    } catch (error) {
      console.error("Erreur lors de la récupération des questions :", error);
    }
  };

  const handleAnswerSelect = (index, answer) => {
    const newSelectedAnswers = [...selectedAnswers];
    newSelectedAnswers[index] = answer;
    setSelectedAnswers(newSelectedAnswers);
  };

  const getAnswerClass = (index, answer) => {
    if (!answersChecked) {
      const isSelected = selectedAnswers[index] === answer;
      return isSelected ? "bg-violet-500" : "";
    }

    const isCorrect = answer === questions[index].correct_answer;
    const isIncorrect = selectedAnswers[index] !== null && !isCorrect;

    if (isIncorrect) {
      return "bg-red-500";
    } else if (isCorrect) {
      return "bg-green-500";
    } else {
      return selectedAnswers[index] ? "bg-violet-500" : "";
    }
  };

  const verifyAnswers = () => {
    setAnswersChecked(true);

    const correctAnswers = questions.map((question) => question.correct_answer);
    const userAnswers = selectedAnswers.filter((answer) => answer !== null);
    let newScore = 0;
    userAnswers.forEach((answer, index) => {
      if (answer === correctAnswers[index]) {
        newScore++;
      }
    });
    setScore(newScore);
  };

  const shuffleArray = (array) => {
    const shuffledArray = array.slice();
    for (let i = shuffledArray.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [shuffledArray[i], shuffledArray[j]] = [
        shuffledArray[j],
        shuffledArray[i],
      ];
    }
    return shuffledArray;
  };

  const resetQuiz = () => {
    setAnswersChecked(false);
    setSelectedAnswers(Array(10).fill(null));
    setScore(null);
    fetchQuestions();
  };

  return (
    <div className="bg-slate-200 h-screen ">
      <div className="mx-auto p-10  text-center ">
        {questions.map((question, index) => (
          <div key={index}>
            <h1
              className="mb-5 font-bold"
              dangerouslySetInnerHTML={{ __html: question.question }}
            ></h1>

            <div className="flex justify-center gap-5">
              {question.answers.map((answer, i) => (
                <label
                  key={i}
                  className={`block w-48 my-2 text-center cursor-pointer mb-5`}
                >
                  <input
                    type="radio"
                    name={`answer-${index}`}
                    value={answer}
                    checked={selectedAnswers[index] === answer}
                    onChange={() => handleAnswerSelect(index, answer)}
                    className="hidden"
                  />
                  <div
                    className={`px-4 py-2 font-bold rounded-full text-white bg-blue-500 hover:bg-violet-700 ${getAnswerClass(
                      index,
                      answer
                    )}`}
                    dangerouslySetInnerHTML={{ __html: answer }}
                    style={{
                      boxShadow:
                        "10px 10px 5px -5px black, 5px 10px 10px -5px black",
                    }}
                  ></div>
                </label>
              ))}
            </div>
          </div>
        ))}
        <div className="flex justify-center">
          <button
            className="px-4 py-2 mt-4 text-white bg-blue-500 hover:bg-violet-800 rounded-2xl"
            onClick={answersChecked ? resetQuiz : verifyAnswers}
            style={{
              boxShadow: "10px 10px 5px -5px black, 5px 10px 10px -5px black",
            }}
          >
            {answersChecked ? "Try again" : "Check answers"}
          </button>
        </div>
        {score !== null && (
          <div className="flex justify-center p-5 font">
            <h1>{`You Scored ${score} sur ${questions.length}`}</h1>
          </div>
        )}
      </div>
    </div>
  );
};

export default Questions;
