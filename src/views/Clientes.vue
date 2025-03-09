<template>
  <div class="p-8 bg-gray-100">
    <div class="flex justify-between items-center mb-4">
      <h1 class="text-2xl text-blue-800">Clientes</h1>
      <button
        class="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600 transition-colors cursor-pointer"
        @click="showCrearClienteModal = true"
      >
        Criar novo cliente
      </button>
    </div>
    <Buscador :campos="camposBusca" @buscar="handleBuscar" />
    <ListaCliente
      ref="listaCliente"
      :colunas="colunasTabela"
      :loading="loading"
      :error="error"
      @edit-item="editarCliente"
      @delete-item="excluirCliente"
    />
    <CrearClienteModal
      v-if="showCrearClienteModal"
      :is-open="showCrearClienteModal"
      @close="showCrearClienteModal = false"
      @clienteCreated="fetchClientes"
    />
    <EditarClienteModal
      v-if="showEditarClienteModal"
      :is-open="showEditarClienteModal"
      :cliente="clienteEditando"
      @close="showEditarClienteModal = false"
      @clienteUpdated="fetchClientes"
    />
  </div>
</template>

<script>
import clienteService from '../services/clienteService';
import Buscador from '../components/Buscador.vue';
import ListaCliente from '../components/ListaCliente.vue';
import CrearClienteModal from '../components/CrearClienteModal.vue';
import EditarClienteModal from '../components/EditarClienteModal.vue';
import { formatDate } from '../utils/dateUtils';

export default {
  components: { Buscador, ListaCliente, CrearClienteModal, EditarClienteModal },
  data() {
    return {
      loading: false,
      error: null,
      showCrearClienteModal: false,
      showEditarClienteModal: false,
      clienteEditando: null,
      camposBusca: [
        { name: 'nombre', label: 'Nome', type: 'text', placeholder: 'Digite o nome' },
        { name: 'email', label: 'Email', type: 'text', placeholder: 'Digite o email' },
        { name: 'nifCif', label: 'NIF/CIF', type: 'text', placeholder: 'Digite o NIF/CIF' },
        { name: 'telefone', label: 'Telefone', type: 'text', placeholder: 'Digite o telefone' },
        { name: 'estadoId', label: 'Estado ID', type: 'number', placeholder: 'Digite o ID do estado' },
      ],
      colunasTabela: [
        { key: 'id', label: 'ID' },
        { key: 'nombre', label: 'Nome' },
        { key: 'email', label: 'Email' },
        { key: 'nifCif', label: 'NIF/CIF' },
        { key: 'telefone', label: 'Telefone' },
        { key: 'estadoId', label: 'Status' },
        { key: 'actions', label: '' },
      ],
    };
  },
  mounted() {
    this.fetchClientes();
  },
  methods: {
    async fetchClientes(filtros = {}) {
      this.loading = true;
      this.error = null;
      try {
        const data = await clienteService.getClientes(filtros);
        this.$refs.listaCliente.clientes = data.page.map(cliente => ({
          ...cliente,
          estadoId: cliente.estadoId || null,
        }));
      } catch (err) {
        this.error = 'Erro ao carregar os clientes: ' + err.message;
      } finally {
        this.loading = false;
      }
    },
    handleBuscar(filtros) {
      this.fetchClientes(filtros);
    },
    editarCliente(clienteId) {
      const cliente = this.$refs.listaCliente.clientes.find(c => c.id === clienteId);
      if (!cliente) {
        this.error = 'Erro: Cliente não encontrado.';
        return;
      }
      this.clienteEditando = { ...cliente };
      this.showEditarClienteModal = true;
    },
    async excluirCliente(clienteId) {
      if (!confirm('Tem certeza de que deseja excluir este cliente?')) return;

      this.loading = true;
      this.error = null;
      try {
        await clienteService.deleteCliente(clienteId);
        this.fetchClientes();
      } catch (err) {
        this.error = err.response?.status === 404
          ? 'Cliente ' + clienteId + ' não encontrado'
          : 'Erro ao excluir cliente: ' + (err.response?.data || err.message);
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