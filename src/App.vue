<script setup>
import AJROTCLogo from './assets/ajrotc/logo.svg';
import AFJROTCLogo from './assets/afjrotc/logo.svg';
</script>

<template>
    <nav>
        <router-link to="/ajrotc">
            <img :src="AJROTCLogo" alt="Army JROTC">
        </router-link>
        <router-link to="/afjrotc">
            <img :src="AFJROTCLogo" alt="Air Force JROTC">
        </router-link>
    </nav>
    <main>
        <RouterView />
    </main>
</template>

<style scoped>
nav {
    text-align: center;
}

img {
  width: 125px;
  height: 125px;
}
</style>
