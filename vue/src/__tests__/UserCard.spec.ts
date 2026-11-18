import { describe, expect, it } from 'vitest'
import { mount, RouterLinkStub } from '@vue/test-utils'
import UserCard from '@/components/UserCard.vue'

const user = { id: 7, name: 'Ana Pérez', email: 'ana@example.test', address: { city: 'Cuenca' } }

describe('tarjeta de usuario', () => {
  it('muestra los datos y emite el id al marcar como favorito', async () => {
    const wrapper = mount(UserCard, {
      props: { user, favorite: false },
      global: { stubs: { RouterLink: RouterLinkStub } },
    })

    expect(wrapper.text()).toContain(user.name)
    expect(wrapper.text()).toContain(user.email)
    expect(wrapper.text()).toContain(user.address.city)
    expect(wrapper.get('button').attributes('aria-pressed')).toBe('false')

    await wrapper.get('button').trigger('click')
    expect(wrapper.emitted('toggleFavorite')).toEqual([[7]])

    await wrapper.setProps({ favorite: true })
    expect(wrapper.get('button').attributes('aria-pressed')).toBe('true')
    expect(wrapper.get('button').text()).toBe('Quitar favorito')
  })
})
