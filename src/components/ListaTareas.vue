<template>
  <div class="lista">
    <table class="min-w-full bg-white border border-gray-300 rounded-lg shadow">
      <thead>
        <tr>
          <th v-for="coluna in colunas" :key="coluna.key" class="py-3 px-4 bg-blue-800 text-white text-left font-semibold border-b border-gray-300">
            {{ coluna.label }}
          </th>
        </tr>
      </thead>
      <tbody>
        <tr
          v-for="item in itensComEstado"
          :key="item.id"
          @click="$emit('item-clicked', item.id)"
          class="hover:bg-gray-100 border-b border-gray-200 cursor-pointer"
        >
          <td v-for="coluna in colunas" :key="coluna.key" class="py-2 px-4 text-gray-700">
            <span v-if="coluna.key !== 'actions' && coluna.key !== 'estadoId' && coluna.key !== 'proyectoId'">
              {{ item[coluna.key] }}
            </span>
            <span v-if="coluna.key === 'estadoId'">
              {{ item.estadoNombre || 'Carregando...' }}
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
    <p v-if="loading" class="mt-4 text-gray-700">Carregando...</p>
    <p v-if="error" class="mt-4 text-red-600">{{ error }}</p>
  </div>
</template>

<script>
import estadoService from '../services/estadoService';

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
  },
  data() {
    return {
      menuAberto: null,
      estadosCache: {}, // Cache para armazenar os nomes dos estados
      itensComEstado: [], // Itens com o campo estadoNombre preenchido
    };
  },
  async created() {
    this.itensComEstado = [...this.itens];
    await this.fetchEstados();
  },
  methods: {
    toggleMenu(itemId) {
      this.menuAberto = this.menuAberto === itemId ? null : itemId;
    },
    async fetchEstados() {
      try {
        const estadoIds = [...new Set(this.itens.map(item => item.estadoId))].filter(id => id != null);
        if (estadoIds.length === 0) {
          console.log('Nenhum estadoId para buscar');
          return;
        }

        console.log('Buscando estados para IDs:', estadoIds);

        const requests = estadoIds.map(id =>
          estadoService.getEstadoById(id).catch(err => {
            console.error(`Erro ao buscar estado ${id}:`, err);
            return { nombre: 'Estado não encontrado' }; // Fallback em caso de erro
          })
        );
        const responses = await Promise.all(requests);

        responses.forEach((estado, index) => {
          const estadoId = estadoIds[index];
          this.estadosCache[estadoId] = estado.nombre || 'Estado não encontrado';
          console.log(`Estado ${estadoId}: ${this.estadosCache[estadoId]}`);
        });

        this.itensComEstado = this.itens.map(item => ({
          ...item,
          estadoNombre: this.estadosCache[item.estadoId] || 'Estado não encontrado',
        }));
      } catch (err) {
        console.error('Erro ao carregar os estados:', err);
        this.$emit('update:error', 'Erro ao carregar os estados: ' + err.message);
      }
    },
    verProyecto(proyectoId) {
      this.$router.push(`/projetos/${proyectoId}`);
    },
  },
  watch: {
    itens(newItens) {
      this.itensComEstado = [...newItens];
      this.fetchEstados();
    },
  },
};
</script>