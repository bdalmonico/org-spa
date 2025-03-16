<template>
  <div class="lista w-[95%] mx-auto">
    <table class="w-full bg-white border border-gray-300 rounded-lg shadow">
      <thead>
        <tr>
          <th v-for="coluna in colunas" :key="coluna.key" class="py-2 px-1 md:px-2 bg-blue-800 text-white text-left font-semibold border-b border-gray-300 text-sm md:text-base">
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
          <td v-for="coluna in colunas" :key="coluna.key" class="py-1 px-1 md:px-2 text-gray-700 text-sm md:text-base">
            <span v-if="coluna.key !== 'estado'">
              {{ item[coluna.key] }}
            </span>
            <span v-else-if="coluna.key === 'estado'" :class="`inline-flex items-center px-1 md:px-2 py-0.5 rounded-full text-xs font-medium ${item[coluna.key].class}`">
              {{ item[coluna.key].text }}
            </span>
          </td>
        </tr>
      </tbody>
    </table>
    <p v-if="loading" class="mt-2 text-gray-700">Carregando...</p>
    <p v-if="error" class="mt-2 text-red-600">{{ error }}</p>
  </div>
</template>

<script>
import proyectoService from '../services/proyectoService'; 

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
};
</script>

<style scoped>
/* Garantir que a tabela seja fluida */
.lista table {
  width: 100%;
  table-layout: auto;
}

/* Ajustar o tamanho mínimo das células */
.lista td, .lista th {
  min-width: 0;
  overflow-wrap: break-word;
}
</style>