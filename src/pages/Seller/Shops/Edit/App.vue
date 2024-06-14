<script setup lang="ts">
import { onMounted, reactive } from 'vue'
import { useShopStore } from 'src/stores/seller/shop'
import { Shop } from 'src/stores/seller/shop/types';
import { useRouter } from 'vue-router';
const shopStore = useShopStore()
const router = useRouter()
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

  const submit = function () {

  }
</script>
<template>
    <Layout>
        <template #page-content>
            <div class="flex flex-column mx-4">
                <h3>{{ $t('Request new shop') }}</h3>
                <div class="flex flex-column gap-2">
                    <div class="flex flex-column gap-2">
                        <label for="shopName">{{ $t('Shop Name') }}</label>
                        <InputText id="shopName" v-model="state.shopName" />
                    </div>
                    <div class="flex flex-column gap-2">
                        <label for="address">{{ $t('Address') }}</label>
                        <InputText id="address" v-model="state.address" />
                    </div>
                    <div class="flex flex-column gap-2">
                        <label for="district">{{ $t('District') }}</label>
                        <InputText id="district" v-model="state.district" />
                    </div>
                    <div class="flex flex-column gap-2">
                        <label for="city">{{ $t('City') }}</label>
                        <InputText id="city" v-model="state.city" />
                    </div>
                    <div class="flex flex-column gap-2">
                        <label for="phone">{{ $t('Phone') }}</label>
                        <InputText id="phone" v-model="state.phoneNumber" />
                    </div>
                    <div class="flex flex-column gap-2">
                        <label for="description">{{ $t('Description') }}</label>
                        <Textarea id="description" v-model="state.description" />
                    </div>
                    <div class="flex flex-column gap-2">
                        <Button
                            label="Submit"
                            @click="submit"
                        />
                    </div>
                </div>
            </div>
        </template>
    </Layout>
</template>