import { beforeEach, describe, expect, it, vi } from 'vitest'
import { createPinia } from 'pinia'
import { flushPromises, mount, RouterLinkStub } from '@vue/test-utils'
import HomeView from '@/views/HomeView.vue'
import { getUsers } from '@/services/userService'

vi.mock('@/services/userService', () => ({ getUsers: vi.fn() }))
beforeEach(() => vi.resetAllMocks())

const options = () => ({ global: { plugins: [createPinia()], stubs: { RouterLink: RouterLinkStub } } })

describe('pantalla del directorio', () => {
  it('muestra un error y el botón Reintentar recupera la lista', async () => {
    vi.mocked(getUsers).mockRejectedValueOnce(new Error('Sin conexión')).mockResolvedValueOnce([
      { id: 1, name: 'Ana Pérez', email: 'ana@example.test', address: { city: 'Cuenca' } },
    ])
    const wrapper = mount(HomeView, options())
    await flushPromises()
    expect(wrapper.get('[role="alert"]').text()).toContain('Sin conexión')

    await wrapper.get('button').trigger('click')
    await flushPromises()
    expect(wrapper.find('[role="alert"]').exists()).toBe(false)
    expect(wrapper.get('article').text()).toContain('Ana Pérez')
    wrapper.unmount()
  })

  it('explica que la lista está vacía si la API no devuelve usuarios', async () => {
    vi.mocked(getUsers).mockResolvedValue([])
    const wrapper = mount(HomeView, options())
    await flushPromises()
    expect(wrapper.text()).toContain('La API no devolvió usuarios.')
    wrapper.unmount()
  })
})
