<script setup>
import Navbar from './components/Navbar.vue';
import Footer from './components/Footer.vue';
import Header from './components/Header.vue';
import { useAuthStore } from './stores/auth';

const authStore = useAuthStore();
</script>

<template>
  <div class="min-h-full">
    <header>
      <Navbar/>
    </header>

    <main>
      <Header/>
      <router-view />
    </main>

    <footer>
      <Footer/>
    </footer>
  </div>
</template>


