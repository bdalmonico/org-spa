<template>
    <div class="lista-cliente">
      <table class="min-w-full bg-white border border-gray-300 rounded-lg shadow">
        <thead>
          <tr>
            <th v-for="coluna in colunas" :key="coluna.key" class="py-3 px-4 bg-blue-800 text-white text-left font-semibold border-b border-gray-300">
              {{ coluna.key === 'actions' ? '' : coluna.label }}
            </th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="cliente in clientes" :key="cliente.id" class="hover:bg-gray-100 border-b border-gray-200">
            <td v-for="coluna in colunas" :key="coluna.key" class="py-2 px-4 text-gray-700">
              <span v-if="coluna.key !== 'actions'">
                {{ cliente[coluna.key] }}
              </span>
              <div v-else class="relative">
                <button
                  @click.stop="toggleMenu(cliente.id)"
                  class=" text-gray-500 px-2 py-1 rounded hover:bg-gray-600 transition-colors cursor-pointer"
                  :disabled="loading"
                >
                  <i class="fas fa-cog"></i>
                </button>
                <div v-if="menuAberto === cliente.id" class="absolute right-0 top-full mt-2 bg-white border border-gray-200 rounded-md shadow-lg z-10">
                  <button
                    @click.stop="handleEdit(cliente.id)"
                    class="w-full px-4 py-2 text-left text-gray-700 hover:bg-gray-100"
                  >
                    <i class="fas fa-edit mr-2"></i> Editar
                  </button>
                  <button
                    @click.stop="handleDelete(cliente.id)"
                    class="w-full px-4 py-2 text-left text-red-500 hover:bg-gray-100"
                  >
                    <i class="fas fa-trash mr-2"></i> Excluir
                  </button>
                </div>
              </div>
            </td>
          </tr>
        </tbody>
      </table>
      <p v-if="loading" class="mt-4 text-gray-700">Carregando...</p>
      <p v-if="error" class="mt-4 text-red-600">{{ error }}</p>
    </div>
  </template>
  
  <script>
  import axios from 'axios';
  
  export default {
    props: {
      colunas: {
        type: Array,
        required: true,
        default: () => [],
      },
      loading: {
        type: Boolean,
        default: false,
      },
      error: {
        type: String,
        default: null,
      },
    },
    data() {
      return {
        clientes: [],
        menuAberto: null, // Controla qual menu está aberto
      };
    },
    mounted() {
      this.fetchClientes();
    },
    methods: {
      async fetchClientes() {
        try {
          const response = await axios.get('/api/cliente', { params: { size: 10 } }); // Limita a 10 itens
          const formattedClientes = [];
          const clientesData = response.data.page || response.data.content || response.data || [];
          for (const cliente of Array.isArray(clientesData) ? clientesData : []) {
            if (!cliente || !cliente.id) continue;
            const clienteFormatted = {
              id: cliente.id,
              nombre: cliente.nombre || 'Sem nome',
              email: cliente.email || '',
              nifCif: cliente.nifCif || '',
              telefone: cliente.telefone || '',
              estadoId: cliente.estadoId || null,
            };
            formattedClientes.push(clienteFormatted);
          }
          this.clientes = formattedClientes;
        } catch (err) {
          this.$emit('error', 'Erro ao carregar os clientes: ' + err.message);
        }
      },
      toggleMenu(clienteId) {
        console.log('Abrindo menu para cliente com ID:', clienteId); // Depuração
        this.menuAberto = this.menuAberto === clienteId ? null : clienteId; // Alterna o menu
      },
      handleEdit(id) {
        console.log('Emitindo edit-item para ID:', id); // Depuração
        this.$emit('edit-item', id);
        this.menuAberto = null; // Fecha o menu após a ação
      },
      handleDelete(id) {
        this.$emit('delete-item', id);
        this.menuAberto = null; // Fecha o menu após a ação
      },
    },
  };
  </script>