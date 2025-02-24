<!-- <template>
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
  // import { apiService } from '../services/apiService';
  
  export default {
    setup() {
      const route = useRoute();
      const proyecto = ref(null);
      const tareas = ref([]);
  
      onMounted(async () => {
        const proyectoId = route.params.id;
        const responseProyecto = await apiService.getProyectoById(1);
        proyecto.value = responseProyecto.data;
  
        const responseTareas = await apiService.getTareas(proyectoId);
        tareas.value = responseTareas.data;
      });
  
      return { proyecto, tareas };
    }
  };
  </script>
   -->

   <!-- <template>
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
        proyecto.value = await apiService.getProyectoById(route.params.id);
        tareas.value = await apiService.getTareas(route.params.id);
      });
  
      return { proyecto, tareas };
    }
  };
  </script> -->


  <template>
    <div>
      <h1>Lista de Projetos</h1>
      <ul>
        <li v-for="proyecto in proyectos" :key="proyecto.id">{{ proyecto.nombre }}</li>
      </ul>
    </div>
  </template>
  
  <script>
  import { apiService } from "../services/apiService";
  
  export default {
    data() {
      return {
        proyectos: []
      };
    },
    async created() {
      this.proyectos = await apiService.getProyectos();
    }
  };
  </script>
  