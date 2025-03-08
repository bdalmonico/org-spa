<template>
  <div class="p-8 bg-gray-100">
    <div class="flex justify-between items-center mb-4">
      <h1 class="text-2xl text-blue-800">Lista de Empregados</h1>
      <button
        class="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600 transition-colors cursor-pointer"
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
import axios from 'axios';
import Buscador from '../components/Buscador.vue';
import ListaEmpleados from '../components/ListaEmpleados.vue';
import CrearEmpleadoModal from '../components/CrearEmpleadoModal.vue';

export default {
  components: {
    Buscador,
    ListaEmpleados,
    CrearEmpleadoModal,
  },
  data() {
    return {
      empleados: [],
      loading: false,
      error: null,
      showCrearEmpleadoModal: false,
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
  mounted() {
    this.fetchEmpleados({});
  },
  methods: {
    async fetchEmpleados(filtros) {
      this.loading = true;
      this.error = null;
      try {
        const response = await axios.get('/api/empleado', { params: filtros });
        const formattedEmpleados = response.data.page.map(empleado => ({
          ...empleado,
          fechaAlta: this.formatDate(empleado.fechaAlta),
        }));
        this.empleados = formattedEmpleados || [];
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
        console.log(`Tentando excluir empregado com ID: ${empleadoId}`); // Log para depuração
        const response = await axios.delete(`/api/empleado/del/${empleadoId}`);

        if (response.status === 200) {
          alert('Empregado excluído com sucesso!');
          await this.fetchEmpleados({}); // Atualiza a lista após a exclusão
        } else {
          throw new Error('Erro inesperado na exclusão.');
        }
      } catch (err) {
        console.error('Erro ao excluir empregado:', err); // Log para depuração
        if (err.response && err.response.status === 404) {
          this.error = `Empregado ${empleadoId} não encontrado.`;
        } else if (err.response && err.response.status === 400) {
          this.error = 'ID inválido fornecido.';
        } else {
          this.error = 'Erro ao excluir empregado: ' + (err.response?.data || err.message);
        }
      } finally {
        this.loading = false;
      }
    },
    formatDate(date) {
      if (!date) return '';
      return new Date(date).toLocaleDateString('pt-BR');
    },
  },
};
</script>

<style scoped>
.p-8 {
  padding: 2rem;
}
</style>