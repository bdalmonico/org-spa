<template>
  <div class="p-8 bg-gray-100">
    <div class="flex justify-between items-center mb-4">
      <h1 class="text-2xl text-blue-800">Lista de Empregados</h1>
      <button
        class="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600 transition-colors cursor-pointer"
        @click="showCrearEmpleadoModal = true"
      >
        Adicionar Novo Empregado
      </button>
    </div>
    <Buscador :campos="camposBusca" @buscar="handleBuscar" />
    <Lista
      :itens="empleados"
      :colunas="colunasTabela"
      :loading="loading"
      :error="error"
      @edit-item="editarEmpleado"
      @delete-item="excluirEmpleado"
    />
    <EditarEmpleadoModal
      v-if="showEditarEmpleadoModal"
      :is-open="showEditarEmpleadoModal"
      :empleado="empleadoEditando"
      :modo="modoModal"
      @close="closeModal"
      @empleadoUpdated="fetchEmpleados({})"
      @empleadoDeleted="fetchEmpleados({})"
    />
    <CrearEmpleadoModal
      v-if="showCrearEmpleadoModal"
      :is-open="showCrearEmpleadoModal"
      @close="showCrearEmpleadoModal = false"
      @empleadoCreated="fetchEmpleados({})"
    />
  </div>
</template>

<script>
import axios from 'axios';
import Buscador from '../components/Buscador.vue';
import Lista from '../components/Lista.vue';
import EditarEmpleadoModal from '../components/EditarEmpleadoModal.vue';
import CrearEmpleadoModal from '../components/CrearEmpleadoModal.vue';

export default {
  components: {
    Buscador,
    Lista,
    EditarEmpleadoModal,
    CrearEmpleadoModal,
  },
  data() {
    return {
      empleados: [],
      loading: false,
      error: null,
      showEditarEmpleadoModal: false, // Estado para o modal de edição/exclusão
      showCrearEmpleadoModal: false, // Estado para o modal de criação
      empleadoEditando: null, // Empregado sendo editado/excluído
      modoModal: 'editar', // Modo do modal: 'editar' ou 'borrar'
      camposBusca: [
        { name: 'nombre', label: 'Nome', type: 'text', placeholder: 'Digite o nome' },
        { name: 'email', label: 'Email', type: 'text', placeholder: 'Digite o email' },
        { name: 'estadoId', label: 'Estado ID', type: 'number', placeholder: 'ID do estado' },
      ],
      colunasTabela: [
        { key: 'id', label: 'ID' },
        { key: 'nombre', label: 'Nome' },
        { key: 'email', label: 'Email' },
        { key: 'fechaAlta', label: 'Fecha de alta' },
        { key: 'rolId', label: 'Rol ID' },
        { key: 'actions', label: '' }, // Botão de configurações
      ],
    };
  },
  mounted() {
    this.fetchEmpleados({});
  },
  methods: {
    async fetchEmpleados(filtros) {
      this.loading = true;
      this.error = null;
      try {
        const response = await axios.get('/api/empleado', { params: filtros });
        this.empleados = response.data.page; // 'page' contém a lista de empregados
      } catch (err) {
        this.error = 'Erro ao carregar os empregados: ' + err.message;
      } finally {
        this.loading = false;
      }
    },
    handleBuscar(filtros) {
      this.fetchEmpleados(filtros);
    },
    editarEmpleado(empleadoId) {
      const empleado = this.empleados.find(e => e.id === empleadoId);
      this.empleadoEditando = { ...empleado }; // Cria uma cópia do empregado para editar
      this.modoModal = 'editar';
      this.showEditarEmpleadoModal = true; // Abre o modal em modo de edição
    },
    excluirEmpleado(empleadoId) {
      const empleado = this.empleados.find(e => e.id === empleadoId);
      this.empleadoEditando = { ...empleado }; // Cria uma cópia do empregado para excluir
      this.modoModal = 'borrar';
      this.showEditarEmpleadoModal = true; // Abre o modal em modo de exclusão
    },
    closeModal() {
      this.showEditarEmpleadoModal = false;
      this.showCrearEmpleadoModal = false;
      this.empleadoEditando = null;
      this.modoModal = 'editar';
    },
  },
};
</script>

<style scoped>
.p-8 {
  padding: 2rem;
}
</style>