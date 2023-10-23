export async function getMonthlyBudget() {
    const response = await fetch('/api/monthlyBudget');
    return await response.json();
}

export async function createWeeklyBudget(budget) {
    const response = await fetch('api/addWeeklyBudget', {
        method: 'POST',
        headers: {'Content-Type': 'application/json'},
        body: JSON.stringify({budget: budget})
    });

    return await response.json();
}