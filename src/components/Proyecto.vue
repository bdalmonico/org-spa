<!-- <script>
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
    <p><strong>Importe:</strong>{{ proyecto.importe }}</p>
  </div>
  <p v-else>Carregando projeto...</p>
</template> -->


<template>
  <div v-if="proyecto">
    <h2>{{ proyecto.nombre }}</h2>
    <p><strong>ID:</strong> {{ proyecto.id }}</p>
    <p><strong>Descrição:</strong> {{ proyecto.descripcion }}</p>
    <p><strong>Importe:</strong> {{ proyecto.importe }}</p>
  </div>
  <p v-else>Carregando projeto...</p>
</template>

<script>
import { ref, onMounted } from 'vue';
import { apiService } from '../services/apiService';
import { useRoute } from 'vue-router';

export default {
  setup() {
    const proyecto = ref(null);
    const route = useRoute();
    
    onMounted(async () => {
      proyecto.value = await apiService.getProyectoById(route.params.id);
    });

    return { proyecto };
  }
};
</script>