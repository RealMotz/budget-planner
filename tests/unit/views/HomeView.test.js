import { mount } from '@vue/test-utils';
import HomeView from '../../../src/views/HomeView.vue';
import { getMonthlyBudget, createDailyExpense, createWeeklyBudget } from '../../../src/services/BudgetService';
jest.mock('../../../src/services/BudgetService');

const days = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
const dayOfWeek = new Date().getDay();
const today = new Date();
const formatted = today.toLocaleString('en-CA', {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit'
});

describe('When the budget is not set', () => {
    let wrapper;
    beforeEach(() => {
        const monthlyBudget = {
            "id": 1,
            "month": today.getMonth() + 1,
            "budget": 0,
            "weeks": [
                {
                    "id": 1,
                    "start": formatted,
                    "end": formatted,
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
                }]
        };
        getMonthlyBudget.mockResolvedValue(monthlyBudget);
        wrapper = mount(HomeView);
    });

    it('Renders the current day correctly', () => {
        const today = wrapper.get('[data-test="today"]');

        expect(today.text()).toBe(days[dayOfWeek]);
    })

    it('Renders 0 yen for every day of the week', () => {
        const dailyBudgets = wrapper.findAllComponents('[data-test="daily-budget"]');
        const zeroYen = new Intl.NumberFormat('ja-JP', {
            style: 'currency',
            currency: 'JPY'
        }).format(0);

        dailyBudgets.forEach(component => {
            expect(component.find('p').text()).toBe(zeroYen)
        });
    })

    it('Asks user to input weekly budget', () => {
        const budgetDiv = wrapper.get('[data-test="add-budget"]');
        expect(budgetDiv.exists());
    })

    const cases = [
        [1000],
        [2000],
        [5000],
        [10000]
    ];
    it.each(cases)('When a budget is inputted, it updates daily budget', async (budget) => {
        const budgetDiv = wrapper.get('[data-test="add-budget"]');
        const dailyBudgets = wrapper.findAllComponents('[data-test="daily-budget"]');
        const dailyBudget = Math.round(budget/7);
        const dailyBudgetInYen = new Intl.NumberFormat('ja-JP', {
            style: 'currency',
            currency: 'JPY'
        }).format(dailyBudget);

        createWeeklyBudget.mockResolvedValue({
            "id": 1,
            "month": today.getMonth() + 1,
            "budget": 0,
            "weeks": [
                {
                    "id": 1,
                    "start": formatted,
                    "end": formatted,
                    "budget": budget,
                    "expenses": {
                        "monday": 0,
                        "tuesday": 0,
                        "wednesday": 0,
                        "thursday": 0,
                        "friday": 0,
                        "saturday": 0,
                        "sunday": 0
                    }
                }]
        })

        const input = budgetDiv.find('input');
        input.setValue(budget);
        await budgetDiv.find('button').trigger('click');

        dailyBudgets.forEach(component => {
            expect(component.find('p').text()).toBe(dailyBudgetInYen)
        });
    })
})


describe('When the budget is set', () => {
    let wrapper;
    beforeEach(() => {
        let monthlyBudget = {
            "id": 1,
            "month": today.getMonth() + 1,
            "budget": 0,
            "weeks": [
                {
                    "id": 1,
                    "start": formatted,
                    "end": formatted,
                    "budget": 1000,
                    "expenses": {
                        "monday": 0,
                        "tuesday": 0,
                        "wednesday": 0,
                        "thursday": 0,
                        "friday": 0,
                        "saturday": 0,
                        "sunday": 0
                    }
                }]
        };
        getMonthlyBudget.mockResolvedValue(monthlyBudget);
        createDailyExpense.mockResolvedValue();
        wrapper = mount(HomeView);
    });

    it('Asks user to input expenses', () => {
        const expenseDiv = wrapper.get('[data-test="add-expense"]');
        expect(expenseDiv.exists());
    })

    it('Renders budget for every day of the week', () => {
        const dailyBudget = 143;
        const dailyBudgets = wrapper.findAllComponents('[data-test="daily-budget"]');
        // budget/7 = 143
        const dailyBudgetInYen = new Intl.NumberFormat('ja-JP', {
            style: 'currency',
            currency: 'JPY'
        }).format(dailyBudget);

        dailyBudgets.forEach(component => {
            expect(component.find('p').text()).toBe(dailyBudgetInYen)
        });
    })

    const cases = [
        [100],
        [200],
        [500],
        [1000]
    ];
    it.each(cases)('When a expense is added, it is displayed on current day', async (expense) => {
        const expenseDiv = wrapper.get('[data-test="add-expense"]');
        const dailyBudgets = wrapper.findAllComponents('[data-test="daily-budget"]');
        const dailyBudget = Math.round(1000/7);
        const expenseInYen = new Intl.NumberFormat('ja-JP', {
            style: 'currency',
            currency: 'JPY'
        }).format(dailyBudget - expense);

        const input = expenseDiv.find('input');
        input.setValue(expense);
        await expenseDiv.find('button').trigger('click');

        const component = dailyBudgets.find((b) => b.find("h3").text() === days[dayOfWeek]);
        expect(component.find('p').text()).toBe(expenseInYen);
    })
})

