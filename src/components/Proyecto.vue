<script>
import { ref, onMounted } from 'vue';
import { apiService } from '../services/apiService';

export default {
  setup() {
    const proyecto = ref(null);
    const id = 1; // ID do projeto que deseja buscar

    onMounted(async () => {
      proyecto.value = await apiService.getProyectoById(id);
    });

    return { proyecto };
  }
};
</script>

<template>
  <div v-if="proyecto">
    <h2>{{ proyecto.nombre }}</h2>
    <p><strong>ID:</strong> {{ proyecto.id }}</p>
    <p><strong>Descrição:</strong> {{ proyecto.descripcion }}</p>
  </div>
  <p v-else>Carregando projeto...</p>
</template>
