<template>
  <v-container>
    <!-- Кнопка для открытия модального окна -->
    <v-btn @click="dialog = true" class="mb-4">Добавить оплату</v-btn>

    <!-- Модальное окно с формой добавления оплаты -->
    <v-dialog v-model="dialog" max-width="600px">
      <v-card>
        <v-card-title>
          <span class="text-h5">Добавить оплату</span>
        </v-card-title>
        <v-card-text>
          <payment-form @payment-added="onPaymentAdded" />
        </v-card-text>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn text @click="dialog = false">Закрыть</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>

    <!-- Таблица с оплатами -->
    <v-row>
      <v-col cols="12">
        <v-data-table
          :headers="headers"
          :items="paymentsWithClientsAndSessions"
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
              label="Поиск"
              class="mx-4"
              append-icon="mdi-magnify"
              single-line
              hide-details
            ></v-text-field>
          </template>
          <template v-slot:item.payment_date="{ item }">
            {{ formatDate(item.payment_date) }}
            <!-- Форматируем дату оплаты -->
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
import PaymentForm from "./PaymentForm.vue";
import { formatDate } from "./helpers";

// Состояние модального окна
const dialog = ref(false);

// Заголовки таблицы
const headers = ref([
  { title: "Клиент", value: "clientName" },
  { title: "Сессия", value: "session_id" },
  { title: "Сумма, руб", value: "amount" },
  { title: "Дата оплаты", value: "payment_date" },
  { title: "Действия", value: "actions" },
]);

// Данные оплат, клиентов и сессий
const payments = ref([]);
const clients = ref([]);
const sessions = ref([]);
const paymentsWithClientsAndSessions = ref([]);

// Поисковое поле
const search = ref("");

// Метод для загрузки списка оплат, клиентов и сессий
const loadPaymentsClientsSessions = async () => {
  try {
    const [paymentsResponse, clientsResponse, sessionsResponse] =
      await Promise.all([
        fetch("http://localhost:3000/payments"),
        fetch("http://localhost:3000/clients"),
        fetch("http://localhost:3000/sessions"),
      ]);

    payments.value = await paymentsResponse.json();
    clients.value = await clientsResponse.json();
    sessions.value = await sessionsResponse.json();

    // Объединяем данные оплат с клиентами и сессиями
    paymentsWithClientsAndSessions.value = payments.value.map((payment) => {
      const client = clients.value.find((c) => c.id === payment.client_id);
      const session = sessions.value.find((s) => s.id === payment.session_id);
      return {
        ...payment,
        clientName: client ? client.name : "Неизвестно",
        session_id: session ? session.id : "Не распределено",
      };
    });
  } catch (error) {
    console.error("Error loading payments, clients or sessions:", error);
  }
};

// Загрузка данных при монтировании компонента
onMounted(() => {
  loadPaymentsClientsSessions();
});

// Метод для добавления оплаты в список после добавления через форму
const onPaymentAdded = (newPayment) => {
  const client = clients.value.find((c) => c.id === newPayment.client_id);
  const session = sessions.value.find((s) => s.id === newPayment.session_id);
  paymentsWithClientsAndSessions.value.push({
    ...newPayment,
    clientName: client ? client.name : "Неизвестно",
    session_id: session ? session.id : "Не распределено",
  });
};
</script>

<style scoped>
/* Дополнительные стили */
</style>
