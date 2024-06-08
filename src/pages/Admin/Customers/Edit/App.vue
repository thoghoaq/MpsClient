<script setup lang="ts">
  import { useToastStore } from 'src/stores/toast'
  import { reactive, ref, onMounted } from 'vue'
  import { useApi } from 'src/stores/api'
  import { appConfig } from 'src/stores/index'
  import { EFileType } from 'src/stores/types'
  import useVuelidate from '@vuelidate/core'
  import { required, email, minLength } from '@vuelidate/validators'
  import { useAuthStore } from 'src/stores/auth'
  import { ERole } from 'src/stores/types'
  import { useI18n } from 'vue-i18n'
  import { useRoute } from 'vue-router'
  import { useCustomerStore } from 'src/stores/admin/customer'
  const route = useRoute()
  const { t } = useI18n()
  const authStore = useAuthStore()
  const api = useApi()
  const toast = useToastStore()
  const customerStore = useCustomerStore()

  const canEdit = ref(false);
  const userId = route.params.id as string | undefined
  onMounted(() => {
    if (userId) {
      customerStore.fetchCustomer(userId).then((response) => {
        const customer = response
        state.fullName = customer.fullName
        state.email = customer.email
        state.phoneNumber = customer.phoneNumber ?? ''
        state.avatarFile = customer.avatarPath ?? ''
      })
    }
  })

  const state = reactive({
    fullName: '',
    email: '',
    phoneNumber: '',
    avatarFile: '',
  })

  const rules = {
    fullName: {
      required,
    },
    email: {
      required,
      email,
    },
    phoneNumber: { minLength: minLength(10) },
    avatarFile: {},
  }

  const v$ = useVuelidate(rules, state)
  const loading = ref(false)

  const submitForm = () => {
    v$.value.$touch()
    if (!v$.value.$invalid) {
      loading.value = true
      if (userId) {
        updateCustomer()
      } else {
        registerCustomer()
      }
    } else {
      toast.warning(t('Please check your input'))
    }
  }

  const registerCustomer = () => {
    authStore
      .register(
        state.email,
        undefined,
        state.fullName,
        ERole.Customer,
        state.avatarFile,
        undefined,
        undefined,
        {},
      )
      .then((response) => {
        if (response.success) {
          toast.success(t('Create successfully'))
        } else {
          toast.error(response.content)
        }
        loading.value = false
      })
  }

  const updateCustomer = () => {
    api
      .put(appConfig.api.account.update, {
        userId: userId,
        fullName: state.fullName,
        email: state.email,
        phoneNumber: state.phoneNumber,
        avatarPath: state.avatarFile,
        customerData: {},
      })
      .then((response) => {
        if (response.success) {
          toast.success(t('Update successfully'))
        } else {
          toast.error(response.content)
        }
        loading.value = false
      })
  }

  const onUpload = async (event: any) => {
    const data = new FormData()
    for (let i = 0; i < event.files.length; i++) {
      data.append('files', event.files[i])
    }
    return api
      .post(
        appConfig.appendUrl(appConfig.api.image.upload, {
          type: EFileType.UserAvatars,
        }),
        data,
      )
      .then((res) => {
        if (res.success) {
          return res.content[0]
        } else {
          toast.error(res.content)
        }
      })
  }

  const onUploadAvatar = async (event: any) => {
    await onUpload(event).then((res) => {
      if (res) state.avatarFile = res
    })
  }
</script>
<template>
  <Layout>
    <template #page-content>
      <div class="flex w-full gap-4 px-6 py-6">
        <div class="flex flex-column gap-2 md:w-14rem">
          <h2>
            {{
              userId ? state.fullName ?? $t('Edit Customer') : $t('Create Customer')
            }}
          </h2>
          <router-link to="/admin/customers">
            <Button
              icon="pi pi-arrow-left"
              :label="$t('Back')"
              outlined
            ></Button>
          </router-link>
        </div>
        <div class="flex flex-column gap-4 w-full">
          <div class="flex flex-column gap-2">
            <label for="fullName">{{ $t('Full Name') }}</label>
            <InputText v-model="state.fullName" :invalid="v$.fullName.$error" :disabled="!canEdit"/>
            <small class="p-error" v-if="v$.fullName.$error">{{
              $t(v$.fullName.$errors[0]?.$message?.toString())
            }}</small>
          </div>
          <div class="flex flex-column gap-2">
            <label for="email">{{ $t('Email') }}</label>
            <InputText
              v-model="state.email"
              :invalid="v$.email.$error"
              :disabled="(userId ? true : false) && !canEdit"
            />
            <small class="p-error" v-if="v$.email.$error">{{
              $t(v$.email.$errors[0]?.$message?.toString())
            }}</small>
          </div>
          <div class="flex flex-column gap-2">
            <label for="phoneNumber">{{ $t('Phone Number') }}</label>
            <InputText v-model="state.phoneNumber" :disabled="!canEdit"/>
            <small class="p-error" v-if="v$.phoneNumber.$error">{{
              $t(v$.phoneNumber.$errors[0]?.$message?.toString())
            }}</small>
          </div>
          <div class="flex flex-column gap-2">
            <label>{{ $t('Avatar') }}</label>
            <div class="card w-30rem">
              <div class="card flex" v-if="!canEdit">
                <Image
                  :src="state.avatarFile ? state.avatarFile : 'https://via.placeholder.com/250'"
                  alt="Avatar"
                  width="250"
                  preview
                />
              </div>
              <FileUpload
                v-else
                name="demo[]"
                :preview-width="100"
                :custom-upload="true"
                @uploader="onUploadAvatar"
                :multiple="false"
                :auto="true"
                :chooseLabel="state.avatarFile ? $t('Change') : $t('Upload')"
                :choose-icon="state.avatarFile ? 'pi pi-pencil' : 'pi pi-plus'"
                :show-upload-button="false"
                :show-cancel-button="false"
                accept="image/*"
                :maxFileSize="2000000"
              >
                <template #empty>
                  <div class="card flex" v-if="state.avatarFile">
                    <Image
                      :src="state.avatarFile"
                      alt="Avatar"
                      width="250"
                      preview
                    />
                  </div>
                  <div
                    v-else
                    class="flex align-items-center justify-content-center flex-column"
                  >
                    <i
                      class="pi pi-cloud-upload border-2 border-circle p-5 text-8xl text-400 border-400"
                    />
                    <p class="mt-4 mb-4">
                      {{ $t('Drag and drop files to here to upload.') }}
                    </p>
                  </div>
                </template>
              </FileUpload>
            </div>
          </div>
          <Button
            v-if="canEdit"
            :label="userId ? $t('Update Customer') : $t('Create Customer')"
            :loading="loading"
            @click="submitForm"
            class="p-button w-10rem"
          ></Button>
        </div>
      </div>
    </template>
  </Layout>
</template>
