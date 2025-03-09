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
import tareaService from '../services/tareaService';
import comentarioTareaService from '../services/comentarioTareaService';
import imputacionService from '../services/imputacionService';
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
        { key: 'estadoId', label: 'Estado' },
        { key: 'proyectoId', label: 'Projeto' },
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
        const response = await tareaService.getTareas(filtros);
        this.tareas = response.page.map(tarea => ({
          ...tarea,
          fechaEstimadaInicio: formatDate(tarea.fechaEstimadaInicio),
          fechaEstimadaFin: formatDate(tarea.fechaEstimadaFin),
          fechaRealInicio: formatDate(tarea.fechaRealInicio),
          fechaRealFin: formatDate(tarea.fechaRealFin),
        }));
      } catch (err) {
        this.error = 'Erro ao carregar as tarefas: ' + (err.response?.data?.message || err.message);
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
    async excluirTarea(tarefa) {
      this.loading = true;
      this.error = null;

      try {
        const [comentariosResponse, imputacionesResponse] = await Promise.all([
          comentarioTareaService.getComentariosByTareaId(tarefa.id),
          imputacionService.getImputacionesByCriteria({ tareaId: tarefa.id }),
        ]);
        const comentarioCount = (comentariosResponse.page || []).length;
        const imputacionCount = (imputacionesResponse.page || []).length;

        const confirmMessage = `Tem certeza de que deseja excluir a tarefa "${tarefa.nombre}"?${comentarioCount > 0 || imputacionCount > 0 ? ` Isso excluirá ${comentarioCount} comentário(s) e ${imputacionCount} imputação(ões) associada(s).` : ''}`;
        if (!confirm(confirmMessage)) return;

        console.log('Excluindo tarefa com ID:', tarefa.id);
        await tareaService.deleteTarea(tarefa.id);
        await this.fetchTareas({});
      } catch (err) {
        this.error = 'Erro ao excluir tarefa: ' + (err.message || 'Erro desconhecido');
        console.error('Erro ao excluir tarefa:', err);
      } finally {
        this.loading = false;
      }
    },
  },
};
</script>

<style scoped>
.p-8 {
  padding: 2rem;
}
</style>