<template>
  <main>
    Weekly Budget Tracker

    <div class="weekly-budget">
      <DailyBudget v-for="day in days" :key="day.day" :day="day.day" :budget="day.budget" data-test="daily-budget"/>
    </div>
    <div class="today">
      <h2 data-test="today">{{ currentDay.day }}</h2>
      <p v-if="isBudgetSet"><strong>Budget</strong>: {{ budget }}</p>
    </div>
    <div v-if="isBudgetSet" class="add-expense data-input" data-test="add-expense">
      <input type="number" v-model="spent" placeholder="Add expense" v-focus />
      <button @click="addExpense" data-test="add-budget">Add</button>
    </div>
    <div v-else>
      <div class="add-budget data-input" data-test="add-budget">
        <input type="number" v-model="newBudget" placeholder="Enter weekly budget" />
        <button @click="addBudget">Add</button>
      </div>
      <div v-if="hasMonthlyBudget" class="data-input use-monthly-budget">
        <button @click="useMonthlyBudget">Use monthly budget?</button>
      </div>
    </div>
  </main>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue';
import DailyBudget from '@/components/DailyBudget.vue';
import { getMonthlyBudget, createWeeklyBudget, createDailyExpense } from "../services/BudgetService";

const monthlyBudget = ref(null);
const budget = ref(null);
const newBudget = ref(null);
const spent = ref(null);
const days = ref([
  {
    day: "Monday",
    budget: 0,
  },
  {
    day: "Tuesday",
    budget: 0,
  },
  {
    day: "Wednesday",
    budget: 0,
  },
  {
    day: "Thursday",
    budget: 0,
  },
  {
    day: "Friday",
    budget: 0,
  },
  {
    day: "Saturday",
    budget: 0,
  },
  {
    day: "Sunday",
    budget: 0,
  }
]);

onMounted(() => {
  getMonthlyBudget().then(data => {
    monthlyBudget.value = data;
    setBudget();
    calculateDailyBudget();
  }).catch(error => {
    console.log("Failed to fetch monthly budget:", error);
  });
});

const currentDay = computed(() => days.value[(new Date().getDay() + 6) % 7]);
const isBudgetSet = computed(() => budget.value > 0);
const hasMonthlyBudget = computed(() => monthlyBudget.value && monthlyBudget.value.budget > 0);

const vFocus = {
  mounted: (el) => el.focus()
}

function setBudget() {
  const weeklyBudget = findCurrentWeek(monthlyBudget.value.weeks);
  if (!weeklyBudget) {
    budget.value = null;
    return;
  }

  budget.value = weeklyBudget.budget;
}

function findCurrentWeek(weeks) {
  if (!weeks) {
    return null;
  }

  const today = new Date().toISOString().slice(0, 10);
  return weeks.find(week => week.start <= today && week.end >= today);
}

function calculateDailyBudget() {
  if (!isBudgetSet) {
    return;
  }

  const dailyBudget = budget.value / 7;
  const weeklyBudget = findCurrentWeek(monthlyBudget.value.weeks);
  if(!weeklyBudget) {
    return;
  }
  days.value.forEach((weekday) => {
    weekday.budget = dailyBudget - weeklyBudget.expenses[weekday.day.toLowerCase()];
  });
}

function addExpense() {
  days.value[(new Date().getDay() + 6) % 7].budget -= spent.value;
  createDailyExpense(spent.value).then(() => {
    spent.value = null;
  }).catch((error) => {
    console.log(error);
  })
}

async function createBudget() {
  createWeeklyBudget(budget.value)
    .then(() => {
      calculateDailyBudget();
    })
    .catch((err) => {
      console.log(err);
    })
}

async function addBudget() {
  budget.value = newBudget.value;
  createBudget();
}

function useMonthlyBudget() {
  budget.value = monthlyBudget.value.budget;
  createBudget();
}
</script>

<style scoped>
main {
  margin: 0 auto;
  max-width: 1200px;
  padding: 1rem;
}

.weekly-budget {
  display: grid;
  grid-template-columns: repeat(7, 1fr);
  grid-gap: 1rem;
  margin-top: 1rem;
}

.today {
  padding: 1rem;
  text-align: center;
  margin-right: 1rem;
  display: block;
  width: 100%;
}

.data-input {
  display: flex;
  justify-content: center;
  margin-top: 1rem;
}

.data-input input {
  border: 1px solid #ccc;
  border-radius: 4px;
  padding: 0.5rem;
  margin-right: 1rem;
}

.data-input input[type=number]::-webkit-inner-spin-button,
.data-input input[type=number]::-webkit-outer-spin-button {
  -webkit-appearance: none;
  margin: 0;
}

.data-input button {
  border: none;
  padding: 15px 32px;
  text-align: center;
  text-decoration: none;
  display: inline-block;
  font-size: 16px;
  border-radius: 4px;
}

.add-budget button {
  background-color: #4865c4;
  color: white;
}

.add-budget button:hover {
  background-color: #3c4f9e;
  cursor: pointer;
}

.add-expense button {
  background-color: #5d9448;
  color: white;
}

.add-expense button:hover {
  background-color: #4b7a3a;
  cursor: pointer;
}

.use-monthly-budget button:hover {
  cursor: pointer;
  background-color: #7a7e7a;
  color: #fff;
}
</style>