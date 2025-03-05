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
            v-for="item in itens"
            :key="item.id"
            @click="$emit('item-clicked', item.id)"
            class="hover:bg-gray-100 border-b border-gray-200 cursor-pointer"
          >
            <td v-for="coluna in colunas" :key="coluna.key" class="py-2 px-4 text-gray-700">
              <span v-if="coluna.key !== 'actions' && coluna.key !== 'estado'">
                {{ item[coluna.key] }}
              </span>
              <span v-else-if="coluna.key === 'estado'" :class="`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium ${item[coluna.key].class}`">
                {{ item[coluna.key].text }}
              </span>
              <div v-else-if="coluna.key === 'actions'" class="relative">
                <button @click.stop="toggleMenu(item.id)" class="text-gray-500 hover:text-gray-700 cursor-pointer">
                  <i class="fas fa-cog"></i>
                </button>
                <div v-if="menuAberto === item.id" class="absolute right-0 top-full mt-2 bg-white border border-gray-200 rounded-md shadow-lg z-10">
                  <button
                    class="w-full px-4 py-2 text-left text-gray-700 hover:bg-gray-100 cursor-pointer"
                    @click.stop="$emit('edit-item', item.id)"
                  >
                    Editar
                  </button>
                  <button
                    class="w-full px-4 py-2 text-left text-red-500 hover:bg-gray-100 cursor-pointer"
                    @click.stop="$emit('delete-item', item.id)"
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
        menuAberto: null, // ID do item com menu aberto
      };
    },
    methods: {
      toggleMenu(itemId) {
        this.menuAberto = this.menuAberto === itemId ? null : itemId;
      },
    },
  };
  </script>