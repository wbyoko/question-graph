const { QuestionGraph } = require("./question-graph");

let demoGraph = new QuestionGraph();

const ADD_AS_VERTEX = true;

demoGraph.addQuestion(
  "schooling",
  {
    question: "What level of schooling have you completed?",
    type: "choice",
    choice: ["High School", "College", "PhD", "None"]
  },
  ADD_AS_VERTEX
);

demoGraph.addQuestion(
  "food",
  {
    question: "Which of these foods consume regularly (Click all that apply)?",
    type: "multi-choice",
    choice: ["Sushi", "Wine", "Candy", "Steak"],
    noneChoice: true
  },
);

demoGraph.addQuestion(
  "age",
  {
    question: "How old are you?",
    type: "number",
  },
  ADD_AS_VERTEX
);


demoGraph.addQuestion(
  "inCollege",
  {
    type: "yes/no",
    question: "Are you currently in college?"
  },
  ADD_AS_VERTEX
);

demoGraph.addQuestion(
  "playSports",
  {
    type: "yes/no",
    question: "Do you play sports?"
  },
  ADD_AS_VERTEX
);

demoGraph.addResult("tooCool", {
  name: "Too Cool For School"
});

demoGraph.addResult("sportyStudent", {
  name: "Sporty Student"
});

demoGraph.addResult("student", {
  name: "Student"
});

demoGraph.addResult("doctor", {
  name: "Doctor"
});

demoGraph.addResult("kid", {
  name: "Kid"
});

demoGraph.addResult("livingLife", {
  name: "Living the life"
});

demoGraph.addResult("woah", {
  name: "🙀😱"
});

// demoGraph.addVertex("schooling", "schooling");

// demoGraph.addVertex("inCollege", "inCollege");

// demoGraph.addVertex("playSports", "playSports");

demoGraph.addVertex("food_1", "food");
demoGraph.addVertex("food_2", "food");
demoGraph.addVertex("food_3", "food");

demoGraph.addEdge("age", "food_1", ({ age }) => {
  if (age != null) {
    return age <= 18;
  }
});
demoGraph.addEdge("age", "food_2", ({ age }) => {
  if (age != null) {
    return age >= 65;
  }
});

demoGraph.addEdge("food_1", "woah", ({ food }) => {
  if (food != null) {
    return food["Wine"];
  }
});

demoGraph.addEdge("food_2", "woah", ({ food }) => {
  if (food != null) {
    return food["Candy"];
  }
});

demoGraph.addEdge("food_3", "livingLife", ({ food }) => {
  if (food != null) {
    let count = 0;
    for (const entry of food) {
      if (entry[1]) count++;
    }
    return count > 1;
  }
});

demoGraph.addEdge("age", "schooling", ({ age }) => {
  if (age != null) {
    return age >= 18;
  }
});

demoGraph.addEdge("age", "kid", ({ age }) => {
  if (age != null) {
    return age < 18;
  }
});

demoGraph.addEdge("schooling", "tooCool", ({ schooling }) => {
  if (schooling != null) {
    return schooling === "None";
  }
});

demoGraph.addEdge("schooling", "inCollege", ({ schooling }) => {
  if (schooling != null) {
    return schooling === "High School";
  }
});

demoGraph.addEdge("schooling", "playSports", ({ schooling }) => {
  if (schooling != null) {
    return schooling === "College";
  }
});

demoGraph.addEdge("schooling", "doctor", ({ schooling }) => {
  if (schooling != null) {
    return schooling === "PhD";
  }
});

demoGraph.addEdge("inCollege", "tooCool", ({ inCollege }) => {
  if (inCollege != null) {
    return !!inCollege === false;
  }
});

demoGraph.addEdge("inCollege", "playSports", ({ inCollege }) => {
  if (inCollege != null) {
    return !!inCollege === true;
  }
});

demoGraph.addEdge("playSports", "sportyStudent", ({ playSports }) => {
  if (playSports != null) {
    return !!playSports === true;
  }
});

demoGraph.addEdge("playSports", "student", ({ playSports }) => {
  if (playSports != null) {
    return !!playSports === false;
  }
});

demoGraph.finalize();

console.log(demoGraph.getNextQuestion());
console.log(demoGraph.getNextQuestion({ schooling: "None" }));
console.log(demoGraph.getNextQuestion({ schooling: "College" }));
console.log(demoGraph.getNextQuestion({ schooling: "High School" }));

console.log(demoGraph.getRemainingQuestions());
console.log(demoGraph.getRemainingQuestions({ schooling: "None" }));
console.log(demoGraph.getRemainingQuestions({ schooling: "College" }));
console.log(demoGraph.getRemainingQuestions({ schooling: "High School" }));

console.log(demoGraph.getRemainingQuestions({ playSports: true }));
console.log(demoGraph.getRemainingQuestions({ inCollege: true }));

console.log("demoGraph.getPossibleResults()");
console.log(demoGraph.getPossibleResults());
console.log(demoGraph.getPossibleResults({ schooling: "None" }));
console.log(demoGraph.getPossibleResults({ schooling: "College" }));
console.log(demoGraph.getPossibleResults({ schooling: "High School" }));

console.log(demoGraph.getPossibleResults({ playSports: true }));
console.log(demoGraph.getPossibleResults({ inCollege: true }));

console.log("demoGraph.getImpossibleResults()");
console.log(demoGraph.getImpossibleResults());
console.log(demoGraph.getImpossibleResults({ schooling: "None" }));
console.log(demoGraph.getImpossibleResults({ schooling: "College" }));
console.log(demoGraph.getImpossibleResults({ schooling: "High School" }));

console.log(demoGraph.getImpossibleResults({ playSports: true }));
console.log(demoGraph.getImpossibleResults({ inCollege: true }));

console.log("demoGraph.getPossibleResultsIds()");
console.log(demoGraph.getPossibleResultsIds());
console.log(demoGraph.getPossibleResultsIds({ schooling: "None" }));
console.log(demoGraph.getPossibleResultsIds({ schooling: "College" }));
console.log(demoGraph.getPossibleResultsIds({ schooling: "High School" }));
console.log(demoGraph.getPossibleResultsIds({ playSports: true }));
console.log(demoGraph.getPossibleResultsIds({ inCollege: true }));

module.exports = { demoGraph };
