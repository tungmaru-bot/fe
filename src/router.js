import { createRouter, createWebHistory } from 'vue-router'
import { authState } from './authState' 

import Login from './Views/Login.vue' 
import Shortener from './Views/Shortener.vue' 
import Home from './Views/Home.vue'
//import GoogleLogin from './Views/GoogleLogin.vue'
import UserProfile from './Views/UserProfile.vue'
import Admin from './Views/Admin.vue'
import Signup from './Views/Signup.vue'
import ForgotPassword from './Views/ForgotPassword.vue'
import ResetPassword from './Views/ResetPassword.vue';

const routes = [
    {
    path: '/',
    name: '/Home',
    component: Home
    },
    {
    path: '/Login',
    name: 'Login',
    component: Login
    },
    //{
    //path: '/GoogleLogin', 
    //name: 'GoogleLogin',
    //component: GoogleLogin
    //},
    {
    path: '/user/:id', 
    name: 'UserProfile',
    component: UserProfile
    },
    {
        path: '/admin',
        name: 'Admin',
        component: Admin,
        meta: { requiresAdmin: true } 
    },
    {
    path: '/Shortener', 
    name: 'Shortener',
    component: Shortener
    },
    {
        path: '/Signup', 
        name: 'Signup',
        component: Signup
    },
    {
        path: '/forgot-password', 
        name: 'ForgotPassword',
        component: ForgotPassword
    },
    {
    path: '/reset-password/:token',
    name: 'ResetPassword',
    component: ResetPassword,
    props: true 
    }
]

const router = createRouter({
    history: createWebHistory(),
    routes
})

router.beforeEach((to, from, next) => {
    if (to.meta.requiresAdmin) {
        if (!authState.isLoggedIn || !authState.isAdmin) {
            alert('You do not have permission to access this page!');
            next('/'); 
        } else {
            next(); 
        }
    } else {
        next(); 
    }
});

export default router

