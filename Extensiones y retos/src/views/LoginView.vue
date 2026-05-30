<template>
  <div class="container mt-5 col-md-4">
    <h3>Iniciar Sesión</h3>

    <input
      v-model="usuario"
      class="form-control mb-2"
      placeholder="Usuario"
    />

    <input
      v-model="clave"
      type="password"
      class="form-control mb-2"
      placeholder="Contraseña"
    />

    <button class="btn btn-primary w-100" @click="login">
      Entrar
    </button>

    <p v-if="error" class="text-danger mt-2">
      {{ error }}
    </p>
  </div>
</template>

<script>
const API = 'https://6a1aebbbbc2f94475492cebb.mockapi.io/usuarios'

export default {
  data() {
    return {
      usuario: '',
      clave: '',
      error: ''
    }
  },
  methods: {
    async login() {
      const res = await fetch(API)
      const users = await res.json()

      const valido = users.find(
        u => u.userName === this.usuario && u.password === this.clave
      )

      if (valido) {
        localStorage.setItem('logueado', 'true')
        localStorage.setItem('role', valido.role)
        this.$router.push('/dashboard')
      } else {
        this.error = 'Credenciales incorrectas'
      }
    }
  }
}
</script>