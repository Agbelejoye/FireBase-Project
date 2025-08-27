<template>
  <div class="container">
    <div class="row border p-4 my-5 rounded">
      <div class="col-9">
        <form v-on:submit.prevent="handleSubmit">
          <div class="h2 text-center text-success">{{ productIdForUpdate? "Update" : "Create" }} Product</div>
          <hr />
          <div v-if="errorList.length>0" class="alert alert-danger pb-0">
            Please fix the following errors:
            <ul>
              <li v-for="error in errorList" :key="error">{{ error }}</li>
            </ul>
          </div>

          <div class="mt-3">
            <span class="text-muted">Name</span>
            <input type="text" v-model.trim="productObj.name" class="form-control" />
          </div>
          <div class="mt-3">
            <span class="text-muted">Description</span>
            <textarea type="text" v-model="productObj.description" class="form-control"></textarea>
          </div>
          <div class="mt-3">
            <span class="text-muted">Price</span>
            <input type="number" v-model.number="productObj.price" class="form-control" />
          </div>

          <div class="mt-3">
            <span class="text-muted">Sale Price</span>
            <input type="number" v-model.number="productObj.salePrice" class="form-control" />
          </div>
          <div class="mt-3">
            <span class="text-muted">Tags (comma-seperated)</span>
            <input type="text" v-model="productObj.tags" class="form-control" placeholder="e.g., modern, classic, luxury" />
          </div>
          <div class="form-check form-switch pt-3">
            <input class="form-check-input" v-model="productObj.isBestSeller" type="checkbox" role="switch" />

            <label class="form-check-label" for="bestseller"> Bestseller </label>
          </div>
          <div class="mt-3">
            <label class="text-muted">Category</label>
            <select class="form-select" v-model="productObj.category">
              <option v-for="option in PRODUCT_CATEGORIES" :key="option" :value="option">{{ option }}</option>
            </select>
          </div>
          <div class="mb-3">
            <label class="form-label">Image</label>
            <div class="input-group">
              <input type="file" @change="handleImageUpload" :disabled="isImageLoading" class="form-control" />
            </div>
          </div>
          <div class="pt-3">
            <button class="btn btn-success m-2 w-25" :disabled="loading || isImageLoading">
              <span v-if="loading || isImageLoading" class="spinner-border spinner-border-sm me-2"></span>Submit
            </button>
            <router-link :to="{name: APP_ROUTE_NAMES.PRODUCT_LIST}" class="btn btn-secondary m-2 w-25"> Cancel </router-link>
          </div>
        </form>
      </div>
      <div class="col-3">
        <img
          :src="productObj.image"
          class="img-fluid w-100 m-3 p-3 rounded"
          alt="Product
        preview"
        />
      </div>
    </div>
  </div>
</template>

<script setup>
// import { name } from '@vue/eslint-config-prettier/skip-formatting';
import {reactive, ref, onMounted} from 'vue'
import { useRouter, useRoute } from 'vue-router';
import { PRODUCT_CATEGORIES } from '@/constants/appConstant';
import { useSwal } from '@/stores/utility/useSwal';
import productServices from '@/services/productServices';
import { APP_ROUTE_NAMES } from '@/constants/routeNames';
import { uploadToCloudinary } from '@/stores/utility/cloudinary';
const {showSuccess, showError, showConfirm} = useSwal();
const router = useRouter();
const route = useRoute();
const loading = ref(false)
const isImageLoading = ref(false)
const errorList = reactive([]);
const productIdForUpdate = ref(null);

const productObj = reactive({
    name: '',
    description: '',
    price: 0,
    salePrice: 0,
    tags: [],
    isBestSeller: false,
    category: '',
    image: 'https://placehold.co/600x400'
});

// onMounted(async()=>{
//     // if(!productIdForUpdate) return;
//     const productIdForUpdate = route.params.id || null;

