<template>
  <div class="mb-4">
    <form @submit.prevent="buscar" class="flex flex-col gap-4 md:flex-row md:items-end">
      <div v-for="campo in campos" :key="campo.name" class="flex-1">
        <label :for="campo.name" class="block text-sm font-medium text-gray-700">
          {{ campo.label }}:
          <input
            :id="campo.name"
            :type="campo.type || 'text'"
            v-model="filtros[campo.name]"
            :placeholder="campo.placeholder || ''"
            class="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:border-blue-300 focus:ring focus:ring-blue-200 focus:ring-opacity-50"
          />
        </label>
      </div>
      <button type="submit" class="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 transition-colors">Buscar</button>
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
    };
  },
  created() {
    this.campos.forEach(campo => {
      this.filtros[campo.name] = campo.type === 'number' ? null : '';
    });
    this.debouncedBuscar = debounce(this.buscar, 300);
  },
  watch: {
    filtros: {
      handler() {
        this.debouncedBuscar();
      },
      deep: true,
    },
  },
  methods: {
    buscar() {
      const filtrosLimpos = Object.fromEntries(
        Object.entries(this.filtros).filter(([_, value]) => value !== '' && value !== null)
      );
      this.$emit('buscar', filtrosLimpos);
    },
  },
};
</script>