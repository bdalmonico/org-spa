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
    
    console.log('Resposta da API:', response.data); 

    if (response.data && typeof response.data === 'object') {
      projectData.value = response.data;
      errorMessage.value = '';
    } else {
      throw new Error('Resposta inesperada da API');
    }
  } catch (error) {
    console.error('Erro ao buscar projeto:', error);
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
      <p><strong>Cliente:</strong> {{ projectData.clienteNombre }}</p>
      <p><strong>Descrição:</strong> {{ projectData.descripcion }}</p>
      <p><strong>Início Estimado:</strong> {{ projectData.fechaEstimadaInicio }}</p>
      <p><strong>Fim Estimado:</strong> {{ projectData.fechaEstimadaFin }}</p>
      <p><strong>Valor:</strong> {{ projectData.importe }}</p>

      <pre class="bg-gray-100 p-2 rounded-md mt-2">{{ projectData }}</pre>
    </div>
  </div>
</template>
