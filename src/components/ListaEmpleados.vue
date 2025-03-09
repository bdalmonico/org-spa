<template>
  <div class="p-6">
    <h2 class="text-2xl font-bold text-blue-800 mb-4">Lista de Empregados</h2>

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
    </div>

    <p v-if="loading" class="mt-4 text-gray-700">Carregando...</p>
    <p v-if="error" class="mt-4 text-red-600">{{ error }}</p>
  </div>
</template>

<script>
import axios from 'axios';

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
      empleadosConRol: [], // Empregados com o campo rolNombre preenchido
      rolesCache: {}, // Cache para armazenar os nomes dos papéis
    };
  },
  created() {
    console.log('ListaEmpleados criado, empleados recebidos:', this.empleados);
    this.empleadosConRol = [...this.empleados];
    this.fetchRoles();
  },
  methods: {
    toggleMenu(itemId) {
      this.menuAberto = this.menuAberto === itemId ? null : itemId;
    },
    async fetchRoles() {
      try {
        // Extrai os rolId únicos
        const rolIds = [...new Set(this.empleados.map(empleado => empleado.rolId))].filter(id => id != null);
        if (rolIds.length === 0) {
          console.log('Nenhum rolId encontrado nos empregados:', this.empleados);
          this.empleadosConRol = this.empleados.map(empleado => ({
            ...empleado,
            rolNombre: 'Papel não definido',
          }));
          return;
        }

        console.log('Buscando papéis para rolIds:', rolIds);

        // Faz chamadas paralelas ao endpoint /api/rol/{id}
        const requests = rolIds.map(id =>
          axios.get(`/api/rol/${id}`).catch(err => {
            console.error(`Erro ao buscar papel ${id}:`, err.response?.status, err.response?.data || err.message);
            return { data: { nombre: 'Papel não encontrado' } }; // Fallback em caso de erro
          })
        );
        const responses = await Promise.all(requests);

        // Atualiza o cache com os nomes dos papéis
        responses.forEach((response, index) => {
          const rolId = rolIds[index];
          console.log(`Resposta para rolId ${rolId}:`, response.data);
          this.rolesCache[rolId] = response.data.nombre || 'Papel não encontrado';
          console.log(`Papel ${rolId}: ${this.rolesCache[rolId]}`);
        });

        // Atualiza os empregados com os nomes dos papéis
        this.empleadosConRol = this.empleados.map(empleado => ({
          ...empleado,
          rolNombre: this.rolesCache[empleado.rolId] || 'Papel não definido',
        }));
        console.log('Empregados com rolNombre:', this.empleadosConRol);
      } catch (err) {
        console.error('Erro ao carregar os papéis:', err);
        this.$emit('update:error', 'Erro ao carregar os papéis: ' + err.message);
        // Fallback para evitar que a tabela fique em branco
        this.empleadosConRol = this.empleados.map(empleado => ({
          ...empleado,
          rolNombre: 'Erro ao buscar papel',
        }));
      }
    },
  },
  watch: {
    // Atualiza os papéis se os empregados mudarem
    empleados(newEmpleados) {
      console.log('Watch: empleados atualizados:', newEmpleados);
      this.empleadosConRol = [...newEmpleados];
      this.fetchRoles();
    },
  },
};
</script>