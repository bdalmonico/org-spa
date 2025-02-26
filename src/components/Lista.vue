 <!-- <template>

    <div class="lista">
      <table>
        <thead>
          <tr>
            <th v-for="coluna in colunas" :key="coluna.key">{{ coluna.label }}</th>
          </tr>
        </thead>
        <tbody>
          <tr
            v-for="item in itens"
            :key="item.id"
            @click="$emit('item-clicked', item.id)"
            class="clickable"
          >
            <td v-for="coluna in colunas" :key="coluna.key">
              {{ item[coluna.key] }}
            </td>
          </tr>
        </tbody>
      </table>
      <p v-if="loading">Carregando...</p>
      <p v-if="error">{{ error }}</p>
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
  };
  </script>
  
  <style scoped>
  .lista {
    width: 100%;
  }
  table {
    width: 100%;
    border-collapse: collapse;
  }
  th, td {
    border: 1px solid #ddd;
    padding: 8px;
    text-align: left;
  }
  th {
    background-color: #f2f2f2;
  }
  .clickable {
    cursor: pointer;
  }
  .clickable:hover {
    background-color: #f5f5f5;
  }
  </style> -->

  <!-- <template>
    <div class="lista">
      <table class="min-w-full bg-white border border-gray-300 rounded-lg shadow">
        <thead>
          <tr>
            <th v-for="coluna in colunas" :key="coluna.key" class="py-3 px-4 bg-blue-800 text-white text-left font-semibold border-b border-gray-300">
              {{ coluna.label }}
            </th>
            <th class="py-3 px-4 bg-blue-800 text-white text-left font-semibold border-b border-gray-300">Ações</th>
          </tr>
        </thead>
        <tbody>
          <tr
            v-for="item in itens"
            :key="item.id"
            @click="$emit('item-clicked', item.id)"
            class="hover:bg-gray-100 cursor-pointer border-b border-gray-200"
          >
            <td v-for="coluna in colunas" :key="coluna.key" class="py-2 px-4 text-gray-700">
              {{ item[coluna.key] }}
            </td>
            <td class="py-2 px-4 flex gap-2">
              <button class="bg-green-500 text-white px-3 py-1 rounded hover:bg-green-600 transition-colors" @click.stop="editarItem(item.id)">Editar</button>
              <button class="bg-red-500 text-white px-3 py-1 rounded hover:bg-red-600 transition-colors" @click.stop="borrarItem(item.id)">Borrar</button>
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
    methods: {
      editarItem(id) {
        console.log('Editar item:', id);
        // Implemente a lógica para editar (ex.: redirecionar para um formulário de edição)
        // this.$router.push(`/proyectos/editar/${id}`);
      },
      borrarItem(id) {
        console.log('Borrar item:', id);
        // Implemente a lógica para deletar (ex.: chamar API DELETE /v1/proyecto/{id})
        // Exemplo: if (confirm('Tem certeza?')) { axios.delete(`/api/proyecto/${id}`); }
      },
    },
  };
  </script> -->


  <template>
    <div class="lista">
      <table class="min-w-full bg-white border border-gray-300 rounded-lg shadow">
        <thead>
          <tr>
            <th v-for="coluna in colunas" :key="coluna.key" class="py-3 px-4 bg-blue-800 text-white text-left font-semibold border-b border-gray-300">
              {{ coluna.label }}
            </th>
            <th class="py-3 px-4 bg-blue-800 text-white text-left font-semibold border-b border-gray-300">Ações</th>
          </tr>
        </thead>
        <tbody>
          <tr
            v-for="item in itens"
            :key="item.id"
            @click="$emit('item-clicked', item.id)"
            class="hover:bg-gray-100 cursor-pointer border-b border-gray-200"
          >
            <td v-for="coluna in colunas" :key="coluna.key" class="py-2 px-4 text-gray-700">
              {{ item[coluna.key] }}
            </td>
            <td class="py-2 px-4 flex gap-2">
              <button class="bg-green-500 text-white px-3 py-1 rounded hover:bg-green-600 transition-colors" @click.stop="editarItem(item.id)">Editar</button>
              <button class="bg-red-500 text-white px-3 py-1 rounded hover:bg-red-600 transition-colors" @click.stop="borrarItem(item.id)">Borrar</button>
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
    methods: {
      editarItem(id) {
        console.log('Editar item:', id);
        // Implemente a lógica para editar
        // this.$router.push(`/proyectos/editar/${id}`);
      },
      borrarItem(id) {
        console.log('Borrar item:', id);
        // Implemente a lógica para deletar
        // if (confirm('Tem certeza?')) { axios.delete(`/api/proyecto/${id}`); }
      },
    },
  };
  </script>