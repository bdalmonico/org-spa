<template>
    <div class="p-6">
      <h2 class="text-2xl font-bold text-blue-800 mb-4">Lista de Empregados</h2>
      <button
        @click="openCreateModal"
        class="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 mb-4"
      >
        Criar Novo Empregado
      </button>
  
      <div v-if="empleados.length === 0" class="text-gray-500">
        Nenhum empregado encontrado.
      </div>
      <div v-else class="overflow-x-auto">
        <table class="min-w-full bg-white border border-gray-300">
          <thead>
            <tr class="bg-gray-100">
              <th class="py-2 px-4 border-b text-left">ID</th>
              <th class="py-2 px-4 border-b text-left">Nome</th>
              <th class="py-2 px-4 border-b text-left">Sobrenome</th>
              <th class="py-2 px-4 border-b text-left">Email</th>
              <th class="py-2 px-4 border-b text-left">Data de Admissão</th>
              <th class="py-2 px-4 border-b text-left">Papel</th>
              <th class="py-2 px-4 border-b text-left">Ações</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="empleado in empleados" :key="empleado.id" class="hover:bg-gray-50">
              <td class="py-2 px-4 border-b">{{ empleado.id }}</td>
              <td class="py-2 px-4 border-b">{{ empleado.nombre }}</td>
              <td class="py-2 px-4 border-b">{{ empleado.apellido }}</td>
              <td class="py-2 px-4 border-b">{{ empleado.email }}</td>
              <td class="py-2 px-4 border-b">{{ formatDate(empleado.fechaAlta) }}</td>
              <td class="py-2 px-4 border-b">{{ empleado.rolId }}</td>
              <td class="py-2 px-4 border-b">
                <div class="relative">
                  <button
                    @click="toggleSettings(empleado.id)"
                    class="text-gray-600 hover:text-gray-800 focus:outline-none"
                  >
                    <svg
                      class="w-5 h-5"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path
                        stroke-linecap="round"
                        stroke-linejoin="round"
                        stroke-width="2"
                        d="M12 6v6m0 0v6m0-6h6m-6 0H6"
                      />
                    </svg>
                  </button>
                  <div
                    v-if="showSettings === empleado.id"
                    class="absolute right-0 mt-2 w-48 bg-white border border-gray-200 rounded shadow-lg z-10"
                  >
                    <button
                      @click="openEditModal(empleado)"
                      class="block w-full text-left px-4 py-2 text-gray-700 hover:bg-gray-100"
                    >
                      Editar
                    </button>
                    <button
                      @click="deleteEmpleado(empleado.id)"
                      class="block w-full text-left px-4 py-2 text-red-600 hover:bg-gray-100"
                    >
                      Excluir
                    </button>
                  </div>
                </div>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
  
      <CrearEmpleadoModal
        :isOpen="isCreateModalOpen"
        @close="closeCreateModal"
        @empleadoCreated="fetchEmpleados"
      />
      <EditarEmpleadoModal
        :isOpen="isEditModalOpen"
        :empleado="selectedEmpleado"
        @close="closeEditModal"
        @empleadoUpdated="fetchEmpleados"
      />
    </div>
  </template>
  
  <script>
  import axios from 'axios';
  import CrearEmpleadoModal from '../components/CrearEmpleadoModal.vue';
  import EditarEmpleadoModal from '../components/EditarEmpleadoModal.vue';
  
  export default {
    components: {
      CrearEmpleadoModal,
      EditarEmpleadoModal,
    },
    data() {
      return {
        empleados: [],
        isCreateModalOpen: false,
        isEditModalOpen: false,
        selectedEmpleado: null,
        showSettings: null,
        loading: false,
        error: null,
      };
    },
    created() {
      this.fetchEmpleados();
    },
    methods: {
      async fetchEmpleados() {
        this.loading = true;
        this.error = null;
        try {
          const response = await axios.get('/api/empleado');
          console.log('Resposta da busca de empregados:', response.data);
          this.empleados = response.data.page || [];
        } catch (err) {
          console.error('Erro ao buscar empregados:', err);
          this.error = 'Erro ao carregar empregados: ' + (err.response?.data || err.message);
        } finally {
          this.loading = false;
        }
      },
      openCreateModal() {
        this.isCreateModalOpen = true;
      },
      closeCreateModal() {
        this.isCreateModalOpen = false;
      },
      openEditModal(empleado) {
        this.selectedEmpleado = empleado;
        this.isEditModalOpen = true;
        this.showSettings = null;
      },
      closeEditModal() {
        this.isEditModalOpen = false;
        this.selectedEmpleado = null;
      },
      toggleSettings(empleadoId) {
        this.showSettings = this.showSettings === empleadoId ? null : empleadoId;
      },
      async deleteEmpleado(id) {
        if (!confirm('Tem certeza que deseja excluir este empregado?')) return;
  
        try {
          const response = await axios.delete(`/api/empleado?id=${id}`);
          console.log('Resposta da exclusão:', response.data);
          this.fetchEmpleados();
          this.showSettings = null;
        } catch (err) {
          console.error('Erro ao excluir empregado:', err);
          alert('Erro ao excluir empregado: ' + (err.response?.data || err.message));
        }
      },
      formatDate(date) {
        if (!date) return '';
        return new Date(date).toLocaleDateString('pt-BR');
      },
    },
  };
  </script>