const { json } = require('express');
const fs = require('fs');
const path = require('path');
const budgetFilePath = path.join(path.dirname(require.main.filename), 'data', 'budget.json');

module.exports = class Budget {
    constructor(weeklyBudget) {
        this.weeklyBudget = weeklyBudget;
    }

    static fetchAll(callback) {
        fs.readFile(budgetFilePath, (err, file) => {
            if (err) {
                callback([]);
            }
            callback(JSON.parse(file));
        })
    }

    static fetchByMonth(callback) {
        fs.readFile(budgetFilePath, (err, file) => {
            if (err) {
                callback([]);
            }
            const monthlyBudget = JSON.parse(file);
            const currentMonthBudget = monthlyBudget.months.find((month) => {
                return month.month === new Date().toLocaleString("default", { month: "numeric" })
            });
            callback(currentMonthBudget);
        })
    }

    createWeeklyBudget(callback) {
        fs.readFile(budgetFilePath, (err, file) => {
            const budget = JSON.parse(file);
            if (err || !budget) {
                callback(err);
            }

            const currentMonth = new Date().toLocaleString("default", { month: "numeric" });
            const currentMonthIndex = budget.months.findIndex(i => i.month == currentMonth);

            const start = new Date();
            const end = new Date();
            start.setDate(start.getDate() - start.getDay());
            end.setDate(start.getDate() + 6);

            if (currentMonthIndex === -1) {
                const newMonthlyBudget = {
                    "id": budget.length + 1,
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
                        }
                    ]
                }
                budget.months.push(newMonthlyBudget);
            } else {
                const today = new Date().toISOString().slice(0, 10);
                let currentWeek = budget.months[currentMonthIndex].weeks.find(week => week.start <= today && week.end >= today);

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

            fs.writeFile(budgetFilePath, JSON.stringify(budget), err => {
                if(err) {
                    callback(err);
                }
            })
        })
    }
}