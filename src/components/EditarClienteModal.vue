<template>
  <div v-if="isOpen" class="fixed inset-0 bg-gray-600 bg-opacity-50 flex items-center justify-center z-50">
    <div class="bg-white p-6 rounded-lg shadow-lg w-full max-w-md">
      <h3 class="text-lg font-semibold text-blue-800 mb-4">Editar Cliente</h3>
      <form @submit.prevent="submitForm" class="space-y-4">
        <div>
          <label for="id" class="block text-sm font-medium text-gray-700">ID</label>
          <input
            v-model="form.id"
            type="number"
            id="id"
            class="mt-1 block w-full border-gray-300 rounded-md shadow-sm bg-gray-100 cursor-not-allowed"
            readonly
          />
        </div>
        <div>
          <label for="nombre" class="block text-sm font-medium text-gray-700">Nome</label>
          <input
            v-model="form.nombre"
            type="text"
            id="nombre"
            class="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:border-blue-500 focus:ring focus:ring-blue-200 focus:ring-opacity-50"
            placeholder="Digite o nome"
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
            placeholder="Digite o email"
            required
          />
        </div>
        <div>
          <label for="nifCif" class="block text-sm font-medium text-gray-700">NIF/CIF</label>
          <input
            v-model="form.nifCif"
            type="text"
            id="nifCif"
            class="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:border-blue-500 focus:ring focus:ring-blue-200 focus:ring-opacity-50"
            placeholder="Digite o NIF/CIF"
            required
          />
        </div>
        <div>
          <label for="telefone" class="block text-sm font-medium text-gray-700">Telefone</label>
          <input
            v-model="form.telefone"
            type="text"
            id="telefone"
            class="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:border-blue-500 focus:ring focus:ring-blue-200 focus:ring-opacity-50"
            placeholder="Digite o telefone"
            required
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
            required
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
  },
  data() {
    return {
      form: {
        id: null,
        nombre: '',
        email: '',
        nifCif: '',
        telefone: '',
        estadoId: null,
      },
      loading: false,
      error: null,
    };
  },
  created() {
    console.log('Cliente recebido no modal:', this.cliente);
    if (this.cliente && typeof this.cliente.id !== 'undefined') {
      this.form.id = this.cliente.id;
      this.form.nombre = this.cliente.nombre || '';
      this.form.email = this.cliente.email || '';
      this.form.nifCif = this.cliente.nifCif || '';
      this.form.telefone = this.cliente.telefone || '';
      this.form.estadoId = this.cliente.estadoId || null;
      console.log('Form inicializado com ID:', this.form.id);
    } else {
      console.error('Cliente ou ID inválido:', this.cliente);
      this.error = 'Erro: Cliente não encontrado.';
    }
  },
  methods: {
    async submitForm() {
      this.loading = true;
      this.error = null;

      console.log('Enviando form com ID:', this.form.id);
      if (!this.form.id) {
        this.error = 'Erro: ID do cliente não encontrado no formulário.';
        this.loading = false;
        return;
      }

      try {
        const params = new URLSearchParams();
        params.append('id', this.form.id.toString());
        params.append('nombre', this.form.nombre);
        params.append('email', this.form.email);
        params.append('nifCif', this.form.nifCif);
        params.append('telefone', this.form.telefone);
        params.append('estadoId', this.form.estadoId !== null ? this.form.estadoId.toString() : '');

        console.log('Parâmetros enviados:', params.toString());
        const response = await axios.put(`/api/cliente?${params.toString()}`);

        console.log('Resposta da atualização:', response.data);
        this.$emit('clienteUpdated');
        this.closeModal();
      } catch (err) {
        console.error('Erro ao atualizar cliente:', err);
        if (err.response) {
          switch (err.response.status) {
            case 404:
              this.error = 'Cliente não encontrado.';
              break;
            case 400:
              this.error = 'Erro nos dados fornecidos: ' + (err.response.data || err.message);
              break;
            case 500:
              this.error = 'Erro interno do servidor. Tente novamente mais tarde.';
              break;
            default:
              this.error = 'Erro ao editar cliente: ' + err.message;
          }
        } else {
          this.error = 'Erro ao editar cliente: ' + err.message;
        }
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
        nifCif: '',
        telefone: '',
        estadoId: null,
      };
      this.error = null;
    },
  },
};
</script>