<template>
  <div class="grid-container">
    <div class="grid-row">
      <div class="grid-offset-3 grid-col-6 margin-y-2">
        <div v-if="currentQuestion" id="questions">
          <h2>Questions</h2>
          <div class="margin-y-1">{{ currentQuestion.question.question }}</div>
          <div v-if="currentQuestion.question.type === 'number'">
            <input
              class="usa-input margin-y-05"
              type="text"
              v-model.number="ui[currentQuestion.questionId]"
              :id="'remainingQuestions-checkbox-' + currentQuestion.questionId"
            />
          </div>
          <div v-else-if="currentQuestion.question.type === 'multi-choice'">
            <div
              class="usa-checkbox"
              v-for="(choice, index) in currentQuestion.question.choice"
              :key="choice"
            >
              <input
                class="usa-checkbox__input"
                type="checkbox"
                :checked="ui[currentQuestion.questionId] && ui[currentQuestion.questionId][choice]"
                @click="toggleData(currentQuestion.questionId, choice)"
                :id="'remainingQuestions-checkbox-' + questionIndex + '-' + index"
              />
              <label
                class="usa-checkbox__label"
                :for="'remainingQuestions-checkbox-' + questionIndex + '-' + index"
              >{{ choice }}</label>
            </div>
          </div>
          <div v-else-if="currentQuestion.question.type === 'choice'">
            <div
              class="usa-radio"
              v-for="(choice, index) in currentQuestion.question.choice"
              :key="choice"
            >
              <input
                class="usa-radio__input"
                type="radio"
                v-model="ui[currentQuestion.questionId]"
                :value="choice"
                :id="'remainingQuestions-radio-' + questionIndex + '-' + index"
              />
              <label
                class="usa-radio__label"
                :for="'remainingQuestions-radio-' + questionIndex + '-' + index"
              >{{ choice }}</label>
            </div>
          </div>
          <div v-else>
            <div class="usa-radio">
              <input
                class="usa-radio__input"
                type="radio"
                v-model="ui[currentQuestion.questionId]"
                :value="true"
                :id="'remainingQuestions-radio-' + questionIndex + '-yes'"
              />
              <label
                class="usa-radio__label"
                :for="'remainingQuestions-radio-' + questionIndex + '-yes'"
              >Yes</label>
            </div>
            <div class="usa-radio">
              <input
                class="usa-radio__input"
                type="radio"
                v-model="ui[currentQuestion.questionId]"
                :value="false"
                :id="'remainingQuestions-radio-' + questionIndex + '-no'"
              />
              <label
                class="usa-radio__label"
                :for="'remainingQuestions-radio-' + questionIndex + '-no'"
              >No</label>
            </div>
          </div>
        </div>
        <div v-else>
          <h2>Benefits</h2>
          <div v-if="possibleResults.length">
            <div
              class="usa-card margin-y-1"
              v-for="result in possibleResults"
              :key="result.resultId"
            >
              <div class="usa-card__container">
                <header class="usa-card__header">
                  <h2 class="usa-card__heading">{{ result.result.data.name }}</h2>
                </header>
                <div class="usa-card__body" v-if="result.result.data.description">
                  <p>{{ result.result.data.description }}</p>
                </div>
                <div class="usa-card__footer" v-if="result.result.data.url">
                  <a :href="result.result.data.url" target="_blank" class="usa-button">Learn More</a>
                </div>
              </div>
            </div>
          </div>
          <div v-else>No have no results</div>
        </div>
      </div>
    </div>

    <div class="grid-row">
      <div class="grid-offset-3 grid-col-6 margin-y-2">
        <ul class="usa-button-group">
          <li class="usa-button-group__item">
            <button
              class="usa-button usa-button--outline"
              :disabled="!insertionOrder.length"
              @click="goBack()"
            >Back</button>
          </li>
          <li class="usa-button-group__item" v-if="currentQuestion">
            <button
              class="usa-button"
              @click="updateAnswer(currentQuestion.questionId, currentQuestion.question.type === 'multi-choice' && {})"
              :disabled="ui[currentQuestion.questionId] == null"
            >Next</button>
          </li>
        </ul>
      </div>
    </div>
  </div>
</template>

<script>
import { questionGraph } from "../../graph/benefitsGraph";

export default {
  name: "App",
  data() {
    return {
      ui: {},
      data: {},
      loading: true,
      insertionOrder: [],
    };
  },
  props: {
    msg: String,
  },

  computed: {
    currentQuestion: function () {
      return questionGraph.getNextQuestion(this.data);
    },
    possibleResults: function () {
      return questionGraph.getPossibleResults(this.data);
    },
  },
  methods: {
    addAnswer: function (questionId, answer) {
      const newData = { ...this.data, [questionId]: answer };
      this.data = newData;
      this.insertionOrder.push(questionId);
      this.ui[questionId] = answer;
      this.ui = { ...this.ui };
    },
    clearAnswer: function (questionId) {
      const newData = { ...this.data };
      delete newData[questionId];
      delete this.ui[questionId];
      this.data = newData;
      const found = this.insertionOrder.indexOf(questionId);
      if (found !== -1) {
        this.insertionOrder = this.insertionOrder.slice(found, 1);
      }
    },
    updateAnswer: function (questionId, emptyValue) {
      const answer = this.ui[questionId] || emptyValue;
      this.clearAnswer(questionId);
      this.addAnswer(questionId, answer);
    },
    toggleData: function (questionId, choice) {
      this.ui[questionId] = { ...(this.ui[questionId] || {}) };
      this.ui[questionId][choice] = !this.ui[questionId][choice];
      this.ui = { ...this.ui };
    },
    goBack: function () {
      if (this.insertionOrder.length) {
        const questionId = this.insertionOrder.pop();
        this.clearAnswer(questionId);
      }
    },
  },
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
</style>
