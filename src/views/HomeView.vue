<script setup>
import BudgetDay from '@/components/BudgetDay.vue'
</script>

<template>
  <main>
    Weekly Budget Tracker

    <div class="weekly-budget">
      <BudgetDay v-for="day in this.days" :key="day.day" :day="day.day" :budget="day.budget" />
    </div>
    <div class="today">
      <h2>{{ currentDay().day }}</h2>
    </div>
    <div v-if="isBudgetSet" class="add-expense data-input">
      <input type="number" v-model="budget" placeholder="Add expense" />
      <button @click="addExpense" v-bind="budget">Add</button>
    </div>
    <div v-else class="add-budget data-input">
      <input type="number" v-model="budget" placeholder="Enter budget" />
      <button @click="addBudget" v-bind="budget">Add</button>
    </div>

  </main>
</template>

<script>
import budgetData from "@/data.json";

export default {
  components: {
    BudgetDay
  },

  data() {
    return {
      budget: "",
      monthlyData: budgetData,
      days: [
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
        },
      ],
    }
  },

  created() {
    if (this.isMonthlyBudgetSet) {
      this.days.forEach((day) => {
        day.budget = monthlyBudget / 7;
      });
    }
  },

  computed: {
    isBudgetSet() {
      if (this.monthlyData.budget > 0) {
        return true
      }

      let date = new Date().toISOString().slice(0, 10);
      let weeklyBudget = this.monthlyData.weeks.find((week) => {
        return week.start <= date && week.end >= date;
      });

      return weeklyBudget ? true : false;
    }
  },

  methods: {
    currentDay() {
      return this.days[(new Date().getDay() + 6) % 7];
    },
    addExpense() {
      this.currentDay().budget += this.budget;
    },
    addBudget() {
      console.log("add budget");
    }
  },
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
</style>