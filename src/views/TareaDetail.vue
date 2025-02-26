<!-- <template>
    <div class="tarea-detalhes">
      <h1>Detalhes da Tarea</h1>
      <div v-if="tarea">
        <p><strong>ID:</strong> {{ tarea.id }}</p>
        <p><strong>Nome:</strong> {{ tarea.nombre }}</p>
        <p><strong>Descrição:</strong> {{ tarea.descripcion }}</p>
        <p><strong>Estado ID:</strong> {{ tarea.estadoId }}</p>
        <p><strong>Proyecto ID:</strong> {{ tarea.proyectoId }}</p>
        <p><strong>Data Estimada de Início:</strong> {{ tarea.fechaEstimadaInicio }}</p>
        <p><strong>Data Estimada de Fim:</strong> {{ tarea.fechaEstimadaFin }}</p>
        <p><strong>Data Real de Início:</strong> {{ tarea.fechaRealInicio }}</p>
        <p><strong>Data Real de Fim:</strong> {{ tarea.fechaRealFin }}</p>
      </div>
      <p v-if="loading">Carregando...</p>
      <p v-if="error">{{ error }}</p>
      <button @click="$router.go(-1)">Voltar</button>
    </div>
  </template>
  
  <script>
  import axios from 'axios';
  
  export default {
    data() {
      return {
        tarea: null,
        loading: false,
        error: null,
      };
    },
    mounted() {
      this.fetchTarea();
    },
    methods: {
      async fetchTarea() {
        this.loading = true;
        this.error = null;
        const id = this.$route.params.id;
        try {
          const response = await axios.get(`/api/tarea/${id}`);
          this.tarea = response.data; // Retorna diretamente o TareaDTO
        } catch (err) {
          this.error = 'Erro ao carregar a tarea: ' + err.message;
        } finally {
          this.loading = false;
        }
      },
    },
  };
  </script>
  
  <style scoped>
  .tarea-detalhes {
    padding: 2rem;
  }
  p {
    margin: 0.5rem 0;
  }
  button {
    margin-top: 1rem;
    padding: 0.5rem 1rem;
    background-color: #333;
    color: white;
    border: none;
    border-radius: 4px;
    cursor: pointer;
  }
  button:hover {
    background-color: #555;
  }
  </style> -->

  <template>
    <div class="p-8 bg-gray-100">
      <div class="flex justify-between items-center mb-4">
        <h1 class="text-2xl text-blue-800">Detalhes da Tarea</h1>
        <div class="flex gap-2">
          <button class="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600 transition-colors" @click="editarTarea">Editar</button>
          <button class="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600 transition-colors" @click="borrarTarea">Borrar</button>
        </div>
      </div>
      <div v-if="tarea" class="bg-white p-6 rounded-lg shadow">
        <p class="mb-2"><strong class="text-gray-800">ID:</strong> {{ tarea.id }}</p>
        <p class="mb-2"><strong class="text-gray-800">Nome:</strong> {{ tarea.nombre }}</p>
        <p class="mb-2"><strong class="text-gray-800">Descrição:</strong> {{ tarea.descripcion }}</p>
        <p class="mb-2"><strong class="text-gray-800">Estado ID:</strong> {{ tarea.estadoId }}</p>
        <p class="mb-2"><strong class="text-gray-800">Proyecto ID:</strong> {{ tarea.proyectoId }}</p>
        <p class="mb-2"><strong class="text-gray-800">Data Estimada de Início:</strong> {{ tarea.fechaEstimadaInicio }}</p>
        <p class="mb-2"><strong class="text-gray-800">Data Estimada de Fim:</strong> {{ tarea.fechaEstimadaFin }}</p>
        <p class="mb-2"><strong class="text-gray-800">Data Real de Início:</strong> {{ tarea.fechaRealInicio }}</p>
        <p class="mb-2"><strong class="text-gray-800">Data Real de Fim:</strong> {{ tarea.fechaRealFin }}</p>
      </div>
  
      <!-- Seção de Comentários da Tarefa -->
      <div v-if="tarea" class="mt-6 bg-white p-6 rounded-lg shadow">
        <h2 class="text-xl text-blue-800 mb-4">Comentários da Tarea</h2>
        <div v-if="comentarios.length" class="space-y-4">
          <div v-for="comentario in comentarios" :key="comentario.id" class="p-4 border border-gray-200 rounded-lg bg-gray-50">
            <p class="text-gray-700">{{ comentario.comentario }}</p>
            <p class="text-sm text-gray-500 mt-2">Data/Hora: {{ comentario.fechaHora }}</p>
            <p class="text-sm text-gray-500">Empleado ID: {{ comentario.empleadoId }}</p>
          </div>
        </div>
        <p v-else class="text-gray-500">Nenhum comentário encontrado para esta tarefa.</p>
      </div>
  
      <!-- Seção de Imputações de Horas -->
      <div v-if="tarea" class="mt-6 bg-white p-6 rounded-lg shadow">
        <h2 class="text-xl text-blue-800 mb-4">Imputações de Horas</h2>
        <table v-if="imputaciones.length" class="min-w-full bg-white border border-gray-300 rounded-lg">
          <thead>
            <tr>
              <th class="py-3 px-4 bg-blue-800 text-white text-left font-semibold border-b border-gray-300">Horas Imputadas</th>
              <th class="py-3 px-4 bg-blue-800 text-white text-left font-semibold border-b border-gray-300">Data/Hora</th>
              <th class="py-3 px-4 bg-blue-800 text-white text-left font-semibold border-b border-gray-300">Comentário</th>
              <th class="py-3 px-4 bg-blue-800 text-white text-left font-semibold border-b border-gray-300">Empleado ID</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="imputacion in imputaciones" :key="imputacion.id" class="hover:bg-gray-100 border-b border-gray-200">
              <td class="py-2 px-4 text-gray-700">{{ imputacion.horasImputadas }}</td>
              <td class="py-2 px-4 text-gray-700">{{ imputacion.fechaHora }}</td>
              <td class="py-2 px-4 text-gray-700">{{ imputacion.comentario }}</td>
              <td class="py-2 px-4 text-gray-700">{{ imputacion.empleadoId }}</td>
            </tr>
          </tbody>
        </table>
        <p v-else class="text-gray-500">Nenhuma imputação de horas encontrada para esta tarefa.</p>
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
        tarea: null,
        comentarios: [],
        imputaciones: [],
        loading: false,
        error: null,
      };
    },
    mounted() {
      this.fetchTarea();
    },
    methods: {
      async fetchTarea() {
        this.loading = true;
        this.error = null;
        const id = this.$route.params.id;
        try {
          const [tareaResponse, comentariosResponse, imputacionesResponse] = await Promise.all([
            axios.get(`/api/tarea/${id}`),
            axios.get(`/api/comentariotarea/tarea/${id}`), // Busca comentários da tarefa
            axios.get('/api/imputacion/search/criteria', { params: { tareaId: id } }), // Busca imputações de horas
          ]);
          this.tarea = tareaResponse.data;
          // Lê os comentários a partir de response.data.page (assumindo o mesmo formato que os comentários do projeto)
          this.comentarios = comentariosResponse.data.page || [];
          // Filtra localmente as imputações pelo tareaId
          this.imputaciones = imputacionesResponse.data.page.filter(imputacion => imputacion.tareaId === Number(id));
        } catch (err) {
          this.error = 'Erro ao carregar a tarefa, comentários ou imputações: ' + err.message;
        } finally {
          this.loading = false;
        }
      },
      editarTarea() {
        console.log('Editar tarea:', this.tarea.id);
        // Implemente a lógica para editar
        // this.$router.push(`/tareas/editar/${this.tarea.id}`);
      },
      borrarTarea() {
        console.log('Borrar tarea:', this.tarea.id);
        // Implemente a lógica para deletar
        // if (confirm('Tem certeza?')) { axios.delete(`/api/tarea/${this.tarea.id}`); }
      },
    },
  };
  </script>