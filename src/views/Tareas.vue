<template>
  <div class="p-8 bg-gray-100">
    <div class="flex justify-between items-center mb-4">
      <h1 class="text-2xl text-blue-800">Tarefas</h1>
      <button
        class="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600 transition-colors cursor-pointer"
        @click="showCrearTareaModal = true"
      >
        Criar Nova Tarefa
      </button>
    </div>
    <Buscador :campos="camposBusca" @buscar="handleBuscar" />
    <ListaTareas
      :itens="tareas"
      :colunas="colunasTabela"
      :loading="loading"
      :error="error"
      @item-clicked="handleItemClicked"
      @edit-item="editarTarea"
      @delete-item="excluirTarea"
    />
    <CrearTareaModal
      v-if="showCrearTareaModal"
      :is-open="showCrearTareaModal"
      @close="showCrearTareaModal = false"
      @taskCreated="fetchTareas({})"
    />
    <EditarTareaModal
      v-if="showEditarTareaModal"
      :is-open="showEditarTareaModal"
      :tarea="tareaEditando"
      @close="showEditarTareaModal = false"
      @taskUpdated="fetchTareas({})"
    />
  </div>
</template>

<script>
import axios from 'axios';
import Buscador from '../components/Buscador.vue';
import ListaTareas from '../components/ListaTareas.vue';
import CrearTareaModal from '../components/CrearTareaModal.vue';
import EditarTareaModal from '../components/EditarTareaModal.vue';
import { formatDate } from '../utils/dateUtils';

export default {
  components: {
    Buscador,
    ListaTareas,
    CrearTareaModal,
    EditarTareaModal,
  },
  data() {
    return {
      tareas: [],
      loading: false,
      error: null,
      showCrearTareaModal: false,
      showEditarTareaModal: false,
      tareaEditando: null,
      camposBusca: [
        { name: 'nombre', label: 'Título', type: 'text', placeholder: 'Digite o título' },
        { name: 'estadoId', label: 'Estado ID', type: 'number', placeholder: 'ID do estado' },
        { name: 'proyectoId', label: 'Projeto ID', type: 'number', placeholder: 'ID do projeto' },
      ],
      colunasTabela: [
        { key: 'id', label: 'ID' },
        { key: 'nombre', label: 'Título' },
        { key: 'descripcion', label: 'Descrição' },
        { key: 'estadoId', label: 'Estado ID' },
        { key: 'proyectoId', label: 'Projeto ID' },
        { key: 'fechaEstimadaInicio', label: 'Data Estimada Início' },
        { key: 'actions', label: '' },
      ],
    };
  },
  mounted() {
    this.fetchTareas({});
  },
  methods: {
    async fetchTareas(filtros) {
      this.loading = true;
      this.error = null;
      try {
        console.log('Buscando tarefas com filtros:', filtros);
        const response = await axios.get('/api/tarea', { params: filtros });
        this.tareas = response.data.page.map(tarea => ({
          ...tarea,
          fechaEstimadaInicio: formatDate(tarea.fechaEstimadaInicio),
          fechaEstimadaFin: formatDate(tarea.fechaEstimadaFin),
          fechaRealInicio: formatDate(tarea.fechaRealInicio),
          fechaRealFin: formatDate(tarea.fechaRealFin),
        }));
      } catch (err) {
        this.error = 'Erro ao carregar as tarefas: ' + err.message;
        console.error('Erro ao buscar tarefas:', err);
      } finally {
        this.loading = false;
      }
    },
    handleBuscar(filtros) {
      this.fetchTareas(filtros);
    },
    handleItemClicked(id) {
      this.$router.push(`/tareas/${id}`);
    },
    editarTarea(tarea) {
      console.log('Editando tarefa:', tarea);
      this.tareaEditando = { ...tarea };
      this.showEditarTareaModal = true;
    },
    async excluirTarea(tarea) {
      if (!confirm('Tem certeza de que deseja excluir esta tarefa?')) return;

      this.loading = true;
      this.error = null;

      try {
        console.log('Excluindo tarefa com ID:', tarea.id);
        await axios.delete(`/api/tarea/${tarea.id}`);
        await this.fetchTareas({});
      } catch (err) {
        if (err.response && err.response.status === 404) {
          this.error = 'Tarefa ' + tarea.id + ' não encontrada';
        } else {
          this.error = 'Erro ao excluir tarefa: ' + (err.response?.data?.message || err.message);
        }
        console.error('Erro ao excluir tarefa:', err);
      } finally {
        this.loading = false;
      }
    },
    formatDate(dateStr) {
      return formatDate(dateStr);
    },
  },
};
</script>

<style scoped>
.p-8 {
  padding: 2rem;
}
</style>