<template>
    <div v-if="proyecto">
      <h1>{{ proyecto.nombre }}</h1>
      <p>{{ proyecto.descripcion }}</p>
  
      <h2>Tarefas</h2>
      <ul>
        <li v-for="tarea in tareas" :key="tarea.id">
          {{ tarea.nombre }} - {{ tarea.estado }}
        </li>
      </ul>
    </div>
  </template>
  
  <script>
  import { ref, onMounted } from 'vue';
  import { useRoute } from 'vue-router';
  import { apiService } from '../services/apiService';
  
  export default {
    setup() {
      const route = useRoute();
      const proyecto = ref(null);
      const tareas = ref([]);
  
      onMounted(async () => {
        const proyectoId = route.params.id;
        const responseProyecto = await apiService.getProyecto(proyectoId);
        proyecto.value = responseProyecto.data;
  
        const responseTareas = await apiService.getTareas(proyectoId);
        tareas.value = responseTareas.data;
      });
  
      return { proyecto, tareas };
    }
  };
  </script>
  