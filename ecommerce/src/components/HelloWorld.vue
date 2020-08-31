<template>
  <div class="hello">
    <div
      v-for="(currentQuestion, questionIndex) in remainingQuestions"
      :key="currentQuestion.questionId"
    >
      {{ currentQuestion.question.question }}
      <div v-if="currentQuestion.question.choice">
        <div
          v-for="(choice, index) in currentQuestion.question.choice"
          :key="choice"
        >
          <input
            type="radio"
            :id="'radio-' + questionIndex + '-' + index"
            @click="addAnswer(currentQuestion.questionId, choice)"
          />
          <label :for="'radio-' + index">{{ choice }}</label>
          <br />
        </div>
      </div>
      <div v-else>
        <input
          type="radio"
          :id="'radio-' + questionIndex + '-yes'"
          @click="addAnswer(currentQuestion.questionId, true)"
        />
        <label :for="'radio-' + questionIndex + '-yes'">Yes</label>
        <br />
        <input
          type="radio"
          :id="'radio-' + questionIndex + '-yes'"
          @click="addAnswer(currentQuestion.questionId, false)"
        />
        <label :for="'radio-' + questionIndex + '-no'">No</label>
        <br />
      </div>
    </div>

    <div>
      <ul v-if="possibleResults.length">
        <li v-for="result in possibleResults" :key="result.resultId">
          {{ result.result.data.label }}
        </li>
      </ul>
      <div v-else>
        No have no results
      </div>
    </div>
  </div>
</template>

<script>
import { demoGraph } from "../assets/demoGraph";

export default {
  name: "HelloWorld",
  data() {
    return {
      data: {},
      loading: true,
      insertionOrder: [],
    };
  },
  props: {
    msg: String,
  },

  computed: {
    remainingQuestions: function() {
      return demoGraph.getRemainingQuestions(this.data);
    },
    possibleResults: function() {
      return demoGraph.getPossibleResults(this.data);
    },
  },
  methods: {
    addAnswer: function(questionId, answer) {
      const newData = { ...this.data, [questionId]: answer };
      this.data = newData;
      this.insertionOrder.push(questionId);
    },
    goBack: function() {
      if (this.insertionOrder.length) {
        const questionId = this.insertionOrder.pop();
        const newData = { ...this.data };
        delete newData[questionId];
        this.data = newData;
      }
    },
  },
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
h3 {
  margin: 40px 0 0;
}
ul {
  list-style-type: none;
  padding: 0;
}
li {
  display: inline-block;
  margin: 0 10px;
}
a {
  color: #42b983;
}
</style>
