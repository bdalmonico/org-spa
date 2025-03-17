<template>
  <div class="p-6">
    <h2 :class="['font-bold text-blue-800 mb-4', isMobile ? 'text-xl' : 'text-2xl']">Lista de Empregados</h2>

    <div v-if="empleados.length === 0" class="text-gray-500">
      Nenhum empregado encontrado.
    </div>
    <div v-else>
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
          <tr v-for="empleado in empleadosConRol" :key="empleado.id" class="hover:bg-gray-100 border-b border-gray-200">
            <td v-for="coluna in colunas" :key="coluna.key" class="py-2 px-4 text-gray-700">
              <span v-if="coluna.key !== 'actions' && coluna.key !== 'rolId'">
                {{ empleado[coluna.key] }}
              </span>
              <span v-if="coluna.key === 'rolId'">
                {{ empleado.rolNombre || 'Carregando...' }}
              </span>
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

      <!-- Layout Mobile -->
      <div v-else class="space-y-2">
        <div
          v-for="empleado in empleadosConRol"
          :key="empleado.id"
          class="bg-white border border-gray-300 rounded-lg p-3 flex justify-between items-center hover:bg-gray-100 cursor-pointer"
        >
          <div class="flex-1">
            <p class="text-gray-700 font-semibold">{{ empleado.nombre }}</p>
            <span class="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-gray-400 text-white">
              {{ empleado.rolNombre || 'Desconhecido' }}
            </span>
          </div>
          <div class="relative">
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
        </div>
      </div>
    </div>

    <p v-if="loading" class="mt-4 text-gray-700">Carregando...</p>
    <p v-if="error" class="mt-4 text-red-600">{{ error }}</p>
  </div>
</template>

<script>
import empleadoService from '../services/empleadoService';

export default {
  props: {
    empleados: { type: Array, required: true },
    colunas: { type: Array, required: true, default: () => [] },
    loading: { type: Boolean, default: false },
    error: { type: String, default: null },
  },
  data() {
    return {
      menuAberto: null,
      empleadosConRol: [],
      rolesCache: {},
      isMobile: window.innerWidth < 768, // Define mobile como largura < 768px
    };
  },
  created() {
    this.empleadosConRol = [...this.empleados];
    this.fetchRoles();
    window.addEventListener('resize', this.handleResize);
  },
  destroyed() {
    window.removeEventListener('resize', this.handleResize);
  },
  methods: {
    toggleMenu(itemId) {
      this.menuAberto = this.menuAberto === itemId ? null : itemId;
    },
    async fetchRoles() {
      try {
        const rolIds = [...new Set(this.empleados.map(e => e.rolId))].filter(id => id != null);
        if (!rolIds.length) {
          this.empleadosConRol = this.empleados.map(e => ({ ...e, rolNombre: 'Papel não definido' }));
          return;
        }

        const requests = rolIds.map(id =>
          empleadoService.getRolById(id).catch(() => ({ nombre: 'Papel não encontrado' }))
        );
        const roles = await Promise.all(requests);
        rolIds.forEach((id, index) => (this.rolesCache[id] = roles[index].nombre));

        this.empleadosConRol = this.empleados.map(empleado => ({
          ...empleado,
          rolNombre: this.rolesCache[empleado.rolId] || 'Papel não definido',
        }));
      } catch (err) {
        this.$emit('update:error', 'Erro ao carregar os papéis: ' + err.message);
        this.empleadosConRol = this.empleados.map(e => ({ ...e, rolNombre: 'Erro ao buscar papel' }));
      }
    },
    handleResize() {
      this.isMobile = window.innerWidth < 768;
    },
  },
  watch: {
    empleados(newEmpleados) {
      this.empleadosConRol = [...newEmpleados];
      this.fetchRoles();
    },
  },
};
</script>

<style scoped>
/* Estilo para mobile */
@media (max-width: 767px) {
  .p-6 {
    padding: 1rem;
  }
}
</style>