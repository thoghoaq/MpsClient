<script setup lang="ts">
  import { MenuItem } from 'primevue/menuitem';
import { useStaffStore } from 'src/stores/administrator/staff'
  import { useToastStore } from 'src/stores/toast'
  import { onMounted, ref } from 'vue'
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

  const menu = ref();
const items = ref<MenuItem[]>([
    {
        class: 'p-0',
        items: [
            {
                label: 'Edit',
                icon: 'pi pi-refresh'
            },
            {
                label: 'Deactive',
                icon: 'pi pi-trash',
                class: 'text-red-500'
            }
        ]
    }
]);

const toggle = (event: any) => {
    menu.value.toggle(event);
};
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
              <InputText
                :placeholder="$t('Search')"
                type="text"
                class="w-8rem sm:w-auto"
              />
              <Button
                icon="pi pi-plus"
                :label="$t('Add New Staff')"
                outlined
              ></Button>
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
            <Column field="fullName" sortable header="Name"></Column>
            <Column field="avatarPath" header="Avatar"></Column>
            <Column field="email" sortable header="Email"></Column>
            <Column header="Role">
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
            <Column field="isActive" sortable header="Status"></Column>
            <Column header="Action">
              <template #body="slotProps">
                <Button type="button" text icon="pi pi-ellipsis-v" @click="toggle" aria-haspopup="true" aria-controls="overlay_menu" />
                <Menu ref="menu" id="overlay_menu" :model="items" :popup="true"  />
              </template>
            </Column>
          </DataTable>
        </div>
      </div>
    </template>
  </Layout>
</template>
