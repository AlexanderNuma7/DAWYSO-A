<template>
  <div class="container mt-4">
    <h3>Gestión de Productos</h3>

    <button class="btn btn-success mb-3" @click="abrirModal()">+ Agregar Producto</button>

    <table class="table table-striped">
      <thead>
        <tr><th>Nombre</th><th>Precio</th><th>Acciones</th></tr>
      </thead>
      <tbody>
        <tr v-for="p in productos" :key="p.id">
          <td>{{ p.nombre }}</td>
          <td>{{ p.precio }}</td>
          <td>
            <button @click="abrirModal(p)" class="btn btn-warning btn-sm me-2">Editar</button>
            <button @click="eliminar(p.id)" class="btn btn-danger btn-sm">Eliminar</button>
          </td>
        </tr>
      </tbody>
    </table>

    <!-- Modal -->
    <div class="modal fade" id="productoModal" tabindex="-1">
      <div class="modal-dialog">
        <div class="modal-content">
          <div class="modal-header">
            <h5 class="modal-title">{{ editando ? 'Editar Producto' : 'Nuevo Producto' }}</h5>
            <button type="button" class="btn-close" data-bs-dismiss="modal"></button>
          </div>
          <div class="modal-body">
            <div class="mb-2">
              <input v-model="form.nombre" class="form-control" :class="{'is-invalid': errores.nombre}" placeholder="Nombre" />
              <div class="invalid-feedback">{{ errores.nombre }}</div>
            </div>
            <div class="mb-2">
              <input v-model="form.precio" class="form-control" :class="{'is-invalid': errores.precio}" placeholder="Precio" type="number" />
              <div class="invalid-feedback">{{ errores.precio }}</div>
            </div>
          </div>
          <div class="modal-footer">
            <button class="btn btn-secondary" data-bs-dismiss="modal">Cancelar</button>
            <button class="btn btn-primary" @click="guardar">Guardar</button>
          </div>
        </div>
      </div>
    </div>

  </div>
</template>

<script>
import { Modal } from 'bootstrap'
import { defineRule, validate } from 'vee-validate'

defineRule('required', value => {
  if (!value || !value.toString().trim()) return 'Este campo es obligatorio'
  return true
})

defineRule('minPrice', value => {
  if (value <= 0) return 'El precio debe ser mayor a 0'
  return true
})

const API = 'https://6a1aebbbbc2f94475492cebb.mockapi.io/Productos'

export default {
  data() {
    return {
      productos: [],
      form: { nombre: '', precio: '' },
      errores: { nombre: '', precio: '' },
      editando: null,
      modal: null
    }
  },
  async created() {
    const res = await fetch(API)
    this.productos = await res.json()
  },
  mounted() {
    this.modal = new Modal(document.getElementById('productoModal'))
  },
  methods: {
    abrirModal(producto = null) {
      if (producto) {
        this.editando = producto.id
        this.form = { nombre: producto.nombre, precio: producto.precio }
      } else {
        this.editando = null
        this.form = { nombre: '', precio: '' }
      }
      this.errores = { nombre: '', precio: '' }
      this.modal.show()
    },
    async guardar() {
      const resultNombre = await validate(this.form.nombre, 'required')
      const resultPrecio = await validate(this.form.precio, 'required|minPrice')

      this.errores.nombre = resultNombre.valid ? '' : resultNombre.errors[0]
      this.errores.precio = resultPrecio.valid ? '' : resultPrecio.errors[0]

      if (!resultNombre.valid || !resultPrecio.valid) return

      if (this.editando) {
        const res = await fetch(`${API}/${this.editando}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(this.form)
        })
        const actualizado = await res.json()
        const index = this.productos.findIndex(p => p.id === this.editando)
        this.productos[index] = actualizado
      } else {
        const res = await fetch(API, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(this.form)
        })
        const nuevo = await res.json()
        this.productos.push(nuevo)
      }

      this.modal.hide()
      this.form = { nombre: '', precio: '' }
      this.editando = null
    },
    async eliminar(id) {
      await fetch(`${API}/${id}`, { method: 'DELETE' })
      this.productos = this.productos.filter(p => p.id !== id)
    }
  }
}
</script>