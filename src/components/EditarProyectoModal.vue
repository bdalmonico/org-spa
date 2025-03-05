<template>
  <div v-if="isOpen" class="fixed inset-0 bg-gray-600 bg-opacity-50 flex items-center justify-center z-50">
    <div class="bg-white p-6 rounded-lg shadow-lg w-full max-w-md">
      <h3 class="text-lg font-semibold text-blue-800 mb-4">Editar Projeto</h3>
      <form @submit.prevent="submitForm" class="space-y-4">
        <div>
          <label for="nombre" class="block text-sm font-medium text-gray-700">Nome</label>
          <input
            v-model="form.nombre"
            type="text"
            id="nombre"
            class="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:border-blue-500 focus:ring focus:ring-blue-200 focus:ring-opacity-50"
            placeholder="Digite o nome do projeto"
            required
          />
        </div>
        <div>
          <label for="descripcion" class="block text-sm font-medium text-gray-700">Descrição</label>
          <textarea
            v-model="form.descripcion"
            id="descripcion"
            class="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:border-blue-500 focus:ring focus:ring-blue-200 focus:ring-opacity-50"
            placeholder="Digite a descrição do projeto"
            rows="3"
            required
          ></textarea>
        </div>
        <div>
          <label for="clienteNombre" class="block text-sm font-medium text-gray-700">Cliente</label>
          <input
            v-model="form.clienteNombre"
            type="text"
            id="clienteNombre"
            class="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:border-blue-500 focus:ring focus:ring-blue-200 focus:ring-opacity-50"
            placeholder="Digite o nome do cliente"
            required
          />
        </div>
        <div>
          <label for="estadoId" class="block text-sm font-medium text-gray-700">Estado ID</label>
          <input
            v-model.number="form.estadoId"
            type="number"
            id="estadoId"
            class="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:border-blue-500 focus:ring focus:ring-blue-200 focus:ring-opacity-50"
            placeholder="Digite o ID do estado"
            required
          />
        </div>
        <div>
          <label for="importe" class="block text-sm font-medium text-gray-700">Importe</label>
          <input
            v-model="form.importe"
            type="text"
            id="importe"
            class="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:border-blue-500 focus:ring focus:ring-blue-200 focus:ring-opacity-50"
            placeholder="Digite o importe (ex.: €10,000.00)"
            required
          />
        </div>
        <div>
          <label for="clienteId" class="block text-sm font-medium text-gray-700">Cliente ID (Opcional)</label>
          <input
            v-model.number="form.clienteId"
            type="number"
            id="clienteId"
            class="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:border-blue-500 focus:ring focus:ring-blue-200 focus:ring-opacity-50"
            placeholder="Digite o ID do cliente"
          />
        </div>
        <div>
          <label for="fechaEstimadaInicio" class="block text-sm font-medium text-gray-700">Data Estimada de Início</label>
          <input
            v-model="form.fechaEstimadaInicio"
            type="date"
            id="fechaEstimadaInicio"
            class="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:border-blue-500 focus:ring focus:ring-blue-200 focus:ring-opacity-50"
            required
          />
        </div>
        <div>
          <label for="fechaEstimadaFin" class="block text-sm font-medium text-gray-700">Data Estimada de Fim</label>
          <input
            v-model="form.fechaEstimadaFin"
            type="date"
            id="fechaEstimadaFin"
            class="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:border-blue-500 focus:ring focus:ring-blue-200 focus:ring-opacity-50"
            required
          />
        </div>
        <div>
          <label for="fechaRealInicio" class="block text-sm font-medium text-gray-700">Data Real de Início (Opcional)</label>
          <input
            v-model="form.fechaRealInicio"
            type="date"
            id="fechaRealInicio"
            class="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:border-blue-500 focus:ring focus:ring-blue-200 focus:ring-opacity-50"
          />
        </div>
        <div>
          <label for="fechaRealFin" class="block text-sm font-medium text-gray-700">Data Real de Fim (Opcional)</label>
          <input
            v-model="form.fechaRealFin"
            type="date"
            id="fechaRealFin"
            class="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:border-blue-500 focus:ring focus:ring-blue-200 focus:ring-opacity-50"
          />
        </div>
        <div class="flex gap-2">
          <button
            type="submit"
            class="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 transition-colors cursor-pointer"
            :disabled="loading"
          >
            Salvar
          </button>
          <button
            type="button"
            class="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600 transition-colors cursor-pointer"
            @click="closeModal"
            :disabled="loading"
          >
            Cancelar
          </button>
        </div>
      </form>
      <p v-if="error" class="mt-4 text-red-600">{{ error }}</p>
    </div>
  </div>
</template>

<script>
import axios from 'axios';
import { formatDate } from '../utils/dateUtils'; // Caminho relativo manual

