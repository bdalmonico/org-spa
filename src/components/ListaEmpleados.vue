<template>
  <div class="p-6">
    <h2 class="text-2xl font-bold text-blue-800 mb-4">Lista de Empregados</h2>
    <button
      @click="$emit('create-empleado')"
      class="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 mb-4"
    >
      Criar Novo Empregado
    </button>

    <div v-if="empleados.length === 0" class="text-gray-500">
      Nenhum empregado encontrado.
    </div>
    <div v-else class="overflow-x-auto">
      <table class="min-w-full bg-white border border-gray-300 rounded-lg shadow">
        <thead>
          <tr>
            <th v-for="coluna in colunas" :key="coluna.key" class="py-3 px-4 bg-blue-800 text-white text-left font-semibold border-b border-gray-300">
              {{ coluna.label }}
            </th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="empleado in empleados" :key="empleado.id" class="hover:bg-gray-100 border-b border-gray-200">
            <td v-for="coluna in colunas" :key="coluna.key" class="py-2 px-4 text-gray-700">
              <span v-if="coluna.key !== 'actions'">{{ empleado[coluna.key] }}</span>
              <div v-else-if="coluna.key === 'actions'" class="relative">
                <button @click.stop="toggleMenu(empleado.id)" class="text-gray-500 hover:text-gray-700 cursor-pointer">
                  <i class="fas fa-cog"></i>
                </button>
                <div v-if="menuAberto === empleado.id" class="absolute right-0 top-full mt-2 bg-white border border-gray-200 rounded-md shadow-lg z-10">
                  <button
                    class="w-full px-4 py-2 text-left text-red-500 hover:bg-gray-100 cursor-pointer"
                    @click.stop="$emit('delete-item', empleado.id)"
                  >
                    Excluir
                  </button>
                </div>
              </div>
            </td>
          </tr>
        </tbody>
      </table>
    </div>

    <p v-if="loading" class="mt-4 text-gray-700">Carregando...</p>
    <p v-if="error" class="mt-4 text-red-600">{{ error }}</p>
  </div>
</template>

<script>
export default {
  props: {
    empleados: {
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
  },
  data() {
    return {
      menuAberto: null,
    };
  },
  methods: {
    toggleMenu(itemId) {
      this.menuAberto = this.menuAberto === itemId ? null : itemId;
    },
  },
};
</script>