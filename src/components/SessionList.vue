<template>
  <v-container>
    <!-- Кнопка для открытия модального окна -->
    <v-btn @click="dialog = true" class="mb-4">Добавить сессию</v-btn>

    <!-- Модальное окно с формой добавления сессии -->
    <v-dialog v-model="dialog" max-width="600px">
      <v-card>
        <v-card-title>
          <span class="text-h5">Добавить сессию</span>
        </v-card-title>
        <v-card-text>
          <session-form @session-added="onSessionAdded" />
        </v-card-text>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn text @click="dialog = false">Закрыть</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>

    <!-- Таблица с сессиями -->
    <v-row>
      <v-col cols="12">
        <v-data-table
          :headers="headers"
          :items="sessionsWithClients"
          class="elevation-1"
          item-value="id"
          item-key="id"
          :style="{ 'max-width': '1000px' }"
          :items-per-page="-1"
          :search="search"
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

          <template v-slot:item.start_time="{ item }">
            {{ formatDate(item.start_time) }}
          </template>

          <template v-slot:item.status="{ item }">
            <v-autocomplete
              v-model="item.status"
              :items="statuses"
              item-value="value"
              item-title="title"
              variant="underlined"
              @update:model-value="updateSessionStatus(item)"
            ></v-autocomplete>
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
import SessionForm from "./SessionForm.vue";
import { format, parseISO } from "date-fns";

interface ISession {
  id: number;
  client_id: number;
  start_time: string;
  duration: number;
  cost: number;
}

interface IClient {
  id: number;
  name: string;
}

// Состояние модального окна
const dialog = ref(false);

// Заголовки таблицы
const headers = [
  { title: "Клиент", value: "clientName" }, // Отображаем ФИО клиента
  { title: "Время начала", value: "start_time" },
  { title: "Длительность, мин", value: "duration" },
  { title: "Стоимость, руб", value: "cost" },
  { title: "Статус записи", value: "status" },
  { title: "Действия", value: "actions" },
];

const statuses = [
  { value: "Scheduled", title: "Запланирована" },
  { value: "Canceled", title: "Отменена" },
  { value: "Completed", title: "Завершена" },
];

const sessions = ref<ISession[]>([]);
const clients = ref<IClient[]>([]);
const sessionsWithClients = ref([]);

const search = ref("");

// Метод для обновления статуса сессии
const updateSessionStatus = async (item) => {
  try {
    const response = await fetch(
      `http://localhost:3000/sessions/${item.id}/status`,
      {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ status: item.status }), // Отправляем новый статус
      }
    );

    if (!response.ok) {
      throw new Error("Ошибка обновления статуса");
    }
  } catch (error) {
    console.error("Ошибка при обновлении статуса сессии:", error);
  }
};

// Метод для загрузки списка сессий и клиентов
const loadSessionsAndClients = async () => {
  try {
    const [sessionsResponse, clientsResponse] = await Promise.all([
      fetch("http://localhost:3000/sessions"), // Запрос к серверу для сессий
      fetch("http://localhost:3000/clients"), // Запрос к серверу для клиентов
    ]);

    sessions.value = await sessionsResponse.json();
    clients.value = await clientsResponse.json();

    // Создаём массив сессий с добавлением ФИО клиента
    sessionsWithClients.value = sessions.value.map((session) => {
      const client = clients.value.find((c) => c.id === session.client_id);
      return {
        ...session,
        clientName: client ? client.name : "Неизвестно",
      };
    });
  } catch (error) {
    console.error("Error loading sessions or clients:", error);
  }
};

// Загрузка данных при монтировании компонента
onMounted(() => {
  loadSessionsAndClients();
});

// Метод форматирования даты и времени
const formatDate = (dateString: string) => {
  try {
    const parsedDate = parseISO(dateString); // Парсим строку в формат даты
    return format(parsedDate, "dd.MM.yyyy HH:mm"); // Форматируем в человеко-читаемый формат
  } catch (error) {
    return "Неверная дата";
  }
};

// Метод для добавления сессии в список после добавления через форму
const onSessionAdded = (newSession: ISession): void => {
  const client = clients.value.find((c) => c.id === newSession.client_id);
  sessionsWithClients.value.push({
    ...newSession,
    clientName: client ? client.name : "Неизвестно",
  });
};
</script>
