<script setup lang="ts">
  import { onMounted, reactive, ref, watch } from 'vue'
  import { useShopStore } from 'src/stores/seller/shop'
  import { useRouter, useRoute } from 'vue-router'
  import { useApi } from 'src/stores/api'
  import { appConfig } from 'src/stores'
  import { APIResponse, EFileType } from 'src/stores/types'
  import { useToastStore } from 'src/stores/toast'
  import useVuelidate from '@vuelidate/core'
  import { required, minLength } from '@vuelidate/validators'
  import { useI18n } from 'vue-i18n'
  import { Shop } from 'src/stores/seller/shop/types'
  import { useAuthStore } from 'src/stores/auth'
  import { PayPalAuth, PayPalCustomer } from 'src/stores/auth/types'
  const authStore = useAuthStore()
  const toast = useToastStore()
  const shopStore = useShopStore()
  const router = useRouter()
  const api = useApi()
  const { t } = useI18n()
  const route = useRoute()
  const shopId = route.params.id as string | undefined
  localStorage.setItem('shopRedirectId', shopId ?? '')
  const code = route.query.code as string | undefined
  const isActive = ref()

  const state = reactive({
    shopName: '',
    address: '',
    phoneNumber: '',
    district: '',
    city: '',
    description: '',
    avatar: '',
    businessLicenseImage: '',
    cover: '',
    payPalAccount: '',
    latitude: <Number | null>null,
    longitude: <Number | null>null,
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
    payPalAccount: {
      required,
    },
    latitude: {
      required,
    },
    longitude: {
      required,
    },
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

  const onUploadBusinessLicense = async (event: any) => {
    await onUpload(event).then((res) => {
      if (res) state.businessLicenseImage = res
    })
  }


  const loading = ref(false)

  const submit = function () {
    $v.value.$touch()
    if (!$v.value.$invalid) {
      loading.value = true
      const data = {
        id: shopId,
        shopName: state.shopName,
        address: state.address,
        phoneNumber: state.phoneNumber,
        district: state.district,
        city: state.city,
        description: state.description,
        avatar: state.avatar,
        payPalAccount: state.payPalAccount,
        latitude: state.latitude,
        longitude: state.longitude,
        businessLicenseImage: state.businessLicenseImage
      }
      if (shopId) {
        api
          .put(`${appConfig.api.seller.shop}/${shopId}`, data)
          .then((res) => {
            if (res.success) {
              toast.success(t('Update shop successfully'))
              router.push('/seller/shops')
            } else {
              toast.error(res.content)
            }
          })
          .finally(() => {
            loading.value = false
          })
      } else {
        api
          .post(appConfig.api.seller.shop, data)
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
      }
    } else {
      toast.warning(t('Please check your input'))
    }
  }

  const loadPayPalButton = async () => {
    // Load the PayPal script
    const script = document.createElement('script')
    script.src = 'https://www.paypalobjects.com/js/external/api.js'
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
          locale: appConfig.language,
          theme: 'neutral',
          buttonType: 'CWP',
          buttonShape: 'rectangle',
          buttonSize: 'lg',
          fullPage: 'true',
          returnurl: `${window.location.origin}/shop-request`,
        })
      })
    }
    document.body.appendChild(script)
    return
  }

  const coordinatesText = ref('')
  let map: any = null
  let marker: any = null

  const onDragEnd = (marker: any) => {
    const lngLat = marker.getLngLat()
    state.latitude = lngLat.lng
    state.longitude = lngLat.lat
    coordinatesText.value = `Longitude: ${lngLat.lng}
  Latitude: ${lngLat.lat}`
    var coordinates = document.getElementById('coordinates')
    coordinates!.style.display = 'block'
    coordinates!.innerHTML = coordinatesText.value
  }

  const updateMarkerPosition = (marker: any, lng: any, lat: any) => {
    marker.setLngLat([lng, lat])
    map.flyTo({
      center: [lng, lat],
      essential: true,
    })
    const lngLat = marker.getLngLat()
    state.latitude = lngLat.lng
    state.longitude = lngLat.lat
    coordinatesText.value = `Longitude: ${lngLat.lng}
Latitude: ${lngLat.lat}`
    var coordinates = document.getElementById('coordinates')
    coordinates!.style.display = 'block'
    coordinates!.innerHTML = coordinatesText.value
    console.log(coordinatesText.value)
  }

  const loadMap = () => {
    // Ensure goong-js script is loaded
    const script = document.createElement('script')
    script.src =
      'https://cdn.jsdelivr.net/npm/@goongmaps/goong-js@1.0.9/dist/goong-js.js'
    script.onload = () => {
      // @ts-ignore
      goongjs.accessToken = import.meta.env.VITE_GOONG_MAP_KEY
      // @ts-ignore
      map = new goongjs.Map({
        container: 'map', // container id
        style: 'https://tiles.goong.io/assets/goong_map_web.json', // stylesheet location
        center: [105.83991, 21.028], // starting position [lng, lat]
        zoom: 12, // starting zoom
      })

      // Load the Goong Geocoder script
      const geocoderScript = document.createElement('script')
      geocoderScript.src =
        'https://cdn.jsdelivr.net/npm/@goongmaps/goong-geocoder@1.1.1/dist/goong-geocoder.min.js'
      geocoderScript.onload = () => {
        // @ts-ignore
        const geocoder = new GoongGeocoder({
          accessToken: import.meta.env.VITE_GOONG_API_KEY,
          // @ts-ignore
          goongjs: goongjs,
        })
        map.addControl(geocoder)
        // Add event listener for search result
        geocoder.on('result', (event: any) => {
          const { result } = event
          console.log(result.result)
          const address = result.result.formatted_address
          const district = result.result.compound.district
          const province = result.result.compound.province
          state.address = address
          state.district = district
          state.city = province

          // Handle the search result (e.g., move the marker to the selected location)
          if (
            result &&
            result.result &&
            result.result.geometry.location &&
            result.result.geometry.location
          ) {
            updateMarkerPosition(
              marker,
              result.result.geometry.location.lng,
              result.result.geometry.location.lat,
            )
          }
        })
      }
      document.head.appendChild(geocoderScript)

      // Add geolocate control to the map
      // @ts-ignore
      const geolocateControl = new goongjs.GeolocateControl({
        positionOptions: {
          enableHighAccuracy: true,
        },
        trackUserLocation: false,
        showUserLocation: true,
      })

      // Add geolocate control to the map
      map.addControl(geolocateControl)

      // Listen for geolocate control events
      geolocateControl.on('geolocate', (event: any) => {
        const { coords } = event
        updateMarkerPosition(marker, coords.longitude, coords.latitude)
      })

      // @ts-ignore
      marker = new goongjs.Marker({
        draggable: true,
      })
        .setLngLat([105.8344898123422, 21.03677130693113])
        .addTo(map)

      marker.on('dragend', () => onDragEnd(marker))

      if (state.latitude != null && state.longitude != null) {
        let latitude = state.latitude as number
        let longitude = state.longitude as number
        console.log(latitude, longitude)
        updateMarkerPosition(marker, longitude, latitude)
      }
    }
    document.head.appendChild(script)

    // Ensure goong-js CSS is loaded
    const goongJsLink = document.createElement('link')
    goongJsLink.href =
      'https://cdn.jsdelivr.net/npm/@goongmaps/goong-js@1.0.9/dist/goong-js.css'
    goongJsLink.rel = 'stylesheet'
    document.head.appendChild(goongJsLink)

    // Ensure goong-geocoder CSS is loaded
    const geocoderLink = document.createElement('link')
    geocoderLink.href =
      'https://cdn.jsdelivr.net/npm/@goongmaps/goong-geocoder@1.1.1/dist/goong-geocoder.css'
    geocoderLink.rel = 'stylesheet'
    document.head.appendChild(geocoderLink)

    // Ensure promise polyfill script is loaded
    const promisePolyfillScript1 = document.createElement('script')
    promisePolyfillScript1.src =
      'https://cdn.jsdelivr.net/npm/es6-promise@4/dist/es6-promise.min.js'
    document.head.appendChild(promisePolyfillScript1)

    const promisePolyfillScript2 = document.createElement('script')
    promisePolyfillScript2.src =
      'https://cdn.jsdelivr.net/npm/es6-promise@4/dist/es6-promise.auto.min.js'
    document.head.appendChild(promisePolyfillScript2)
  }

  onMounted(() => {
    if (shopId) {
      api.get(`${appConfig.api.seller.shop}/${shopId}`).then((res) => {
        if (res.success) {
          const shop = res.content as Shop
          state.shopName = shop.shopName
          state.address = shop.address
          state.phoneNumber = shop.phoneNumber
          state.district = shop.district ?? ''
          state.city = shop.city ?? ''
          state.description = shop.description ?? ''
          state.avatar = shop.avatar ?? ''
          state.cover = shop.cover ?? ''
          state.payPalAccount = shop.payPalAccount ?? ''
          isActive.value = shop.isActive
          state.latitude = shop.latitude
          state.longitude = shop.longitude
        } else {
          toast.error(res.content)
        }
        loadMap()
      })
    } else {
      loadMap()
    }
    if (code) {
      authStore.authPayPal(code).then((res) => {
        if (res.success) {
          var content = res.content as PayPalAuth
          authStore.getPayPalCustomer(content.access_token).then((res) => {
            if (res.success) {
              const payPalAuth = res.content as PayPalCustomer
              state.payPalAccount = payPalAuth.email
            } else {
              toast.error(res.content)
            }
          })
        } else {
          toast.error(res.content)
        }
      })
    }
    loadPayPalButton()
  })

  const getStatus = function (isActive: Boolean) {
    switch (isActive) {
      case true:
        return 'Openning'
      case false:
        return 'Closing'
      default:
        return 'Draft'
    }
  }
