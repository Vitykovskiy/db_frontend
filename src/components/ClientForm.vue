<template>
  <v-container>
    <v-row>
      <v-col>
        <v-text-field label="ФИО" v-model="formData.name"></v-text-field>
      </v-col>
    </v-row>
    <v-row>
      <v-col>
        <v-text-field
          label="Контактные данные"
          v-model="formData.contacts"
        ></v-text-field>
      </v-col>
    </v-row>
    <v-row>
      <v-col>
        <v-text-field
          label="Комментарий"
          v-model="formData.comments"
        ></v-text-field>
      </v-col>
    </v-row>
    <v-row>
      <v-col cols="3">
        <v-btn @click="submitClient">Добавить</v-btn>
      </v-col>
    </v-row>
  </v-container>
</template>

<script setup lang="ts">
import { reactive, defineEmits } from "vue";

interface IClientFormItem {
  name: string | null;
  contacts: string | null;
  comments: string | null;
}

const initialData = (): IClientFormItem => ({
  name: null,
  contacts: null,
  comments: null,
});

const formData = reactive<IClientFormItem>(initialData());

// Используем defineEmits для отправки события
const emit = defineEmits(["client-added"]);

// Функция для отправки данных клиента на сервер
const submitClient = async () => {
  console.log("submitClient", formData);
  try {
    const response = await fetch("http://localhost:3000/clients", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(formData), // Отправляем данные на сервер
    });

    const newClient = await response.json(); // Получаем добавленного клиента

    // Отправляем событие "client-added" с данными нового клиента
    emit("client-added", newClient);

    // Очищаем форму
    Object.assign(formData, initialData());
  } catch (error) {
    console.error("Error adding client:", error);
  }
};
</script>

<style scoped></style>
