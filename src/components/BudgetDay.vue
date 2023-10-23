<template>
    <div class="day">
        <h3>{{ day }}</h3>
        <p :class="{ 'over-budget': overBudget }">{{ formatBudget }}</p>
    </div>
</template>

<script>
export default {
    props: {
        day: {
            type: String,
            required: true
        },
        budget: {
            type: Number,
            required: true
        }
    },

    computed: {
        formatBudget() {
            return new Intl.NumberFormat('ja-JP', {
                style: 'currency',
                currency: 'JPY'
            }).format(this.budget);
        },

        overBudget() {
            return this.budget < 0;
        }
    }
}
</script>

<style scoped>
.day {
    border: 1px solid #ccc;
    padding: 1rem;
    text-align: center;
    width: 100%;
}

.over-budget {
    color: red;
}

</style>