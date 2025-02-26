<template>
    <div class="tareas">
      <h1>Lista de Tareas</h1>
      <Buscador :campos="camposBusca" @buscar="handleBuscar" />
      <Lista
        :itens="tareas"
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
        tareas: [],
        loading: false,
        error: null,
        camposBusca: [
          { name: 'nombre', label: 'Nome', type: 'text', placeholder: 'Digite o nome' },
          { name: 'estadoId', label: 'Estado ID', type: 'number', placeholder: 'ID do estado' },
          { name: 'proyectoId', label: 'Proyecto ID', type: 'number', placeholder: 'ID do proyecto' },
        ],
        colunasTabela: [
          { key: 'id', label: 'ID' },
          { key: 'nombre', label: 'Nome' },
          { key: 'descripcion', label: 'Descrição' },
          { key: 'estadoId', label: 'Estado ID' },
          { key: 'proyectoId', label: 'Proyecto ID' },
          { key: 'fechaEstimadaInicio', label: 'Data Estimada Início' },
        ],
      };
    },
    mounted() {
      this.fetchTareas({});
    },
    methods: {
      async fetchTareas(filtros) {
        this.loading = true;
        this.error = null;
        try {
          const response = await axios.get('/api/tarea', { params: filtros });
          this.tareas = response.data.page; // 'page' contém a lista de tarefas
        } catch (err) {
          this.error = 'Erro ao carregar as tareas: ' + err.message;
        } finally {
          this.loading = false;
        }
      },
      handleBuscar(filtros) {
        this.fetchTareas(filtros);
      },
      handleItemClicked(id) {
        this.$router.push(`/tareas/${id}`);
      },
    },
  };
  </script>
  
  <style scoped>
  .tareas {
    padding: 2rem;
  }
  </style>