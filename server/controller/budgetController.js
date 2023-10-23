const { fetchBudgetByMonth, fetchAllBudget, Budget } = require('../model/budget');

exports.getMonthlyBudget = (req, res, next) => {
    fetchBudgetByMonth((budget) => {
        console.log(budget);
        res.json(budget);
    })
};

exports.getAllMonthlyBudget = (req, res, next) => {
    fetchAllBudget((budget) => {
        console.log(budget);
        res.json(budget);
    })
}

exports.createWeeklyBudget = (req, res, next) => {
    const weeklyBudget = req.body.budget;
    const budget = new Budget(weeklyBudget);
    budget.createWeeklyBudget((err) => {
        res.writeHead(401, { 'Content-Type': 'text/plain' });
        res.end(err.message);
        return;
    });
    res.status(200).json({ message: 'Budget Created!' })
}