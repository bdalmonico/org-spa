<template>
  <div class="p-8 bg-gray-100 min-h-screen">
    <h1 class="text-3xl font-bold text-center text-blue-800 mb-8">ORGANIZATE</h1>

    <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
      <!-- Widget de Projetos -->
      <div class="bg-white p-6 rounded-lg shadow-lg">
        <div class="flex justify-between items-center mb-4">
          <h2 class="text-xl font-semibold text-blue-800">Projetos Recentes</h2>
          <div class="flex gap-2">
            <button
              class="bg-blue-500 text-white px-3 py-1 rounded hover:bg-blue-600 transition-colors cursor-pointer"
              @click="$router.push('/projetos')"
            >
              Ver Mais
            </button>
            <button
              class="bg-green-500 text-white px-3 py-1 rounded hover:bg-green-600 transition-colors cursor-pointer"
              @click="showCrearProyectoModal = true"
            >
              Adicionar Novo
            </button>
          </div>
        </div>
        <Lista
          :itens="proyectos.slice(0, 10)"
          :colunas="colunasProyectos"
          :loading="loadingProyectos"
          :error="errorProyectos"
          @item-clicked="handleProyectoClicked"
        />
      </div>

      <!-- Widget de Tarefas -->
      <div class="bg-white p-6 rounded-lg shadow-lg">
        <div class="flex justify-between items-center mb-4">
          <h2 class="text-xl font-semibold text-blue-800">Tarefas Recentes</h2>
          <div class="flex gap-2">
            <button
              class="bg-blue-500 text-white px-3 py-1 rounded hover:bg-blue-600 transition-colors cursor-pointer"
              @click="$router.push('/tareas')"
            >
              Ver Mais
            </button>
            <button
              class="bg-green-500 text-white px-3 py-1 rounded hover:bg-green-600 transition-colors cursor-pointer"
              @click="showCrearTareaModal = true"
            >
              Adicionar Novo
            </button>
          </div>
        </div>
        <Lista
          :itens="tareas.slice(0, 10)"
          :colunas="colunasTareas"
          :loading="loadingTareas"
          :error="errorTareas"
          @item-clicked="handleTareaClicked"
        />
      </div>
    </div>

    <!-- Modal para Criar Projeto -->
    <CrearProyectoModal v-if="showCrearProyectoModal" :is-open="showCrearProyectoModal" @close="showCrearProyectoModal = false" @projectCreated="fetchProyectosAndTareas" />

    <!-- Modal para Criar Tarefa (Assumindo que você tenha um componente similar para tarefas) -->
    <CrearTareaModal v-if="showCrearTareaModal" :is-open="showCrearTareaModal" @close="showCrearTareaModal = false" @taskCreated="fetchProyectosAndTareas" />
  </div>
</template>

<script>
import axios from 'axios';
import Lista from '../components/Lista.vue';
import CrearProyectoModal from '../components/CrearProyectoModal.vue';
import { formatDate } from '../utils/dateUtils'; // Caminho relativo manual

