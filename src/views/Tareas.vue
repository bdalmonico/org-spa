<!-- <template>
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
</style> -->
<!-- 
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
      :current-page="currentPage"
      :total-pages="totalPages"
      :total-items="totalItems"
      @item-clicked="handleItemClicked"
      @edit-item="editarTarea"
      @delete-item="excluirTarea"
      @change-page="handlePageChange"
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
      currentPage: 1,
      totalPages: 1,
      totalItems: 0,
      itemsPerPage: 10,
      filtrosAtuais: {},
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
    async fetchTareas(filtros, page = this.currentPage) {
      this.loading = true;
      this.error = null;
      try {
        console.log('Buscando tarefas com filtros:', filtros, 'Página:', page);
        const data = await tareaService.getTareas(filtros, page, this.itemsPerPage);
        this.tareas = data.page.map(tarea => ({
          ...tarea,
          fechaEstimadaInicio: formatDate(tarea.fechaEstimadaInicio),
          fechaEstimadaFin: formatDate(tarea.fechaEstimadaFin),
          fechaRealInicio: formatDate(tarea.fechaRealInicio),
          fechaRealFin: formatDate(tarea.fechaRealFin),
        }));
        this.totalPages = data.totalPages || 1;
        this.totalItems = data.totalItems || 0;
        this.currentPage = page;
        this.filtrosAtuais = filtros;
      } catch (err) {
        this.error = 'Erro ao carregar as tarefas: ' + (err.response?.data?.message || err.message);
        console.error('Erro ao buscar tarefas:', err);
      } finally {
        this.loading = false;
      }
    },
    handleBuscar(filtros) {
      this.currentPage = 1;
      this.fetchTareas(filtros);
    },
    handlePageChange(newPage) {
      if (newPage >= 1 && newPage <= this.totalPages) {
        this.fetchTareas(this.filtrosAtuais, newPage);
      }
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
      this.loading = true;
      this.error = null;
      try {
        const [comentariosResponse, imputacionesResponse] = await Promise.all([
          comentarioTareaService.getComentariosByTareaId(tarea.id),
          imputacionService.getImputacionesByCriteria({ tareaId: tarea.id }),
        ]);
        const comentarioCount = (comentariosResponse.page || []).length;
        const imputacionCount = (imputacionesResponse.page || []).length;

        const confirmMessage = `Tem certeza de que deseja excluir a tarefa "${tarea.nombre}"?${comentarioCount > 0 || imputacionCount > 0 ? ` Isso excluirá ${comentarioCount} comentário(s) e ${imputacionCount} imputação(ões) associada(s).` : ''}`;
        if (!confirm(confirmMessage)) return;

        console.log('Excluindo tarefa com ID:', tarefa.id);
        await tareaService.deleteTarea(tarea.id);
        await this.fetchTareas(this.filtrosAtuais);
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
</style> -->

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
      :current-page="currentPage"
      :total-pages="totalPages"
      :total-items="totalItems"
      @item-clicked="handleItemClicked"
      @edit-item="editarTarea"
      @delete-item="excluirTarea"
      @change-page="handlePageChange"
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
      currentPage: 1,
      totalPages: 1,
      totalItems: 0,
      itemsPerPage: 10,
      filtrosAtuais: {},
      camposBusca: [
        { name: 'nombre', label: 'Título', type: 'text', placeholder: 'Digite o título' },
        { name: 'estadoId', label: 'Estado ID', type: 'number', placeholder: 'ID do estado' },
        { name: 'proyectoId', label: 'Projeto ID', type: 'number', placeholder: 'ID do projeto' },
      ],
      colunasTabela: [
        { key: 'id', label: 'ID' },
        { key: 'nombre', label: 'Título' },
        { key: 'descripcion', label: 'Descrição' },
        { key: 'estado', label: 'Estado' }, // Alterado de estadoId para estado
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
    async fetchTareas(filtros, page = this.currentPage) {
      this.loading = true;
      this.error = null;
      try {
        console.log('Buscando tarefas com filtros:', filtros, 'Página:', page);
        const data = await tareaService.getTareas(filtros, page, this.itemsPerPage);
        this.tareas = data.page.map(tarea => ({
          ...tarea,
          fechaEstimadaInicio: formatDate(tarea.fechaEstimadaInicio),
          fechaEstimadaFin: formatDate(tarea.fechaEstimadaFin),
          fechaRealInicio: formatDate(tarea.fechaRealInicio),
          fechaRealFin: formatDate(tarea.fechaRealFin),
          estado: this.getEstadoBadge(tarea.estadoId), // Adiciona o badge
        }));
        this.totalPages = data.totalPages || 1;
        this.totalItems = data.totalItems || 0;
        this.currentPage = page;
        this.filtrosAtuais = filtros;
      } catch (err) {
        this.error = 'Erro ao carregar as tarefas: ' + (err.response?.data?.message || err.message);
        console.error('Erro ao buscar tarefas:', err);
      } finally {
        this.loading = false;
      }
    },
    getEstadoBadge(estadoId) {
      switch (estadoId) {
        case 1: return { text: 'ABERTO', class: 'bg-green-500 text-white' };
        case 6: return { text: 'ACTIVO', class: 'bg-blue-500 text-white' };
        case 4: return { text: 'APROBACION', class: 'bg-yellow-500 text-black' };
        case 2: return { text: 'CONCLUIDO', class: 'bg-gray-500 text-white' };
        case 8: return { text: 'DESARROLLO', class: 'bg-purple-500 text-white' };
        case 7: return { text: 'INACTIVO', class: 'bg-red-500 text-white' };
        case 5: return { text: 'PROTOTIPO', class: 'bg-orange-500 text-white' };
        case 3: return { text: 'TRABAJANDO', class: 'bg-cyan-500 text-white' };
        default: return { text: 'DESCONHECIDO', class: 'bg-gray-400 text-white' };
      }
    },
    handleBuscar(filtros) {
      this.currentPage = 1;
      this.fetchTareas(filtros);
    },
    handlePageChange(newPage) {
      if (newPage >= 1 && newPage <= this.totalPages) {
        this.fetchTareas(this.filtrosAtuais, newPage);
      }
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
      this.loading = true;
      this.error = null;
      try {
        const [comentariosResponse, imputacionesResponse] = await Promise.all([
          comentarioTareaService.getComentariosByTareaId(tarea.id),
          imputacionService.getImputacionesByCriteria({ tareaId: tarea.id }),
        ]);
        const comentarioCount = (comentariosResponse.page || []).length;
        const imputacionCount = (imputacionesResponse.page || []).length;

        const confirmMessage = `Tem certeza de que deseja excluir a tarefa "${tarea.nombre}"?${comentarioCount > 0 || imputacionCount > 0 ? ` Isso excluirá ${comentarioCount} comentário(s) e ${imputacionCount} imputação(ões) associada(s).` : ''}`;
        if (!confirm(confirmMessage)) return;

        console.log('Excluindo tarefa com ID:', tarefa.id);
        await tareaService.deleteTarea(tarea.id);
        await this.fetchTareas(this.filtrosAtuais);
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