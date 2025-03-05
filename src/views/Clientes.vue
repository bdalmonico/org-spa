<template>
  <div class="p-8 bg-gray-100">
    <div class="flex justify-between items-center mb-4">
      <h1 class="text-2xl text-blue-800">Lista de Clientes</h1>
      <button
        class="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600 transition-colors cursor-pointer"
        @click="showEditarClienteModal = true"
      >
        Adicionar Novo Cliente
      </button>
    </div>
    <Buscador :campos="camposBusca" @buscar="handleBuscar" />
    <Lista
      :itens="clientes"
      :colunas="colunasTabela"
      :loading="loading"
      :error="error"
      @edit-item="editarCliente"
      @delete-item="excluirCliente"
    />
    <EditarClienteModal
      v-if="showEditarClienteModal"
      :is-open="showEditarClienteModal"
      :cliente="clienteEditando"
      :modo="modoModal"
      @close="closeModal"
      @clientUpdated="fetchClientes({})"
      @clientDeleted="fetchClientes({})"
    />
  </div>
</template>

<script>
import axios from 'axios';
import Buscador from '../components/Buscador.vue';
import Lista from '../components/Lista.vue';
import EditarClienteModal from '../components/EditarClienteModal.vue';

export default {
  components: {
    Buscador,
    Lista,
    EditarClienteModal,
  },
  data() {
    return {
      clientes: [],
      loading: false,
      error: null,
      showEditarClienteModal: false, // Estado para o modal de edição/exclusão
      clienteEditando: null, // Cliente sendo editado/excluído
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
        { key: 'telefone', label: 'Telefone' },
        { key: 'estadoId', label: 'Estado ID' },
        { key: 'actions', label: '' }, // Adicionado botão de configurações
      ],
    };
  },
  mounted() {
    this.fetchClientes({});
  },
  methods: {
    async fetchClientes(filtros) {
      this.loading = true;
      this.error = null;
      try {
        const response = await axios.get('/api/cliente', { params: filtros });
        this.clientes = response.data.page; // 'page' contém a lista de clientes
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
      const cliente = this.clientes.find(c => c.id === clienteId);
      this.clienteEditando = { ...cliente }; // Cria uma cópia do cliente para editar
      this.modoModal = 'editar';
      this.showEditarClienteModal = true; // Abre o modal em modo de edição
    },
    excluirCliente(clienteId) {
      const cliente = this.clientes.find(c => c.id === clienteId);
      this.clienteEditando = { ...cliente }; // Cria uma cópia do cliente para excluir
      this.modoModal = 'borrar';
      this.showEditarClienteModal = true; // Abre o modal em modo de exclusão
    },
    closeModal() {
      this.showEditarClienteModal = false;
      this.clienteEditando = null;
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