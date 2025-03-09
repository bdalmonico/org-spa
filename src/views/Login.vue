<template>
  <div class="min-h-screen bg-gray-100 flex items-center justify-center">
    <div class="bg-white p-6 rounded-lg shadow-lg w-full max-w-md">
      <h1 class="text-2xl text-blue-800 text-center mb-6">Login</h1>
      <form @submit.prevent="handleLogin" class="space-y-4">
        <div>
          <label for="email" class="block text-sm font-medium text-gray-700">Email</label>
          <input
            v-model="form.email"
            type="email"
            id="email"
            class="mt-1 block w-full border border-gray-300 rounded-md shadow-sm focus:border-blue-500 focus:ring focus:ring-blue-200 focus:ring-opacity-50"
            placeholder="Digite seu email"
            required
          />
        </div>
        <div>
          <label for="password" class="block text-sm font-medium text-gray-700">Senha</label>
          <input
            v-model="form.password"
            type="password"
            id="password"
            class="mt-1 block w-full border border-gray-300 rounded-md shadow-sm focus:border-blue-500 focus:ring focus:ring-blue-200 focus:ring-opacity-50"
            placeholder="Digite sua senha"
            required
          />
        </div>
        <button
          type="submit"
          class="w-full bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 transition-colors"
          :disabled="loading"
        >
          Entrar
        </button>
        <p v-if="error" class="mt-2 text-red-600 text-center">{{ error }}</p>
      </form>
    </div>
  </div>
</template>

<script>
import axios from 'axios';

export default {
  data() {
    return {
      form: {
        email: '',
        password: '',
      },
      loading: false,
      error: null,
    };
  },
  methods: {
    async handleLogin() {
      if (!this.form.email || !this.form.password) {
        this.error = 'Por favor, preencha todos os campos.';
        return;
      }

      this.loading = true;
      this.error = null;

      try {
        //  Buscar o ID do usuário com base no email
        const response = await axios.get('/api/empleado', {
          params: {
            email: this.form.email.trim(),
          },
        });

        const empleados = response.data.page;
        if (!empleados || empleados.length === 0) {
          this.error = 'Nenhum usuário encontrado com este email.';
          return;
        }

        const empleado = empleados[0];
        const userId = empleado.id;

        if (!userId) {
          this.error = 'Não foi possível obter o ID do usuário.';
          return;
        }

        // Passo 2: Autenticar usando o ID e a senha
        const empleadoDTO = {
          id: userId,
          nombre: 'Placeholder',
          apellido: 'Placeholder',
          email: this.form.email.trim(),
          contrasena: this.form.password.trim(),
          fechaEstimadaInicio: '2023-01-01',
          rolId: 1,
        };

        const authResponse = await axios.post('/api/empleado/autenticar', empleadoDTO, {
          headers: {
            'Content-Type': 'application/json',
            'Accept': 'application/json',
          },
        });

        const authenticatedEmpleado = authResponse.data;

        // Passo 3: Salvar cookies
        document.cookie = `userId=${authenticatedEmpleado.id}; path=/; max-age=86400`;
        document.cookie = `userEmail=${authenticatedEmpleado.email}; path=/; max-age=86400`;

        this.$root.$emit('login-success', authenticatedEmpleado.email, authenticatedEmpleado.id);

        this.$router.push('/home');
      } catch (err) {
        this.error = 'Erro ao fazer login: ' + (err.response?.data || err.message);
      } finally {
        this.loading = false;
      }
    },
  },
};
</script>