</script>
<template>
  <Layout>
    <template #page-content>
      <div class="flex flex-column">
        <h3 class="mx-5 mt-5 gap-2">
          {{ shopId ? state.shopName : $t('Request New Shop') }}
        </h3>
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
                <label class="required" for="shopName">{{
                  $t('Shop Name')
                }}</label>
              </FloatLabel>
              <small class="p-error" v-if="$v.shopName.$error">{{
                $t($v.shopName.$errors[0]?.$message?.toString())
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
                <label class="required" for="phoneNumber">{{
                  $t('Phone Number')
                }}</label>
              </FloatLabel>
              <small class="p-error" v-if="$v.phoneNumber.$error">{{
                $t($v.phoneNumber.$errors[0]?.$message?.toString())
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
            <div class="flex flex-column gap-2">
              <div class="flex gap-2 align-items-center">
                <FloatLabel class="w-full">
                  <InputText
                    class="w-full"
                    id="payPalAccount"
                    v-model="state.payPalAccount"
                    :invalid="$v.payPalAccount.$error"
                    @blur="$v.payPalAccount.$touch"
                    disabled
                  />
                  <label class="required" for="payPalAccount">{{
                    $t('PayPal Account')
                  }}</label>
                </FloatLabel>
                <div id="paypal-button"></div>
              </div>
              <small class="p-error" v-if="$v.payPalAccount.$error">{{
                $t($v.payPalAccount.$errors[0]?.$message?.toString())
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
                <label class="required" for="address">{{
                  $t('Address')
                }}</label>
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
                <label class="required" for="district">{{
                  $t('District')
                }}</label>
              </FloatLabel>
              <small class="p-error" v-if="$v.district.$error">{{
                $t($v.district.$errors[0]?.$message?.toString())
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
                <label class="required" for="city">{{ $t('City') }}</label>
              </FloatLabel>
              <small class="p-error" v-if="$v.city.$error">{{
                $t($v.city.$errors[0]?.$message?.toString())
              }}</small>
            </div>
            <div class="flex flex-column gap-2 mb-3">
              <div class="h-30rem" id="map"></div>
              <pre id="coordinates" class="coordinates">{{
                coordinatesText
              }}</pre>
              <small
                class="p-error"
                v-if="$v.latitude.$error || $v.longitude.$error"
                >{{ $t($v.latitude.$errors[0]?.$message?.toString()) }}</small
              >
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
                    $t(getStatus(isActive))
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
            <div class="flex flex-column gap-2">
              <label>{{ $t('Business License') }}</label>
              <div class="card w-30rem">
                <FileUpload
                  name="demo[]"
                  :preview-width="100"
                  :custom-upload="true"
                  @uploader="onUploadBusinessLicense"
                  :multiple="false"
                  :auto="true"
                  :chooseLabel="state.businessLicenseImage ? $t('Change') : $t('Upload')"
                  :choose-icon="state.businessLicenseImage ? 'pi pi-pencil' : 'pi pi-plus'"
                  :show-upload-button="false"
                  :show-cancel-button="false"
                  accept="image/*"
                  :maxFileSize="2000000"
                >
                  <template #empty>
                    <div class="card flex" v-if="state.businessLicenseImage">
                      <Image
                        :src="state.businessLicenseImage"
                        alt="BusinessLicense"
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
              <Button :label="$t('Submit')" @click="submit" />
            </div>
          </div>
        </div>
      </div>
    </template>
  </Layout>
</template>
<style scoped lang="css">
  .coordinates {
    background: rgba(0, 0, 0, 0.5);
    color: #fff;
    padding: 5px 10px;
    margin: 0;
    font-size: 11px;
    line-height: 18px;
    border-radius: 3px;
    display: none;
  }
</style>
