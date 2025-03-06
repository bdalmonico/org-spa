<template>
  <div v-if="isOpen" class="fixed inset-0 bg-gray-600 bg-opacity-50 flex items-center justify-center z-50">
    <div class="bg-white p-6 rounded-lg shadow-lg w-full max-w-md">
      <h3 class="text-lg font-semibold text-blue-800 mb-4">Criar Novo Empregado</h3>
      <form @submit.prevent="submitForm" class="space-y-4">
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
          <label for="apellido" class="block text-sm font-medium text-gray-700">Sobrenome</label>
          <input
            v-model="form.apellido"
            type="text"
            id="apellido"
            class="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:border-blue-500 focus:ring focus:ring-blue-200 focus:ring-opacity-50"
            placeholder="Digite o sobrenome do empregado"
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
          <label for="contrasena" class="block text-sm font-medium text-gray-700">Senha</label>
          <input
            v-model="form.contrasena"
            type="password"
            id="contrasena"
            class="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:border-blue-500 focus:ring focus:ring-blue-200 focus:ring-opacity-50"
            placeholder="Digite a senha do empregado"
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
            Criar
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
  },
  data() {
    return {
      form: {
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
  methods: {
    async submitForm() {
      if (!this.form.nombre || !this.form.apellido || !this.form.email || !this.form.fechaAlta || !this.form.rolId) {
        this.error = 'Nome, Sobrenome, Email, Data de Admissão e ID do Papel são obrigatórios.';
        return;
      }

      this.loading = true;
      this.error = null;

      try {
        const formData = new URLSearchParams();
        formData.append('nombre', this.form.nombre.trim());
        formData.append('apellido', this.form.apellido.trim());
        formData.append('email', this.form.email.trim());
        if (this.form.contrasena) formData.append('contrasena', this.form.contrasena);
        formData.append('fechaAlta', this.form.fechaAlta);
        formData.append('rolId', this.form.rolId.toString());

        console.log('URL da requisição:', '/api/empleado');
        console.log('Dados enviados para criação:', {
          nombre: this.form.nombre,
          apellido: this.form.apellido,
          email: this.form.email,
          contrasena: this.form.contrasena,
          fechaAlta: this.form.fechaAlta,
          rolId: this.form.rolId,
        });
        console.log('FormData como string:', formData.toString());

        const response = await axios.post('/api/empleado', formData, {
          headers: {
            'Content-Type': 'application/x-www-form-urlencoded',
            'Accept': 'application/json',
          },
          maxRedirects: 0,
        });

        console.log('Resposta da criação:', response.data);
        this.$emit('empleadoCreated');
        this.closeModal();
      } catch (err) {
        console.error('Erro ao criar empregado:', err);
        if (err.response) {
          const errorMessage = err.response.data || 'Erro desconhecido no servidor';
          console.log('Resposta de erro do servidor:', errorMessage);
          switch (err.response.status) {
            case 400:
              this.error = 'Erro nos dados fornecidos: ' + errorMessage;
              break;
            case 500:
              this.error = 'Erro interno do servidor: ' + errorMessage;
              break;
            default:
              this.error = 'Erro ao criar empregado: ' + errorMessage;
          }
        } else {
          this.error = 'Erro ao criar empregado: ' + err.message;
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