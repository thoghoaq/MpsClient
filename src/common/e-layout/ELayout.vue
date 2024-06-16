<script setup lang="ts">
  import { ref } from 'vue'
  import ETopBar from './TopBar/ETopBar.vue'
  import { useI18n } from 'vue-i18n'
  import { MenuItem } from 'primevue/menuitem'
  import { useRouter } from 'vue-router'
  const router = useRouter()
  const { t } = useI18n()
  const props = defineProps({
    hideCategory: Boolean,
  })

  const visible = ref(true)
  const toggleMenu = () => {
    visible.value = !visible.value
  }

  const getBreadcrum = function (path: string): MenuItem[] {
    const items = path.split('/').filter((item) => item !== '')
    return items.map((item) => {
      return getMenuItem(item)
    })
  }

  const getMenuItem = function (item: string): MenuItem {
    switch (item) {
      case 'admin':
        return {
          label: t('Administrator'),
          class: 'm-0',
        }
      default:
        return {
          label: item,
          class: 'm-0',
        }
    }
  }

  const home = ref({
    icon: 'pi pi-home',
    label: t('HOME'),
    route: '/',
  })
</script>
<template>
  <header></header>
  <main>
    <div class="overflow-auto h-screen">
      <ETopBar :on-toggle-menu="toggleMenu" class="sticky top-0 z-1" />
      <div>
        <div class="flex">
          <Category v-if="props.hideCategory"></Category>
          <div class="flex flex-column h-screen w-full m-3">
            <div class="bg-primary-reverse border-round mb-3">
              <Breadcrumb
                :home="home"
                :model="getBreadcrum(router.currentRoute.value.fullPath)"
              >
                <template #item="{ item, props }">
                  <router-link
                    v-if="item.route"
                    :to="item.route"
                    v-slot="{ href, navigate }"
                    custom
                  >
                    <a v-ripple v-bind="props.action" @click="navigate">
                      <span class="font-semibold">{{ item.label }}</span>
                    </a>
                  </router-link>
                  <a
                    v-else
                    v-ripple
                    :target="item.target"
                    v-bind="props.action"
                  >
                    <span class="font-semibold">{{ item.label }}</span>
                  </a>
                </template>
                <template #separator>
                  <span class="font-semibold">/</span>
                </template>
              </Breadcrumb>
            </div>
            <div class="bg-primary-reverse h-full overflow-auto border-round">
              <slot name="page-content"></slot>
            </div>
          </div>
        </div>
      </div>
    </div>
  </main>
</template>
