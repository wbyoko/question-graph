const { QuestionGraph } = require("./question-graph");

let graph = new QuestionGraph();

const ADD_AS_VERTEX = true;

graph.addQuestion(
  "schooling",
  {
    question: "What level of schooling have you completed?",
    choice: ["High School", "College", "PhD", "None"],
  },
  ADD_AS_VERTEX
);

graph.addQuestion(
  "inCollege",
  {
    question: "Are you currently in college?",
  },
  ADD_AS_VERTEX
);

graph.addQuestion(
  "playSports",
  {
    question: "Do you play sports?",
  },
  ADD_AS_VERTEX
);

graph.addResult("tooCool", {
  label: "Too Cool For School",
});

graph.addResult("sportyStudent", {
  label: "Sporty Student",
});

graph.addResult("student", {
  label: "Student",
});

graph.addResult("doctor", {
  label: "Doctor",
});

// graph.addVertex("schooling", "schooling");

// graph.addVertex("inCollege", "inCollege");

// graph.addVertex("playSports", "playSports");

graph.addEdge("schooling", "tooCool", ({ schooling }) => {
  if (schooling != null) {
    return schooling === "None";
  }
});

graph.addEdge("schooling", "inCollege", ({ schooling }) => {
  if (schooling != null) {
    return schooling === "High School";
  }
});

graph.addEdge("schooling", "playSports", ({ schooling }) => {
  if (schooling != null) {
    return schooling === "College";
  }
});

graph.addEdge("schooling", "doctor", ({ schooling }) => {
  if (schooling != null) {
    return schooling === "PhD";
  }
});

graph.addEdge("inCollege", "tooCool", ({ inCollege }) => {
  if (inCollege != null) {
    return !!inCollege === false;
  }
});

graph.addEdge("inCollege", "playSports", ({ inCollege }) => {
  if (inCollege != null) {
    return !!inCollege === true;
  }
});

graph.addEdge("playSports", "sportyStudent", ({ playSports }) => {
  if (playSports != null) {
    return !!playSports === true;
  }
});

graph.addEdge("playSports", "student", ({ playSports }) => {
  if (playSports != null) {
    return !!playSports === false;
  }
});

graph.finalize();

console.log(graph.getNextQuestion());
console.log(graph.getNextQuestion({ schooling: "None" }));
console.log(graph.getNextQuestion({ schooling: "College" }));
console.log(graph.getNextQuestion({ schooling: "High School" }));

console.log(graph.getRemainingQuestions());
console.log(graph.getRemainingQuestions({ schooling: "None" }));
console.log(graph.getRemainingQuestions({ schooling: "College" }));
console.log(graph.getRemainingQuestions({ schooling: "High School" }));

console.log(graph.getRemainingQuestions({ playSports: true }));
console.log(graph.getRemainingQuestions({ inCollege: true }));

console.log("graph.getPossibleResults()");
console.log(graph.getPossibleResults());
console.log(graph.getPossibleResults({ schooling: "None" }));
console.log(graph.getPossibleResults({ schooling: "College" }));
console.log(graph.getPossibleResults({ schooling: "High School" }));

console.log(graph.getPossibleResults({ playSports: true }));
console.log(graph.getPossibleResults({ inCollege: true }));

console.log("graph.getImpossibleResults()");
console.log(graph.getImpossibleResults());
console.log(graph.getImpossibleResults({ schooling: "None" }));
console.log(graph.getImpossibleResults({ schooling: "College" }));
console.log(graph.getImpossibleResults({ schooling: "High School" }));

console.log(graph.getImpossibleResults({ playSports: true }));
console.log(graph.getImpossibleResults({ inCollege: true }));

console.log("graph.getPossibleResultsIds()");
console.log(graph.getPossibleResultsIds());
console.log(graph.getPossibleResultsIds({ schooling: "None" }));
console.log(graph.getPossibleResultsIds({ schooling: "College" }));
console.log(graph.getPossibleResultsIds({ schooling: "High School" }));
console.log(graph.getPossibleResultsIds({ playSports: true }));
console.log(graph.getPossibleResultsIds({ inCollege: true }));
