<template>
  <div class="p-4 sm:p-8 bg-gray-100 min-h-screen">
    <div class="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-4">
      <h1 class="text-xl sm:text-2xl text-blue-800 mb-2 sm:mb-0">Detalhes do Proyecto</h1>
      <div class="flex gap-2">
        <button
          class="bg-green-500 text-white px-3 py-1 sm:px-4 sm:py-2 rounded hover:bg-green-600 transition-colors cursor-pointer text-sm sm:text-base"
          @click="showEditarProyectoModal = true"
        >
          Editar
        </button>
        <button
          class="bg-red-500 text-white px-3 py-1 sm:px-4 sm:py-2 rounded hover:bg-red-600 transition-colors cursor-pointer text-sm sm:text-base"
          @click="borrarProyecto"
        >
          Borrar
        </button>
      </div>
    </div>

    <div v-if="proyecto" class="bg-white p-4 sm:p-6 rounded-lg shadow overflow-x-auto">
      <p class="mb-2 break-words"><strong class="text-gray-800">ID:</strong> {{ proyecto.id }}</p>
      <p class="mb-2 break-words"><strong class="text-gray-800">Nome:</strong> {{ proyecto.nombre }}</p>
      <p class="mb-2 break-words"><strong class="text-gray-800">Descrição:</strong> {{ proyecto.descripcion }}</p>
      <p class="mb-2 break-words"><strong class="text-gray-800">Cliente:</strong> {{ proyecto.clienteNombre }}</p>
      <p class="mb-2 break-words"><strong class="text-gray-800">Estado:</strong> {{ proyecto.estadoNombre || 'Carregando...' }}</p>
      <p class="mb-2 break-words"><strong class="text-gray-800">Data Estimada de Início:</strong> {{ formatDate(proyecto.fechaEstimadaInicio) }}</p>
      <p class="mb-2 break-words"><strong class="text-gray-800">Data Estimada de Fim:</strong> {{ formatDate(proyecto.fechaEstimadaFin) }}</p>
      <p class="mb-2 break-words"><strong class="text-gray-800">Importe:</strong> {{ proyecto.importe }}</p>
      <p class="mb-2 break-words"><strong class="text-gray-800">Total de Horas Imputadas:</strong> {{ totalHorasImputadas || '0' }} horas</p>
    </div>

    <!-- Seção de Tarefas Relacionadas -->
    <div v-if="proyecto" class="mt-6 bg-white p-4 sm:p-6 rounded-lg shadow overflow-x-auto">
      <h2 class="text-lg sm:text-xl text-blue-800 mb-4">Tarefas Relacionadas</h2>
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
    <div v-if="proyecto" class="mt-6 bg-white p-4 sm:p-6 rounded-lg shadow">
      <h2 class="text-lg sm:text-xl text-blue-800 mb-4">Comentários do Projeto</h2>
      <div v-if="comentarios.length" class="space-y-4">
        <div v-for="comentario in comentarios" :key="comentario.id" class="p-4 border border-gray-200 rounded-lg bg-gray-50 flex flex-col sm:flex-row items-start sm:items-center justify-between relative">
          <div class="break-words w-full sm:w-auto">
            <p class="text-gray-700">{{ comentario.comentario }}</p>
            <p class="text-sm text-gray-500 mt-2">Data/Hora: {{ formatDate(comentario.fechaHora) }}</p>
          </div>
          <div class="flex items-center gap-2 mt-2 sm:mt-0">
            <button @click="verEmpleado(comentario.empleadoId)" class="text-blue-500 hover:text-blue-700">
              <i class="fas fa-user"></i>
            </button>
            <button @click="toggleMenu(comentario.id)" class="text-gray-500 hover:text-gray-700">
              <i class="fas fa-cog"></i>
            </button>
          </div>
          <!-- Menu de Ações (Excluir e Editar) -->
          <div v-if="menuAberto === comentario.id" class="absolute right-0 top-full mt-2 bg-white border border-gray-200 rounded-md shadow-lg z-10 w-32 sm:w-auto">
            <button
              class="w-full px-4 py-2 text-left text-gray-700 hover:bg-gray-100 text-sm sm:text-base"
              @click.stop="editarComentario(comentario)"
            >
              Editar
            </button>
            <button
              class="w-full px-4 py-2 text-left text-red-500 hover:bg-gray-100 text-sm sm:text-base"
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
          class="mt-2 bg-blue-500 text-white px-3 py-1 sm:px-4 sm:py-2 rounded hover:bg-blue-600 transition-colors text-sm sm:text-base"
          @click="criarComentario"
          :disabled="!novoComentario.trim()"
        >
          Adicionar Comentário
        </button>
      </div>
    </div>

    <!-- Modal para Editar Comentário -->
    <div v-if="editandoComentario" class="fixed inset-0 bg-gray-600 bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div class="bg-white p-4 sm:p-6 rounded-lg shadow-lg w-full max-w-md">
        <h3 class="text-lg font-semibold text-blue-800 mb-4">Editar Comentário</h3>
        <textarea
          v-model="comentarioEditado"
          class="w-full p-2 border border-gray-300 rounded-md focus:border-blue-500 focus:ring focus:ring-blue-200 focus:ring-opacity-50"
          rows="3"
          placeholder="Edite seu comentário..."
        ></textarea>
        <div class="mt-4 flex gap-2">
          <button
            class="bg-blue-500 text-white px-3 py-1 sm:px-4 sm:py-2 rounded hover:bg-blue-600 transition-colors text-sm sm:text-base"
            @click="salvarEdicao"
          >
            Salvar
          </button>
          <button
            class="bg-red-500 text-white px-3 py-1 sm:px-4 sm:py-2 rounded hover:bg-red-600 transition-colors text-sm sm:text-base"
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
    <p v-if="error" class="mt-4 text-red-600 break-words">{{ error }}</p>
    <button
      class="mt-4 bg-blue-500 text-white px-3 py-1 sm:px-4 sm:py-2 rounded hover:bg-blue-600 transition-colors cursor-pointer text-sm sm:text-base"
      @click="$router.go(-1)"
    >
      Voltar
    </button>
  </div>
