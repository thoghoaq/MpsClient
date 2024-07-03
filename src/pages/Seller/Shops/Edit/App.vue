<script setup lang="ts">
  import { onMounted, reactive, ref } from 'vue'
  import { useShopStore } from 'src/stores/seller/shop'
  import { Shop } from 'src/stores/seller/shop/types'
  import { useRouter, useRoute } from 'vue-router'
  import { useApi } from 'src/stores/api'
  import { appConfig } from 'src/stores'
  import { EFileType } from 'src/stores/types'
  import { useToastStore } from 'src/stores/toast'
  import useVuelidate from '@vuelidate/core'
  import { required, minLength } from '@vuelidate/validators'
  import { useI18n } from 'vue-i18n'
  const toast = useToastStore()
  const shopStore = useShopStore()
  const router = useRouter()
  const api = useApi()
  const { t } = useI18n()
  const route = useRoute()
  const shopId = route.params.id as string | undefined
  shopStore.redirectId = shopId
  const state = reactive({
    shopName: '',
    address: '',
    phoneNumber: '',
    district: '',
    city: '',
    description: '',
    avatar: '',
    cover: '',
  })

  const rules = {
    shopName: {
      required,
    },
    address: {
      required,
    },
    phoneNumber: {
      required,
    },
    district: {
      required,
    },
    city: {
      required,
    },
    description: {},
    avatar: {},
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
      if (res) state.avatar = res
    })
  }

  const loading = ref(false)

  const submit = function () {
    $v.value.$touch()
    if (!$v.value.$invalid) {
      loading.value = true
      api
        .post(appConfig.api.seller.shop, {
          shopName: state.shopName,
          address: state.address,
          phoneNumber: state.phoneNumber,
          district: state.district,
          city: state.city,
          description: state.description,
          avatar: state.avatar,
        })
        .then((res) => {
          if (res.success) {
            toast.success(t('Request new shop successfully'))
            router.push('/seller/shops')
          } else {
            toast.error(res.content)
          }
        })
        .finally(() => {
          loading.value = false
        })
    } else {
      toast.warning(t('Please check your input'))
    }
  }

  onMounted(() => {
  // Load the PayPal script
  const script = document.createElement('script');
  script.src = 'https://www.paypalobjects.com/js/external/api.js';
  script.onload = () => {
    // Ensure PayPal is available globally
    // @ts-ignore
    paypal.use(['login'], function (login: any) {
      login.render({
        appid: import.meta.env.VITE_PAYPAL_CLIENT_ID,
        authend: 'sandbox',
        scopes: 'email profile',
        containerid: 'paypal-button',
        responseType: 'code id_token',
        locale: 'vi-vn',
        theme: 'neutral',
        buttonType: 'CWP',
        buttonShape: 'rectangle',
        buttonSize: 'lg',
        fullPage: 'true',
        returnurl: `${window.location.origin}/shop-request`
      });
    });
  };
  document.body.appendChild(script);
});

</script>
<template>
  <Layout>
    <template #page-content>
      <div class="flex flex-column">
        <h3 class="mx-5 mt-5 gap-2">{{ $t('Request New Shop') }}</h3>
        <div class="grid mx-4 mt-3 gap-4">
          <div class="col flex flex-column gap-5 w-full">
            <div class="flex flex-column gap-2">
              <FloatLabel>
                <InputText
                  class="w-full"
                  id="shopName"
                  v-model="state.shopName"
                  :invalid="$v.shopName.$error"
                  @blur="$v.shopName.$touch"
                />
                <label for="shopName">{{ $t('Shop Name') }}</label>
              </FloatLabel>
              <small class="p-error" v-if="$v.shopName.$error">{{
                $t($v.shopName.$errors[0]?.$message?.toString())
              }}</small>
            </div>
            <div class="flex flex-column gap-2">
              <FloatLabel>
                <InputText
                  class="w-full"
                  id="address"
                  v-model="state.address"
                  :invalid="$v.address.$error"
                  @blur="$v.address.$touch"
                />
                <label for="address">{{ $t('Address') }}</label>
              </FloatLabel>
              <small class="p-error" v-if="$v.address.$error">{{
                $t($v.address.$errors[0]?.$message?.toString())
              }}</small>
            </div>
            <div class="flex flex-column gap-2">
              <FloatLabel>
                <InputText
                  class="w-full"
                  id="district"
                  v-model="state.district"
                  :invalid="$v.district.$error"
                  @blur="$v.district.$touch"
                />
                <label for="district">{{ $t('District') }}</label>
              </FloatLabel>
              <small class="p-error" v-if="$v.district.$error">{{
                $t($v.district.$errors[0]?.$message?.toString())
              }}</small>
            </div>
            <div class="flex flex-column gap-2">
              <FloatLabel>
                <InputText
                  class="w-full"
                  id="phoneNumber"
                  v-model="state.phoneNumber"
                  :invalid="$v.phoneNumber.$error"
                  @blur="$v.phoneNumber.$touch"
                />
                <label for="phoneNumber">{{ $t('Phone Number') }}</label>
              </FloatLabel>
              <small class="p-error" v-if="$v.phoneNumber.$error">{{
                $t($v.phoneNumber.$errors[0]?.$message?.toString())
              }}</small>
            </div>
            <div class="flex flex-column gap-2">
              <FloatLabel>
                <InputText
                  class="w-full"
                  id="city"
                  v-model="state.city"
                  :invalid="$v.city.$error"
                  @blur="$v.city.$touch"
                />
                <label for="city">{{ $t('City') }}</label>
              </FloatLabel>
              <small class="p-error" v-if="$v.city.$error">{{
                $t($v.city.$errors[0]?.$message?.toString())
              }}</small>
            </div>
            <div class="flex flex-column gap-2">
              <FloatLabel>
                <Textarea
                  class="w-full"
                  id="description"
                  v-model="state.description"
                  rows="5"
                  :invalid="$v.description.$error"
                  @blur="$v.description.$touch"
                />
                <label for="description">{{ $t('Description') }}</label>
              </FloatLabel>
              <small class="p-error" v-if="$v.description.$error">{{
                $t($v.description.$errors[0]?.$message?.toString())
              }}</small>
            </div>
          </div>
          <div class="flex flex-column gap-5">
            <div class="border-1 surface-border border-round">
              <span
                class="text-900 font-bold block border-bottom-1 surface-border p-3"
                >{{ $t('Publish') }}</span
              >
              <div class="p-3">
                <div
                  class="surface-100 py-2 px-3 flex align-items-center border-round"
                >
                  <span class="text-black-alpha-90 font-bold mr-3"
                    >{{ $t('Status') }}:</span
                  ><span class="text-black-alpha-60 font-semibold">{{
                    $t('Draft')
                  }}</span>
                </div>
              </div>
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
                  :chooseLabel="state.avatar ? $t('Change') : $t('Upload')"
                  :choose-icon="state.avatar ? 'pi pi-pencil' : 'pi pi-plus'"
                  :show-upload-button="false"
                  :show-cancel-button="false"
                  accept="image/*"
                  :maxFileSize="2000000"
                >
                  <template #empty>
                    <div class="card flex" v-if="state.avatar">
                      <Image
                        :src="state.avatar"
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
            <div id="paypal-button"></div>
            <div class="flex flex-column gap-2">
              <Button label="Submit" @click="submit" />
            </div>
          </div>
        </div>
      </div>
    </template>
  </Layout>
</template>
