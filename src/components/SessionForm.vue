<template>
  <v-container>
    <v-row>
      <v-col>
        <v-autocomplete
          v-model="formData.client_id"
          :items="clients"
          item-value="id"
          item-title="name"
          label="Клиент"
        ></v-autocomplete>
      </v-col>
    </v-row>
    <v-row>
      <v-col>
        <v-text-field
          label="Время начала"
          v-model="formData.start_time"
          type="datetime-local"
        ></v-text-field>
      </v-col>
    </v-row>
    <v-row>
      <v-col>
        <v-text-field
          label="Длительность, мин"
          v-model="formData.duration"
          type="number"
        ></v-text-field>
      </v-col>
    </v-row>
    <v-row>
      <v-col>
        <v-text-field
          label="Стоимост, руб"
          v-model="formData.cost"
          type="number"
        ></v-text-field>
      </v-col>
    </v-row>
    <v-row>
      <v-col cols="3">
        <v-btn @click="submitSession">Добавить</v-btn>
      </v-col>
    </v-row>
  </v-container>
</template>
<script setup lang="ts">
import { ref, reactive, defineEmits, onMounted } from "vue";

interface ISessionFormItem {
  client_id: number | null;
  start_time: string | null;
  duration: number | null;
  cost: number | null;
}

interface IClient {
  id: number;
  name: string;
}

const initialData = (): ISessionFormItem => ({
  client_id: null,
  start_time: null,
  duration: null,
  cost: null,
});

const formData = reactive<ISessionFormItem>(initialData());
const clients = ref<IClient[]>([]);

const emit = defineEmits(["session-added"]);

// Функция для загрузки списка клиентов с сервера
const loadClients = async () => {
  try {
    const response = await fetch("http://localhost:3000/clients");
    clients.value = await response.json();
  } catch (error) {
    console.error("Error loading clients:", error);
  }
};

// Загрузим клиентов при монтировании компонента
onMounted(() => {
  loadClients();
});

// Функция для отправки данных сессии на сервер
const submitSession = async () => {
  try {
    const sessionData = {
      client_id: formData.client_id, // Выбираем ID клиента из объекта
      start_time: formData.start_time,
      duration: formData.duration,
      cost: formData.cost,
    };

    const response = await fetch("http://localhost:3000/sessions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(sessionData), // Отправляем данные на сервер
    });

    const newSession = await response.json(); // Получаем добавленную сессию

    // Отправляем событие "session-added" с данными новой сессии
    emit("session-added", newSession);

    // Очищаем форму
    Object.assign(formData, initialData());
  } catch (error) {
    console.error("Error adding session:", error);
  }
};
</script>

<style scoped></style>
