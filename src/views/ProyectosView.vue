<template>
  <div class="p-8 bg-gray-100">
    <div class="flex justify-between items-center mb-4">
      <h1 class="text-2xl text-blue-800">Proyectos</h1>
      <button
        class="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600 transition-colors cursor-pointer"
        @click="showCrearProyectoModal = true"
      >
        Crear nuevo proyecto
      </button>
    </div>
    <Buscador :campos="camposBusca" @buscar="handleBuscar" />
    <ListaProyecto
      :itens="proyectos"
      :colunas="colunasTabela"
      :loading="loading"
      :error="error"
      @item-clicked="handleItemClicked"
      @edit-item="editarProyecto"
      @delete-item="excluirProyecto"
    />
    <CrearProyectoModal
      v-if="showCrearProyectoModal"
      :is-open="showCrearProyectoModal"
      @close="showCrearProyectoModal = false"
      @projectCreated="fetchProyectos({})"
    />
    <EditarProyectoModal
      v-if="showEditarProyectoModal"
      :is-open="showEditarProyectoModal"
      :proyecto="projetoEditando"
      @close="showEditarProyectoModal = false"
      @projectUpdated="fetchProyectos({})"
    />
  </div>
</template>

<script>
import proyectoService from '../services/proyectoService';
import Buscador from '../components/Buscador.vue';
import ListaProyecto from '../components/ListaProyecto.vue';
import CrearProyectoModal from '../components/CrearProyectoModal.vue';
import EditarProyectoModal from '../components/EditarProyectoModal.vue';
import { formatDate } from '../utils/dateUtils';

export default {
  components: { Buscador, ListaProyecto, CrearProyectoModal, EditarProyectoModal },
  data() {
    return {
      proyectos: [],
      nombresEmpleados: {},
      loading: false,
      error: null,
      showCrearProyectoModal: false,
      showEditarProyectoModal: false,
      projetoEditando: null,
      camposBusca: [
        { name: 'nombre', label: 'Nome', type: 'text', placeholder: 'Digite o nome' },
        { name: 'estadoId', label: 'Estado ID', type: 'number', placeholder: 'ID do estado' },
        { name: 'clienteNombre', label: 'Cliente', type: 'text', placeholder: 'Nome do cliente' },
        { name: 'descripcion', label: 'Descrição', type: 'text', placeholder: 'Digite a descrição' },
        { name: 'importe', label: 'Importe', type: 'text', placeholder: 'Digite o importe (ex.: €10,000.00)' },
      ],
      colunasTabela: [
        { key: 'id', label: 'ID' },
        { key: 'nombre', label: 'Nombre' },
        { key: 'encargado', label: 'Encargado' },
        { key: 'fechaEstimadaInicio', label: 'Desde' },
        { key: 'fechaEstimadaFin', label: 'Hasta' },
        { key: 'estado', label: 'Status' },
        { key: 'actions', label: '' },
      ],
    };
  },
  mounted() {
    this.fetchProyectos({});
  },
  methods: {
    async fetchProyectos(filtros) {
      this.loading = true;
      this.error = null;
      try {
        const data = await proyectoService.getProyectos(filtros);
        const formattedProyectos = await Promise.all(
          data.page.map(async proyecto => {
            const encargado = await proyectoService.getEmpleadoNombre(proyecto.estadoId).catch(() => 'Desconhecido');
            return {
              id: proyecto.id,
              nombre: proyecto.nombre,
              descripcion: proyecto.descripcion,
              estadoId: proyecto.estadoId,
              clienteNombre: proyecto.clienteNombre,
              clienteId: proyecto.clienteId,
              fechaEstimadaInicio: formatDate(proyecto.fechaEstimadaInicio),
              fechaEstimadaFin: formatDate(proyecto.fechaEstimadaFin),
              fechaRealInicio: formatDate(proyecto.fechaRealInicio),
              fechaRealFin: formatDate(proyecto.fechaRealFin),
              importe: proyecto.importe,
              encargado,
              estado: this.getEstadoBadge(proyecto.estadoId),
            };
          })
        );
        this.proyectos = formattedProyectos;
      } catch (err) {
        this.error = 'Erro ao carregar os proyectos: ' + err.message;
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
      this.fetchProyectos(filtros);
    },
    handleItemClicked(id) {
      this.$router.push(`/projetos/${id}`);
    },
    editarProyecto(proyectoId) {
      const proyecto = this.proyectos.find(p => p.id === proyectoId);
      if (!proyecto) {
        this.error = 'Erro: Projeto não encontrado.';
        return;
      }
      this.projetoEditando = { ...proyecto };
      this.showEditarProyectoModal = true;
    },
    async excluirProyecto(proyectoId) {
      if (!confirm('Tem certeza de que deseja excluir este projeto?')) return;

      this.loading = true;
      this.error = null;
      try {
        await proyectoService.deleteProyecto(proyectoId);
        await this.fetchProyectos({});
      } catch (err) {
        this.error = err.response?.status === 400
          ? 'Projeto ' + proyectoId + ' não encontrado'
          : 'Erro ao excluir projeto: ' + (err.response?.data || err.message);
      } finally {
        this.loading = false;
      }
    },
  },
};
</script>