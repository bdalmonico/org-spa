<!-- <template>
    <div class="p-6 bg-white shadow-md rounded-lg">
      <h1 class="text-2xl font-bold text-gray-800">📁 Lista de Proyectos</h1>
      <ul class="mt-4 space-y-3">
        <li v-for="proyecto in proyectos" :key="proyecto.id" class="p-4 bg-gray-50 rounded-lg shadow-sm">
          <p class="text-lg font-semibold">{{ proyecto.nombre }}</p>
          <p class="text-gray-600">{{ proyecto.descripcion }}</p>
        </li>
      </ul>
    </div>
  </template>
  
  <script>
  import { ref, onMounted } from "vue";
  import { apiService } from "../services/apiService";
  
  export default {
    setup() {
      const proyectos = ref([]);
  
      onMounted(async () => {
        proyectos.value = await apiService.getProyectoById(2);
      });
  
      return { proyectos };
    },
  };
  </script>
   -->

   <template>
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
        proyectos.value = await apiService.getProyectos();
      });
  
      return { proyectos };
    }
  };
  </script>