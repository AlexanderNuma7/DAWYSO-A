import { mount } from '@vue/test-utils'
import { describe, it, expect, vi } from 'vitest'



vi.mock('bootstrap', () => {
  const Modal = function() {
    this.show = vi.fn()
    this.hide = vi.fn()
  }
  return { Modal }
})

import ProductoComponent from '@/components/ProductoComponent.vue'


global.fetch = vi.fn(() =>
  Promise.resolve({
    json: () => Promise.resolve([
      { id: '1', nombre: 'Producto 1', precio: 100 },
      { id: '2', nombre: 'Producto 2', precio: 200 }
    ])
  })
)

describe('ProductoComponent', () => {
  it('renderiza el título correctamente', () => {
    const wrapper = mount(ProductoComponent)
    expect(wrapper.text()).toContain('Gestión de Productos')
  })

  it('tiene un botón para agregar producto', () => {
    const wrapper = mount(ProductoComponent)
    expect(wrapper.text()).toContain('+ Agregar Producto')
  })

  it('el formulario inicia vacío', () => {
    const wrapper = mount(ProductoComponent)
    expect(wrapper.vm.form.nombre).toBe('')
    expect(wrapper.vm.form.precio).toBe('')
  })
})