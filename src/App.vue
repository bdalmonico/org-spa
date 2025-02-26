<!-- 20h
<template>
  <div>
    <AppHeader/>
    <div class="flex h-screen">
      <AppSidebar />
      <main class="flex-1 p-6 bg-white-300 overflow-auto">
        <router-view />
      </main>
    </div>
  </div>
</template>

<script>
import AppHeader from "./components/AppHeader.vue";
import AppSidebar from "./components/AppSideBar.vue";

export default {
  components: { AppSidebar, AppHeader }
};
</script> -->

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