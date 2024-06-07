<script setup lang="ts">
  import { watch } from 'vue'
  import { MenuItem } from 'primevue/menuitem'
  import { useStaffStore } from 'src/stores/admin/staff'
  import { useToastStore } from 'src/stores/toast'
  import { onMounted, ref } from 'vue'
  import DateTimeHelper from 'src/helpers/datetime-helper'
  const staffStore = useStaffStore()
  const toast = useToastStore()
  const loading = ref(false)
  onMounted(() => {
    loading.value = true
    staffStore
      .fetchStaffs()
      .catch((error) => {
        toast.error(error)
      })
      .finally(() => {
        loading.value = false
      })
  })

  const getRoleClass = (role: string) => {
    switch (role) {
      case 'SuperAdmin':
        return 'bg-red-200'
      case 'Admin':
        return 'bg-orange-200'
      case 'Staff':
        return 'bg-yellow-200'
      case 'ShopOwner':
        return 'bg-teal-200'
      case 'Customer':
        return ''
      default:
        return ''
    }
  }

  const menu = ref()
  const items = ref<MenuItem[]>([
    {
      class: 'p-0',
      items: [
        {
          label: 'Edit',
          icon: 'pi pi-pencil',
          route: '/admin/staffs',
        },
        {
          label: 'Deactivate',
          icon: 'pi pi-lock',
          class: 'text-red-500',
        },
      ],
    },
  ])

  const toggle = (event: any) => {
    menu.value.toggle(event)
  }

  const query = ref(null)

  watch(query, (value) => {
    staffStore.searchStaffs(value)
  })
</script>
<template>
  <Layout>
    <template #page-content>
      <div class="mx-3">
        <Menubar class="border-0 mt-3 px-3">
          <template #start>
            <h4>{{ $t('List of Staffs') }}</h4>
          </template>
          <template #end>
            <div class="flex align-items-center gap-2">
              <IconField iconPosition="left">
                <InputIcon class="pi pi-search"> </InputIcon>
                <InputText
                  v-model="query"
                  :placeholder="$t('Search')"
                  type="text"
                  class="w-8rem sm:w-auto"
                />
              </IconField>
              <router-link to="/admin/staffs/create">
                <Button
                  icon="pi pi-plus"
                  :label="$t('Add New Staff')"
                  outlined
                ></Button>
              </router-link>
            </div>
          </template>
        </Menubar>
        <div class="card mt-1">
          <DataTable
            :value="staffStore.staffs"
            :loading="false"
            removableSort
            selectionMode="single"
            paginator
            :rows="5"
            :rowsPerPageOptions="[5, 10, 20, 50]"
            tableStyle="min-width: 50rem"
            paginatorTemplate="RowsPerPageDropdown FirstPageLink PrevPageLink CurrentPageReport NextPageLink LastPageLink"
            :currentPageReportTemplate="`{first} ${$t('to')} {last} ${$t('of')} {totalRecords}`"
          >
            <template #empty> {{ $t('No staffs found.') }} </template>
            <Column field="fullName" sortable :header="$t('Name')"></Column>
            <Column :header="$t('Avatar')">
              <template #body="slotProps">
                <Avatar
                  :src="slotProps.data.avatarPath"
                  :label="slotProps.data.fullName[0]"
                  shape="circle"
                  size="normal"
                />
              </template>
            </Column>
            <Column field="email" sortable :header="$t('Email')"></Column>
            <Column :header="$t('Role')">
              <template #body="slotProps">
                <Chip
                  v-for="role in (slotProps.data.role as string)
                    .split(',')
                    .filter((x) => x.trim() != '')"
                  :label="role"
                  class="mr-1"
                  :class="getRoleClass(role)"
                ></Chip>
              </template>
            </Column>
            <Column
              field="phoneNumber"
              sortable
              :header="$t('Phone Number')"
            ></Column>
            <Column field="createdAt" sortable :header="$t('Created At')">
              <template #body="{ data }">
                {{ DateTimeHelper.format(data.createdAt, 'datetime') }}
              </template>
            </Column>
            <Column field="isActive" sortable :header="$t('Status')">
              <template #body="{ data }">
                <i
                  class="pi"
                  :class="{
                    'pi-check-circle text-green-500': data.isActive,
                    'pi-times-circle text-red-400': !data.isActive,
                  }"
                ></i>
              </template>
            </Column>
            <Column>
              <template #body="slotProps">
                <Button
                  type="button"
                  text
                  icon="pi pi-ellipsis-v"
                  @click="toggle"
                  aria-haspopup="true"
                  aria-controls="overlay_menu"
                />
                <Menu ref="menu" id="overlay_menu" :model="items" :popup="true">
                  <template #item="{ item, props }">
                    <router-link
                      v-if="item.route"
                      v-slot="{ href, navigate }"
                      :to="`${item.route}/${slotProps.data.userId}`"
                      custom
                    >
                      <a
                        v-ripple
                        :href="href"
                        v-bind="props.action"
                        @click="navigate"
                      >
                        <span :class="`${item.icon} ${item.class}`" />
                        <span :class="`ml-2 ${item.class}`">{{
                          item.label ? $t(item.label?.toString()) : ''
                        }}</span>
                        <Badge
                          v-if="item.badge"
                          class="ml-auto"
                          :value="item.badge"
                        />
                        <span
                          v-if="item.shortcut"
                          class="ml-auto border-1 surface-border border-round surface-100 text-xs p-1"
                          >{{ item.shortcut }}
                        </span>
                      </a>
                    </router-link>
                    <a
                      v-else
                      v-ripple
                      class="flex align-items-center"
                      :target="item.target"
                      v-bind="props.action"
                    >
                      <span :class="`${item.icon} ${item.class}`" />
                      <span :class="`ml-2 ${item.class}`">{{
                        item.label ? $t(item.label?.toString()) : ''
                      }}</span>
                      <Badge
                        v-if="item.badge"
                        class="ml-auto"
                        :value="item.badge"
                      />
                      <span
                        v-if="item.shortcut"
                        class="ml-auto border-1 surface-border border-round surface-100 text-xs p-1"
                        >{{ item.shortcut }}
                      </span>
                    </a>
                  </template>
                </Menu>
              </template>
            </Column>
          </DataTable>
        </div>
      </div>
    </template>
  </Layout>
</template>
src/stores/admin/staff
