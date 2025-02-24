<!-- <template>
  <div>
    <h1>Lista de Projetos</h1>
    <ul>
      <li v-for="proyecto in proyectos" :key="proyecto.id">
        <router-link :to="'/proyecto/' + proyecto.id">{{ proyecto.nombre }}</router-link>
      </li>
    </ul>
  </div>
</template>

<script>
import { ref, onMounted } from 'vue';
import { apiService } from '../services/apiService';

export default {
  setup() {
    const proyectos = ref([]);

    onMounted(async () => {
      const response = await apiService.getProyectoById(1);
      proyectos.value = response.data;
    });

    return { proyectos };
  }
};
</script> -->

<template>
  <div class="p-6 text-center text-3xl font-bold">ORGANIZATE</div>
</template>