<template>
    <div class="min-h-screen flex items-center justify-center bg-gray-100">
      <div class="bg-white p-8 rounded-lg shadow-lg w-full max-w-md">
        <div class="text-center mb-6">
          <h1 class="text-2xl font-bold text-gray-800">Login</h1>
          <p class="text-gray-500">Entre com suas credenciais para acessar o sistema</p>
        </div>
  
        <form @submit.prevent="handleLogin" class="space-y-4">
          <div>
            <label for="email" class="block text-sm font-medium text-gray-700">Email</label>
            <input
              v-model="form.email"
              type="email"
              id="email"
              class="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:border-blue-500 focus:ring focus:ring-blue-200 focus:ring-opacity-50"
              placeholder="seu.email@exemplo.com"
              required
            />
          </div>
  
          <div>
            <label for="password" class="block text-sm font-medium text-gray-700">Senha</label>
            <input
              v-model="form.password"
              type="password"
              id="password"
              class="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:border-blue-500 focus:ring focus:ring-blue-200 focus:ring-opacity-50"
              placeholder="Digite sua senha"
              required
            />
          </div>
  
          <button
            type="submit"
            class="w-full bg-blue-500 text-white py-2 px-4 rounded-md hover:bg-blue-600 transition-colors cursor-pointer"
            :disabled="loading"
          >
            <span v-if="loading">Carregando...</span>
            <span v-else>Entrar</span>
          </button>
  
          <p v-if="error" class="mt-4 text-red-600 text-center">{{ error }}</p>
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
        this.loading = true;
        this.error = null;
  
        try {
          // Passo 1: Buscar o ID do empregado com base no email
          const empleadoResponse = await axios.get(`/api/empleado/email/${encodeURIComponent(this.form.email)}`);
          const empleadoId = empleadoResponse.data.id; // Assume que a resposta contém um objeto com 'id'
  
          if (!empleadoId) {
            throw new Error('Email não encontrado.');
          }
  
          // Passo 2: Buscar a senha armazenada para o empregado pelo ID
          const empleadoDetailResponse = await axios.get(`/api/empleado/${empleadoId}`);
          const storedPassword = empleadoDetailResponse.data.password; // Assume que há um campo 'password' no EmpleadoDTO
  
          if (!storedPassword) {
            throw new Error('Senha não encontrada para este usuário.');
          }
  
          // Passo 3: Fazer o match da senha fornecida com a senha armazenada
          // Aqui, assumo que a senha no banco está em texto plano para simplicidade
          // Se a senha for criptografada (ex.: com jasypt, bcrypt, etc.), ajuste para verificar o hash
          if (this.form.password !== storedPassword) {
            throw new Error('Email ou senha inválidos.');
          }
  
          // Passo 4: Se o login for bem-sucedido, redirecione para a home ou outra rota
          this.$router.push('/'); // Redireciona para a home após login bem-sucedido
        } catch (err) {
          this.error = err.message || 'Erro ao fazer login. Tente novamente.';
        } finally {
          this.loading = false;
        }
      },
    },
  };
  </script>
  
  <style scoped>
  /* Estilos adicionais para maior semelhança com o Frappe Framework, se necessário */
  </style>