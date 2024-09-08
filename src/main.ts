import { createApp } from "vue";
import App from "./App.vue";
import { createVuetify } from "vuetify";
import * as components from "vuetify/components";
import * as directives from "vuetify/directives";
import router from "./router"; // Импорт роутера

import "vuetify/styles"; // Импортируем стили Vuetify
import "@mdi/font/css/materialdesignicons.css"; // Импортируем иконки mdi

const vuetify = createVuetify({
  components,
  directives,
  icons: {
    defaultSet: "mdi", // Указываем иконки по умолчанию
  },
});

const app = createApp(App);
app.use(vuetify);
app.use(router); // Подключаем роутер к приложению
app.mount("#app");
