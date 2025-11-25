import { createApp } from 'vue'
import './style.css'
import App from './App.vue'
import router from './router' 


import $ from 'jquery' 
window.jQuery = window.$ = $ 


import 'semantic-ui-css/semantic.css'



createApp(App)
    .use(router) 
    .mount('#app')