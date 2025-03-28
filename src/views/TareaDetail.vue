<template>
  <div class="p-8 bg-gray-100">
    <div class="flex justify-between items-center mb-4">
      <h1 class="text-2xl text-blue-800">Detalhes da Tarefa</h1>
      <div class="flex gap-2">
        <button
          class="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600 transition-colors cursor-pointer"
          @click="editarTarea"
        >
          Editar
        </button>
        <button
          class="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600 transition-colors cursor-pointer"
          @click="borrarTarea"
        >
          Borrar
        </button>
      </div>
    </div>

    <div v-if="tarea" class="bg-white p-6 rounded-lg shadow">
      <p class="mb-2"><strong class="text-gray-800">ID:</strong> {{ tarea.id }}</p>
      <p class="mb-2"><strong class="text-gray-800">Nome:</strong> {{ tarea.nombre }}</p>
      <p class="mb-2"><strong class="text-gray-800">Descrição:</strong> {{ tarea.descripcion }}</p>
      <p class="mb-2"><strong class="text-gray-800">Estado:</strong> {{ tarea.estadoNombre || 'Carregando...' }}</p>
      <p class="mb-2"><strong class="text-gray-800">Projeto:</strong> {{ tarea.proyectoNombre || 'Carregando...' }}</p>
      <p class="mb-2"><strong class="text-gray-800">Data Estimada de Início:</strong> {{ formatDate(tarea.fechaEstimadaInicio) }}</p>
      <p class="mb-2"><strong class="text-gray-800">Data Estimada de Fim:</strong> {{ formatDate(tarea.fechaEstimadaFin) }}</p>
      <p class="mb-2"><strong class="text-gray-800">Data Real de Início:</strong> {{ formatDate(tarea.fechaRealInicio) }}</p>
      <p class="mb-2"><strong class="text-gray-800">Data Real de Fim:</strong> {{ formatDate(tarea.fechaRealFin) }}</p>
    </div>

    <div v-if="tarea" class="mt-6 bg-white p-6 rounded-lg shadow">
      <h2 class="text-xl text-blue-800 mb-4">Comentários da Tarefa</h2>
      <div v-if="comentarios.length" class="space-y-4">
        <div v-for="comentario in comentarios" :key="comentario.id" class="p-4 border border-gray-200 rounded-lg bg-gray-50 flex items-center justify-between relative">
          <div>
            <p class="text-gray-700">{{ comentario.comentario }}</p>
            <p class="text-sm text-gray-500 mt-2">Data/Hora: {{ formatDate(comentario.fechaHora) }}</p>
            <p class="text-sm text-gray-500">Empleado ID: {{ comentario.empleadoId }}</p>
          </div>
          <div class="flex items-center gap-2">
            <button @click="verEmpleado(comentario.empleadoId)" class="text-blue-500 hover:text-blue-700">
              <i class="fas fa-user"></i>
            </button>
            <button @click="toggleMenu(comentario.id)" class="text-gray-500 hover:text-gray-700">
              <i class="fas fa-cog"></i>
            </button>
          </div>
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
      <p v-else class="text-gray-500">Nenhum comentário encontrado para esta tarefa.</p>

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

    <div v-if="tarea" class="mt-6 bg-white p-6 rounded-lg shadow">
      <h2 class="text-xl text-blue-800 mb-4">Imputações de Horas</h2>

      <div class="mb-4">
        <h3 class="text-lg font-semibold text-gray-800 mb-2">Imputar Novas Horas</h3>
        <div class="flex flex-col gap-4">
          <div>
            <label for="horasImputadas" class="block text-sm font-medium text-gray-700">Horas Imputadas</label>
            <input
              v-model.number="novaImputacao.horasImputadas"
              type="number"
              id="horasImputadas"
              min="0"
              step="0.5"
              class="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:border-blue-500 focus:ring focus:ring-blue-200 focus:ring-opacity-50"
              placeholder="Digite o número de horas"
              required
            />
          </div>
          <div>
            <label for="comentarioImputacao" class="block text-sm font-medium text-gray-700">Comentário (Opcional)</label>
            <textarea
              v-model="novaImputacao.comentario"
              id="comentarioImputacao"
              class="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:border-blue-500 focus:ring focus:ring-blue-200 focus:ring-opacity-50"
              placeholder="Digite um comentário sobre a imputação"
              rows="2"
            ></textarea>
          </div>
          <button
            class="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 transition-colors"
            @click="imputarHoras"
            :disabled="!novaImputacao.horasImputadas || novaImputacao.horasImputadas <= 0"
          >
            Imputar Horas
          </button>
        </div>
      </div>

      <table v-if="imputaciones.length" class="min-w-full bg-white border border-gray-300 rounded-lg">
        <thead>
          <tr>
            <th class="py-3 px-4 bg-blue-800 text-white text-left font-semibold border-b border-gray-300">Horas Imputadas</th>
            <th class="py-3 px-4 bg-blue-800 text-white text-left font-semibold border-b border-gray-300">Data/Hora</th>
            <th class="py-3 px-4 bg-blue-800 text-white text-left font-semibold border-b border-gray-300">Comentário</th>
            <th class="py-3 px-4 bg-blue-800 text-white text-left font-semibold border-b border-gray-300">Empleado ID</th>
            <th class="py-3 px-4 bg-blue-800 text-white text-left font-semibold border-b border-gray-300">Ações</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="imputacion in imputaciones" :key="imputacion.id" class="hover:bg-gray-100 border-b border-gray-200">
            <td class="py-2 px-4 text-gray-700">{{ imputacion.horasImputadas }}</td>
            <td class="py-2 px-4 text-gray-700">{{ formatDate(imputacion.fechaHora) }}</td>
            <td class="py-2 px-4 text-gray-700">{{ imputacion.comentario }}</td>
            <td class="py-2 px-4 text-gray-700">{{ imputacion.empleadoId }}</td>
            <td class="py-2 px-4 text-gray-700">
              <button
                class="text-red-500 hover:text-red-700"
                @click="excluirImputacao(imputacion.id)"
              >
                <i class="fas fa-trash-alt"></i>
              </button>
            </td>
          </tr>
        </tbody>
      </table>
      <p v-else class="text-gray-500">Nenhuma imputação de horas encontrada para esta tarefa.</p>
    </div>

    <EditarTareaModal
      v-if="showEditarTareaModal"
      :is-open="showEditarTareaModal"
      :tarea="tarea"
      @close="showEditarTareaModal = false"
      @taskUpdated="fetchTarea"
    />

    <p v-if="loading" class="mt-4 text-gray-700">Carregando...</p>
    <p v-if="error" class="mt-4 text-red-600">{{ error }}</p>
    <button class="mt-4 bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 transition-colors" @click="$router.go(-1)">Voltar</button>
  </div>
