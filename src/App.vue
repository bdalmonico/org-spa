<!-- <script>
import Proyecto from './components/Proyecto.vue';

import AppSidebar from "./components/AppSideBar.vue";

export default {
  components: {
    AppSidebar,
    Proyecto
  }
};
</script>


<template>
  <div class="flex h-screen">
    <AppSidebar />
    <main class="flex-1 p-6 bg-gray-100 overflow-auto">
      <router-view>
     
      </router-view>
    </main>
  </div>
 
</template> -->


<template>
  <div class="flex h-screen">
    <AppSidebar />
    <main class="flex-1 p-6 bg-gray-100 overflow-auto">
      <router-view />
    </main>
  </div>
</template>

<script>
import AppSidebar from "./components/AppSideBar.vue";

export default {
  components: { AppSidebar }
};
</script>