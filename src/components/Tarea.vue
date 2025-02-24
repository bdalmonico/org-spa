<script>
import { ref, onMounted } from 'vue';
import { apiService } from '../services/apiService';

export default {
  setup() {
    const tarea = ref(null);
    const id = 1; // ID do tarea que deseja buscar

    onMounted(async () => {
      tarea.value = await apiService.getTareaById(id);
    });

    return { tarea };
  }
};
</script>

<template>
  <div v-if="tarea">
    <h2>{{ tarea.nombre }}</h2>
    <p><strong>ID:</strong> {{ tarea.id }}</p>
    <p><strong>Descrição:</strong> {{ tarea.descripcion }}</p>
  </div>
  <p v-else>Carregando tarea...</p>
</template>
