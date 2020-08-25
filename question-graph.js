class Node {
  constructor(data) {
    this.data = data || {};
    this.edges = [];
  }
}

class Edge {
  constructor(toId, question) {
    this.toId = toId;
    this.question = question;
  }
}

class QuestionGraph {
  constructor() {
    this.map = new Map();
    this.headIds = new Set();
  }

  addVertex(nodeId, data) {
    this.map.set(nodeId, new Node(data));
    this.headIds.add(nodeId);
  }

  addEdge(fromId, toId, question) {
    const fromNode = this.map.get(fromId);
    const toNode = this.map.get(fromId);

    if (fromNode && toNode) {
      fromNode.edges.push(new Edge(toId, question));
      this.headIds.delete(toId);
    }
  }

/*
getNextQuestion(data)
	- bfs to find to next question based off data

getRemainingQuestions(data)
	- bfs search to find all the valid questions. if not STOP;


getPossibleResults(data)
	- bfs to find possible results / return the impossible results as well

getImpossibleResults(data)
	- bfs to find possible results / return the impossible results as well
}
*/
module.exports = { QuestionGraph };
