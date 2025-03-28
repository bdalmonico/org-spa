<template>
  <div :class="['bg-gray-100', isMobile ? 'p-2' : 'p-8']">
    <div class="flex justify-between items-center mb-4">
      <h1 :class="['text-blue-800', isMobile ? 'text-xl' : 'text-2xl']">Lista de Empregados</h1>
      <button
        :class="[
          'bg-green-500 text-white rounded hover:bg-green-600 transition-colors cursor-pointer',
          isMobile ? 'px-2 py-1 text-sm' : 'px-4 py-2'
        ]"
        @click="showCrearEmpleadoModal = true"
      >
        Adicionar Novo Empregado
      </button>
    </div>
    <Buscador :campos="camposBusca" @buscar="handleBuscar" />
    <ListaEmpleados
      :empleados="empleados"
      :colunas="colunasTabela"
      :loading="loading"
      :error="error"
      @create-empleado="showCrearEmpleadoModal = true"
      @delete-item="excluirEmpleado"
    />
    <CrearEmpleadoModal
      v-if="showCrearEmpleadoModal"
      :is-open="showCrearEmpleadoModal"
      @close="showCrearEmpleadoModal = false"
      @empleadoCreated="fetchEmpleados({})"
    />
  </div>
</template>

<script>
import empleadoService from '../services/empleadoService';
import Buscador from '../components/Buscador.vue';
import ListaEmpleados from '../components/ListaEmpleados.vue';
import CrearEmpleadoModal from '../components/CrearEmpleadoModal.vue';

export default {
  components: { Buscador, ListaEmpleados, CrearEmpleadoModal },
  data() {
    return {
      empleados: [],
      loading: false,
      error: null,
      showCrearEmpleadoModal: false,
      isMobile: window.innerWidth < 768, // Define mobile como largura < 768px
      camposBusca: [
        { name: 'nombre', label: 'Nome', type: 'text', placeholder: 'Digite o nome' },
        { name: 'email', label: 'Email', type: 'text', placeholder: 'Digite o email' },
        { name: 'estadoId', label: 'Estado ID', type: 'number', placeholder: 'ID do estado' },
      ],
      colunasTabela: [
        { key: 'id', label: 'ID' },
        { key: 'nombre', label: 'Nome' },
        { key: 'apellido', label: 'Sobrenome' },
        { key: 'email', label: 'Email' },
        { key: 'fechaAlta', label: 'Data de Admissão' },
        { key: 'rolId', label: 'Papel' },
        { key: 'actions', label: '' },
      ],
    };
  },
  created() {
    window.addEventListener('resize', this.handleResize);
  },
  mounted() {
    this.fetchEmpleados({});
  },
  destroyed() {
    window.removeEventListener('resize', this.handleResize);
  },
  methods: {
    async fetchEmpleados(filtros) {
      this.loading = true;
      this.error = null;
      try {
        const data = await empleadoService.getEmpleados(filtros);
        this.empleados = data.page.map(empleado => ({
          ...empleado,
          fechaAlta: this.formatDate(empleado.fechaAlta),
        })) || [];
      } catch (err) {
        this.error = 'Erro ao carregar os empregados: ' + err.message;
      } finally {
        this.loading = false;
      }
    },
    handleBuscar(filtros) {
      this.fetchEmpleados(filtros);
    },
    async excluirEmpleado(empleadoId) {
      if (!confirm('Tem certeza de que deseja excluir este empregado?')) return;

      this.loading = true;
      this.error = null;
      try {
        await empleadoService.deleteEmpleado(empleadoId);
        alert('Empregado excluído com sucesso!');
        await this.fetchEmpleados({});
      } catch (err) {
        this.error = err.response?.status === 404
          ? `Empregado ${empleadoId} não encontrado.`
          : 'Erro ao excluir empregado: ' + (err.response?.data || err.message);
      } finally {
        this.loading = false;
      }
    },
    formatDate(date) {
      if (!date) return '';
      return new Date(date).toLocaleDateString('pt-BR');
    },
    handleResize() {
      this.isMobile = window.innerWidth < 768;
    },
  },
};
</script>

<style scoped>
.p-8 {
  padding: 2rem;
}
</style>