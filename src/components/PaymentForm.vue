<template>
  <v-container>
    <v-row>
      <v-col>
        <!-- v-autocomplete для выбора клиента -->
        <v-autocomplete
          v-model="formData.client_id"
          :items="clients"
          item-value="id"
          item-title="name"
          label="Клиент"
          @update:model-value="filterSessionsByClient"
        ></v-autocomplete>
      </v-col>
    </v-row>
    <v-row>
      <v-col>
        <!-- v-autocomplete для выбора сессии -->
        <v-autocomplete
          v-model="formData.session_id"
          :items="filteredSessions"
          item-value="id"
          item-title="start_time"
          label="Сессия"
          :disabled="!formData.client_id"
        ></v-autocomplete>
      </v-col>
    </v-row>
    <v-row>
      <v-col>
        <v-text-field
          label="Сумма, руб"
          v-model="formData.amount"
          type="number"
        ></v-text-field>
      </v-col>
    </v-row>

    <v-row>
      <v-col cols="3">
        <v-btn @click="submitPayment">Добавить</v-btn>
      </v-col>
    </v-row>
  </v-container>
</template>

<script setup lang="ts">
import { reactive, ref, onMounted, defineEmits } from "vue";
import { formatDate } from "./helpers";

interface IPaymentFormItem {
  client_id: number | null;
  session_id: number | null;
  amount: number | null;
}

interface IClient {
  id: number;
  name: string;
}

interface ISession {
  id: number;
  client_id: number;
  start_time: string;
}

const initialData = (): IPaymentFormItem => ({
  client_id: null,
  session_id: null,
  amount: null,
});

const formData = reactive<IPaymentFormItem>(initialData());
const clients = ref<IClient[]>([]);
const sessions = ref<ISession[]>([]);
const filteredSessions = ref<ISession[]>([]);

// Используем defineEmits для отправки события
const emit = defineEmits(["payment-added"]);

// Загрузка списка клиентов и сессий
const loadClientsAndSessions = async () => {
  try {
    const [clientsResponse, sessionsResponse] = await Promise.all([
      fetch("http://localhost:3000/clients"),
      fetch("http://localhost:3000/sessions"),
    ]);

    clients.value = await clientsResponse.json();
    sessions.value = await sessionsResponse.json();
  } catch (error) {
    console.error("Error loading clients or sessions:", error);
  }
};

// Метод для фильтрации сессий по выбранному клиенту
const filterSessionsByClient = () => {
  if (formData.client_id) {
    filteredSessions.value = sessions.value
      .filter((session) => session.client_id === formData.client_id)
      .map((session) => ({
        ...session,
        start_time: formatDate(session.start_time),
      }));
  } else {
    filteredSessions.value = [];
  }
};

// Загрузка данных при монтировании компонента
onMounted(() => {
  loadClientsAndSessions();
});

// Функция для отправки данных оплаты на сервер
const submitPayment = async () => {
  try {
    const paymentData = {
      client_id: formData.client_id, // Выбираем ID клиента из объекта
      session_id: formData.session_id, // Выбираем ID сессии из объекта
      amount: formData.amount,
    };

    const response = await fetch("http://localhost:3000/payments", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(paymentData), // Отправляем данные на сервер
    });

    const newPayment = await response.json(); // Получаем добавленную оплату

    // Отправляем событие "payment-added" с данными новой оплаты
    emit("payment-added", newPayment);

    // Очищаем форму
    Object.assign(formData, initialData());
  } catch (error) {
    console.error("Error adding payment:", error);
  }
};
</script>

<style scoped></style>
