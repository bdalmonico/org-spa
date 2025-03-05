<template>
    <div v-if="isOpen" class="fixed inset-0 bg-gray-600 bg-opacity-50 flex items-center justify-center z-50">
      <div class="bg-white p-6 rounded-lg shadow-lg w-full max-w-md">
        <h3 class="text-lg font-semibold text-blue-800 mb-4">{{ modo === 'editar' ? 'Editar Empregado' : 'Excluir Empregado' }}</h3>
        <form v-if="modo === 'editar'" @submit.prevent="submitForm" class="space-y-4">
          <div>
            <label for="nombre" class="block text-sm font-medium text-gray-700">Nome</label>
            <input
              v-model="form.nombre"
              type="text"
              id="nombre"
              class="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:border-blue-500 focus:ring focus:ring-blue-200 focus:ring-opacity-50"
              placeholder="Digite o nome do empregado"
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
              placeholder="Digite o email do empregado"
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
              placeholder="Digite o telefone do empregado"
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
          <p class="text-gray-700">Tem certeza de que deseja excluir o empregado <strong>{{ form.nombre }}</strong>?</p>
          <div class="flex gap-2">
            <button
              class="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600 transition-colors cursor-pointer"
              @click="excluirEmpleado"
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
      empleado: {
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
      // Preenche os campos com os dados do empregado ao abrir o modal
      this.form.id = this.empleado.id;
      this.form.nombre = this.empleado.nombre || '';
      this.form.email = this.empleado.email || '';
      this.form.telefone = this.empleado.telefone || '';
      this.form.estadoId = this.empleado.estadoId || null;
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
  
          await axios.put(`/api/empleado/${this.form.id}`, payload, {
            headers: {
              'Content-Type': 'application/json',
            },
          });
  
          this.$emit('empleadoUpdated');
          this.closeModal();
        } catch (err) {
          this.error = 'Erro ao editar empregado: ' + err.message;
        } finally {
          this.loading = false;
        }
      },
      async excluirEmpleado() {
        this.loading = true;
        this.error = null;
  
        try {
          await axios.delete(`/api/empleado/del/${this.form.id}`); // Assumindo endpoint /del/{id} similar ao de projetos e clientes
          this.$emit('empleadoDeleted');
          this.closeModal();
        } catch (err) {
          this.error = 'Erro ao excluir empregado: ' + err.message;
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