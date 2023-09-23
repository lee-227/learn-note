import { createApp } from 'vue';
import './style.css';
import App from './App.vue';
import 'virtual:svg-icons-register';
import globalComponent from './components/index.ts';

const app = createApp(App);
app.use(globalComponent);
app.mount('#app');
