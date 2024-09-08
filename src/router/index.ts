import { createRouter, createWebHistory } from "vue-router";
import ClientList from "../components/ClientList.vue";
import SessionList from "../components/SessionList.vue"; // Импортируем компонент для сессий
import PaymentList from "../components/PaymentList.vue"; // Импортируем компонент для оплат

const routes = [
  { path: "/", component: ClientList }, // Маршрут для списка клиентов
  { path: "/sessions", component: SessionList }, // Маршрут для списка сессий
  { path: "/payments", component: PaymentList }, // Маршрут для списка оплат
];

const router = createRouter({
  history: createWebHistory(),
  routes,
});

export default router;