//     loading.value = true
//     try {
//         const product = await productServices.getProductById(productIdForUpdate)
//         Object.assign(productObj, {...product, tags: product.tags.join(', ')})
//     }
    
//     catch (e) {
//         console.log(e)
//     }
//     finally{
//         loading.value = false
//     }
// })


onMounted(async () => {
  productIdForUpdate.value = route.params.id || null;

  if (!productIdForUpdate.value) return;

  loading.value = true;
  try {
    const product = await productServices.getProductById(productIdForUpdate.value);
    Object.assign(productObj, { ...product, tags: product.tags.join(', ') });
  } catch (e) {
    console.log(e);
  } finally {
    loading.value = false;
  }
});




async function handleSubmit() {
  try {
    loading.value = true;
    errorList.length = 0;

    // validation
    if (productObj.name.length < 3) {
      errorList.push("Name is required and at least 3 characters");
    }

    if (productObj.price <= 0) {
      errorList.push("Price should be a valid number");
    }

    if (productObj.category === '') {
      errorList.push("Kindly select a category");
    }

    if (!errorList.length) {
      const productData = {
        ...productObj,
        price: Number(productObj.price),
        salePrice: productObj.salePrice ? Number(productObj.salePrice) : null,
        tags: productObj.tags.length > 0
          ? productObj.tags.split(',').map((tag) => tag.trim())
          : [],
        bestseller: Boolean(productObj.isBestSeller),
      };

      if (productIdForUpdate.value) {
        await productServices.updateProduct(productIdForUpdate.value, productData);
        showSuccess("Product Updated Successfully");
      } else {
        await productServices.createProduct(productData);
        showSuccess("Product Created Successfully");
      }

      router.push({ name: APP_ROUTE_NAMES.PRODUCT_LIST });
      console.log(productData);
    }
  } catch (e) {
    console.log(e);
  } finally {
    loading.value = false;
  }
  console.log(productObj);
}


// async function handleSubmit(){
//     try {
//         loading.value=true;
//         errorList.length =0;

//         // validation
//         if(productObj.name.length <3 ){
//             errorList.push("Name is required and at least 3 character")
//         }

//         if(productObj.price<=0){
//             errorList.push('Price should be a valid number')
//         }
        
//         if(productObj.category === ''){
//             errorList.push('Kindly Select a category')
//         }

//         if(!errorList.length){

//         const productData = {
//             ...productObj,
//             price: Number(productObj.price),
//             salePrice: productObj.salePrice? Number(productObj.salePrice) : null,
//             tags: productObj.tags.length>0? productObj.tags.split(',').map((tag) => tag.trim()): [],
//             bestseller: Boolean(productObj.isBestSeller),
//         };

//         // if(productIdForUpdate){
//         //     await productServices.createProduct(productData);
//         // showSuccess("Product Updated Successfully");
//         // }
//         // else{
//         //     await productServices.createProduct(productIdForUpdate, productData);
//         // showSuccess("Product Created Successfully");
//         // }

//         if (productIdForUpdate) {
//   await productServices.updateProduct(productIdForUpdate, productData);
//   showSuccess("Product Updated Successfully");
// } else {
//   await productServices.createProduct(productData);
//   showSuccess("Product Created Successfully");
// }

//         // await new Promise((resolve) => setTimeout(resolve, 2000));
        
//         router.push({name:APP_ROUTE_NAMES.PRODUCT_LIST})
//         console.log(productData);
//         }
//     } 
    
//     catch (e) {
//         console.log(e)
//     }

//     finally{
//         loading.value=false;
//     }
//     console.log(productObj)
// }

async function handleImageUpload(event){
    const file = event.target.files[0]
    if(!file) return

    try {
        isImageLoading.value = true
        const imageUrl = await uploadToCloudinary(file)
        productObj.image = imageUrl
    } 
    
    catch (e) {
        console.log(e)
        throw e
    }

    finally{
        isImageLoading.value = false
    }
}

</script>

<style scoped></style>