export default {
  props: {
    isOpen: {
      type: Boolean,
      required: true,
    },
    proyecto: {
      type: Object,
      required: true,
    },
  },
  data() {
    return {
      form: {
        id: null,
        nombre: '',
        descripcion: '',
        clienteNombre: '',
        estadoId: null,
        importe: '',
        clienteId: null,
        fechaEstimadaInicio: '',
        fechaEstimadaFin: '',
        fechaRealInicio: '',
        fechaRealFin: '',
      },
      loading: false,
      error: null,
    };
  },
  created() {
    // Preenche os campos com os dados do projeto ao abrir o modal
    this.form.id = this.proyecto.id;
    this.form.nombre = this.proyecto.nombre || '';
    this.form.descripcion = this.proyecto.descripcion || '';
    this.form.clienteNombre = this.proyecto.clienteNombre || '';
    this.form.estadoId = this.proyecto.estadoId || null;
    this.form.importe = this.proyecto.importe || '';
    this.form.clienteId = this.proyecto.clienteId || null;
    this.form.fechaEstimadaInicio = this.proyecto.fechaEstimadaInicio ? this.formatFromIso(this.proyecto.fechaEstimadaInicio) : '';
    this.form.fechaEstimadaFin = this.proyecto.fechaEstimadaFin ? this.formatFromIso(this.proyecto.fechaEstimadaFin) : '';
    this.form.fechaRealInicio = this.proyecto.fechaRealInicio ? this.formatFromIso(this.proyecto.fechaRealInicio) : '';
    this.form.fechaRealFin = this.proyecto.fechaRealFin ? this.formatFromIso(this.proyecto.fechaRealFin) : '';
  },
  methods: {
    async submitForm() {
      this.loading = true;
      this.error = null;

      try {
        const formData = new URLSearchParams();
        formData.append('id', this.form.id);
        formData.append('nombre', this.form.nombre);
        formData.append('descripcion', this.form.descripcion);
        formData.append('clienteNombre', this.form.clienteNombre);
        formData.append('estadoId', this.form.estadoId !== null ? this.form.estadoId.toString() : '');
        formData.append('clienteId', this.form.clienteId !== null ? this.form.clienteId.toString() : '');
        formData.append('importe', this.form.importe);
        formData.append('fechaEstimadaInicio', this.formatToIso(this.form.fechaEstimadaInicio));
        formData.append('fechaEstimadaFin', this.formatToIso(this.form.fechaEstimadaFin));
        formData.append('fechaRealInicio', this.form.fechaRealInicio ? this.formatToIso(this.form.fechaRealInicio) : '');
        formData.append('fechaRealFin', this.form.fechaRealFin ? this.formatToIso(this.form.fechaRealFin) : '');

        await axios.put(`/api/proyecto/actualizar/${this.form.id}`, formData, {
          headers: {
            'Content-Type': 'application/x-www-form-urlencoded',
          },
        });

        this.$emit('projectUpdated');
        this.closeModal();
      } catch (err) {
        if (err.response) {
          switch (err.response.status) {
            case 404:
              this.error = 'Projeto não encontrado.';
              break;
            case 400:
              this.error = 'Erro nos dados fornecidos: ' + (err.response.data.message || err.message);
              break;
            case 500:
              this.error = 'Erro interno do servidor. Tente novamente mais tarde.';
              break;
            default:
              this.error = 'Erro ao editar projeto: ' + err.message;
          }
        } else {
          this.error = 'Erro ao editar projeto: ' + err.message;
        }
      } finally {
        this.loading = false;
      }
    },
    closeModal() {
      this.$emit('close');
      this.resetForm();
    },
    resetForm() {
      this.form = {
        id: null,
        nombre: '',
        descripcion: '',
        clienteNombre: '',
        estadoId: null,
        importe: '',
        clienteId: null,
        fechaEstimadaInicio: '',
        fechaEstimadaFin: '',
        fechaRealInicio: '',
        fechaRealFin: '',
      };
      this.error = null;
    },
    formatToIso(dateStr) {
      if (!dateStr) return '';
      const date = new Date(dateStr);
      return date.toISOString().split('T')[0]; // Formato YYYY-MM-DD (o backend espera yyyy-MM-dd, mas isso deve funcionar)
    },
    formatFromIso(dateStr) {
      if (!dateStr) return '';
      try {
        // Remove caracteres indesejados como "<", ">", ou "Z" no final
        const cleanDateStr = dateStr.replace(/[<>Z]/g, '').trim();
        if (!cleanDateStr) return '';

        // Divide a string em ano, mês e dia
        const [year, month, day] = cleanDateStr.split('-');
        if (!year || !month || !day) return '';

        // Formata para YYYY-MM-DD, garantindo que mês e dia tenham 2 dígitos
        return `${year}-${month.padStart(2, '0')}-${day.padStart(2, '0')}`;
      } catch (error) {
        console.warn('Erro ao formatar data:', dateStr, error);
        return ''; // Retorna vazio se houver erro
      }
    },
    // Método utilitário como método do componente (para uso no template, se necessário)
    formatDate(dateStr) {
      return formatDate(dateStr); // Usa o método do utilitário
    },
  },
};
</script>