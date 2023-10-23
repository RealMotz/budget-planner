const fs = require('fs');
const path = require('path');
const budgetFilePath = path.join(path.dirname(require.main.filename), 'data', 'budget.json');


function fetchAllBudget(callback) {
    fs.readFile(budgetFilePath, (err, file) => {
        if (err) {
            callback([]);
        }
        callback(JSON.parse(file));
    });
};

function fetchBudgetByMonth(callback) {
    if (!fs.existsSync(budgetFilePath)) {
        const newMonthlyBudget = createMonthlyBudget();
        const newBudget = { months: [newMonthlyBudget] };
        fs.writeFile(budgetFilePath, JSON.stringify(newBudget), (error) => {
            if (error) {
                callback(error);
            }

            callback(newMonthlyBudget);
        });
    } else {
        fs.readFile(budgetFilePath, (err, file) => {
            if (err) {
                return callback([]);
            }
            const monthlyBudget = JSON.parse(file);
            const currentMonthBudget = monthlyBudget.months.find((month) => {
                return month.month === new Date().toLocaleString("default", { month: "numeric" })
            });

            callback(currentMonthBudget);
        });
    }
};

function createMonthlyBudget() {
    const start = new Date();
    const end = new Date();
    start.setDate(start.getDate() - start.getDay());
    end.setDate(start.getDate() + 6);
    const currentMonth = new Date().toLocaleString("default", { month: "numeric" });

    const newMonthlyBudget = {
        "id": 1,
        "month": currentMonth,
        "budget": 0,
        "weeks": [
            {
                "id": 1,
                "start": start.toLocaleString('en-CA', {
                    year: 'numeric',
                    month: '2-digit',
                    day: '2-digit'
                }),
                "end": end.toLocaleString('en-CA', {
                    year: 'numeric',
                    month: '2-digit',
                    day: '2-digit'
                }),
                "budget": 0,
                "expenses": {
                    "monday": 0,
                    "tuesday": 0,
                    "wednesday": 0,
                    "thursday": 0,
                    "friday": 0,
                    "saturday": 0,
                    "sunday": 0
                }
            }
        ]
    }
    return newMonthlyBudget;
}


class Budget {
    constructor(weeklyBudget) {
        this.weeklyBudget = weeklyBudget;
    }

    createWeeklyBudget(callback) {
        fs.readFile(budgetFilePath, (error, file) => {
            if (error) {
                return callback(error);
            }

            const budget = JSON.parse(file);
            const currentMonth = new Date().toLocaleString("default", { month: "numeric" });
            const currentMonthIndex = budget.months.findIndex(i => i.month == currentMonth);

            const start = new Date();
            const end = new Date();
            start.setDate(start.getDate() - start.getDay());
            end.setDate(start.getDate() + 6);

            if (currentMonthIndex === -1) {
                budget.months.push(createMonthlyBudget());
            } else {
                const today = new Date();
                let currentWeek = budget.months[currentMonthIndex].weeks.find(week => new Date(week.start) <= today && new Date(week.end) >= today);

                if (!currentWeek) {
                    currentWeek = {
                        "id": budget.months[currentMonthIndex].weeks.length + 1,
                        "start": start.toLocaleString('en-CA', {
                            year: 'numeric',
                            month: '2-digit',
                            day: '2-digit'
                        }),
                        "end": end.toLocaleString('en-CA', {
                            year: 'numeric',
                            month: '2-digit',
                            day: '2-digit'
                        }),
                        "budget": this.weeklyBudget,
                        "expenses": {
                            "monday": 0,
                            "tuesday": 0,
                            "wednesday": 0,
                            "thursday": 0,
                            "friday": 0,
                            "saturday": 0,
                            "sunday": 0
                        }
                    };
                    budget.months[currentMonthIndex].weeks.push(currentWeek);
                } else {
                    const weekIndex = budget.months[currentMonthIndex].weeks.findIndex(week => week.id === currentWeek.id);
                    currentWeek.budget = this.weeklyBudget;
                    budget.months[currentMonthIndex].weeks[weekIndex] = currentWeek;
                }
            }

            fs.writeFile(budgetFilePath, JSON.stringify(budget), error => {
                if (error) {
                    callback(error);
                }
            })
        })
    }
}

module.exports = {
    fetchAllBudget,
    fetchBudgetByMonth,
    Budget
};