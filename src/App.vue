<script setup>
import Navbar from './components/Navbar.vue';
import Footer from './components/Footer.vue';
import Header from './components/Header.vue';
import { useAuthStore } from './stores/auth';

const authStore = useAuthStore();
</script>

<template>
  <div class="min-h-full">
    <header v-if="authStore.isAuthenticated">
      <Navbar/>
    </header>

    <main>
      <Header v-if="authStore.isAuthenticated"/>
      <router-view />
    </main>

    <footer v-if="authStore.isAuthenticated">
      <Footer/>
    </footer>
  </div>
</template>


