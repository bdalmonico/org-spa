<template>
    <div class="empleados">
      <h1>Lista de Empleados</h1>
      <Buscador :campos="camposBusca" @buscar="handleBuscar" />
      <Lista
        :itens="empleados"
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
        empleados: [],
        loading: false,
        error: null,
        camposBusca: [
          { name: 'nombre', label: 'Nome', type: 'text', placeholder: 'Digite o nome' },
          { name: 'apellido', label: 'Sobrenome', type: 'text', placeholder: 'Digite o sobrenome' },
          { name: 'email', label: 'Email', type: 'text', placeholder: 'Digite o email' },
          { name: 'rolId', label: 'Rol ID', type: 'number', placeholder: 'ID do rol' },
        ],
        colunasTabela: [
          { key: 'id', label: 'ID' },
          { key: 'nombre', label: 'Nome' },
          { key: 'apellido', label: 'Sobrenome' },
          { key: 'email', label: 'Email' },
          { key: 'fechaAlta', label: 'Data de Alta' },
          { key: 'rolId', label: 'Rol ID' },
        ],
      };
    },
    mounted() {
      this.fetchEmpleados({});
    },
    methods: {
      async fetchEmpleados(filtros) {
        this.loading = true;
        this.error = null;
        try {
          const response = await axios.get('/api/empleado', { params: filtros });
          this.empleados = response.data.page; // 'page' contém a lista de empleados
        } catch (err) {
          this.error = 'Erro ao carregar os empleados: ' + err.message;
        } finally {
          this.loading = false;
        }
      },
      handleBuscar(filtros) {
        this.fetchEmpleados(filtros);
      },
      handleItemClicked(id) {
        this.$router.push(`/empleados/${id}`);
      },
    },
  };
  </script>
  
  <style scoped>
  .empleados {
    padding: 2rem;
  }
  </style>