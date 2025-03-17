<template>
  <div class="mb-6">
    <form @submit.prevent="buscar" :class="['flex gap-4', isMobile ? 'flex-col' : 'flex-row items-end']">
      <div v-for="campo in camposFiltrados" :key="campo.name" class="flex-1">
        <label :for="campo.name" :class="['block text-sm font-medium text-gray-700', isMobile ? 'mb-1' : 'mb-2']">
          {{ campo.label }}
          <input
            v-if="campo.name !== 'estadoId'"
            :id="campo.name"
            :type="campo.type || 'text'"
            v-model="filtros[campo.name]"
            :placeholder="campo.placeholder || ''"
            :class="[
              'block w-full border border-gray-300 rounded-lg shadow-sm focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-colors duration-200',
              isMobile ? 'p-2 text-sm' : 'p-2.5'
            ]"
          />
          <select
            v-else
            :id="campo.name"
            v-model="filtros[campo.name]"
            :class="[
              'block w-full border border-gray-300 rounded-lg shadow-sm focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-colors duration-200',
              isMobile ? 'p-2 text-sm' : 'p-2.5'
            ]"
          >
            <option :value="null">Todos</option>
            <option v-for="(estado, id) in estados" :key="id" :value="id">
              {{ estado }}
            </option>
          </select>
        </label>
      </div>
      <div :class="['flex gap-2', isMobile ? 'mt-2' : '']">
        <button
          type="submit"
          class="bg-gradient-to-r from-blue-500 to-blue-600 text-white px-4 py-2 rounded-lg shadow-md hover:from-blue-600 hover:to-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-300 transition-colors duration-200"
        >
          Buscar
        </button>
        <button
          type="button"
          @click="limparFiltros"
          class="bg-gray-200 text-gray-700 px-4 py-2 rounded-lg shadow-md hover:bg-gray-300 focus:outline-none focus:ring-2 focus:ring-gray-300 transition-colors duration-200"
        >
          Limpar
        </button>
      </div>
    </form>
  </div>
</template>

<script>
import debounce from 'lodash/debounce';

export default {
  props: {
    campos: {
      type: Array,
      required: true,
      default: () => [],
    },
  },
  data() {
    return {
      filtros: {},
      isMobile: window.innerWidth < 768,
      estados: {
        1: 'Aberto',
        2: 'Concluído',
        3: 'Trabalhando',
        4: 'Aprovação',
        5: 'Protótipo',
        6: 'Ativo',
        7: 'Inativo',
        8: 'Desenvolvimento',
      },
    };
  },
  computed: {
    camposFiltrados() {
      return this.campos.map(campo => {
        if (campo.name === 'estadoId') {
          return { ...campo, type: 'select', label: 'Estado' }; // Ajusta o label para "Estado"
        }
        return campo;
      });
    },
  },
  created() {
    this.initializeFiltros();
    this.debouncedBuscar = debounce(this.buscar, 300);
    window.addEventListener('resize', this.handleResize);
  },
  destroyed() {
    window.removeEventListener('resize', this.handleResize);
  },
  watch: {
    filtros: {
      handler() {
        this.debouncedBuscar();
      },
      deep: true,
    },
    campos(newCampos) {
      this.initializeFiltros(newCampos);
    },
  },
  methods: {
    initializeFiltros(campos = this.camposFiltrados) {
      const novosFiltros = {};
      campos.forEach(campo => {
        novosFiltros[campo.name] = campo.name === 'estadoId' ? null : campo.type === 'number' ? null : '';
      });
      Object.assign(this.filtros, novosFiltros);
    },
    buscar() {
      const filtrosLimpos = Object.fromEntries(
        Object.entries(this.filtros).filter(([_, value]) => value !== '' && value !== null)
      );
      this.$emit('buscar', filtrosLimpos);
    },
    limparFiltros() {
      this.camposFiltrados.forEach(campo => {
        this.filtros[campo.name] = campo.name === 'estadoId' ? null : campo.type === 'number' ? null : '';
      });
      this.buscar();
    },
    handleResize() {
      this.isMobile = window.innerWidth < 768;
    },
  },
};
</script>

<style scoped>
input:focus,
select:focus {
  outline: none;
}
</style>