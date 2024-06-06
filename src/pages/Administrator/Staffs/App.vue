<script setup lang="ts">
  import { ref } from 'vue'
  const staffs = ref([
    { code: 'S001', name: 'John Doe', category: 'Manager', quantity: 1 },
    { code: 'S002', name: 'Jane Doe', category: 'Staff', quantity: 2 },
    { code: 'S003', name: 'John Smith', category: 'Staff', quantity: 3 },
    { code: 'S004', name: 'Jane Smith', category: 'Staff', quantity: 4 },
    { code: 'S005', name: 'John Doe', category: 'Manager', quantity: 1 },
    { code: 'S006', name: 'Jane Doe', category: 'Staff', quantity: 2 },
    { code: 'S007', name: 'John Smith', category: 'Staff', quantity: 3 },
    { code: 'S008', name: 'Jane Smith', category: 'Staff', quantity: 4 },
    { code: 'S009', name: 'John Doe', category: 'Manager', quantity: 1 },
    { code: 'S010', name: 'Jane Doe', category: 'Staff', quantity: 2 },
    { code: 'S011', name: 'John Smith', category: 'Staff', quantity: 3 },
    { code: 'S012', name: 'Jane Smith', category: 'Staff', quantity: 4 },
    { code: 'S013', name: 'John Doe', category: 'Manager', quantity: 1 },
    { code: 'S014', name: 'Jane Doe', category: 'Staff', quantity: 2 },
    { code: 'S015', name: 'John Smith', category: 'Staff', quantity: 3 },
    { code: 'S016', name: 'Jane Smith', category: 'Staff', quantity: 4 },
    { code: 'S017', name: 'John Doe', category: 'Manager', quantity: 1 },
    { code: 'S018', name: 'Jane Doe', category: 'Staff', quantity: 2 },
    { code: 'S019', name: 'John Smith', category: 'Staff', quantity: 3 },
    { code: 'S020', name: 'Jane Smith', category: 'Staff', quantity: 4 },
  ])
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
              <Button icon="pi pi-plus" :label="$t('Add New Staff')" outlined></Button>
            </div>
          </template>
        </Menubar>
        <div class="card mt-1">
          <DataTable
            :value="staffs"
            removableSort
            selectionMode="single"
            paginator
            :rows="5"
            :rowsPerPageOptions="[5, 10, 20, 50]"
            tableStyle="min-width: 50rem"
            paginatorTemplate="RowsPerPageDropdown FirstPageLink PrevPageLink CurrentPageReport NextPageLink LastPageLink"
            :currentPageReportTemplate="`{first} ${$t('to')} {last} ${$t('of')} {totalRecords}`"
          >
            <Column
              field="code"
              sortable
              header="Code"
            ></Column>
            <Column
              field="name"
              sortable
              header="Name"
            ></Column>
            <Column
              field="category"
              sortable
              header="Category"
            ></Column>
            <Column
              field="quantity"
              sortable
              header="Quantity"
            ></Column>
          </DataTable>
        </div>
      </div>
    </template>
  </Layout>
</template>
