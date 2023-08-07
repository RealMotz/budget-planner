<template>
    <div class="day">
        <h3>{{ day }}</h3>
        <p>{{ budget }}</p>
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
</style>