<template>
  <div v-if="isOpen" class="fixed inset-0 bg-gray-600 bg-opacity-50 flex items-center justify-center z-50">
    <div class="bg-white p-6 rounded-lg shadow-lg w-full max-w-md">
      <h3 class="text-lg font-semibold text-blue-800 mb-4">Editar Empregado</h3>
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
          <label for="apellido" class="block text-sm font-medium text-gray-700">Sobrenome</label>
          <input
            v-model="form.apellido"
            type="text"
            id="apellido"
            class="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:border-blue-500 focus:ring focus:ring-blue-200 focus:ring-opacity-50"
            placeholder="Digite o sobrenome"
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
          <label for="contrasena" class="block text-sm font-medium text-gray-700">Nova Senha (opcional)</label>
          <input
            v-model="form.contrasena"
            type="password"
            id="contrasena"
            class="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:border-blue-500 focus:ring focus:ring-blue-200 focus:ring-opacity-50"
            placeholder="Digite a nova senha"
          />
        </div>
        <div>
          <label for="fechaAlta" class="block text-sm font-medium text-gray-700">Data de Admissão</label>
          <input
            v-model="form.fechaAlta"
            type="date"
            id="fechaAlta"
            class="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:border-blue-500 focus:ring focus:ring-blue-200 focus:ring-opacity-50"
            required
          />
        </div>
        <div>
          <label for="rolId" class="block text-sm font-medium text-gray-700">ID do Papel</label>
          <input
            v-model.number="form.rolId"
            type="number"
            id="rolId"
            class="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:border-blue-500 focus:ring focus:ring-blue-200 focus:ring-opacity-50"
            placeholder="Digite o ID do papel"
            required
          />
        </div>
        <div class="flex gap-2">
          <button
            type="submit"
            class="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 transition-colors cursor-pointer"
            :disabled="loading || !form.nombre || !form.apellido || !form.email || !form.fechaAlta || !form.rolId"
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
    empleado: {
      type: Object,
      required: true,
    },
  },
  data() {
    return {
      form: {
        id: null,
        nombre: '',
        apellido: '',
        email: '',
        contrasena: '',
        fechaAlta: '',
        rolId: null,
      },
      loading: false,
      error: null,
    };
  },
  created() {
    console.log('Empregado recebido no modal:', this.empleado);
    if (this.empleado && typeof this.empleado.id !== 'undefined') {
      this.form.id = this.empleado.id;
      this.form.nombre = this.empleado.nombre || '';
      this.form.apellido = this.empleado.apellido || '';
      this.form.email = this.empleado.email || '';
      this.form.contrasena = ''; // Não preenchemos a senha existente por segurança
      this.form.fechaAlta = this.empleado.fechaAlta ? this.empleado.fechaAlta.split('T')[0] : '';
      this.form.rolId = this.empleado.rolId || null;
      console.log('Form inicializado com ID:', this.form.id);
    } else {
      console.error('Empregado ou ID inválido:', this.empleado);
      this.error = 'Erro: Empregado não encontrado.';
    }
  },
  methods: {
    async submitForm() {
      if (!this.form.nombre || !this.form.apellido || !this.form.email || !this.form.fechaAlta || !this.form.rolId) {
        this.error = 'Nome, Sobrenome, Email, Data de Admissão e ID do Papel são obrigatórios.';
        return;
      }

      this.loading = true;
      this.error = null;

      console.log('Enviando form com ID:', this.form.id);
      if (!this.form.id) {
        this.error = 'Erro: ID do empregado não encontrado no formulário.';
        this.loading = false;
        return;
      }

      try {
        const formData = new URLSearchParams();
        formData.append('nombre', this.form.nombre.trim());
        formData.append('apellido', this.form.apellido.trim());
        formData.append('email', this.form.email.trim());
        if (this.form.contrasena) formData.append('contrasena', this.form.contrasena);
        formData.append('fechaAlta', this.form.fechaAlta);
        formData.append('rolId', this.form.rolId.toString());

        console.log('Dados enviados na requisição:', {
          id: this.form.id,
          nombre: this.form.nombre,
          apellido: this.form.apellido,
          email: this.form.email,
          contrasena: this.form.contrasena,
          fechaAlta: this.form.fechaAlta,
          rolId: this.form.rolId,
        });

        const response = await axios.put(`/api/empleado?id=${this.form.id}`, formData, {
          headers: {
            'Content-Type': 'application/x-www-form-urlencoded',
            'Accept': 'application/json',
          },
        });

        console.log('Resposta da atualização:', response.data);
        this.$emit('empleadoUpdated');
        this.closeModal();
      } catch (err) {
        console.error('Erro ao atualizar empregado:', err);
        if (err.response) {
          const errorMessage = err.response.data || 'Erro desconhecido no servidor';
          switch (err.response.status) {
            case 404:
              this.error = 'Empregado não encontrado.';
              break;
            case 400:
              this.error = 'Erro nos dados fornecidos: ' + errorMessage;
              break;
            case 500:
              this.error = 'Erro interno do servidor: ' + errorMessage;
              break;
            default:
              this.error = 'Erro ao editar empregado: ' + errorMessage;
          }
        } else {
          this.error = 'Erro ao editar empregado: ' + err.message;
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
        apellido: '',
        email: '',
        contrasena: '',
        fechaAlta: '',
        rolId: null,
      };
      this.error = null;
    },
  },
};
</script>