</template>

<script>
import proyectoService from '../services/proyectoService';
import tareaService from '../services/tareaService';
import comentarioProyectoService from '../services/comentarioProyectoService';
import imputacionService from '../services/imputacionService';
import estadoService from '../services/estadoService';
import Cookies from 'js-cookie';
import Lista from '../components/Lista.vue';
import EditarProyectoModal from '../components/EditarProyectoModal.vue';
import { formatDate } from '../utils/dateUtils';

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
      novoComentario: '',
      comentarioEditado: '',
      editandoComentario: null,
      menuAberto: null,
      loading: false,
      error: null,
      showEditarProyectoModal: false,
      empleadoId: null,
    };
  },
  mounted() {
    this.getUserIdFromCookie();
    this.fetchProyecto();
  },
  methods: {
    getUserIdFromCookie() {
      const userId = Cookies.get('userId');
      if (userId) {
        this.empleadoId = parseInt(userId, 10);
        console.log('Empleado ID recuperado do cookie:', this.empleadoId);
      } else {
        this.error = 'Usuário não autenticado. Faça login para continuar.';
        console.error('Cookie userId não encontrado.');
      }
    },
    async fetchProyecto() {
      this.loading = true;
      this.error = null;
      const id = this.$route.params.id;
      try {
        // Buscar os dados do projeto primeiro
        const proyectoResponse = await proyectoService.getProyectoById(id);

        // Buscar o nome do estado com base no estadoId do projeto
        const estadoResponse = await estadoService.getEstadoById(proyectoResponse.estadoId);

        // Buscar tarefas, comentários e horas imputadas como na versão original
        const [tareasResponse, comentariosResponse, totalHorasResponse] = await Promise.all([
          tareaService.getTareas({}), // Busca todas as tarefas sem filtro
          comentarioProyectoService.getComentariosByProyectoId(id),
          imputacionService.getTotalHorasImputadas({ proyectoId: id }),
        ]);

        this.proyecto = {
          id: proyectoResponse.id,
          nombre: proyectoResponse.nombre,
          descripcion: proyectoResponse.descripcion,
          clienteNombre: proyectoResponse.clienteNombre,
          estadoId: proyectoResponse.estadoId,
          estadoNombre: estadoResponse.nombre || 'Desconhecido', // Nome do estado
          importe: proyectoResponse.importe,
          clienteId: proyectoResponse.clienteId,
          fechaEstimadaInicio: formatDate(proyectoResponse.fechaEstimadaInicio),
          fechaEstimadaFin: formatDate(proyectoResponse.fechaEstimadaFin),
          fechaRealInicio: formatDate(proyectoResponse.fechaRealInicio),
          fechaRealFin: formatDate(proyectoResponse.fechaRealFin),
        };

        // Filtrar tarefas no frontend como na versão original
        this.tareas = tareasResponse.page
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

        this.comentarios = comentariosResponse.page.map(comentario => ({
          id: comentario.id,
          comentario: comentario.comentario,
          empleadoId: comentario.empleadoId,
          fechaHora: formatDate(comentario.fechaHora),
          ascDesc: comentario.ascDesc,
          orderBy: comentario.orderBy,
          proyectoId: comentario.proyectoId,
        }));

        this.totalHorasImputadas = totalHorasResponse || 0;

        console.log('Projeto carregado:', this.proyecto);
        console.log('Tarefas carregadas:', this.tareas);
      } catch (err) {
        this.error = 'Erro ao carregar o projeto, estado, tarefas, comentários ou total de horas: ' + (err.response?.data?.message || err.message);
        console.error('Erro:', err);
      } finally {
        this.loading = false;
      }
    },
    async criarComentario() {
      if (!this.novoComentario.trim()) return;
      if (!this.empleadoId) {
        this.error = 'Usuário não autenticado. Faça login para comentar.';
        return;
      }

      this.loading = true;
      this.error = null;
      const comentarioData = {
        comentario: this.novoComentario,
        empleadoId: this.empleadoId,
        fechaHora: new Date().toISOString().split('T')[0],
        proyectoId: this.proyecto.id,
      };

      try {
        await comentarioProyectoService.createComentario(comentarioData);
        const response = await comentarioProyectoService.getComentariosByProyectoId(this.proyecto.id);
        this.comentarios = response.page.map(comentario => ({
          id: comentario.id,
          comentario: comentario.comentario,
          empleadoId: comentario.empleadoId,
          fechaHora: formatDate(comentario.fechaHora),
          ascDesc: comentario.ascDesc,
          orderBy: comentario.orderBy,
          proyectoId: comentario.proyectoId,
        }));
        this.novoComentario = '';
      } catch (err) {
        this.error = 'Erro ao criar comentário: ' + (err.response?.data?.message || err.message);
        console.error('Erro:', err);
      } finally {
        this.loading = false;
      }
    },
    toggleMenu(comentarioId) {
      this.menuAberto = this.menuAberto === comentarioId ? null : comentarioId;
    },
    editarComentario(comentario) {
      this.editandoComentario = comentario.id;
      this.comentarioEditado = comentario.comentario;
      this.menuAberto = null;
    },
    async salvarEdicao() {
      if (!this.comentarioEditado.trim() || !this.editandoComentario) return;
      if (!this.empleadoId) {
        this.error = 'Usuário não autenticado. Faça login para editar comentários.';
        return;
      }

      this.loading = true;
      this.error = null;
      const comentarioData = {
        id: this.editandoComentario,
        comentario: this.comentarioEditado,
        empleadoId: this.empleadoId,
        fechaHora: new Date().toISOString().split('T')[0],
        proyectoId: this.proyecto.id,
      };

      try {
        await comentarioProyectoService.updateComentario(comentarioData);
        const response = await comentarioProyectoService.getComentariosByProyectoId(this.proyecto.id);
        this.comentarios = response.page.map(comentario => ({
          id: comentario.id,
          comentario: comentario.comentario,
          empleadoId: comentarioुलId,
          fechaHora: formatDate(comentario.fechaHora),
          ascDesc: comentario.ascDesc,
          orderBy: comentario.orderBy,
          proyectoId: comentario.proyectoId,
        }));
        this.cancelarEdicao();
      } catch (err) {
        this.error = 'Erro ao editar comentário: ' + (err.response?.data?.message || err.message);
        console.error('Erro:', err);
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
        await comentarioProyectoService.deleteComentario(comentarioId);
        const response = await comentarioProyectoService.getComentariosByProyectoId(this.proyecto.id);
        this.comentarios = response.page.map(comentario => ({
          id: comentario.id,
          comentario: comentario.comentario,
          empleadoId: comentario.empleadoId,
          fechaHora: formatDate(comentario.fechaHora),
          ascDesc: comentario.ascDesc,
          orderBy: comentario.orderBy,
          proyectoId: comentario.proyectoId,
        }));
        this.menuAberto = null;
      } catch (err) {
        this.error = 'Erro ao excluir comentário: ' + (err.response?.data?.message || err.message);
        console.error('Erro:', err);
      } finally {
        this.loading = false;
      }
    },
    handleTareaClicked(tareaId) {
      console.log('Tarefa clicada, redirecionando para /tareas/', tareaId);
      this.$router.push(`/tareas/${tareaId}`);
    },
    verEmpleado(empleadoId) {
      this.$router.push(`/empleados/${empleadoId}`);
    },
    async borrarProyecto() {
      if (!confirm('Tem certeza de que deseja excluir este projeto?')) return;

      this.loading = true;
      this.error = null;

      try {
        await proyectoService.deleteProyecto(this.proyecto.id);
        this.$router.push('/projetos');
      } catch (err) {
        if (err.response && err.response.status === 400) {
          this.error = 'Projeto ' + this.proyecto.id + ' não encontrado';
        } else {
          this.error = 'Erro ao excluir projeto: ' + (err.response?.data?.message || err.message);
        }
        console.error('Erro:', err);
      } finally {
        this.loading = false;
      }
    },
    formatDate(dateStr) {
      return formatDate(dateStr);
    },
  },
};
</script>