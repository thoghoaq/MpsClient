<script setup lang="ts">
  import { appConfig } from 'src/stores'
  import { useToastStore } from 'src/stores/toast'
  import { reactive, ref } from 'vue'
  import { useApi } from 'src/stores/api'
  import { EFileType } from 'src/stores/types'
  import useVuelidate from '@vuelidate/core'
  import { useI18n } from 'vue-i18n'
  import { required, email, minLength } from '@vuelidate/validators'
  import { useAuthStore } from 'src/stores/auth'
  import { useDataSourceStore } from 'src/stores/datasource'
  const datasourceStore = useDataSourceStore()
  const authStore = useAuthStore()
  const { t } = useI18n()
  const api = useApi()
  const toast = useToastStore()
  const state = reactive({
    displayName: appConfig.loggedUser.data.displayName,
    avatarFile: appConfig.loggedUser.data.photoUrl,
    email: appConfig.loggedUser.data.email,
    phoneNumber: appConfig.loggedUser.data.phoneNumber,
    address: appConfig.loggedUser.data.customerAddress,
  })

  const rules = {
    displayName: { required },
    email: { required, email },
    phoneNumber: { required, minLength: minLength(10) },
    address: {},
  }

  const $v = useVuelidate(rules, state)

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

  const saveProfile = () => {
    $v.value.$touch()
    if (!$v.value.$invalid) {
      api
        .put(appConfig.api.account.update, {
          userId: appConfig.loggedUser.userId,
          fullName: state.displayName,
          avatarPath: state.avatarFile,
          phoneNumber: state.phoneNumber,
          customerData: {
            address: state.address,
          },
        })
        .then((res) => {
          if (res.success) {
            toast.success(res.content['message'])
            authStore.getLoggedUser().then(() => {
              window.location.reload()
            })
          } else {
            toast.error(res.content)
          }
        })
    } else {
      toast.warning(t('Please check your input'))
    }
  }

  const addressItems = ref(<any>[])
  const searchAddress = (event: any) => {
    datasourceStore.getPlaceAutocomplete(event.query).then((res) => {
      if (res.success) {
        addressItems.value = res.content.predictions.flatMap((item: any) => {
          return item.description
        })
      }
    })
  }
</script>
<template>
  <Layout
    v-if="
      appConfig.loggedUser.isManagerGroup || appConfig.loggedUser.isShopOwner
    "
  >
    <template #page-content>
      <div class="bg-primary-reverse border-round p-5">
        <span class="block text-900 font-bold text-xl mb-4">{{
          state.displayName
        }}</span>
        <div class="grid">
          <div class="col-12 lg:col-8">
            <div class="flex flex-column gap-2">
              <label class="required" for="avatar">{{ $t('Avatar') }}</label>
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
          <div class="col-12 lg:col-4 flex flex-column gap-3">
            <div class="flex flex-column gap-2">
              <label class="required" for="displayName">{{ $t('Name') }}</label>
              <InputText
                class="w-full"
                :placeholder="$t('Name')"
                v-model="state.displayName"
                :invalid="$v.displayName.$error"
                @blur="$v.displayName.$touch"
              />
              <small class="p-error" v-if="$v.displayName.$error">{{
                $t($v.displayName.$errors[0]?.$message?.toString())
              }}</small>
            </div>
            <div class="flex flex-column gap-2">
              <label class="required" for="email">{{ 'Email' }}</label>
              <InputText
                class="w-full"
                :placeholder="'Email'"
                v-model="state.email"
                :invalid="$v.email.$error"
                @blur="$v.email.$touch"
                :disabled="true"
              />
              <small class="p-error" v-if="$v.email.$error">{{
                $t($v.email.$errors[0]?.$message?.toString())
              }}</small>
            </div>
            <div class="flex flex-column gap-2">
              <label class="required" for="phoneNumber">{{
                $t('Phone Number')
              }}</label>
              <InputText
                class="w-full"
                :placeholder="$t('Phone Number')"
                v-model="state.phoneNumber"
                :invalid="$v.phoneNumber.$error"
                @blur="$v.phoneNumber.$touch"
              />
              <small class="p-error" v-if="$v.phoneNumber.$error">{{
                $t($v.phoneNumber.$errors[0]?.$message?.toString())
              }}</small>
            </div>
            <div class="flex flex-column gap-2">
              <label for="address">{{ $t('Address') }}</label>
              <AutoComplete
                v-bind:input-class="'w-full'"
                :placeholder="$t('Address')"
                v-model="state.address"
                :suggestions="addressItems"
                :invalid="$v.address.$error"
                @complete="searchAddress"
              />
              <small class="p-error" v-if="$v.address.$error">{{
                $t($v.address.$errors[0]?.$message?.toString())
              }}</small>
            </div>
            <div class="flex">
              <Button
                :label="$t('Save')"
                class="w-full"
                :disabled="$v.$invalid"
                @click="saveProfile"
              ></Button>
            </div>
          </div>
        </div>
      </div>
    </template>
  </Layout>
  <ELayout :hide-category="true" v-else>
    <template #page-content>
      <div class="bg-primary-reverse border-round p-5">
        <span class="block text-900 font-bold text-xl mb-4">{{
          state.displayName
        }}</span>
        <div class="grid">
          <div class="col-12 lg:col-8">
            <div class="flex flex-column gap-2">
              <label class="required" for="avatar">{{ $t('Avatar') }}</label>
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
          <div class="col-12 lg:col-4 flex flex-column gap-3">
            <div class="flex flex-column gap-2">
              <label class="required" for="displayName">{{ $t('Name') }}</label>
              <InputText
                class="w-full"
                :placeholder="$t('Name')"
                v-model="state.displayName"
                :invalid="$v.displayName.$error"
                @blur="$v.displayName.$touch"
              />
              <small class="p-error" v-if="$v.displayName.$error">{{
                $t($v.displayName.$errors[0]?.$message?.toString())
              }}</small>
            </div>
            <div class="flex flex-column gap-2">
              <label class="required" for="email">{{ 'Email' }}</label>
              <InputText
                class="w-full"
                :placeholder="'Email'"
                v-model="state.email"
                :invalid="$v.email.$error"
                @blur="$v.email.$touch"
                :disabled="true"
              />
              <small class="p-error" v-if="$v.email.$error">{{
                $t($v.email.$errors[0]?.$message?.toString())
              }}</small>
            </div>
            <div class="flex flex-column gap-2">
              <label class="required" for="phoneNumber">{{
                $t('Phone Number')
              }}</label>
              <InputText
                class="w-full"
                :placeholder="$t('Phone Number')"
                v-model="state.phoneNumber"
                :invalid="$v.phoneNumber.$error"
                @blur="$v.phoneNumber.$touch"
              />
              <small class="p-error" v-if="$v.phoneNumber.$error">{{
                $t($v.phoneNumber.$errors[0]?.$message?.toString())
              }}</small>
            </div>
            <div class="flex flex-column gap-2">
              <label for="address">{{ $t('Address') }}</label>
              <AutoComplete
                v-bind:input-class="'w-full'"
                :placeholder="$t('Address')"
                v-model="state.address"
                :suggestions="addressItems"
                :invalid="$v.address.$error"
                @complete="searchAddress"
              />
              <small class="p-error" v-if="$v.address.$error">{{
                $t($v.address.$errors[0]?.$message?.toString())
              }}</small>
            </div>
            <div class="flex">
              <Button
                :label="$t('Save')"
                class="w-full"
                :disabled="$v.$invalid"
                @click="saveProfile"
              ></Button>
            </div>
          </div>
        </div>
      </div>
    </template>
  </ELayout>
</template>
