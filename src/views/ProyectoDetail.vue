<template>
  <div class="p-8 bg-gray-100">
    <div class="flex justify-between items-center mb-4">
      <h1 class="text-2xl text-blue-800">Detalhes do Proyecto</h1>
      <div class="flex gap-2">
        <button
          class="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600 transition-colors cursor-pointer"
          @click="showEditarProyectoModal = true"
        >
          Editar
        </button>
        <button
          class="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600 transition-colors cursor-pointer"
          @click="borrarProyecto"
        >
          Borrar
        </button>
      </div>
    </div>
    <div v-if="proyecto" class="bg-white p-6 rounded-lg shadow">
      <p class="mb-2"><strong class="text-gray-800">ID:</strong> {{ proyecto.id }}</p>
      <p class="mb-2"><strong class="text-gray-800">Nome:</strong> {{ proyecto.nombre }}</p>
      <p class="mb-2"><strong class="text-gray-800">Descrição:</strong> {{ proyecto.descripcion }}</p>
      <p class="mb-2"><strong class="text-gray-800">Cliente:</strong> {{ proyecto.clienteNombre }}</p>
      <p class="mb-2"><strong class="text-gray-800">Estado ID:</strong> {{ proyecto.estadoId }}</p>
      <p class="mb-2"><strong class="text-gray-800">Data Estimada de Início:</strong> {{ formatDate(proyecto.fechaEstimadaInicio) }}</p>
      <p class="mb-2"><strong class="text-gray-800">Data Estimada de Fim:</strong> {{ formatDate(proyecto.fechaEstimadaFin) }}</p>
      <p class="mb-2"><strong class="text-gray-800">Importe:</strong> {{ proyecto.importe }}</p>
      <p class="mb-2"><strong class="text-gray-800">Total de Horas Imputadas:</strong> {{ totalHorasImputadas || '0' }} horas</p>
    </div>

    <!-- Seção de Tarefas Relacionadas -->
    <div v-if="proyecto" class="mt-6 bg-white p-6 rounded-lg shadow">
      <h2 class="text-xl text-blue-800 mb-4">Tarefas Relacionadas</h2>
      <Lista
        :itens="tareas"
        :colunas="[
          { key: 'nombre', label: 'Título' },
          { key: 'fechaEstimadaInicio', label: 'Data Estimada Início' },
          { key: 'fechaEstimadaFin', label: 'Data Estimada Fim' },
        ]"
        :loading="loading"
        :error="error"
        @item-clicked="handleTareaClicked"
      />
    </div>

    <!-- Seção de Comentários do Projeto -->
    <div v-if="proyecto" class="mt-6 bg-white p-6 rounded-lg shadow">
      <h2 class="text-xl text-blue-800 mb-4">Comentários do Projeto</h2>
      <div v-if="comentarios.length" class="space-y-4">
        <div v-for="comentario in comentarios" :key="comentario.id" class="p-4 border border-gray-200 rounded-lg bg-gray-50 flex items-center justify-between relative">
          <div>
            <p class="text-gray-700">{{ comentario.comentario }}</p>
            <p class="text-sm text-gray-500 mt-2">Data/Hora: {{ formatDate(comentario.fechaHora) }}</p>
          </div>
          <div class="flex items-center gap-2">
            <button @click="verEmpleado(comentario.empleadoId)" class="text-blue-500 hover:text-blue-700">
              <i class="fas fa-user"></i> <!-- Ícone de usuário do Font Awesome -->
            </button>
            <button @click="toggleMenu(comentario.id)" class="text-gray-500 hover:text-gray-700">
              <i class="fas fa-cog"></i> <!-- Ícone de configurações do Font Awesome -->
            </button>
          </div>
          <!-- Menu de Ações (Excluir e Editar) -->
          <div v-if="menuAberto === comentario.id" class="absolute right-0 top-full mt-2 bg-white border border-gray-200 rounded-md shadow-lg z-10">
            <button
              class="w-full px-4 py-2 text-left text-gray-700 hover:bg-gray-100"
              @click.stop="editarComentario(comentario)"
            >
              Editar
            </button>
            <button
              class="w-full px-4 py-2 text-left text-red-500 hover:bg-gray-100"
              @click.stop="excluirComentario(comentario.id)"
            >
              Excluir
            </button>
          </div>
        </div>
      </div>
      <p v-else class="text-gray-500">Nenhum comentário encontrado para este projeto.</p>

      <!-- Campo de Input para Novo Comentário -->
      <div class="mt-4">
        <textarea
          v-model="novoComentario"
          class="w-full p-2 border border-gray-300 rounded-md focus:border-blue-500 focus:ring focus:ring-blue-200 focus:ring-opacity-50"
          placeholder="Digite seu comentário aqui..."
          rows="3"
        ></textarea>
        <button
          class="mt-2 bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 transition-colors"
          @click="criarComentario"
          :disabled="!novoComentario.trim()"
        >
          Adicionar Comentário
        </button>
      </div>
    </div>

    <!-- Modal para Editar Comentário -->
    <div v-if="editandoComentario" class="fixed inset-0 bg-gray-600 bg-opacity-50 flex items-center justify-center z-50">
      <div class="bg-white p-6 rounded-lg shadow-lg w-full max-w-md">
        <h3 class="text-lg font-semibold text-blue-800 mb-4">Editar Comentário</h3>
        <textarea
          v-model="comentarioEditado"
          class="w-full p-2 border border-gray-300 rounded-md focus:border-blue-500 focus:ring focus:ring-blue-200 focus:ring-opacity-50"
          rows="3"
          placeholder="Edite seu comentário..."
        ></textarea>
        <div class="mt-4 flex gap-2">
          <button
            class="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 transition-colors"
            @click="salvarEdicao"
          >
            Salvar
          </button>
          <button
            class="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600 transition-colors"
            @click="cancelarEdicao"
          >
            Cancelar
          </button>
        </div>
      </div>
    </div>

    <!-- Modal para Editar Projeto -->
    <EditarProyectoModal
      v-if="showEditarProyectoModal"
      :is-open="showEditarProyectoModal"
      :proyecto="proyecto"
      @close="showEditarProyectoModal = false"
      @projectUpdated="fetchProyecto"
    />

    <p v-if="loading" class="mt-4 text-gray-700">Carregando...</p>
    <p v-if="error" class="mt-4 text-red-600">{{ error }}</p>
    <button
      class="mt-4 bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 transition-colors cursor-pointer"
      @click="$router.go(-1)"
    >
      Voltar
    </button>
  </div>
