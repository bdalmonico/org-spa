<template>
  <div class="lista">
    <!-- Layout Desktop -->
    <table v-if="!isMobile" class="min-w-full bg-white border border-gray-300 rounded-lg shadow">
      <thead>
        <tr>
          <th v-for="coluna in colunas" :key="coluna.key" class="py-3 px-4 bg-blue-800 text-white text-left font-semibold border-b border-gray-300">
            {{ coluna.label }}
          </th>
        </tr>
      </thead>
      <tbody>
        <tr
          v-for="item in itens"
          :key="item.id"
          @click="$emit('item-clicked', item.id)"
          class="hover:bg-gray-100 border-b border-gray-200 cursor-pointer"
        >
          <td v-for="coluna in colunas" :key="coluna.key" class="py-2 px-4 text-gray-700">
            <span v-if="coluna.key !== 'actions' && coluna.key !== 'estado' && coluna.key !== 'proyectoId'">
              {{ item[coluna.key] }}
            </span>
            <span v-if="coluna.key === 'estado'" :class="`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium ${item[coluna.key].class}`">
              {{ item[coluna.key].text }}
            </span>
            <div v-if="coluna.key === 'proyectoId'" class="relative">
              <button
                @click.stop="verProyecto(item.proyectoId)"
                class="bg-blue-500 text-white px-3 py-1 rounded hover:bg-blue-600 transition-colors cursor-pointer"
              >
                Ver
              </button>
            </div>
            <div v-if="coluna.key === 'actions'" class="relative">
              <button @click.stop="toggleMenu(item.id)" class="text-gray-500 hover:text-gray-700 cursor-pointer">
                <i class="fas fa-cog"></i>
              </button>
              <div v-if="menuAberto === item.id" class="absolute right-0 top-full mt-2 bg-white border border-gray-200 rounded-md shadow-lg z-10">
                <button
                  class="w-full px-4 py-2 text-left text-gray-700 hover:bg-gray-100 cursor-pointer"
                  @click.stop="$emit('edit-item', item)"
                >
                  Editar
                </button>
                <button
                  class="w-full px-4 py-2 text-left text-red-500 hover:bg-gray-100 cursor-pointer"
                  @click.stop="$emit('delete-item', item)"
                >
                  Excluir
                </button>
              </div>
            </div>
          </td>
        </tr>
      </tbody>
    </table>

    <!-- Layout Mobile -->
    <div v-else class="space-y-2">
      <div
        v-for="item in itens"
        :key="item.id"
        @click="$emit('item-clicked', item.id)"
        class="bg-white border border-gray-300 rounded-lg p-3 flex justify-between items-center hover:bg-gray-100 cursor-pointer"
      >
        <div class="flex-1">
          <p class="text-gray-700 font-semibold">{{ item.nombre }}</p>
          <span :class="`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${item.estado.class}`">
            {{ item.estado.text }}
          </span>
        </div>
        <div class="relative">
          <button @click.stop="toggleMenu(item.id)" class="text-gray-500 hover:text-gray-700 cursor-pointer">
            <i class="fas fa-cog"></i>
          </button>
          <div v-if="menuAberto === item.id" class="absolute right-0 top-full mt-2 bg-white border border-gray-200 rounded-md shadow-lg z-10">
            <button
              class="w-full px-4 py-2 text-left text-gray-700 hover:bg-gray-100 cursor-pointer"
              @click.stop="$emit('edit-item', item)"
            >
              Editar
            </button>
            <button
              class="w-full px-4 py-2 text-left text-red-500 hover:bg-gray-100 cursor-pointer"
              @click.stop="$emit('delete-item', item)"
            >
              Excluir
            </button>
          </div>
        </div>
      </div>
    </div>

    <!-- Mensagens de Loading e Erro -->
    <p v-if="loading" class="mt-4 text-gray-700">Carregando...</p>
    <p v-if="error" class="mt-4 text-red-600">{{ error }}</p>

    <!-- Paginação -->
    <div class="mt-4 flex flex-col md:flex-row justify-between items-center">
      <p class="text-gray-600">
        Mostrando {{ itens.length }} de {{ totalItems }} tarefas
      </p>
      <div class="flex space-x-2 mt-2 md:mt-0">
        <button
          :disabled="currentPage === 1"
          @click="$emit('change-page', currentPage - 1)"
          class="px-3 py-1 bg-gray-200 rounded hover:bg-gray-300 disabled:opacity-50 text-sm"
        >
          Anterior
        </button>
        <span class="px-3 py-1 text-sm">
          Página {{ currentPage }} de {{ totalPages }}
        </span>
        <button
          :disabled="currentPage === totalPages"
          @click="$emit('change-page', currentPage + 1)"
          class="px-3 py-1 bg-gray-200 rounded hover:bg-gray-300 disabled:opacity-50 text-sm"
        >
          Próxima
        </button>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  props: {
    itens: {
      type: Array,
      required: true,
    },
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
    currentPage: {
      type: Number,
      default: 1,
    },
    totalPages: {
      type: Number,
      default: 1,
    },
    totalItems: {
      type: Number,
      default: 0,
    },
  },
  data() {
    return {
      menuAberto: null,
      isMobile: window.innerWidth < 768,
    };
  },
  created() {
    window.addEventListener('resize', this.handleResize);
  },
  destroyed() {
    window.removeEventListener('resize', this.handleResize);
  },
  methods: {
    toggleMenu(itemId) {
      this.menuAberto = this.menuAberto === itemId ? null : itemId;
    },
    verProyecto(proyectoId) {
      this.$router.push(`/projetos/${proyectoId}`);
    },
    handleResize() {
      this.isMobile = window.innerWidth < 768;
    },
  },
};
</script>

<style scoped>
@media (max-width: 767px) {
  .lista {
    padding: 0 8px;
  }
}
</style>