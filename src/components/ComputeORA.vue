<template>
<div class="m-2">
    <button :disabled="computationLaunched"
    class="rounded p-2 bg-purple-300 hover:bg-purple-400 disabled:bg-red-500" 
    @click="launchComputation"> 
        Compute ORA on selected proteins
    </button>

    <span v-if="computationLaunched" class="close hover:text-gray-500" @click="closeResults"> &times; </span>
    
    <div v-if="computationLaunched" class="bg-gray-100">
        <Loader v-if="!resultsLoaded" message="ORA under computation..."/>
        <div v-if="resultsLoaded">
            RESULTS
        </div>
    </div>
    
</div>
</template>

<script lang="ts">

import { defineComponent, ref } from 'vue'; 
import Loader from '@/components/global/Loader.vue'; 

export default defineComponent({

    components : { Loader }, 

    setup(_, { emit }){

        const test = ref(false); 
        const resultsLoaded = ref(false); 
        const computationLaunched = ref(false); 

        const launchComputation = () => {
            console.log("LAUNCH")
            computationLaunched.value = true; 
            emit('disable-volcano')
            setTimeout(() => {resultsLoaded.value = true}, 3000); 
        }

        const closeResults = () => {
            console.log("close")
            computationLaunched.value = false; 
            resultsLoaded.value = false; 
            emit('enable-volcano')
        }

    
    return { launchComputation, resultsLoaded, computationLaunched, closeResults }

    }

})

</script>

<style scoped>
.close{
  cursor: pointer;
  color: #aaa;
  float: right;
  font-size: 28px;
  font-weight: bold;
}
</style>