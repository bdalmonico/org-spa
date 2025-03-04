<template>
    <header class="bg-blue-800 text-white p-4 flex justify-between items-center border-b border-blue-900">
      <div>
        <h1 class="text-xl">Organizate.es</h1>
      </div>
      <div class="flex items-center gap-4">
        <img src="../assets/user-icon.png" alt="Usuário" class="w-6 h-6 rounded-full object-cover" />
        <span class="text-sm">María López Garcia</span>
        <span class="text-lg cursor-pointer hover:text-gray-300">✉</span>
        <span class="text-lg cursor-pointer hover:text-gray-300">⚙</span>
      </div>
    </header>
  </template>
  
  <script>
  export default {
    name: 'Header',
  };
  </script>