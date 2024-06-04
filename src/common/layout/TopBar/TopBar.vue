<script setup lang="ts">
  import { ref } from 'vue'
  import { useSettingStore } from 'src/stores/setting'
  import { usePrimeVue } from 'primevue/config'
  import { Theme } from 'src/stores/setting/types'
  const primeVue = usePrimeVue()
  const settingStore = useSettingStore()

  const props = defineProps({
    onToggleMenu: Function,
  })
  const items = ref([])

  const showSettings = ref(false)
  const showProfile = ref(false)

  const changeTheme = function (nextTheme: string, scheme?: string) {
    primeVue.changeTheme(
      settingStore.currentTheme,
      nextTheme,
      'theme-link',
      () => {},
    )
    settingStore.changeTheme(nextTheme, scheme)
  }

  const changeScheme = function (scheme: string) {
    if (settingStore.currentScheme === scheme) return
    const isDark = scheme === 'Dark'
    const nextTheme = settingStore.collection.find((theme: Theme) =>
      theme.light === settingStore.currentTheme || theme.dark === settingStore.currentTheme,
    )
    if (nextTheme)
      isDark ? changeTheme(nextTheme.dark, scheme) : changeTheme(nextTheme.light, scheme)
  }
</script>
<template>
  <div class="card w-full">
    <Menubar :model="items" class="border-0 border-noround md:h-6rem">
      <template #start>
        <Button
          icon="pi pi-bars"
          class="p-button-rounded p-button-text"
          @click="props.onToggleMenu"
        />
      </template>
      <template #item="{ item, props, hasSubmenu, root }">
        <a v-ripple class="flex align-items-center" v-bind="props.action">
          <span :class="item.icon" />
          <span class="ml-2">{{ item.label }}</span>
          <Badge
            v-if="item.badge"
            :class="{ 'ml-auto': !root, 'ml-2': root }"
            :value="item.badge"
          />
          <span
            v-if="item.shortcut"
            class="ml-auto border-1 surface-border border-round surface-100 text-xs p-1"
            >{{ item.shortcut }}</span
          >
          <i
            v-if="hasSubmenu"
            :class="[
              'pi pi-angle-down',
              { 'pi-angle-down ml-2': root, 'pi-angle-right ml-auto': !root },
            ]"
          ></i>
        </a>
      </template>
      <template #end>
        <div class="flex align-items-center gap-2 mx-2">
          <IconField iconPosition="left">
            <InputIcon class="pi pi-search"> </InputIcon>
            <InputText :placeholder="$t('Search')" />
          </IconField>
          <Button
            icon="pi pi-cog"
            class="p-button-rounded p-button-text"
            @click="showSettings = true"
          />
          <Avatar
            image="https://primefaces.org/cdn/primevue/images/avatar/amyelsner.png"
            shape="circle"
            @click="showProfile = true"
          />
        </div>
      </template>
    </Menubar>
    <Sidebar
      v-model:visible="showSettings"
      :header="$t('Settings')"
      position="right"
    >
      <div>
        <h3 class="mb-3">{{ $t('Themes') }}</h3>
        <Button
          v-for="theme in settingStore.collection"
          :class="`p-button-rounded m-1 ${theme.color} ${settingStore.currentTheme == theme.light || settingStore.currentTheme == theme.dark ? 'border-3' : 'border-0'}`"
          @click="
            changeTheme(
              settingStore.currentScheme === 'Light' ? theme.light : theme.dark,
            )
          "
        ></Button>
      </div>
      <div>
        <h3 class="mb-3">{{ $t('Color Scheme') }}</h3>
        <div
          v-for="scheme in settingStore.colorSchemes"
          :key="settingStore.colorSchemes.indexOf(scheme)"
          class="flex align-items-center mb-2"
        >
          <RadioButton
            v-model="settingStore.currentScheme"
            :inputId="scheme"
            name="dynamic"
            :value="scheme"
            @click="changeScheme(scheme)"
          />
          <label :for="scheme" class="ml-2">{{ $t(scheme) }}</label>
        </div>
      </div>
    </Sidebar>
    <Sidebar v-model:visible="showProfile" header="Profile" position="right">
      <p>
        Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod
        tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim
        veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea
        commodo consequat.
      </p>
    </Sidebar>
  </div>
</template>
src/stores/settingsrc/stores/setting/types
