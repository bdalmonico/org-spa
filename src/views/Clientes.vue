<template>
    <div class="clientes">
      <h1>Lista de Clientes</h1>
      <Buscador :campos="camposBusca" @buscar="handleBuscar" />
      <Lista
        :itens="clientes"
        :colunas="colunasTabela"
        :loading="loading"
        :error="error"
        @item-clicked="handleItemClicked"
      />
    </div>
  </template>
  
  <script>
  import axios from 'axios';
  import Buscador from '../components/Buscador.vue';
  import Lista from '../components/Lista.vue';
  
  export default {
    components: {
      Buscador,
      Lista,
    },
    data() {
      return {
        clientes: [],
        loading: false,
        error: null,
        camposBusca: [
          { name: 'nombre', label: 'Nome', type: 'text', placeholder: 'Digite o nome' },
          { name: 'email', label: 'Email', type: 'text', placeholder: 'Digite o email' },
          { name: 'estadoId', label: 'Estado ID', type: 'number', placeholder: 'ID do estado' },
        ],
        colunasTabela: [
          { key: 'id', label: 'ID' },
          { key: 'nombre', label: 'Nome' },
          { key: 'email', label: 'Email' },
          { key: 'telefone', label: 'Telefone' },
          { key: 'estadoId', label: 'Estado ID' },
        ],
      };
    },
    mounted() {
      this.fetchClientes({});
    },
    methods: {
      async fetchClientes(filtros) {
        this.loading = true;
        this.error = null;
        try {
          const response = await axios.get('/api/cliente', { params: filtros });
          this.clientes = response.data.page; // 'page' contém a lista de clientes
        } catch (err) {
          this.error = 'Erro ao carregar os clientes: ' + err.message;
        } finally {
          this.loading = false;
        }
      },
      handleBuscar(filtros) {
        this.fetchClientes(filtros);
      },
      handleItemClicked(id) {
        this.$router.push(`/clientes/${id}`);
      },
    },
  };
  </script>
  
  <style scoped>
  .clientes {
    padding: 2rem;
  }
  </style>