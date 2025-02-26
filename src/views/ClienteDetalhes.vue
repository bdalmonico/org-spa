<template>
    <div class="cliente-detalhes">
      <h1>Detalhes do Cliente</h1>
      <div v-if="cliente">
        <p><strong>ID:</strong> {{ cliente.id }}</p>
        <p><strong>Nome:</strong> {{ cliente.nombre }}</p>
        <p><strong>Email:</strong> {{ cliente.email }}</p>
        <p><strong>Telefone:</strong> {{ cliente.telefone }}</p>
        <p><strong>NIF/CIF:</strong> {{ cliente.nifCif }}</p>
        <p><strong>Estado ID:</strong> {{ cliente.estadoId }}</p>
      </div>
      <p v-if="loading">Carregando...</p>
      <p v-if="error">{{ error }}</p>
      <button @click="$router.go(-1)">Voltar</button>
    </div>
  </template>
  
  <script>
  import axios from 'axios';
  
  export default {
    data() {
      return {
        cliente: null,
        loading: false,
        error: null,
      };
    },
    mounted() {
      this.fetchCliente();
    },
    methods: {
      async fetchCliente() {
        this.loading = true;
        this.error = null;
        const id = this.$route.params.id;
        try {
          const response = await axios.get(`/api/cliente/${id}`);
          this.cliente = response.data; // Retorna diretamente o ClienteDTO
        } catch (err) {
          this.error = 'Erro ao carregar o cliente: ' + err.message;
        } finally {
          this.loading = false;
        }
      },
    },
  };
  </script>
  
  <style scoped>
  .cliente-detalhes {
    padding: 2rem;
  }
  p {
    margin: 0.5rem 0;
  }
  button {
    margin-top: 1rem;
    padding: 0.5rem 1rem;
    background-color: #333;
    color: white;
    border: none;
    border-radius: 4px;
    cursor: pointer;
  }
  button:hover {
    background-color: #555;
  }
  </style>