</template>

<script>
import tareaService from '../services/tareaService';
import comentarioTareaService from '../services/comentarioTareaService';
import imputacionService from '../services/imputacionService';
import estadoService from '../services/estadoService';
import proyectoService from '../services/proyectoService';
import Cookies from 'js-cookie';
import EditarTareaModal from '../components/EditarTareaModal.vue';
import { formatDate } from '../utils/dateUtils';

export default {
  components: {
    EditarTareaModal,
  },
  data() {
    return {
      tarea: null,
      comentarios: [],
      imputaciones: [],
      loading: false,
      error: null,
      showEditarTareaModal: false,
      novoComentario: '',
      comentarioEditado: '',
      editandoComentario: null,
      menuAberto: null,
      novaImputacao: {
        horasImputadas: null,
        comentario: '',
      },
      empleadoId: null,
    };
  },
  mounted() {
    this.getUserIdFromCookie();
    this.fetchTarea();
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
    async fetchTarea() {
      this.loading = true;
      this.error = null;
      const id = this.$route.params.id;
      try {
        // Primeiro, buscar os dados da tarefa
        const tareaResponse = await tareaService.getTareaById(id);

        // Em seguida, buscar o nome do estado e do projeto
        const [estadoResponse, proyectoResponse] = await Promise.all([
          estadoService.getEstadoById(tareaResponse.estadoId),
          proyectoService.getProyectoById(tareaResponse.proyectoId),
        ]);

        // Buscar comentários e imputações em paralelo
        const [comentariosResponse, imputacionesResponse] = await Promise.all([
          comentarioTareaService.getComentariosByTareaId(id),
          imputacionService.getImputacionesByCriteria({ tareaId: id }),
        ]);

        this.tarea = {
          ...tareaResponse,
          estadoNombre: estadoResponse.nombre || 'Desconhecido', // Nome do estado
          proyectoNombre: proyectoResponse.nombre || 'Desconhecido', // Nome do projeto
          fechaEstimadaInicio: formatDate(tareaResponse.fechaEstimadaInicio),
          fechaEstimadaFin: formatDate(tareaResponse.fechaEstimadaFin),
          fechaRealInicio: formatDate(tareaResponse.fechaRealInicio),
          fechaRealFin: formatDate(tareaResponse.fechaRealFin),
        };

        this.comentarios = (comentariosResponse.page || []).map(comentario => ({
          ...comentario,
          fechaHora: formatDate(comentario.fechaHora),
        }));

        this.imputaciones = (imputacionesResponse.page || []).map(imputacion => ({
          ...imputacion,
          fechaHora: formatDate(imputacion.fechaHora),
        }));

        console.log('Tarefa carregada:', this.tarea);
      } catch (err) {
        this.error = 'Erro ao carregar a tarefa, estado, projeto, comentários ou imputações: ' + (err.response?.data?.message || err.message);
        console.error('Erro:', err);
      } finally {
        this.loading = false;
      }
    },
    editarTarea() {
      this.showEditarTareaModal = true;
    },
    async borrarTarea() {
      const comentarioCount = this.comentarios.length;
      const imputacionCount = this.imputaciones.length;
      const confirmMessage = `Tem certeza de que deseja excluir esta tarefa?${comentarioCount > 0 || imputacionCount > 0 ? ` Isso excluirá ${comentarioCount} comentário(s) e ${imputacionCount} imputação(ões) associada(s).` : ''}`;
      if (!confirm(confirmMessage)) return;

      this.loading = true;
      this.error = null;

      try {
        await tareaService.deleteTarea(this.tarea.id);
        console.log(`Tarefa ${this.tarea.id} excluída com sucesso`);
        this.$router.push('/tareas');
      } catch (err) {
        this.error = 'Erro ao excluir tarefa: ' + (err.message || 'Erro desconhecido');
        console.error('Erro ao excluir tarefa:', err);
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
        tareaId: this.tarea.id,
      };

      try {
        await comentarioTareaService.createComentario(comentarioData);
        this.comentarios = (await comentarioTareaService.getComentariosByTareaId(this.tarea.id)).page.map(c => ({
          ...c,
          fechaHora: formatDate(c.fechaHora),
        }));
        this.novoComentario = '';
      } catch (err) {
        this.error = 'Erro ao criar comentário: ' + (err.response?.data?.message || err.message);
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
        tareaId: this.tarea.id,
      };

      try {
        await comentarioTareaService.updateComentario(comentarioData);
        this.comentarios = (await comentarioTareaService.getComentariosByTareaId(this.tarea.id)).page.map(c => ({
          ...c,
          fechaHora: formatDate(c.fechaHora),
        }));
        this.cancelarEdicao();
      } catch (err) {
        this.error = 'Erro ao editar comentário: ' + (err.response?.data?.message || err.message);
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
        await comentarioTareaService.deleteComentario(comentarioId);
        this.comentarios = (await comentarioTareaService.getComentariosByTareaId(this.tarea.id)).page.map(c => ({
          ...c,
          fechaHora: formatDate(c.fechaHora),
        }));
        this.menuAberto = null;
      } catch (err) {
        this.error = 'Erro ao excluir comentário: ' + (err.response?.data?.message || err.message);
      } finally {
        this.loading = false;
      }
    },
    async imputarHoras() {
      if (!this.novaImputacao.horasImputadas || this.novaImputacao.horasImputadas <= 0) return;
      if (!this.empleadoId) {
        this.error = 'Usuário não autenticado. Faça login para imputar horas.';
        return;
      }

      this.loading = true;
      this.error = null;
      const imputacionData = {
        horasImputadas: this.novaImputacao.horasImputadas,
        comentario: this.novaImputacao.comentario || '',
        empleadoId: this.empleadoId,
        fechaHora: new Date().toISOString().split('T')[0],
        tareaId: this.tarea.id,
        proyectoId: this.tarea.proyectoId,
      };

      try {
        await imputacionService.createImputacion(imputacionData);
        this.imputaciones = (await imputacionService.getImputacionesByCriteria({ tareaId: this.tarea.id })).page.map(i => ({
          ...i,
          fechaHora: formatDate(i.fechaHora),
        }));
        this.novaImputacao = { horasImputadas: null, comentario: '' };
      } catch (err) {
        this.error = 'Erro ao imputar horas: ' + (err.response?.data?.message || err.message);
      } finally {
        this.loading = false;
      }
    },
    async excluirImputacao(imputacionId) {
      if (!confirm('Tem certeza de que deseja excluir esta imputação de horas?')) return;

      this.loading = true;
      this.error = null;

      try {
        await imputacionService.deleteImputacion(imputacionId);
        this.imputaciones = (await imputacionService.getImputacionesByCriteria({ tareaId: this.tarea.id })).page.map(i => ({
          ...i,
          fechaHora: formatDate(i.fechaHora),
        }));
      } catch (err) {
        this.error = 'Erro ao excluir imputação: ' + (err.response?.data?.message || err.message);
      } finally {
        this.loading = false;
      }
    },
    verEmpleado(empleadoId) {
      this.$router.push(`/empleados/${empleadoId}`);
    },
    formatDate(dateStr) {
      return formatDate(dateStr);
    },
  },
};
</script>