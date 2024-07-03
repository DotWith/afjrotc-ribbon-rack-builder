<template>
    <div>
        <header>
            <h1>Air Force JROTC</h1>
            <h2>Order of Precedence</h2>
        </header>

        <main>
            <RackBuilder folder="afjrotc" />
        </main>
    </div>
</template>

<script setup>
import RackBuilder from './components/RackBuilder.vue';
</script>

<style scoped>
header {
    text-align: center;
    letter-spacing: normal;
    color: #0e172d;
}

header img {
    width: 125px;
    height: 125px;
}

header h2 {
    font-size: medium;
    margin-bottom: 30px;
}
</style>