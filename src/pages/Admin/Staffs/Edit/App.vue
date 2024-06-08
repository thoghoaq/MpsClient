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
  import { useStaffStore } from 'src/stores/admin/staff'
  const route = useRoute()
  const { t } = useI18n()
  const authStore = useAuthStore()
  const api = useApi()
  const toast = useToastStore()
  const staffStore = useStaffStore()

  const userId = route.params.id as string | undefined;
  onMounted(() => {
    if (userId) {
      staffStore.fetchStaff(userId).then((response) => {
          const staff = response;
          state.fullName = staff.fullName
          state.email = staff.email
          state.phoneNumber = staff.phoneNumber ?? ''
          state.avatarFile = staff.avatarPath ?? ''
          state.address = staff.address ?? ''
          state.identityCardNumber = staff.identityCard ?? ''
          state.identityCardFront = staff.identityCardFrontPath ?? ''
          state.identityCardBack = staff.identityCardBackPath ?? ''
          state.certificate = staff.certificatePath ?? ''
        })
    }
  })

  const state = reactive({
    fullName: '',
    email: '',
    phoneNumber: '',
    avatarFile: '',
    identityCardNumber: '',
    identityCardFront: '',
    identityCardBack: '',
    certificate: '',
    address: '',
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
    address: {},
    identityCardNumber: {},
    identityCardFront: {},
    identityCardBack: {},
    certificate: {},
  }

  const v$ = useVuelidate(rules, state)
  const loading = ref(false)

  const submitForm = () => {
    v$.value.$touch()
    if (!v$.value.$invalid) {
      loading.value = true
      if (userId) {
        updateStaff()
      } else {
        registerStaff()
      }
    } else {
      toast.warning(t('Please check your input'))
    }
  }

  const registerStaff = () => {
    authStore
        .register(
          state.email,
          undefined,
          state.fullName,
          ERole.Staff,
          state.avatarFile,
          {
            address: state.address,
            identityCard: state.identityCardNumber,
            identityCardFrontPath: state.identityCardFront,
            identityCardBackPath: state.identityCardBack,
            certificatePath: state.certificate,
          },
          undefined
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

  const updateStaff = () => {
    api.put(appConfig.api.account.update, {
      userId: userId,
      fullName: state.fullName,
      email: state.email,
      phoneNumber: state.phoneNumber,
      avatarPath: state.avatarFile,
      staffData: {
        address: state.address,
        identityCard: state.identityCardNumber,
        identityCardFrontPath: state.identityCardFront,
        identityCardBackPath: state.identityCardBack,
        certificatePath: state.certificate
      }
    }).then((response) => {
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

  const onUploadIdentityCardFront = async (event: any) => {
    await onUpload(event).then((res) => {
      if (res) state.identityCardFront = res
    })
  }

  const onUploadIdentityCardBack = async (event: any) => {
    await onUpload(event).then((res) => {
      if (res) state.identityCardBack = res
    })
  }

  const onUploadCertificate = async (event: any) => {
    await onUpload(event).then((res) => {
      if (res) state.certificate = res
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
          <h2>{{ userId ? state.fullName ?? $t('Edit Staff') : $t('Create Staff') }}</h2>
          <router-link to="/admin/staffs">
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
            <InputText v-model="state.fullName" :invalid="v$.fullName.$error" />
            <small class="p-error" v-if="v$.fullName.$error">{{
              $t(v$.fullName.$errors[0]?.$message?.toString())
            }}</small>
          </div>
          <div class="flex flex-column gap-2">
            <label for="email">{{ $t('Email') }}</label>
            <InputText v-model="state.email" :invalid="v$.email.$error" :disabled="userId ? true :  false"/>
            <small class="p-error" v-if="v$.email.$error">{{
              $t(v$.email.$errors[0]?.$message?.toString())
            }}</small>
          </div>
          <div class="flex flex-column gap-2">
            <label for="phoneNumber">{{ $t('Phone Number') }}</label>
            <InputText v-model="state.phoneNumber" />
            <small class="p-error" v-if="v$.phoneNumber.$error">{{
              $t(v$.phoneNumber.$errors[0]?.$message?.toString())
            }}</small>
          </div>
          <div class="flex flex-column gap-2">
            <label>{{ $t('Avatar') }}</label>
            <div class="card w-30rem">
              <FileUpload
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
          <div class="flex flex-column gap-2">
            <label for="address">{{ $t('Address') }}</label>
            <InputText v-model="state.address" />
            <small class="p-error" v-if="v$.address.$error">{{
              $t(v$.address.$errors[0]?.$message?.toString())
            }}</small>
          </div>
          <div class="flex flex-column gap-2">
            <label for="identityCardNumber">{{
              $t('Identity Card Number')
            }}</label>
            <InputText v-model="state.identityCardNumber" />
            <small class="p-error" v-if="v$.identityCardNumber.$error">{{
              $t(v$.identityCardNumber.$errors[0]?.$message?.toString())
            }}</small>
          </div>
          <div class="flex gap-4">
            <div class="flex flex-column gap-2">
              <label>{{ $t('Identity Card Front') }}</label>
              <div class="card w-30rem">
                <FileUpload
                  name="demo[]"
                  :preview-width="100"
                  :custom-upload="true"
                  @uploader="onUploadIdentityCardFront"
                  :multiple="false"
                  :auto="true"
                  :chooseLabel="state.identityCardFront ? $t('Change') : $t('Upload')"
                  :choose-icon="state.identityCardFront ? 'pi pi-pencil' : 'pi pi-plus'"
                  :show-upload-button="false"
                  :show-cancel-button="false"
                  accept="image/*"
                  :maxFileSize="2000000"
                >
                  <template #empty>
                    <div class="card flex" v-if="state.identityCardFront">
                      <Image
                        :src="state.identityCardFront"
                        alt="IdentityCardFront"
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
            <div class="flex flex-column gap-2">
              <label>{{ $t('Identity Card Back') }}</label>
              <div class="card w-30rem">
                <FileUpload
                  name="demo[]"
                  :preview-width="100"
                  :custom-upload="true"
                  @uploader="onUploadIdentityCardBack"
                  :multiple="false"
                  :auto="true"
                  :chooseLabel="state.identityCardBack ? $t('Change') : $t('Upload')"
                  :choose-icon="state.identityCardBack ? 'pi pi-pencil' : 'pi pi-plus'"
                  :show-upload-button="false"
                  :show-cancel-button="false"
                  accept="image/*"
                  :maxFileSize="2000000"
                >
                  <template #empty>
                    <div class="card flex" v-if="state.identityCardBack">
                      <Image
                        :src="state.identityCardBack"
                        alt="IdentityCardBack"
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
          </div>
          <div class="flex flex-column gap-2">
              <label>{{ $t('Certificate') }}</label>
              <div class="card w-30rem">
                <FileUpload
                  name="demo[]"
                  :preview-width="100"
                  :custom-upload="true"
                  @uploader="onUploadCertificate"
                  :multiple="false"
                  :auto="true"
                  :chooseLabel="state.certificate ? $t('Change') : $t('Upload')"
                  :choose-icon="state.certificate ? 'pi pi-pencil' : 'pi pi-plus'"
                  :show-upload-button="false"
                  :show-cancel-button="false"
                  accept="image/*"
                  :maxFileSize="2000000"
                >
                  <template #empty>
                    <div class="card flex" v-if="state.certificate">
                      <Image
                        :src="state.certificate"
                        alt="Certificate"
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
            :label="userId ? $t('Update Staff') : $t('Create Staff')"
            :loading="loading"
            @click="submitForm"
            class="p-button w-10rem"
          ></Button>
        </div>
      </div>
    </template>
  </Layout>
</template>
