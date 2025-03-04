// src/utils/dateUtils.js

/**
 * Formata uma data no formato ISO 8601 (YYYY-MM-DDZ ou com < no final) para DD/MM/YYYY
 * @param {string} dateStr - String da data no formato ISO 8601 (ex.: "2028-06-01Z" ou "2028-06-01<")
 * @returns {string} - Data formatada no formato DD/MM/YYYY ou uma string vazia se inválida
 */
export function formatDate(dateStr) {
    if (!dateStr) return '';
  
    // Remove caracteres indesejados como "<" no final, se presente
    const cleanDateStr = dateStr.replace(/[<>Z]/g, '').trim();
  
    // Tenta criar uma data a partir da string limpa
    const date = new Date(cleanDateStr);
  
    // Verifica se a data é válida
    if (isNaN(date.getTime())) {
      console.warn('Data inválida:', dateStr);
      return '';
    }
  
    // Formata a data para DD/MM/YYYY
    const day = String(date.getDate()).padStart(2, '0');
    const month = String(date.getMonth() + 1).padStart(2, '0'); // getMonth() retorna 0-11
    const year = date.getFullYear();
  
    return `${day}/${month}/${year}`;
  }