<template>
  <div v-if="isOpen" class="fixed inset-0 bg-gray-600 bg-opacity-50 flex items-center justify-center z-50">
    <div class="bg-white p-6 rounded-lg shadow-lg w-full max-w-md">
      <h3 class="text-lg font-semibold text-blue-800 mb-4">Criar Nova Tarefa</h3>
      <form @submit.prevent="submitForm" class="space-y-4">
        <div>
          <label for="nombre" class="block text-sm font-medium text-gray-700">Título</label>
          <input
            v-model="form.nombre"
            type="text"
            id="nombre"
            class="mt-1 block w-full border border-gray-300 rounded-md shadow-sm focus:border-blue-500 focus:ring focus:ring-blue-200 focus:ring-opacity-50"
            placeholder="Digite o título da tarefa"
            required
          />
        </div>
        <div>
          <label for="descripcion" class="block text-sm font-medium text-gray-700">Descrição</label>
          <textarea
            v-model="form.descripcion"
            id="descripcion"
            class="mt-1 block w-full border border-gray-300 rounded-md shadow-sm focus:border-blue-500 focus:ring focus:ring-blue-200 focus:ring-opacity-50"
            placeholder="Digite a descrição da tarefa"
            rows="3"
            required
          ></textarea>
        </div>
        <div>
          <label for="estadoId" class="block text-sm font-medium text-gray-700">Estado ID</label>
          <input
            v-model.number="form.estadoId"
            type="number"
            id="estadoId"
            class="mt-1 block w-full border border-gray-300 rounded-md shadow-sm focus:border-blue-500 focus:ring focus:ring-blue-200 focus:ring-opacity-50"
            placeholder="Digite o ID do estado"
            required
          />
        </div>
        <div>
          <label for="proyectoId" class="block text-sm font-medium text-gray-700">Projeto ID</label>
          <input
            v-model.number="form.proyectoId"
            type="number"
            id="proyectoId"
            class="mt-1 block w-full border border-gray-300 rounded-md shadow-sm focus:border-blue-500 focus:ring focus:ring-blue-200 focus:ring-opacity-50"
            placeholder="Digite o ID do projeto"
            required
          />
        </div>
        <div>
          <label for="fechaEstimadaInicio" class="block text-sm font-medium text-gray-700">Data Estimada Início</label>
          <input
            v-model="form.fechaEstimadaInicio"
            type="date"
            id="fechaEstimadaInicio"
            class="mt-1 block w-full border border-gray-300 rounded-md shadow-sm focus:border-blue-500 focus:ring focus:ring-blue-200 focus:ring-opacity-50"
            required
          />
        </div>
        <div>
          <label for="fechaEstimadaFin" class="block text-sm font-medium text-gray-700">Data Estimada Fim</label>
          <input
            v-model="form.fechaEstimadaFin"
            type="date"
            id="fechaEstimadaFin"
            class="mt-1 block w-full border border-gray-300 rounded-md shadow-sm focus:border-blue-500 focus:ring focus:ring-blue-200 focus:ring-opacity-50"
            required
          />
        </div>
        <div>
          <label for="fechaRealInicio" class="block text-sm font-medium text-gray-700">Data Real Início (Opcional)</label>
          <input
            v-model="form.fechaRealInicio"
            type="date"
            id="fechaRealInicio"
            class="mt-1 block w-full border border-gray-300 rounded-md shadow-sm focus:border-blue-500 focus:ring focus:ring-blue-200 focus:ring-opacity-50"
          />
        </div>
        <div>
          <label for="fechaRealFin" class="block text-sm font-medium text-gray-700">Data Real Fim (Opcional)</label>
          <input
            v-model="form.fechaRealFin"
            type="date"
            id="fechaRealFin"
            class="mt-1 block w-full border border-gray-300 rounded-md shadow-sm focus:border-blue-500 focus:ring focus:ring-blue-200 focus:ring-opacity-50"
          />
        </div>
        <div class="flex gap-2">
          <button
            type="submit"
            class="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 transition-colors"
            :disabled="loading"
          >
            Criar Tarefa
          </button>
          <button
            type="button"
            class="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600 transition-colors"
            @click="closeModal"
            :disabled="loading"
          >
            Cancelar
          </button>
        </div>
      </form>
      <p v-if="error" class="mt-4 text-red-600">{{ error }}</p>
    </div>
  </div>
</template>

<script>
import tareaService from '../services/tareaService';

export default {
  props: {
    isOpen: {
      type: Boolean,
      required: true,
    },
  },
  data() {
    return {
      form: {
        nombre: '',
        descripcion: '',
        estadoId: null,
        proyectoId: null,
        fechaEstimadaInicio: '',
        fechaEstimadaFin: '',
        fechaRealInicio: '',
        fechaRealFin: '',
      },
      loading: false,
      error: null,
    };
  },
  methods: {
    async submitForm() {
      if (!this.form.nombre || !this.form.descripcion || !this.form.estadoId || !this.form.proyectoId || !this.form.fechaEstimadaInicio || !this.form.fechaEstimadaFin) {
        this.error = 'Todos os campos obrigatórios devem ser preenchidos.';
        return;
      }

      this.loading = true;
      this.error = null;

      try {
        const tareaData = { ...this.form };
        console.log('Criando tarefa com dados:', tareaData);
        await tareaService.createTarea(tareaData);
        this.$emit('taskCreated');
        this.closeModal();
      } catch (err) {
        console.error('Erro ao criar tarefa:', err);
        this.error = 'Erro ao criar tarefa: ' + (err.response?.data?.message || err.message);
      } finally {
        this.loading = false;
      }
    },
    closeModal() {
      this.$emit('close');
      this.resetForm();
    },
    resetForm() {
      this.form = {
        nombre: '',
        descripcion: '',
        estadoId: null,
        proyectoId: null,
        fechaEstimadaInicio: '',
        fechaEstimadaFin: '',
        fechaRealInicio: '',
        fechaRealFin: '',
      };
      this.error = null;
    },
  },
};
</script>