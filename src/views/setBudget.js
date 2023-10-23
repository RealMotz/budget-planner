import { findCurrentWeek, monthlyBudget, budget } from './HomeView.vue';

export function setBudget() {
const weeklyBudget = findCurrentWeek(monthlyBudget.value.weeks);
if (!weeklyBudget) {
budget.value = null;
return;
}

budget.value = weeklyBudget.budget;
}
