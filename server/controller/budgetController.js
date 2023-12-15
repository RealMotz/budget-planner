const { fetchBudgetByMonth, fetchAllBudget, Budget, Expense } = require('../model/budget');

exports.fetchMonthlyBudget = (req, res, next) => {
    fetchBudgetByMonth((budget, error) => {
        if(error) {
            res.status(404).json({ message: error.message });
        }
        res.status(200).json(budget);
    })
};

exports.createWeeklyBudget = (req, res, next) => {
    const weeklyBudget = req.body.budget;
    const budget = new Budget(weeklyBudget);
    budget.createWeeklyBudget((error) => {
        res.writeHead(400, { 'Content-Type': 'text/plain' });
        res.end(error.message);
        return;
    });
    res.status(200).json({ message: 'Budget Created!' })
}

exports.createDailyExpense = (req, res, next) => {
    const expense = req.body.expense;
    Expense.add(expense, (error) => {
        res.writeHead(400, { 'Content-Type': 'text/plain' });
        res.end(error.message);
        return;
    });
    res.status(200).json({ message: 'Expense Added!' })
}
