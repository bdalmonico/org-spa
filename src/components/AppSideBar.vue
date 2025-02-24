<!-- <template>
    <aside class="w-64 bg-gray-800 text-white h-screen p-5 shadow-lg">
      <nav>
        <ul class="space-y-4">
          <li>
            <router-link to="/home" class="block px-4 py-2 rounded-lg hover:bg-gray-700">
              Home
            </router-link>
          </li>
          <li>
            <router-link to="/proyectos" class="block px-4 py-2 rounded-lg hover:bg-gray-700">
              📁 Proyectos
            </router-link>
          </li>
          <li>
            <router-link to="/tareas" class="block px-4 py-2 rounded-lg hover:bg-gray-700">
              ✅ Tareas
            </router-link>
          </li>
          <li>
            <router-link to="/empleados" class="block px-4 py-2 rounded-lg hover:bg-gray-700">
              👤 Empleados
            </router-link>
          </li>
          <li>
            <router-link to="/clientes" class="block px-4 py-2 rounded-lg hover:bg-gray-700">
              🏢 Clientes
            </router-link>
          </li>
        </ul>
      </nav>
    </aside>
  </template>
  
  <script>
  export default {
    name: "AppSidebar",
  };
  </script>
   -->

   <template>
    <aside class="w-64 bg-gray-800 text-white h-screen p-5 shadow-lg">
      <nav>
        <ul class="space-y-4">
          <li>
            <router-link to="/home" class="block px-4 py-2 rounded-lg hover:bg-gray-700">🏠 Home</router-link>
          </li>
          <li>
            <router-link to="/proyectos" class="block px-4 py-2 rounded-lg hover:bg-gray-700">📁 Proyectos</router-link>
          </li>
        </ul>
      </nav>
    </aside>
  </template>
  
  <script>
  export default {
    name: "AppSidebar"
  };
  </script>