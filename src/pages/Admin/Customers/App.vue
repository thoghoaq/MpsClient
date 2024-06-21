<script setup lang="ts">
  import { watch } from 'vue'
  import { useCustomerStore } from 'src/stores/admin/customer'
  import { useToastStore } from 'src/stores/toast'
  import { onMounted, ref } from 'vue'
  import DateTimeHelper from 'src/helpers/datetime-helper'
  import { useConfirm } from 'primevue/useconfirm'
  import { useI18n } from 'vue-i18n'
  const { t } = useI18n()
  const customerStore = useCustomerStore()
  const toast = useToastStore()
  const loading = ref(false)
  const confirm = useConfirm()

  onMounted(() => {
    loading.value = true
    customerStore
      .fetchCustomers()
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
        return 'bg-red-400'
      case 'Admin':
        return 'bg-orange-400'
      case 'Staff':
        return 'bg-yellow-400'
      case 'ShopOwner':
        return 'bg-green-400'
      case 'Customer':
        return 'bg-cyan-400'
      default:
        return ''
    }
  }

  const menu = ref()
  const items = ref<any>([
    {
      class: 'p-0',
      items: [
        {
          label: 'Detail',
          icon: 'pi pi-user',
          route: '/admin/customers',
        },
        {
          label: 'Deactivate',
          icon: 'pi pi-lock',
          class: 'text-red-500',
          command: () => {
            confirmDeactive()
          },
        },
      ],
    },
  ])

  const menuId = ref()

  const toggle = (event: any) => {
    menuId.value = event.currentTarget.id.replace('menu_', '')
    menu.value.toggle(event)
  }

  const query = ref(null)

  watch(query, (value) => {
    customerStore.searchCustomers(value)
  })

  const confirmDeactive = () => {
    confirm.require({
      header: t('Confirm'),
      icon: 'pi pi-exclamation-triangle',
      message: t('Are you sure you want to active/deactive this customer?'),
      rejectClass: 'p-button-secondary p-button-outlined',
      rejectLabel: t('No'),
      acceptLabel: t('Yes'),
      acceptClass: 'p-button-danger',
      accept: () => {
        customerStore.activeOrDeactive(menuId.value)
        .then((response) => {
          if (response.success) {
            toast.success(t('Active/Deactive Successfully'))
          } else {
            toast.error(response.content)
          }
        })
      },
    })
  }

  const selectedKey = ref()
</script>
<template>
  <Layout>
    <template #page-content>
      <ConfirmDialog></ConfirmDialog>
      <div class="mx-3">
        <Menubar class="border-0 mt-3 px-3">
          <template #start>
            <h4>{{ $t('List of Customers') }}</h4>
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
              <router-link to="/admin/customers/create" v-if="false">
                <Button
                  icon="pi pi-plus"
                  :label="$t('Add New Customer')"
                  outlined
                ></Button>
              </router-link>
            </div>
          </template>
        </Menubar>
        <div class="card mt-1">
          <DataTable
            v-model:selection="selectedKey"
            data-key="id"
            :value="customerStore.customers"
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
            <template #empty> {{ $t('No customers found.') }} </template>
            <Column field="fullName" sortable :header="$t('Full Name')">
              <template #body="slotProps">
                <div class="flex align-items-center gap-2">
                  <Avatar
                    :image="slotProps.data.avatarPath"
                    :label="
                      slotProps.data.avatarPath
                        ? undefined
                        : slotProps.data.fullName[0]
                    "
                    class="font-bold"
                    shape="circle"
                    size="normal"
                  />
                  <div>
                    {{ slotProps.data.fullName }}
                  </div>
                </div>
              </template>
            </Column>
            <Column field="email" sortable :header="$t('Email')"></Column>
            <Column :header="$t('Role')">
              <template #body="slotProps">
                <div class="flex gap-1">
                  <Tag severity="contrast" v-for="role in (slotProps.data.role as string)
                      .split(',')
                      .filter((x) => x.trim() != '')" :value="role"
                    :class="getRoleClass(role)"></Tag>
                </div>
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
            <Column field="updatedAt" sortable :header="$t('Updated At')">
              <template #body="{ data }">
                {{ DateTimeHelper.format(data.updatedAt, 'datetime') }}
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
            <Column field="userId">
              <template #body="{ data }">
                <Button
                  type="button"
                  text
                  icon="pi pi-ellipsis-v"
                  @click="toggle"
                  aria-haspopup="true"
                  aria-controls="overlay_menu"
                  :id="`menu_${data.id}`"
                />
                <Menu ref="menu" id="overlay_menu" :model="items" :popup="true">
                  <template #item="{ item, props }">
                    <router-link
                      v-if="item.route"
                      v-slot="{ href, navigate }"
                      :to="`${item.route}/${menuId}`"
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