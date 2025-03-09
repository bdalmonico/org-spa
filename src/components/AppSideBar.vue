<template>
  <aside class="w-64 bg-gray-200 p-4 h-full border-r border-gray-300">
    <h2 class="text-lg font-semibold mb-4 text-gray-800">Menu</h2>
    <ul class="space-y-2">
      <li><router-link to="/home" class="flex items-center p-2 text-gray-700 hover:bg-gray-300 rounded transition-colors"><i class="fas fa-home mr-2"></i> Início</router-link></li>
      <li><router-link to="/tareas" class="flex items-center p-2 text-gray-700 hover:bg-gray-300 rounded transition-colors"><i class="fas fa-tasks mr-2"></i> Tareas</router-link></li>
      <li><router-link to="/projetos" class="flex items-center p-2 text-gray-700 hover:bg-gray-300 rounded transition-colors"><i class="fas fa-project-diagram mr-2"></i> Proyectos</router-link></li>
      <li><router-link to="/clientes" class="flex items-center p-2 text-gray-700 hover:bg-gray-300 rounded transition-colors"><i class="fas fa-users mr-2"></i> Clientes</router-link></li>
      <li><router-link to="/empleados" class="flex items-center p-2 text-gray-700 hover:bg-gray-300 rounded transition-colors"><i class="fas fa-user-tie mr-2"></i> Empleados</router-link></li>
    </ul>
  </aside>
</template>

<script>
export default {
  name: 'Sidebar',
};
</script>