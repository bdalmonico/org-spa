<script setup>
import { ref } from 'vue';
import axios from 'axios';

const projectId = ref('');
const projectData = ref(null);
const errorMessage = ref('');

const fetchProject = async () => {
  if (!projectId.value) {
    errorMessage.value = 'Por favor, insira um ID.';
    return;
  }

  try {
    const response = await axios.get(`http://localhost:8080/org-rest-api/v1/proyecto/${projectId.value}`);
    projectData.value = response.data;
    errorMessage.value = '';
  } catch (error) {
    errorMessage.value = 'Erro ao buscar o projeto. Verifique se o ID está correto.';
    projectData.value = null;
  }
};
</script>

<template>
  <div class="p-4">
    <h1 class="text-2xl font-bold mb-4">Buscar Projeto por ID</h1>
    
    <input 
      v-model="projectId" 
      type="text" 
      placeholder="Digite o ID do projeto" 
      class="border p-2 rounded-md mr-2"
    />
    
    <button @click="fetchProject" class="bg-blue-500 text-white px-4 py-2 rounded-md">
      Buscar
    </button>

    <p v-if="errorMessage" class="text-red-500 mt-2">{{ errorMessage }}</p>

    <div v-if="projectData" class="mt-4 p-4 border rounded-md">
      <h2 class="text-xl font-bold">Detalhes do Projeto</h2>
      <p><strong>ID:</strong> {{ projectData.id }}</p>
      <p><strong>Nome:</strong> {{ projectData.nombre }}</p>
    </div>
  </div>
</template>
