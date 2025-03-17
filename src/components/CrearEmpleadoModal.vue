<template>
  <div v-if="isOpen" class="fixed inset-0 bg-gray-600 bg-opacity-50 flex items-center justify-center z-50">
    <div class="bg-white p-6 rounded-lg shadow-lg w-full max-w-md">
      <h3 class="text-lg font-semibold text-blue-800 mb-4">Criar Novo Empregado</h3>
      <form @submit.prevent="submitForm" class="space-y-4">
        <div>
          <label for="nombre" class="block text-sm font-medium text-gray-700">Nome</label>
          <input v-model="form.nombre" type="text" id="nombre" class="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:border-blue-500 focus:ring focus:ring-blue-200 focus:ring-opacity-50" placeholder="Digite o nome do empregado" required />
        </div>
        <div>
          <label for="apellido" class="block text-sm font-medium text-gray-700">Sobrenome</label>
          <input v-model="form.apellido" type="text" id="apellido" class="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:border-blue-500 focus:ring focus:ring-blue-200 focus:ring-opacity-50" placeholder="Digite o sobrenome do empregado" required />
        </div>
        <div>
          <label for="email" class="block text-sm font-medium text-gray-700">Email</label>
          <input v-model="form.email" type="email" id="email" class="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:border-blue-500 focus:ring focus:ring-blue-200 focus:ring-opacity-50" placeholder="Digite o email do empregado" required />
        </div>
        <div>
          <label for="contrasena" class="block text-sm font-medium text-gray-700">Senha</label>
          <input v-model="form.contrasena" type="password" id="contrasena" class="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:border-blue-500 focus:ring focus:ring-blue-200 focus:ring-opacity-50" placeholder="Digite a senha do empregado" required />
        </div>
        <div>
          <label for="fechaAlta" class="block text-sm font-medium text-gray-700">Data de Admissão</label>
          <input v-model="form.fechaAlta" type="date" id="fechaAlta" class="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:border-blue-500 focus:ring focus:ring-blue-200 focus:ring-opacity-50" required />
        </div>
        <div>
          <label for="rolId" class="block text-sm font-medium text-gray-700">ID do Papel</label>
          <input v-model.number="form.rolId" type="number" id="rolId" class="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:border-blue-500 focus:ring focus:ring-blue-200 focus:ring-opacity-50" placeholder="Digite o ID do papel" required />
        </div>
        <div class="flex gap-2">
          <button type="submit" class="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 transition-colors cursor-pointer" :disabled="loading || !form.nombre || !form.apellido || !form.email || !form.contrasena || !form.fechaAlta || !form.rolId">Criar</button>
          <button type="button" class="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600 transition-colors cursor-pointer" @click="closeModal" :disabled="loading">Cancelar</button>
        </div>
      </form>
      <p v-if="error" class="mt-4 text-red-600">{{ error }}</p>
    </div>
  </div>
</template>

<script>
import empleadoService from '../services/empleadoService';

export default {
  props: { isOpen: { type: Boolean, required: true } },
  data() {
    return {
      form: { nombre: '', apellido: '', email: '', contrasena: '', fechaAlta: '', rolId: null },
      loading: false,
      error: null,
    };
  },
  methods: {
    async submitForm() {
      if (!this.form.nombre || !this.form.apellido || !this.form.email || !this.form.contrasena || !this.form.fechaAlta || !this.form.rolId) {
        this.error = 'Todos os campos são obrigatórios, incluindo a senha.';
        return;
      }
      this.loading = true;
      this.error = null;
      try {
        // Ajustar o formato da data antes de enviar
        const empleadoData = {
          ...this.form,
          fechaAlta: new Date(this.form.fechaAlta).toISOString() // Converte para '2025-02-22T00:00:00.000Z'
        };
        await empleadoService.crearEmpleado(empleadoData);
        this.$emit('empleadoCreated');
        this.closeModal();
      } catch (err) {
        this.error = err.response?.status === 400
          ? 'Erro nos dados fornecidos: ' + (err.response?.data || err.message)
          : 'Erro ao criar empregado: ' + (err.response?.data || err.message);
      } finally {
        this.loading = false;
      }
    },
    closeModal() {
      this.$emit('close');
      this.resetForm();
    },
    resetForm() {
      this.form = { nombre: '', apellido: '', email: '', contrasena: '', fechaAlta: '', rolId: null };
      this.error = null;
    },
  },
};
</script>