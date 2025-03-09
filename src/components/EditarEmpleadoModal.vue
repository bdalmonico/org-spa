<template>
  <div v-if="isOpen" class="fixed inset-0 bg-gray-600 bg-opacity-50 flex items-center justify-center z-50">
    <div class="bg-white p-6 rounded-lg shadow-lg w-full max-w-md">
      <h3 class="text-lg font-semibold text-blue-800 mb-4">Editar Empregado</h3>
      <form @submit.prevent="submitForm" class="space-y-4">
        <div>
          <label for="id" class="block text-sm font-medium text-gray-700">ID</label>
          <input v-model="form.id" type="number" id="id" class="mt-1 block w-full border-gray-300 rounded-md shadow-sm bg-gray-100 cursor-not-allowed" readonly />
        </div>
        <div>
          <label for="nombre" class="block text-sm font-medium text-gray-700">Nome</label>
          <input v-model="form.nombre" type="text" id="nombre" class="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:border-blue-500 focus:ring focus:ring-blue-200 focus:ring-opacity-50" placeholder="Digite o nome" required />
        </div>
        <div>
          <label for="apellido" class="block text-sm font-medium text-gray-700">Sobrenome</label>
          <input v-model="form.apellido" type="text" id="apellido" class="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:border-blue-500 focus:ring focus:ring-blue-200 focus:ring-opacity-50" placeholder="Digite o sobrenome" required />
        </div>
        <div>
          <label for="email" class="block text-sm font-medium text-gray-700">Email</label>
          <input v-model="form.email" type="email" id="email" class="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:border-blue-500 focus:ring focus:ring-blue-200 focus:ring-opacity-50" placeholder="Digite o email" required />
        </div>
        <div>
          <label for="contrasena" class="block text-sm font-medium text-gray-700">Nova Senha (opcional)</label>
          <input v-model="form.contrasena" type="password" id="contrasena" class="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:border-blue-500 focus:ring focus:ring-blue-200 focus:ring-opacity-50" placeholder="Digite a nova senha" />
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
          <button type="submit" class="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 transition-colors cursor-pointer" :disabled="loading || !form.nombre || !form.apellido || !form.email || !form.fechaAlta || !form.rolId">Salvar</button>
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
  props: { isOpen: { type: Boolean, required: true }, empleado: { type: Object, required: true } },
  data() {
    return {
      form: { id: null, nombre: '', apellido: '', email: '', contrasena: '', fechaAlta: '', rolId: null },
      loading: false,
      error: null,
    };
  },
  created() {
    if (this.empleado && this.empleado.id) {
      this.form = {
        id: this.empleado.id,
        nombre: this.empleado.nombre || '',
        apellido: this.empleado.apellido || '',
        email: this.empleado.email || '',
        contrasena: '',
        fechaAlta: this.empleado.fechaAlta ? this.empleado.fechaAlta.split('T')[0] : '',
        rolId: this.empleado.rolId || null,
      };
    } else {
      this.error = 'Erro: Empregado não encontrado.';
    }
  },
  methods: {
    async submitForm() {
      if (!this.form.id || !this.form.nombre || !this.form.apellido || !this.form.email || !this.form.fechaAlta || !this.form.rolId) {
        this.error = 'Todos os campos obrigatórios devem ser preenchidos.';
        return;
      }
      this.loading = true;
      this.error = null;
      try {
        await empleadoService.updateEmpleado(this.form);
        this.$emit('empleadoUpdated');
        this.closeModal();
      } catch (err) {
        this.error = err.response?.status === 404
          ? 'Empregado não encontrado.'
          : 'Erro ao editar empregado: ' + (err.response?.data || err.message);
      } finally {
        this.loading = false;
      }
    },
    closeModal() {
      this.$emit('close');
      this.resetForm();
    },
    resetForm() {
      this.form = { id: null, nombre: '', apellido: '', email: '', contrasena: '', fechaAlta: '', rolId: null };
      this.error = null;
    },
  },
};
</script>