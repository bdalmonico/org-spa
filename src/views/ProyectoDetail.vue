<!-- <template>
    <div class="p-8 bg-gray-100">
      <div class="flex justify-between items-center mb-4">
        <h1 class="text-2xl text-blue-800">Detalhes do Proyecto</h1>
        <div class="flex gap-2">
          <button class="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600 transition-colors" @click="editarProyecto">Editar</button>
          <button class="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600 transition-colors" @click="borrarProyecto">Borrar</button>
        </div>
      </div>
      <div v-if="proyecto" class="bg-white p-6 rounded-lg shadow">
        <p class="mb-2"><strong class="text-gray-800">ID:</strong> {{ proyecto.id }}</p>
        <p class="mb-2"><strong class="text-gray-800">Nome:</strong> {{ proyecto.nombre }}</p>
        <p class="mb-2"><strong class="text-gray-800">Descrição:</strong> {{ proyecto.descripcion }}</p>
        <p class="mb-2"><strong class="text-gray-800">Cliente:</strong> {{ proyecto.clienteNombre }}</p>
        <p class="mb-2"><strong class="text-gray-800">Estado ID:</strong> {{ proyecto.estadoId }}</p>
        <p class="mb-2"><strong class="text-gray-800">Data Estimada de Início:</strong> {{ proyecto.fechaEstimadaInicio }}</p>
        <p class="mb-2"><strong class="text-gray-800">Data Estimada de Fim:</strong> {{ proyecto.fechaEstimadaFin }}</p>
        <p class="mb-2"><strong class="text-gray-800">Importe:</strong> {{ proyecto.importe }}</p>
        <p class="mb-2"><strong class="text-gray-800">Total de Horas Imputadas:</strong> {{ totalHorasImputadas || '0' }} horas</p>
      </div>
  
      <div v-if="proyecto" class="mt-6 bg-white p-6 rounded-lg shadow">
        <h2 class="text-xl text-blue-800 mb-4">Tarefas Relacionadas</h2>
        <table v-if="tareas.length" class="min-w-full bg-white border border-gray-300 rounded-lg">
          <thead>
            <tr>
              <th class="py-3 px-4 bg-blue-800 text-white text-left font-semibold border-b border-gray-300">Título</th>
              <th class="py-3 px-4 bg-blue-800 text-white text-left font-semibold border-b border-gray-300">Data Estimada Início</th>
              <th class="py-3 px-4 bg-blue-800 text-white text-left font-semibold border-b border-gray-300">Data Estimada Fim</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="tarea in tareas" :key="tarea.id" class="hover:bg-gray-100 border-b border-gray-200">
              <td class="py-2 px-4 text-gray-700">{{ tarea.nombre }}</td>
              <td class="py-2 px-4 text-gray-700">{{ tarea.fechaEstimadaInicio }}</td>
              <td class="py-2 px-4 text-gray-700">{{ tarea.fechaEstimadaFin }}</td>
            </tr>
          </tbody>
        </table>
        <p v-else class="text-gray-500">Nenhuma tarefa encontrada para este projeto.</p>
      </div>
  
      <div v-if="proyecto" class="mt-6 bg-white p-6 rounded-lg shadow">
        <h2 class="text-xl text-blue-800 mb-4">Comentários do Projeto</h2>
        <div v-if="comentarios.length" class="space-y-4">
          <div v-for="comentario in comentarios" :key="comentario.id" class="p-4 border border-gray-200 rounded-lg bg-gray-50">
            <p class="text-gray-700">{{ comentario.comentario }}</p>
            <p class="text-sm text-gray-500 mt-2">Data/Hora: {{ comentario.fechaHora }}</p>
            <p class="text-sm text-gray-500">Empleado ID: {{ comentario.empleadoId }}</p>
          </div>
        </div>
        <p v-else class="text-gray-500">Nenhum comentário encontrado para este projeto.</p>
      </div>
  
      <p v-if="loading" class="mt-4 text-gray-700">Carregando...</p>
      <p v-if="error" class="mt-4 text-red-600">{{ error }}</p>
      <button class="mt-4 bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 transition-colors" @click="$router.go(-1)">Voltar</button>
    </div>
  </template>
  
  <script>
  import axios from 'axios';
  
  export default {
    data() {
      return {
        proyecto: null,
        tareas: [],
        comentarios: [],
        totalHorasImputadas: null,
        loading: false,
        error: null,
      };
    },
    mounted() {
      this.fetchProyecto();
    },
    methods: {
      async fetchProyecto() {
        this.loading = true;
        this.error = null;
        const id = this.$route.params.id;
        try {
          const [proyectoResponse, tareasResponse, comentariosResponse, totalHorasResponse] = await Promise.all([
            axios.get(`/api/proyecto/${id}`),
            axios.get('/api/tarea'), // Busca todas as tarefas
            axios.get(`/api/comentarioproyecto/proyecto/${id}`),
            axios.get('/api/imputacion/search/total', { params: { proyectoId: id } }), // Busca o total de horas imputadas
          ]);
          this.proyecto = proyectoResponse.data;
          this.tareas = tareasResponse.data.page.filter(tarea => tarea.proyectoId === Number(id));
          this.comentarios = comentariosResponse.data.page;
          // Lê diretamente o valor numérico retornado pelo endpoint (ex.: 75.5)
          this.totalHorasImputadas = totalHorasResponse.data || 0;
        } catch (err) {
          this.error = 'Erro ao carregar o projeto, tarefas, comentários ou total de horas: ' + err.message;
        } finally {
          this.loading = false;
        }
      },
      editarProyecto() {
        console.log('Editar proyecto:', this.proyecto.id);
        // Implemente a lógica para editar
        // this.$router.push(`/proyectos/editar/${this.proyecto.id}`);
      },
      borrarProyecto() {
        console.log('Borrar proyecto:', this.proyecto.id);
        // Implemente a lógica para deletar
        // if (confirm('Tem certeza?')) { axios.delete(`/api/proyecto/${this.proyecto.id}`); }
      },
    },
  };
  </script> -->


  <template>
  <div class="p-8 bg-gray-100">
    <div class="flex justify-between items-center mb-4">
      <h1 class="text-2xl text-blue-800">Detalhes do Proyecto</h1>
      <div class="flex gap-2">
        <button class="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600 transition-colors" @click="editarProyecto">Editar</button>
        <button class="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600 transition-colors" @click="borrarProyecto">Borrar</button>
      </div>
    </div>
    <div v-if="proyecto" class="bg-white p-6 rounded-lg shadow">
      <p class="mb-2"><strong class="text-gray-800">ID:</strong> {{ proyecto.id }}</p>
      <p class="mb-2"><strong class="text-gray-800">Nome:</strong> {{ proyecto.nombre }}</p>
      <p class="mb-2"><strong class="text-gray-800">Descrição:</strong> {{ proyecto.descripcion }}</p>
      <p class="mb-2"><strong class="text-gray-800">Cliente:</strong> {{ proyecto.clienteNombre }}</p>
      <p class="mb-2"><strong class="text-gray-800">Estado ID:</strong> {{ proyecto.estadoId }}</p>
      <p class="mb-2"><strong class="text-gray-800">Data Estimada de Início:</strong> {{ proyecto.fechaEstimadaInicio }}</p>
      <p class="mb-2"><strong class="text-gray-800">Data Estimada de Fim:</strong> {{ proyecto.fechaEstimadaFin }}</p>
      <p class="mb-2"><strong class="text-gray-800">Importe:</strong> {{ proyecto.importe }}</p>
      <p class="mb-2"><strong class="text-gray-800">Total de Horas Imputadas:</strong> {{ totalHorasImputadas || '0' }} horas</p>
    </div>

    <!-- Seção de Tarefas Relacionadas -->
    <div v-if="proyecto" class="mt-6 bg-white p-6 rounded-lg shadow">
      <h2 class="text-xl text-blue-800 mb-4">Tarefas Relacionadas</h2>
      <Lista
        :itens="tareas"
        :colunas="[
          { key: 'nombre', label: 'Título' },
          { key: 'fechaEstimadaInicio', label: 'Data Estimada Início' },
          { key: 'fechaEstimadaFin', label: 'Data Estimada Fim' },
        ]"
        :loading="loading"
        :error="error"
        @item-clicked="handleTareaClicked"
      />
    </div>

    <!-- Seção de Comentários do Projeto -->
    <div v-if="proyecto" class="mt-6 bg-white p-6 rounded-lg shadow">
      <h2 class="text-xl text-blue-800 mb-4">Comentários do Projeto</h2>
      <div v-if="comentarios.length" class="space-y-4">
        <div v-for="comentario in comentarios" :key="comentario.id" class="p-4 border border-gray-200 rounded-lg bg-gray-50">
          <p class="text-gray-700">{{ comentario.comentario }}</p>
          <p class="text-sm text-gray-500 mt-2">Data/Hora: {{ comentario.fechaHora }}</p>
          <p class="text-sm text-gray-500">Empleado ID: {{ comentario.empleadoId }}</p>
        </div>
      </div>
      <p v-else class="text-gray-500">Nenhum comentário encontrado para este projeto.</p>
    </div>

    <p v-if="loading" class="mt-4 text-gray-700">Carregando...</p>
    <p v-if="error" class="mt-4 text-red-600">{{ error }}</p>
    <button class="mt-4 bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 transition-colors" @click="$router.go(-1)">Voltar</button>
  </div>
