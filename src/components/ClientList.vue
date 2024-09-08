<template>
  <v-container>
    <!-- Кнопка для открытия модального окна -->

    <v-btn @click="dialog = true" class="mb-4">Добавить клиента</v-btn>

    <!-- Модальное окно с формой добавления клиента -->
    <v-dialog v-model="dialog" max-width="600px">
      <v-card>
        <v-card-title>
          <span class="text-h5">Добавить клиента</span>
        </v-card-title>
        <v-card-text>
          <client-form @client-added="onClientAdded" />
          <!-- Форма добавления клиента -->
        </v-card-text>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn text @click="dialog = false">Закрыть</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>

    <!-- Таблица с клиентами -->
    <v-row>
      <v-col cols="12">
        <v-data-table
          :headers="headers"
          :items="clients"
          class="elevation-1"
          item-value="id"
          item-key="id"
          :items-per-page="-1"
          :search="search"
          :style="{ 'max-width': '1000px' }"
        >
          <template v-slot:top>
            <v-text-field
              v-model="search"
              label="Search"
              class="mx-4"
              append-icon="mdi-magnify"
              single-line
              hide-details
            ></v-text-field>
          </template>
          <template v-slot:item.debt="{ item }">
            <span
              :style="{
                color:
                  item.debt > 0 ? 'green' : item.debt < 0 ? 'red' : 'black',
              }"
            >
              {{ item.debt }}
            </span>
          </template>
          <template v-slot:item.actions>
            <v-btn variant="flat" icon="mdi-pencil" />
            <v-btn variant="flat" icon="mdi-delete" />
          </template>
          <template v-slot:bottom></template>
        </v-data-table>
      </v-col>
    </v-row>
  </v-container>
</template>

<script setup lang="ts">
import { ref, onMounted } from "vue";
import ClientForm from "./ClientForm.vue";

// Состояние модального окна
const dialog = ref(false);

// Заголовки таблицы
const headers = [
  { title: "ФИО", value: "name" },
  { title: "Контактные данные", value: "contacts" },
  { title: "Комментарий", value: "comments" },
  { title: "Долг/переплата", value: "debt" },
  { title: "Действия", value: "actions" },
];

// Данные клиентов
const clients = ref([]);

// Поисковое поле
const search = ref("");

// Метод для загрузки списка клиентов с backend
const loadClients = async () => {
  try {
    const response = await fetch("http://localhost:3000/clients"); // Запрос к серверу
    clients.value = await response.json();
  } catch (error) {
    console.error("Error loading clients:", error);
  }
};

// Загрузка списка клиентов при монтировании компонента
onMounted(() => {
  loadClients();
});

// Метод для добавления клиента в список после добавления через форму
const onClientAdded = (newClient) => {
  clients.value.push(newClient);
};
</script>

<style scoped>
/* Дополнительные стили */
</style>
