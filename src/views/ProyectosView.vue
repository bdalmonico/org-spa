<!-- <template>
  <div class="projetos">
    <h1>Lista de Projetos</h1>
    <Buscador :campos="camposBusca" @buscar="handleBuscar" />
    <Lista
      :itens="projetos"
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
      projetos: [],
      loading: false,
      error: null,
      camposBusca: [
        { name: 'nombre', label: 'Nome', type: 'text', placeholder: 'Digite o nome' },
        { name: 'estadoId', label: 'Estado ID', type: 'number', placeholder: 'ID do estado' },
        { name: 'clienteNombre', label: 'Cliente', type: 'text', placeholder: 'Nome do cliente' },
      ],
      colunasTabela: [
        { key: 'id', label: 'ID' },
        { key: 'nombre', label: 'Nome' },
        { key: 'descripcion', label: 'Descrição' },
        { key: 'clienteNombre', label: 'Cliente' },
        { key: 'estadoId', label: 'Estado ID' },
      ],
    };
  },
  mounted() {
    this.fetchProjetos({});
  },
  methods: {
    async fetchProjetos(filtros) {
      this.loading = true;
      this.error = null;
      try {
        const response = await axios.get('/api/proyecto', { params: filtros });
        this.projetos = response.data.page;
      } catch (err) {
        this.error = 'Erro ao carregar os projetos: ' + err.message;
      } finally {
        this.loading = false;
      }
    },
    handleBuscar(filtros) {
      this.fetchProjetos(filtros);
    },
    handleItemClicked(id) {
      this.$router.push(`/projetos/${id}`);
    },
  },
};
</script>

<style scoped>
.projetos {
  padding: 2rem;
}
</style> -->

<template>
  <div class="p-8 bg-gray-100">
    <div class="flex justify-between items-center mb-4">
      <h1 class="text-2xl text-blue-800">Proyectos</h1>
      <button class="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600 transition-colors" @click="crearProyecto">Crear nuevo proyecto</button>
    </div>
    <Buscador :campos="camposBusca" @buscar="handleBuscar" />
    <Lista
      :itens="proyectos"
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
      proyectos: [],
      loading: false,
      error: null,
      camposBusca: [
        { name: 'nombre', label: 'Nome', type: 'text', placeholder: 'Digite o nome' },
        { name: 'estadoId', label: 'Estado ID', type: 'number', placeholder: 'ID do estado' },
        { name: 'clienteNombre', label: 'Cliente', type: 'text', placeholder: 'Nome do cliente' },
      ],
      colunasTabela: [
        { key: 'nombre', label: 'Nombre de proyecto' },
        { key: 'id', label: 'Identificador' },
        { key: 'estadoId', label: 'Número empleado' }, // Ajuste conforme sua API
        { key: 'fechaEstimadaInicio', label: 'Desde' },
        { key: 'fechaEstimadaFin', label: 'Hasta' },
        { key: 'importe', label: 'Importe' },
      ],
    };
  },
  mounted() {
    this.fetchProyectos({});
  },
  methods: {
    async fetchProyectos(filtros) {
      this.loading = true;
      this.error = null;
      try {
        const response = await axios.get('/api/proyecto', { params: filtros });
        this.proyectos = response.data.page;
      } catch (err) {
        this.error = 'Erro ao carregar os proyectos: ' + err.message;
      } finally {
        this.loading = false;
      }
    },
    handleBuscar(filtros) {
      this.fetchProyectos(filtros);
    },
    handleItemClicked(id) {
      this.$router.push(`/projetos/${id}`);
    },
    crearProyecto() {
      console.log('Criar novo projeto');
      // Implemente a lógica para criar um novo projeto
      // Exemplo: this.$router.push('/proyectos/novo');
    },
  },
};
</script>