</template>

<script>
import axios from 'axios';
import Lista from '../components/Lista.vue';

export default {
  components: {
    Lista,
  },
  data() {
    return {
      proyecto: null,
      tareas: [],
      comentarios: [],
      totalHorasImputadas: null,
      loading: false,
      error: null,
    };
  },
  mounted() {
    this.fetchProyecto();
  },
  methods: {
    async fetchProyecto() {
      this.loading = true;
      this.error = null;
      const id = this.$route.params.id;
      try {
        const [proyectoResponse, tareasResponse, comentariosResponse, totalHorasResponse] = await Promise.all([
          axios.get(`/api/proyecto/${id}`),
          axios.get('/api/tarea'), // Busca todas as tarefas
          axios.get(`/api/comentarioproyecto/proyecto/${id}`),
          axios.get('/api/imputacion/search/total', { params: { proyectoId: id } }), // Busca o total de horas imputadas
        ]);
        this.proyecto = proyectoResponse.data;
        this.tareas = tareasResponse.data.page.filter(tarea => tarea.proyectoId === Number(id));
        this.comentarios = comentariosResponse.data.page;
        this.totalHorasImputadas = totalHorasResponse.data || 0;
      } catch (err) {
        this.error = 'Erro ao carregar o projeto, tarefas, comentários ou total de horas: ' + err.message;
      } finally {
        this.loading = false;
      }
    },
    handleTareaClicked(tareaId) {
      this.$router.push(`/tareas/${tareaId}`);
    },
    editarProyecto() {
      console.log('Editar proyecto:', this.proyecto.id);
      // Implemente a lógica para editar
      // this.$router.push(`/proyectos/editar/${this.proyecto.id}`);
    },
    borrarProyecto() {
      console.log('Borrar proyecto:', this.proyecto.id);
      // Implemente a lógica para deletar
      // if (confirm('Tem certeza?')) { axios.delete(`/api/proyecto/${this.proyecto.id}`); }
    },
  },
};
</script>