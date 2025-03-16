<template>
  <aside 
    :class="[
      'w-64 bg-gray-200 p-4 h-full border-r border-gray-300 fixed top-0 left-0 z-30 transition-transform duration-300 md:transition-none md:relative md:translate-x-0',
      isOpen ? 'translate-x-0' : '-translate-x-full'
    ]"
  >
    <div class="flex justify-between items-center mb-4">
      <h2 class="text-lg font-semibold text-gray-800">Menu</h2>
      <button 
        class="md:hidden text-xl" 
        @click="closeSidebar"
      >
        ✕
      </button>
    </div>
    <ul class="space-y-2">
      <li><router-link to="/home" class="flex items-center p-2 text-gray-700 hover:bg-gray-300 rounded transition-colors" @click="closeSidebar"><i class="fas fa-home mr-2"></i> Início</router-link></li>
      <li><router-link to="/tareas" class="flex items-center p-2 text-gray-700 hover:bg-gray-300 rounded transition-colors" @click="closeSidebar"><i class="fas fa-tasks mr-2"></i> Tareas</router-link></li>
      <li><router-link to="/projetos" class="flex items-center p-2 text-gray-700 hover:bg-gray-300 rounded transition-colors" @click="closeSidebar"><i class="fas fa-project-diagram mr-2"></i> Proyectos</router-link></li>
      <li><router-link to="/clientes" class="flex items-center p-2 text-gray-700 hover:bg-gray-300 rounded transition-colors" @click="closeSidebar"><i class="fas fa-users mr-2"></i> Clientes</router-link></li>
      <li><router-link to="/empleados" class="flex items-center p-2 text-gray-700 hover:bg-gray-300 rounded transition-colors" @click="closeSidebar"><i class="fas fa-user-tie mr-2"></i> Empleados</router-link></li>
    </ul>
  </aside>
</template>

<script>
export default {
  name: 'Sidebar',
  props: {
    isOpen: {
      type: Boolean,
      default: false,
    },
  },
  methods: {
    closeSidebar() {
      this.$emit('toggle-sidebar', false);
    },
  },
};
</script>