<template>
  <div v-if="isOpen" class="fixed inset-0 bg-gray-600 bg-opacity-50 flex items-center justify-center z-50">
    <div class="bg-white p-6 rounded-lg shadow-lg w-full max-w-md">
      <h3 class="text-lg font-semibold text-blue-800 mb-4">Criar Novo Cliente</h3>
      <form @submit.prevent="submitForm" class="space-y-4">
        <div>
          <label for="nombre" class="block text-sm font-medium text-gray-700">Nome</label>
          <input v-model="form.nombre" type="text" id="nombre" class="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:border-blue-500 focus:ring focus:ring-blue-200 focus:ring-opacity-50" placeholder="Digite o nome do cliente" required />
        </div>
        <div>
          <label for="email" class="block text-sm font-medium text-gray-700">Email</label>
          <input v-model="form.email" type="email" id="email" class="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:border-blue-500 focus:ring focus:ring-blue-200 focus:ring-opacity-50" placeholder="Digite o email do cliente" required />
        </div>
        <div>
          <label for="nifCif" class="block text-sm font-medium text-gray-700">NIF/CIF</label>
          <input v-model="form.nifCif" type="text" id="nifCif" class="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:border-blue-500 focus:ring focus:ring-blue-200 focus:ring-opacity-50" placeholder="Digite o NIF/CIF do cliente" />
        </div>
        <div>
          <label for="telefone" class="block text-sm font-medium text-gray-700">Telefone</label>
          <input v-model="form.telefone" type="tel" id="telefone" class="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:border-blue-500 focus:ring focus:ring-blue-200 focus:ring-opacity-50" placeholder="Digite o telefone do cliente" />
        </div>
        <div>
          <label for="estadoId" class="block text-sm font-medium text-gray-700">Estado ID</label>
          <input v-model.number="form.estadoId" type="number" id="estadoId" class="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:border-blue-500 focus:ring focus:ring-blue-200 focus:ring-opacity-50" placeholder="Digite o ID do estado" />
        </div>
        <div class="flex gap-2">
          <button type="submit" class="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 transition-colors cursor-pointer" :disabled="loading || !form.nombre || !form.email">Criar</button>
          <button type="button" class="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600 transition-colors cursor-pointer" @click="closeModal" :disabled="loading">Cancelar</button>
        </div>
      </form>
      <p v-if="error" class="mt-4 text-red-600">{{ error }}</p>
    </div>
  </div>
</template>

<script>
import clienteService from '../services/clienteService';

export default {
  props: { isOpen: { type: Boolean, required: true } },
  data() {
    return {
      form: { nombre: '', email: '', nifCif: '', telefone: '', estadoId: null },
      loading: false,
      error: null,
    };
  },
  methods: {
    async submitForm() {
      if (!this.form.nombre || !this.form.email) {
        this.error = 'Nome e Email são obrigatórios.';
        return;
      }
      this.loading = true;
      this.error = null;
      try {
        await clienteService.createCliente(this.form);
        this.$emit('clienteCreated');
        this.closeModal();
      } catch (err) {
        this.error = err.response?.status === 400
          ? 'Erro nos dados fornecidos: ' + (err.response?.data || err.message)
          : 'Erro ao criar cliente: ' + (err.response?.data || err.message);
      } finally {
        this.loading = false;
      }
    },
    closeModal() {
      this.$emit('close');
      this.resetForm();
    },
    resetForm() {
      this.form = { nombre: '', email: '', nifCif: '', telefone: '', estadoId: null };
      this.error = null;
    },
  },
};
</script>