</template>

<script>
import axios from 'axios';
import Lista from '../components/Lista.vue';
import EditarProyectoModal from '../components/EditarProyectoModal.vue';
import { formatDate } from '../utils/dateUtils'; // Caminho relativo manual

export default {
  components: {
    Lista,
    EditarProyectoModal,
  },
  data() {
    return {
      proyecto: null,
      tareas: [],
      comentarios: [],
      totalHorasImputadas: null,
      novoComentario: '', // Estado para o novo comentário
      comentarioEditado: '', // Estado para o comentário em edição
      editandoComentario: null, // ID do comentário sendo editado
      menuAberto: null, // ID do comentário com menu aberto
      loading: false,
      error: null,
      showEditarProyectoModal: false, // Estado para o modal de edição do projeto
    };
  },
  mounted() {
    this.fetchProyecto();
  },
  methods: {
    async fetchProyecto() {
      this.loading = true;
      this.error = null;
      const id = this.$route.params.id;
      try {
        const [proyectoResponse, tareasResponse, comentariosResponse, totalHorasResponse] = await Promise.all([
          axios.get(`/api/proyecto/${id}`),
          axios.get('/api/tarea'), // Busca todas as tarefas
          axios.get(`/api/comentarioproyecto/proyecto/${id}`),
          axios.get('/api/imputacion/search/total', { params: { proyectoId: id } }), // Busca o total de horas imputadas
        ]);
        // Formata as datas manualmente, sem usar spread operator
        this.proyecto = {
          id: proyectoResponse.data.id,
          nombre: proyectoResponse.data.nombre,
          descripcion: proyectoResponse.data.descripcion,
          clienteNombre: proyectoResponse.data.clienteNombre,
          estadoId: proyectoResponse.data.estadoId,
          importe: proyectoResponse.data.importe,
          clienteId: proyectoResponse.data.clienteId, // Novo campo adicionado
          fechaEstimadaInicio: formatDate(proyectoResponse.data.fechaEstimadaInicio),
          fechaEstimadaFin: formatDate(proyectoResponse.data.fechaEstimadaFin),
          fechaRealInicio: formatDate(proyectoResponse.data.fechaRealInicio), // Novo campo adicionado
          fechaRealFin: formatDate(proyectoResponse.data.fechaRealFin), // Novo campo adicionado
        };
        this.tareas = tareasResponse.data.page
          .filter(tarea => tarea.proyectoId === Number(id))
          .map(tarea => ({
            id: tarea.id,
            nombre: tarea.nombre,
            descripcion: tarea.descripcion,
            estadoId: tarea.estadoId,
            proyectoId: tarea.proyectoId,
            fechaEstimadaInicio: formatDate(tarea.fechaEstimadaInicio),
            fechaEstimadaFin: formatDate(tarea.fechaEstimadaFin),
            fechaRealInicio: formatDate(tarea.fechaRealInicio),
            fechaRealFin: formatDate(tarea.fechaRealFin),
          }));
        this.comentarios = comentariosResponse.data.page.map(comentario => ({
          id: comentario.id,
          comentario: comentario.comentario,
          empleadoId: comentario.empleadoId,
          fechaHora: formatDate(comentario.fechaHora),
          ascDesc: comentario.ascDesc,
          orderBy: comentario.orderBy,
          proyectoId: comentario.proyectoId,
        }));
        this.totalHorasImputadas = totalHorasResponse.data || 0;
      } catch (err) {
        this.error = 'Erro ao carregar o projeto, tarefas, comentários ou total de horas: ' + err.message;
      } finally {
        this.loading = false;
      }
    },
    async criarComentario() {
      if (!this.novoComentario.trim()) return;

      this.loading = true;
      this.error = null;
      const id = this.proyecto.id;
      const empleadoId = 1; // Substitua por um valor dinâmico, se disponível (ex.: do usuário logado)
      const fechaHora = new Date().toISOString(); // Data/hora atual no formato ISO

      try {
        await axios.post('/api/comentarioproyecto', null, {
          params: {
            comentario: this.novoComentario,
            empleadoId: empleadoId,
            fechaHora: fechaHora,
            proyectoId: id,
          },
        });

        // Após criar o comentário, atualiza a lista de comentários
        const response = await axios.get(`/api/comentarioproyecto/proyecto/${id}`);
        this.comentarios = response.data.page.map(comentario => ({
          id: comentario.id,
          comentario: comentario.comentario,
          empleadoId: comentario.empleadoId,
          fechaHora: formatDate(comentario.fechaHora),
          ascDesc: comentario.ascDesc,
          orderBy: comentario.orderBy,
          proyectoId: comentario.proyectoId,
        }));
        this.novoComentario = ''; // Limpa o campo de input
      } catch (err) {
        this.error = 'Erro ao criar comentário: ' + err.message;
      } finally {
        this.loading = false;
      }
    },
    toggleMenu(comentarioId) {
      this.menuAberto = this.menuAberto === comentarioId ? null : comentarioId;
    },
    async editarComentario(comentario) {
      this.editandoComentario = comentario.id;
      this.comentarioEditado = comentario.comentario; // Inicializa o campo de edição com o comentário atual
      this.menuAberto = null; // Fecha o menu ao abrir o modal
    },
    async salvarEdicao() {
      if (!this.comentarioEditado.trim() || !this.editandoComentario) return;

      this.loading = true;
      this.error = null;
      const id = this.editandoComentario;
      const empleadoId = 1; // Substitua por um valor dinâmico, se disponível
      const fechaHora = new Date().toISOString(); // Atualiza a data/hora, se necessário

      try {
        await axios.put(`/api/comentarioproyecto/${id}`, null, {
          params: {
            comentario: this.comentarioEditado,
            empleadoId: empleadoId,
            fechaHora: fechaHora,
            proyectoId: this.proyecto.id,
          },
        });

        // Atualiza a lista de comentários
        const response = await axios.get(`/api/comentarioproyecto/proyecto/${this.proyecto.id}`);
        this.comentarios = response.data.page.map(comentario => ({
          id: comentario.id,
          comentario: comentario.comentario,
          empleadoId: comentario.empleadoId,
          fechaHora: formatDate(comentario.fechaHora),
          ascDesc: comentario.ascDesc,
          orderBy: comentario.orderBy,
          proyectoId: comentario.proyectoId,
        }));
        this.cancelarEdicao(); // Fecha o modal após salvar
      } catch (err) {
        this.error = 'Erro ao editar comentário: ' + err.message;
      } finally {
        this.loading = false;
      }
    },
    cancelarEdicao() {
      this.editandoComentario = null;
      this.comentarioEditado = '';
    },
    async excluirComentario(comentarioId) {
      if (!confirm('Tem certeza de que deseja excluir este comentário?')) return;

      this.loading = true;
      this.error = null;

      try {
        await axios.delete(`/api/comentarioproyecto/${comentarioId}`);

        // Atualiza a lista de comentários
        const response = await axios.get(`/api/comentarioproyecto/proyecto/${this.proyecto.id}`);
        this.comentarios = response.data.page.map(comentario => ({
          id: comentario.id,
          comentario: comentario.comentario,
          empleadoId: comentario.empleadoId,
          fechaHora: formatDate(comentario.fechaHora),
          ascDesc: comentario.ascDesc,
          orderBy: comentario.orderBy,
          proyectoId: comentario.proyectoId,
        }));
        this.menuAberto = null; // Fecha o menu após excluir
      } catch (err) {
        this.error = 'Erro ao excluir comentário: ' + err.message;
      } finally {
        this.loading = false;
      }
    },
    handleTareaClicked(tareaId) {
      this.$router.push(`/tareas/${tareaId}`); // Navegação para detalhes da tarefa
    },
    verEmpleado(empleadoId) {
      this.$router.push(`/empleados/${empleadoId}`); // Navegação para detalhes do empregado
    },
    async editarProyecto() {
      this.showEditarProyectoModal = true; // Abre o modal de edição
    },
    async borrarProyecto() {
      if (!confirm('Tem certeza de que deseja excluir este projeto?')) return;

      this.loading = true;
      this.error = null;

      try {
        await axios.delete(`/api/proyecto/del/${this.proyecto.id}`); // Usa o endpoint /del/{id}
        // Redireciona para a lista de projetos após exclusão
        this.$router.push('/projetos');
      } catch (err) {
        if (err.response && err.response.status === 400) {
          this.error = 'Projeto ' + this.proyecto.id + ' não encontrado';
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