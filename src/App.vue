<template>
  <v-app>
    <!-- Навигационная панель -->
    <v-app-bar app>
      <v-btn to="/" text>Клиенты</v-btn>
      <v-btn to="/sessions" text>Сессии</v-btn>
      <v-btn to="/payments" text>Оплаты</v-btn>
    </v-app-bar>

    <!-- Основной контент -->
    <v-main>
      <v-container>
        <router-view />
        <!-- Router outlet для отображения страниц -->
      </v-container>
    </v-main>
  </v-app>
</template>

<script setup lang="ts">
// Здесь можно добавить любую логику, если она понадобится для всего приложения
</script>

<style scoped>
/* Основные стили */
</style>
