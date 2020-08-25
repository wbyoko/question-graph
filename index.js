const { QuestionGraph } = require("./question-graph");

let graph = new QuestionGraph();

graph.addVertex("schooling", {
  question: "What level of schooling have you completed?",
  choice: ["High School", "College", "PhD", "None"],
});

graph.addVertex("inCollege", {
  question: "Are you currently in college?",
});

graph.addVertex("playSports", {
  question: "Do you play sports?",
});

graph.addVertex("tooCool", {
  label: "Too Cool For School",
});

graph.addVertex("sportyStudent", {
  label: "Sporty Student",
});

graph.addVertex("student", {
  label: "Student",
});

graph.addVertex("doctor", {
  label: "Doctor",
});

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
