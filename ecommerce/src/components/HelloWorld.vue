<template>
  <div class="grid-container">
    <div class="grid-row">
      <div class="grid-col-4">
        <h2>Questions</h2>

        <div
          v-for="(currentQuestion, questionIndex) in remainingQuestions"
          :key="currentQuestion.questionId"
        >
          {{ currentQuestion.question.question }}
          <div v-if="currentQuestion.question.choice">
            <div
              class="usa-radio"
              v-for="(choice, index) in currentQuestion.question.choice"
              :key="choice"
            >
              <input
                class="usa-radio__input"
                type="radio"
                :id="'radio-' + questionIndex + '-' + index"
                @click="addAnswer(currentQuestion.questionId, choice)"
              />
              <label
                class="usa-radio__label"
                :for="'radio-' + questionIndex + '-' + index"
              >{{ choice }}</label>
            </div>
          </div>
          <div v-else>
            <div class="usa-radio">
              <input
                class="usa-radio__input"
                type="radio"
                :id="'radio-' + questionIndex + '-yes'"
                @click="addAnswer(currentQuestion.questionId, true)"
              />
              <label class="usa-radio__label" :for="'radio-' + questionIndex + '-yes'">Yes</label>
            </div>
            <div class="usa-radio">
              <input
                class="usa-radio__input"
                type="radio"
                :id="'radio-' + questionIndex + '-yes'"
                @click="addAnswer(currentQuestion.questionId, false)"
              />
              <label class="usa-radio__label" :for="'radio-' + questionIndex + '-no'">No</label>
            </div>
          </div>
        </div>
      </div>
      <div class="grid-col-8">
        <h2>Benefits</h2>

        <div>
          <div v-if="possibleResults.length">
            <div
              class="usa-card margin-y-1"
              v-for="result in possibleResults"
              :key="result.resultId"
            >
              <div class="usa-card__container">
                <header class="usa-card__header">
                  <h2 class="usa-card__heading">{{ result.result.data.label }}</h2>
                </header>
                <div class="usa-card__body" v-if="result.result.data.description">
                  <p>{{ result.result.data.description }}</p>
                </div>
                <div class="usa-card__footer" v-if="result.result.data.link">
                  <button class="usa-button">Visit Florida Keys</button>
                </div>
              </div>
            </div>
          </div>
          <div v-else>No have no results</div>
        </div>
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
    remainingQuestions: function () {
      return demoGraph.getRemainingQuestions(this.data);
    },
    possibleResults: function () {
      return demoGraph.getPossibleResults(this.data);
    },
    completedQuestions: function () {
      return demoGraph.getCompletedQuestions(this.data);
    },
  },
  methods: {
    addAnswer: function (questionId, answer) {
      const newData = { ...this.data, [questionId]: answer };
      this.data = newData;
      this.insertionOrder.push(questionId);
    },
    goBack: function () {
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
<style scoped></style>
