<template>
  <div class="p-8 bg-gray-100 min-h-screen">
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
        <ListaProyectosHome
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
        <ListaTareasHome
          :itens="tareas.slice(0, 10)"
          :colunas="colunasTareas"
          :loading="loadingTareas"
          :error="errorTareas"
          @item-clicked="handleTareaClicked"
        />
      </div>
    </div>

    <!-- Modal para Criar Projeto -->
    <CrearProyectoModal
      v-if="showCrearProyectoModal"
      :is-open="showCrearProyectoModal"
      @close="showCrearProyectoModal = false"
      @projectCreated="fetchProyectosAndTareas"
    />

    <!-- Modal para Criar Tarefa -->
    <CrearTareaModal
      v-if="showCrearTareaModal"
      :is-open="showCrearTareaModal"
      :proyectoId="null"
      @close="showCrearTareaModal = false"
      @taskCreated="fetchProyectosAndTareas"
    />
  </div>
</template>

<script>
import proyectoService from '../services/proyectoService';
import tareaService from '../services/tareaService';
import ListaProyectosHome from '../components/ListaProyectosHome.vue';
import ListaTareasHome from '../components/ListaTareasHome.vue';
import CrearProyectoModal from '../components/CrearProyectoModal.vue';
import CrearTareaModal from '../components/CrearTareaModal.vue';
import { formatDate } from '../utils/dateUtils';

export default {
  components: {
    ListaProyectosHome,
    ListaTareasHome,
    CrearProyectoModal,
    CrearTareaModal,
  },
  data() {
    return {
      proyectos: [],
      tareas: [],
      nombresEmpleados: {},
      loadingProyectos: false,
      loadingTareas: false,
      errorProyectos: null,
      errorTareas: null,
      showCrearProyectoModal: false,
      showCrearTareaModal: false,
      colunasProyectos: [
        { key: 'nombre', label: 'Nombre' },
        { key: 'estado', label: 'Status' },
      ],
      colunasTareas: [
        { key: 'nombre', label: 'Título' },
        { key: 'estado', label: 'Estado' },
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
        const response = await proyectoService.getProyectos({ size: 10 });
        const formattedProyectos = [];
        const proyectosData = response.page || response.content || response || [];
        for (const proyecto of Array.isArray(proyectosData) ? proyectosData : []) {
          if (!proyecto || !proyecto.id) continue;
          const proyectoFormatted = {
            id: proyecto.id,
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
        this.errorProyectos = 'Erro ao carregar os projetos: ' + (err.response?.data?.message || err.message);
      } finally {
        this.loadingProyectos = false;
      }
    },
    async fetchTareas() {
      this.loadingTareas = true;
      this.errorTareas = null;
      try {
        const response = await tareaService.getTareas({ size: 10 });
        const formattedTareas = [];
        const tareasData = response.page || response.content || response || [];
        for (const tarea of Array.isArray(tareasData) ? tareasData : []) {
          if (!tarea || !tarea.id) continue;
          const tareaFormatted = {
            id: tarea.id,
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
        this.errorTareas = 'Erro ao carregar as tarefas: ' + (err.response?.data?.message || err.message);
      } finally {
        this.loadingTareas = false;
      }
    },
    getEstadoBadge(estadoId) {
      switch (estadoId) {
        case 1:
          return { text: 'ABERTO', class: 'bg-green-500 text-white' };
        case 6:
          return { text: 'ACTIVO', class: 'bg-blue-500 text-white' };
        case 4:
          return { text: 'APROBACION', class: 'bg-yellow-500 text-black' };
        case 2:
          return { text: 'CONCLUIDO', class: 'bg-gray-500 text-white' };
        case 8:
          return { text: 'DESARROLLO', class: 'bg-purple-500 text-white' };
        case 7:
          return { text: 'INACTIVO', class: 'bg-red-500 text-white' };
        case 5:
          return { text: 'PROTOTIPO', class: 'bg-orange-500 text-white' };
        case 3:
          return { text: 'TRABAJANDO', class: 'bg-cyan-500 text-white' };
        default:
          return { text: 'DESCONHECIDO', class: 'bg-gray-400 text-white' };
      }
    },
    handleProyectoClicked(id) {
      this.$router.push(`/projetos/${id}`); // Corrigido o erro de sintaxe nas aspas
    },
    handleTareaClicked(id) {
      this.$router.push(`/tareas/${id}`); // Corrigido o erro de sintaxe nas aspas
    },
    formatDate(dateStr) {
      return formatDate(dateStr);
    },
  },
};
</script>