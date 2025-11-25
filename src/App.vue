<template>
  <div id="app-layout">
    
    <div class="ui inverted segment navbar">
      <div class="ui container full-width-nav-content">
        <div class="logo-area"> 
          <router-link to="/" class="item logo-image-wrapper">
            <img :src="AppLogo" alt=".NET URL Shortener Logo" class="app-logo">
          </router-link>
        </div>
        <div class="ui large secondary inverted pointing menu compact">
          
          
          
          <router-link to="/" class="item"> 
            <i class="home icon"></i>Home
          </router-link>
          
          <router-link to="/Shortener" class="item"> 
            <i class="list icon"></i>Shortener
          </router-link>
          
          <router-link v-if="authState.isLoggedIn" to="/user/current" class="item"> 
            <i class="user icon"></i>User Profile
          </router-link>

          <router-link v-if="authState.isAdmin" to="/Admin" class="item"> 
            <i class="shield alternate icon"></i>Admin
          </router-link>
          
          <router-link v-if="!authState.isLoggedIn" to="/Login" class="item">
            <i class="plus icon"></i>Login/sign up
          </router-link>

          <a v-else @click="handleLogoutWrapper" class="item" style="cursor: pointer;">
            <i class="sign-out icon"></i>Logout
          </a>

        </div>
      </div>
    </div>

    <div class="main-content">
      <router-view /> 
</div>
    
  </div>
</template>

<script setup>
import { authState, handleLogout } from './authState';
import { useRouter } from 'vue-router';
import AppLogo from './assets/dotnet-url-shortener-logo.png'; 

const router = useRouter();

const handleLogoutWrapper = () => {// hàm chuyển hướng sang đăng nhập sau khi đăng xuất
    handleLogout();
    router.push('/Login'); 
};
</script>

<style>

.ui.container.full-width-nav-content {
    display: flex; 
    justify-content: space-between; 
    align-items: center; 
    width: 90% !important; 
    margin: auto !important;
}
body {
    min-height: 100vh;
    margin: 0;
    font-family: Arial, Helvetica, sans-serif;
    background-image: 
        linear-gradient(to bottom, 
            #33B5E5 0%,    
            #2196F3 60%,  
            #F0F8FF 100%);
            
    background-size: cover;
    background-attachment: fixed;
}
.main-content {
    flex-grow: 1;
    padding-top: 20px;
    background-color: transparent !important;

    width: 90%; 
    max-width: 1200px; 
    margin-left: auto;
    margin-right: auto;
    padding-left: 1em; 
    padding-right: 1em;
}

#app-layout {
    min-height: 100vh;
    display: flex;
    flex-direction: column;
}

.main-content {
    flex-grow: 1;
    padding-top: 20px;
    background-color: transparent;
}

.ui.inverted.segment.navbar {
    background-color: #ffffff !important;
    box-shadow: 0 2px 5px rgba(0, 0, 0, 0.1);
    margin-bottom: 0 !important;
    border-radius: 0 !important;
    border: none !important;
}

.ui.large.secondary.inverted.pointing.menu.compact {
    background: none !important;
    border: none !important;
}

.logo-image-wrapper {
    display: flex !important;
    align-items: center;
    padding: 0.5em 1.14285714em !important; 
    margin-right: 20px !important; 
}

.app-logo {
    height: 40px; 
    width: auto; 
    display: block; 
}

.ui.menu .item {
    font-size: 1.1em;
    color: #555 !important; 
    font-weight: 500;
}

.ui.menu .item:hover {
    background-color: #f0f0f0 !important; 
    color: #2185d0 !important;
}

.ui.pointing.menu .active.item {
    color: #2185d0 !important;
    border-color: #2185d0 !important;
}
</style>  