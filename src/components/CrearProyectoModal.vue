<template>
  <div v-if="isOpen" class="fixed inset-0 bg-gray-600 bg-opacity-50 flex items-center justify-center z-50">
    <div class="bg-white p-6 rounded-lg shadow-lg w-full max-w-md">
      <h3 class="text-lg font-semibold text-blue-800 mb-4">Criar Novo Projeto</h3>
      <form @submit.prevent="submitForm" class="space-y-4">
        <div>
          <label for="nombre" class="block text-sm font-medium text-gray-700">Nome</label>
          <input v-model="form.nombre" type="text" id="nombre" class="mt-1 block w-full border border-gray-300 rounded-md shadow-sm focus:border-blue-500 focus:ring focus:ring-blue-200 focus:ring-opacity-50" placeholder="Digite o nome do projeto" required />
        </div>
        <div>
          <label for="descripcion" class="block text-sm font-medium text-gray-700">Descrição</label>
          <textarea v-model="form.descripcion" id="descripcion" class="mt-1 block w-full border border-gray-300 rounded-md shadow-sm focus:border-blue-500 focus:ring focus:ring-blue-200 focus:ring-opacity-50" placeholder="Digite a descrição do projeto" rows="3" required></textarea>
        </div>
        <div>
          <label for="clienteNombre" class="block text-sm font-medium text-gray-700">Cliente</label>
          <input v-model="form.clienteNombre" type="text" id="clienteNombre" class="mt-1 block w-full border border-gray-300 rounded-md shadow-sm focus:border-blue-500 focus:ring focus:ring-blue-200 focus:ring-opacity-50" placeholder="Digite o nome do cliente" required />
        </div>
        <div>
          <label for="estadoId" class="block text-sm font-medium text-gray-700">Estado ID</label>
          <input v-model.number="form.estadoId" type="number" id="estadoId" class="mt-1 block w-full border border-gray-300 rounded-md shadow-sm focus:border-blue-500 focus:ring focus:ring-blue-200 focus:ring-opacity-50" placeholder="Digite o ID do estado" required />
        </div>
        <div>
          <label for="importe" class="block text-sm font-medium text-gray-700">Importe</label>
          <input v-model="form.importe" type="text" id="importe" class="mt-1 block w-full border border-gray-300 rounded-md shadow-sm focus:border-blue-500 focus:ring focus:ring-blue-200 focus:ring-opacity-50" placeholder="Digite o importe (ex.: €10,000.00)" required />
        </div>
        <div>
          <label for="clienteId" class="block text-sm font-medium text-gray-700">Cliente ID</label>
          <input v-model.number="form.clienteId" type="number" id="clienteId" class="mt-1 block w-full border border-gray-300 rounded-md shadow-sm focus:border-blue-500 focus:ring focus:ring-blue-200 focus:ring-opacity-50" placeholder="Digite o ID do cliente" required />
        </div>
        <div>
          <label for="fechaEstimadaInicio" class="block text-sm font-medium text-gray-700">Data Estimada de Início</label>
          <input v-model="form.fechaEstimadaInicio" type="date" id="fechaEstimadaInicio" class="mt-1 block w-full border border-gray-300 rounded-md shadow-sm focus:border-blue-500 focus:ring focus:ring-blue-200 focus:ring-opacity-50" required />
        </div>
        <div>
          <label for="fechaEstimadaFin" class="block text-sm font-medium text-gray-700">Data Estimada de Fim</label>
          <input v-model="form.fechaEstimadaFin" type="date" id="fechaEstimadaFin" class="mt-1 block w-full border border-gray-300 rounded-md shadow-sm focus:border-blue-500 focus:ring focus:ring-blue-200 focus:ring-opacity-50" required />
        </div>
        <div>
          <label for="fechaRealInicio" class="block text-sm font-medium text-gray-700">Data Real de Início (Opcional)</label>
          <input v-model="form.fechaRealInicio" type="date" id="fechaRealInicio" class="mt-1 block w-full border border-gray-300 rounded-md shadow-sm focus:border-blue-500 focus:ring focus:ring-blue-200 focus:ring-opacity-50" />
        </div>
        <div>
          <label for="fechaRealFin" class="block text-sm font-medium text-gray-700">Data Real de Fim (Opcional)</label>
          <input v-model="form.fechaRealFin" type="date" id="fechaRealFin" class="mt-1 block w-full border border-gray-300 rounded-md shadow-sm focus:border-blue-500 focus:ring focus:ring-blue-200 focus:ring-opacity-50" />
        </div>
        <div class="flex gap-2">
          <button type="submit" class="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 transition-colors cursor-pointer" :disabled="loading">Criar</button>
          <button type="button" class="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600 transition-colors cursor-pointer" @click="closeModal" :disabled="loading">Cancelar</button>
        </div>
      </form>
      <p v-if="error" class="mt-4 text-red-600">{{ error }}</p>
    </div>
  </div>
</template>

<script>
import proyectoService from '../services/proyectoService';

export default {
  props: { isOpen: { type: Boolean, required: true } },
  data() {
    return {
      form: {
        nombre: '',
        descripcion: '',
        clienteNombre: '',
        estadoId: null,
        importe: '',
        clienteId: null,
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
      this.loading = true;
      this.error = null;
      try {
        await proyectoService.createProyecto(this.form);
        this.$emit('projectCreated');
        this.closeModal();
      } catch (err) {
        this.error = 'Erro ao criar projeto: ' + (err.response?.data || err.message);
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
        clienteNombre: '',
        estadoId: null,
        importe: '',
        clienteId: null,
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