<template>
  <div class="flex flex-col h-screen">
    <Header />
    <div class="flex flex-1">
      <Sidebar />
      <router-view class="flex-1 p-8 bg-gray-100" />
    </div>
  </div>
</template>

<script>
import Header from './components/AppHeader.vue';
import Sidebar from './components/AppSidebar.vue';

export default {
  components: {
    Header,
    Sidebar,
  },
};
</script>