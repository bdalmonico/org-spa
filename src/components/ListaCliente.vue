<!-- <template>
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
        <tr v-for="cliente in clientesComEstado" :key="cliente.id" class="hover:bg-gray-100 border-b border-gray-200">
          <td v-for="coluna in colunas" :key="coluna.key" class="py-2 px-4 text-gray-700">
            <span v-if="coluna.key !== 'actions' && coluna.key !== 'estadoId'">
              {{ cliente[coluna.key] }}
            </span>
            <span v-if="coluna.key === 'estadoId'">
              {{ cliente.estadoNombre || 'Carregando...' }}
            </span>
            <div v-if="coluna.key === 'actions'" class="relative">
              <button
                @click.stop="toggleMenu(cliente.id)"
                class="text-gray-500 px-2 py-1 rounded hover:bg-gray-600 transition-colors cursor-pointer"
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
import clienteService from '../services/clienteService';

export default {
  props: {
    colunas: { type: Array, required: true, default: () => [] },
    loading: { type: Boolean, default: false },
    error: { type: String, default: null },
  },
  data() {
    return {
      clientes: [],
      clientesComEstado: [],
      menuAberto: null,
      estadosCache: {},
    };
  },
  watch: {
    clientes(newClientes) {
      this.clientesComEstado = [...newClientes];
      this.fetchEstados();
    },
  },
  methods: {
    async fetchEstados() {
      try {
        const estadoIds = [...new Set(this.clientes.map(c => c.estadoId))].filter(id => id != null);
        if (!estadoIds.length) return;

        const requests = estadoIds.map(id =>
          clienteService.getEstadoById(id).catch(() => ({ nombre: 'Estado não encontrado' }))
        );
        const estados = await Promise.all(requests);
        estadoIds.forEach((id, index) => (this.estadosCache[id] = estados[index].nombre));

        this.clientesComEstado = this.clientes.map(cliente => ({
          ...cliente,
          estadoNombre: this.estadosCache[cliente.estadoId] || 'Estado não encontrado',
        }));
      } catch (err) {
        this.$emit('error', 'Erro ao carregar os estados: ' + err.message);
      }
    },
    toggleMenu(clienteId) {
      this.menuAberto = this.menuAberto === clienteId ? null : clienteId;
    },
    handleEdit(id) {
      this.$emit('edit-item', id);
      this.menuAberto = null;
    },
    handleDelete(id) {
      this.$emit('delete-item', id);
      this.menuAberto = null;
    },
  },
};
</script> -->

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
        <tr v-for="cliente in clientesComEstado" :key="cliente.id" class="hover:bg-gray-100 border-b border-gray-200">
          <td v-for="coluna in colunas" :key="coluna.key" class="py-2 px-4 text-gray-700">
            <span v-if="coluna.key !== 'actions' && coluna.key !== 'estadoId'">
              {{ cliente[coluna.key] }}
            </span>
            <span v-if="coluna.key === 'estadoId'">
              {{ cliente.estadoNombre || 'Carregando...' }}
            </span>
            <div v-if="coluna.key === 'actions'" class="relative">
              <button
                @click.stop="toggleMenu(cliente.id)"
                class="text-gray-500 px-2 py-1 rounded hover:bg-gray-600 transition-colors cursor-pointer"
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
    <div class="mt-4 flex justify-between items-center">
      <p class="text-gray-600">
        Mostrando {{ clientesComEstado.length }} de {{ totalItems }} clientes
      </p>
      <div class="flex space-x-2">
        <button
          :disabled="currentPage === 1"
          @click="$emit('change-page', currentPage - 1)"
          class="px-4 py-2 bg-gray-200 rounded hover:bg-gray-300 disabled:opacity-50"
        >
          Anterior
        </button>
        <span class="px-4 py-2">
          Página {{ currentPage }} de {{ totalPages }}
        </span>
        <button
          :disabled="currentPage === totalPages"
          @click="$emit('change-page', currentPage + 1)"
          class="px-4 py-2 bg-gray-200 rounded hover:bg-gray-300 disabled:opacity-50"
        >
          Próxima
        </button>
      </div>
    </div>
  </div>
</template>

<script>
import clienteService from '../services/clienteService';

export default {
  props: {
    colunas: { type: Array, required: true, default: () => [] },
    loading: { type: Boolean, default: false },
    error: { type: String, default: null },
    currentPage: { type: Number, default: 1 },
    totalPages: { type: Number, default: 1 },
    totalItems: { type: Number, default: 0 },
  },
  data() {
    return {
      clientes: [],
      clientesComEstado: [],
      menuAberto: null,
      estadosCache: {},
    };
  },
  watch: {
    clientes(newClientes) {
      this.clientesComEstado = [...newClientes];
      this.fetchEstados();
    },
  },
  methods: {
    async fetchEstados() {
      try {
        const estadoIds = [...new Set(this.clientes.map(c => c.estadoId))].filter(id => id != null);
        if (!estadoIds.length) return;

        const requests = estadoIds.map(id =>
          clienteService.getEstadoById(id).catch(() => ({ nombre: 'Estado não encontrado' }))
        );
        const estados = await Promise.all(requests);
        estadoIds.forEach((id, index) => (this.estadosCache[id] = estados[index].nombre));

        this.clientesComEstado = this.clientes.map(cliente => ({
          ...cliente,
          estadoNombre: this.estadosCache[cliente.estadoId] || 'Estado não encontrado',
        }));
      } catch (err) {
        this.$emit('error', 'Erro ao carregar os estados: ' + err.message);
      }
    },
    toggleMenu(clienteId) {
      this.menuAberto = this.menuAberto === clienteId ? null : clienteId;
    },
    handleEdit(id) {
      this.$emit('edit-item', id);
      this.menuAberto = null;
    },
    handleDelete(id) {
      this.$emit('delete-item', id);
      this.menuAberto = null;
    },
  },
};
</script>