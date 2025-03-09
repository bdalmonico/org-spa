<template>
  <header class="bg-blue-800 text-white p-4 flex justify-between items-center border-b border-blue-900">
    <div>
      <h1 class="text-xl text-white">Organizate.es</h1>
    </div>
    <div class="flex items-center gap-4 relative">
      <img src="../assets/user-icon.png" alt="Usuário" class="w-6 h-6 rounded-full object-cover" />
      <span class="text-sm">{{ empleadoNombre || 'Carregando...' }}</span>
      <span class="text-lg cursor-pointer hover:text-gray-300" @click="toggleSettingsMenu">{{ settingsIcon }}</span>
      <!-- Menu de Configurações -->
      <div v-if="showSettingsMenu" class="absolute right-0 top-full mt-2 bg-white text-black border border-gray-200 rounded-md shadow-lg z-10">
        <button
          class="w-full px-4 py-2 text-left text-red-500 hover:bg-gray-100 cursor-pointer"
          @click="logout"
        >
          Sair
        </button>
      </div>
    </div>
  </header>
</template>

<script>
import axios from 'axios';

export default {
  name: 'Header',
  data() {
    return {
      empleadoNombre: '',
      showSettingsMenu: false,
      settingsIcon: '⚙',
      userEmail: this.getCookie('userEmail') || '',
      userId: this.getCookie('userId') || '',
    };
  },
  mounted() {
    this.fetchEmpleadoNombre();
  },
  watch: {
    userEmail(newEmail) {
      // Quando userEmail mudar (login/logout), buscar o nome novamente
      this.fetchEmpleadoNombre();
    },
  },
  methods: {
    toggleSettingsMenu() {
      this.showSettingsMenu = !this.showSettingsMenu;
    },
    getCookie(name) {
      const value = `; ${document.cookie}`;
      const parts = value.split(`; ${name}=`);
      if (parts.length === 2) return parts.pop().split(';').shift();
      return '';
    },
    async fetchEmpleadoNombre() {
      if (!this.userEmail) {
        this.empleadoNombre = ''; // Limpa o nome se não houver email (usuário deslogado)
        return;
      }

      try {
        const response = await axios.get('/api/empleado', {
          params: {
            email: this.userEmail.trim(),
          },
        });
        const empleados = response.data.page;
        if (empleados && empleados.length > 0) {
          this.empleadoNombre = `${empleados[0].nombre} ${empleados[0].apellido || ''}`.trim() || this.userEmail;
        } else {
          this.empleadoNombre = this.userEmail; // Fallback para o email se o nome não for encontrado
        }
      } catch (err) {
        console.error('Erro ao buscar nome do empregado:', err);
        this.empleadoNombre = this.userEmail; // Fallback
      }
    },
    logout() {
      document.cookie = 'userId=; path=/; max-age=0';
      document.cookie = 'userEmail=; path=/; max-age=0';
      this.userEmail = ''; // Atualiza o userEmail para acionar o watch
      this.userId = '';
      this.$router.push('/login');
      this.showSettingsMenu = false;
    },
  },
};
</script>