<template>
    <div v-if="isOpen" class="fixed inset-0 bg-gray-600 bg-opacity-50 flex items-center justify-center z-50">
      <div class="bg-white p-6 rounded-lg shadow-lg w-full max-w-md">
        <h3 class="text-lg font-semibold text-blue-800 mb-4">{{ modo === 'editar' ? 'Editar Cliente' : 'Excluir Cliente' }}</h3>
        <form v-if="modo === 'editar'" @submit.prevent="submitForm" class="space-y-4">
          <div>
            <label for="nombre" class="block text-sm font-medium text-gray-700">Nome</label>
            <input
              v-model="form.nombre"
              type="text"
              id="nombre"
              class="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:border-blue-500 focus:ring focus:ring-blue-200 focus:ring-opacity-50"
              placeholder="Digite o nome do cliente"
              required
            />
          </div>
          <div>
            <label for="email" class="block text-sm font-medium text-gray-700">Email</label>
            <input
              v-model="form.email"
              type="email"
              id="email"
              class="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:border-blue-500 focus:ring focus:ring-blue-200 focus:ring-opacity-50"
              placeholder="Digite o email do cliente"
              required
            />
          </div>
          <div>
            <label for="telefone" class="block text-sm font-medium text-gray-700">Telefone</label>
            <input
              v-model="form.telefone"
              type="tel"
              id="telefone"
              class="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:border-blue-500 focus:ring focus:ring-blue-200 focus:ring-opacity-50"
              placeholder="Digite o telefone do cliente"
            />
          </div>
          <div>
            <label for="estadoId" class="block text-sm font-medium text-gray-700">Estado ID</label>
            <input
              v-model.number="form.estadoId"
              type="number"
              id="estadoId"
              class="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:border-blue-500 focus:ring focus:ring-blue-200 focus:ring-opacity-50"
              placeholder="Digite o ID do estado"
            />
          </div>
          <div class="flex gap-2">
            <button
              type="submit"
              class="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 transition-colors cursor-pointer"
              :disabled="loading"
            >
              Salvar
            </button>
            <button
              type="button"
              class="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600 transition-colors cursor-pointer"
              @click="closeModal"
              :disabled="loading"
            >
              Cancelar
            </button>
          </div>
        </form>
        <div v-else-if="modo === 'borrar'" class="space-y-4">
          <p class="text-gray-700">Tem certeza de que deseja excluir o cliente <strong>{{ form.nombre }}</strong>?</p>
          <div class="flex gap-2">
            <button
              class="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600 transition-colors cursor-pointer"
              @click="excluirCliente"
              :disabled="loading"
            >
              Excluir
            </button>
            <button
              class="bg-gray-500 text-white px-4 py-2 rounded hover:bg-gray-600 transition-colors cursor-pointer"
              @click="closeModal"
              :disabled="loading"
            >
              Cancelar
            </button>
          </div>
        </div>
        <p v-if="error" class="mt-4 text-red-600">{{ error }}</p>
      </div>
    </div>
  </template>
  
  <script>
  import axios from 'axios';
  
  export default {
    props: {
      isOpen: {
        type: Boolean,
        required: true,
      },
      cliente: {
        type: Object,
        required: true,
      },
      modo: {
        type: String,
        required: true,
        validator: value => ['editar', 'borrar'].includes(value),
      },
    },
    data() {
      return {
        form: {
          id: null,
          nombre: '',
          email: '',
          telefone: '',
          estadoId: null,
        },
        loading: false,
        error: null,
      };
    },
    created() {
      // Preenche os campos com os dados do cliente ao abrir o modal
      this.form.id = this.cliente.id;
      this.form.nombre = this.cliente.nombre || '';
      this.form.email = this.cliente.email || '';
      this.form.telefone = this.cliente.telefone || '';
      this.form.estadoId = this.cliente.estadoId || null;
    },
    methods: {
      async submitForm() {
        this.loading = true;
        this.error = null;
  
        try {
          const payload = {
            id: this.form.id,
            nombre: this.form.nombre,
            email: this.form.email,
            telefone: this.form.telefone,
            estadoId: this.form.estadoId,
          };
  
          await axios.put(`/api/cliente/${this.form.id}`, payload, {
            headers: {
              'Content-Type': 'application/json',
            },
          });
  
          this.$emit('clientUpdated');
          this.closeModal();
        } catch (err) {
          this.error = 'Erro ao editar cliente: ' + err.message;
        } finally {
          this.loading = false;
        }
      },
      async excluirCliente() {
        this.loading = true;
        this.error = null;
  
        try {
          await axios.delete(`/api/cliente/del/${this.form.id}`); // Assumindo endpoint /del/{id} similar ao de projetos
          this.$emit('clientDeleted');
          this.closeModal();
        } catch (err) {
          this.error = 'Erro ao excluir cliente: ' + err.message;
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
          id: null,
          nombre: '',
          email: '',
          telefone: '',
          estadoId: null,
        };
        this.error = null;
      },
    },
  };
  </script>