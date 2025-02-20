<template>
  <div>
    <nav>
      <router-link to="/">Home</router-link> |
      <router-link to="/test">Test</router-link>
    </nav>
    <router-view /> <!-- Isso renderiza a rota correta -->
  </div>
</template>