export default {
  components: {
    Lista,
    CrearProyectoModal,
    // Adicione CrearTareaModal quando implementado
  },
  data() {
    return {
      proyectos: [],
      tareas: [],
      nombresEmpleados: {}, // Armazena os nomes dos empregados por estadoId (mantido para compatibilidade, mas não usado)
      loadingProyectos: false,
      loadingTareas: false,
      errorProyectos: null,
      errorTareas: null,
      showCrearProyectoModal: false,
      showCrearTareaModal: false,
      colunasProyectos: [
        { key: 'nombre', label: 'Nombre' },
        
        { key: 'estado', label: 'Status' }, // Mantido badge para status
      ],
      colunasTareas: [
        { key: 'nombre', label: 'Título' },
        { key: 'estado', label: 'Status' }, // Mantido badge para status
      ],
    };
  },
  mounted() {
    this.fetchProyectosAndTareas();
  },
  methods: {
    async fetchProyectosAndTareas() {
      await Promise.all([this.fetchProyectos(), this.fetchTareas()]);
    },
    async fetchProyectos() {
      this.loadingProyectos = true;
      this.errorProyectos = null;
      try {
        const response = await axios.get('/api/proyecto', { params: { size: 10 } }); // Limita a 10 itens
        const formattedProyectos = [];
        const proyectosData = response.data.page || response.data.content || response.data || []; // Tenta lidar com diferentes formatos
        for (const proyecto of Array.isArray(proyectosData) ? proyectosData : []) {
          if (!proyecto || !proyecto.id) continue; // Garante que o projeto é válido
          const proyectoFormatted = {
            id: proyecto.id, // Mantido para navegação, mas não exibido
            nombre: proyecto.nombre || 'Sem nome',
            descripcion: proyecto.descripcion || '',
            estadoId: proyecto.estadoId || null,
            clienteNombre: proyecto.clienteNombre || 'Sem cliente',
          };
          proyectoFormatted.estado = this.getEstadoBadge(proyecto.estadoId);
          formattedProyectos.push(proyectoFormatted);
        }
        this.proyectos = formattedProyectos;
      } catch (err) {
        this.errorProyectos = 'Erro ao carregar os projetos: ' + err.message;
      } finally {
        this.loadingProyectos = false;
      }
    },
    async fetchTareas() {
      this.loadingTareas = true;
      this.errorTareas = null;
      try {
        const response = await axios.get('/api/tarea', { params: { size: 10 } }); // Limita a 10 itens
        const formattedTareas = [];
        const tareasData = response.data.page || response.data.content || response.data || []; // Tenta lidar com diferentes formatos
        for (const tarea of Array.isArray(tareasData) ? tareasData : []) {
          if (!tarea || !tarea.id) continue; // Garante que a tarefa é válida
          const tareaFormatted = {
            id: tarea.id, // Mantido para navegação, mas não exibido
            nombre: tarea.nombre || 'Sem título',
            descripcion: tarea.descripcion || '',
            estadoId: tarea.estadoId || null,
            proyectoId: tarea.proyectoId || null,
            
          };
          tareaFormatted.estado = this.getEstadoBadge(tarea.estadoId);
          formattedTareas.push(tareaFormatted);
        }
        this.tareas = formattedTareas;
      } catch (err) {
        this.errorTareas = 'Erro ao carregar as tarefas: ' + err.message;
      } finally {
        this.loadingTareas = false;
      }
    },
    getEstadoBadge(estadoId) {
      switch (estadoId) {
        case 1: // ABERTO
          return { text: 'ABERTO', class: 'bg-green-500 text-white' };
        case 6: // ACTIVO
          return { text: 'ACTIVO', class: 'bg-blue-500 text-white' };
        case 4: // APROBACION
          return { text: 'APROBACION', class: 'bg-yellow-500 text-black' };
        case 2: // CONCLUIDO
          return { text: 'CONCLUIDO', class: 'bg-gray-500 text-white' };
        case 8: // DESARROLLO
          return { text: 'DESARROLLO', class: 'bg-purple-500 text-white' };
        case 7: // INACTIVO
          return { text: 'INACTIVO', class: 'bg-red-500 text-white' };
        case 5: // PROTOTIPO
          return { text: 'PROTOTIPO', class: 'bg-orange-500 text-white' };
        case 3: // TRABAJANDO
          return { text: 'TRABAJANDO', class: 'bg-cyan-500 text-white' };
        default:
          return { text: 'DESCONHECIDO', class: 'bg-gray-400 text-white' };
      }
    },
    handleProyectoClicked(id) {
      this.$router.push(`/projetos/${id}`);
    },
    handleTareaClicked(id) {
      this.$router.push(`/tareas/${id}`);
    },
    // Método utilitário como método do componente (para uso no template, se necessário)
    formatDate(dateStr) {
      return formatDate(dateStr); // Usa o método do utilitário
    },
    fetchProyectosAndTareas() {
      this.fetchProyectos();
      this.fetchTareas();
    },
  },
};
</script>