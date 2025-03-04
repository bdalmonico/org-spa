<template>
  <div class="p-8 bg-gray-100">
    <div class="flex justify-between items-center mb-4">
      <h1 class="text-2xl text-blue-800">Proyectos</h1>
      <button class="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600 transition-colors cursor-pointer" @click="showCrearProyectoModal = true">Crear nuevo proyecto</button>
    </div>
    <Buscador :campos="camposBusca" @buscar="handleBuscar" />
    <Lista
      :itens="proyectos"
      :colunas="colunasTabela"
      :loading="loading"
      :error="error"
      @item-clicked="handleItemClicked"
      @edit-item="editarProyecto"
      @delete-item="excluirProyecto"
    />
    <CrearProyectoModal v-if="showCrearProyectoModal" :is-open="showCrearProyectoModal" @close="showCrearProyectoModal = false" @projectCreated="fetchProyectos({})" />
    <EditarProyectoModal v-if="showEditarProyectoModal" :is-open="showEditarProyectoModal" :proyecto="projetoEditando" @close="showEditarProyectoModal = false" @projectUpdated="fetchProyectos({})" />
  </div>
</template>

<script>
import axios from 'axios';
import Buscador from '../components/Buscador.vue';
import Lista from '../components/Lista.vue';
import CrearProyectoModal from '../components/CrearProyectoModal.vue';
import EditarProyectoModal from '../components/EditarProyectoModal.vue';
import { formatDate } from '../utils/dateUtils'; // Caminho relativo manual

export default {
  components: {
    Buscador,
    Lista,
    CrearProyectoModal,
    EditarProyectoModal,
  },
  data() {
    return {
      proyectos: [],
      nombresEmpleados: {}, // Armazena os nomes dos empregados por estadoId
      loading: false,
      error: null,
      showCrearProyectoModal: false, // Estado para o modal de criar
      showEditarProyectoModal: false, // Estado para o modal de editar
      projetoEditando: null, // Projeto sendo editado
      camposBusca: [
        { name: 'nombre', label: 'Nome', type: 'text', placeholder: 'Digite o nome' },
        { name: 'estadoId', label: 'Estado ID', type: 'number', placeholder: 'ID do estado' },
        { name: 'clienteNombre', label: 'Cliente', type: 'text', placeholder: 'Nome do cliente' },
        { name: 'descripcion', label: 'Descrição', type: 'text', placeholder: 'Digite a descrição' },
        { name: 'importe', label: 'Importe', type: 'text', placeholder: 'Digite o importe (ex.: €10,000.00)' },
      ],
      colunasTabela: [
        { key: 'id', label: 'ID' },
        { key: 'nombre', label: 'Nombre' },
        { key: 'encargado', label: 'Encargado' }, // Renomeado de 'Empleado' para 'Encargado'
        { key: 'fechaEstimadaInicio', label: 'Desde' }, // Adicionada data estimada de início
        { key: 'fechaEstimadaFin', label: 'Hasta' }, // Adicionada data estimada de fim
        { key: 'estado', label: 'Status' }, // Badge para status
        { key: 'actions', label: '' }, // Botão de configurações sem texto
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
        // Formata as datas manualmente, sem usar spread operator, e busca nomes dos empregados
        const formattedProyectos = [];
        for (const proyecto of response.data.page) {
          const proyectoFormatted = {
            id: proyecto.id,
            nombre: proyecto.nombre,
            descripcion: proyecto.descripcion,
            estadoId: proyecto.estadoId,
            clienteNombre: proyecto.clienteNombre,
            fechaEstimadaInicio: formatDate(proyecto.fechaEstimadaInicio),
            fechaEstimadaFin: formatDate(proyecto.fechaEstimadaFin),
          };
          // Busca o nome do empregado (usando estadoId como empleadoId)
          proyectoFormatted.encargado = await this.getEmpleadoNombre(proyecto.estadoId); // Renomeado para 'encargado'
          proyectoFormatted.estado = this.getEstadoBadge(proyecto.estadoId); // Adiciona o badge de status
          formattedProyectos.push(proyectoFormatted);
        }
        this.proyectos = formattedProyectos;
      } catch (err) {
        this.error = 'Erro ao carregar os proyectos: ' + err.message;
      } finally {
        this.loading = false;
      }
    },
    async getEmpleadoNombre(estadoId) {
      if (!estadoId || this.nombresEmpleados[estadoId]) {
        return this.nombresEmpleados[estadoId] || 'Desconhecido';
      }
      try {
        const response = await axios.get(`/api/empleado/${estadoId}`);
        this.nombresEmpleados[estadoId] = response.data.nombre; // Assume que o endpoint retorna um objeto com 'nombre'
        return this.nombresEmpleados[estadoId];
      } catch (err) {
        console.warn(`Erro ao carregar nome do empregado ${estadoId}: ${err.message}`);
        this.nombresEmpleados[estadoId] = 'Desconhecido';
        return 'Desconhecido';
      }
    },
    getEstadoBadge(estadoId) {
      switch (estadoId) {
        case 1: // ABERTO
          return { text: 'ABERTO', class: 'bg-green-500 text-white' };
        case 6: // ACTIVO
          return { text: 'ACTIVO', class: 'bg-blue-500 text-white' };
        case 4: // APROBACION
          return { text: 'APROBACION', class: 'bg-yellow-500 text-black' };
        case 2: // CONCLUIDO
          return { text: 'CONCLUIDO', class: 'bg-gray-500 text-white' };
        case 8: // DESARROLLO
          return { text: 'DESARROLLO', class: 'bg-purple-500 text-white' };
        case 7: // INACTIVO
          return { text: 'INACTIVO', class: 'bg-red-500 text-white' };
        case 5: // PROTOTIPO
          return { text: 'PROTOTIPO', class: 'bg-orange-500 text-white' };
        case 3: // TRABAJANDO
          return { text: 'TRABAJANDO', class: 'bg-cyan-500 text-white' };
        default:
          return { text: 'DESCONHECIDO', class: 'bg-gray-400 text-white' };
      }
    },
    handleBuscar(filtros) {
      this.fetchProyectos(filtros); // Simplesmente passa os filtros sem ajustes de datas
    },
    handleItemClicked(id) {
      this.$router.push(`/projetos/${id}`); // Caminho manual para rota
    },
    crearProyecto() {
      this.showCrearProyectoModal = true; // Abre o modal de criar projeto
    },
    editarProyecto(proyectoId) {
      const proyecto = this.proyectos.find(p => p.id === proyectoId);
      this.projetoEditando = { ...proyecto }; // Cria uma cópia do projeto para editar
      this.showEditarProyectoModal = true; // Abre o modal de edição
    },
    async excluirProyecto(proyectoId) {
      if (!confirm('Tem certeza de que deseja excluir este projeto?')) return;

      this.loading = true;
      this.error = null;

      try {
        await axios.delete(`/api/proyecto/del/${proyectoId}`); // Ajustado para /del/{id}
        // Atualiza a lista de projetos após exclusão
        await this.fetchProyectos({});
      } catch (err) {
        if (err.response && err.response.status === 400) {
          this.error = 'Projeto ' + proyectoId + ' não encontrado';
        } else {
          this.error = 'Erro ao excluir projeto: ' + (err.message || 'Tente novamente.');
        }
      } finally {
        this.loading = false;
      }
    },
    // Método utilitário como método do componente (para uso no template, se necessário)
    formatDate(dateStr) {
      return formatDate(dateStr); // Usa o método do utilitário
    },
  },
};
</script>