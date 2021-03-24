<template>
    <button 
    class="rounded p-1 bg-purple-300 hover:bg-purple-400"
    @click="launchComputation"> 
        Compute ORA 
    </button>
</template>

<script lang="ts">

import { defineComponent } from 'vue'; 

export default defineComponent({

    setup(){

        const launchComputation = () => {
            console.log("compute ora")
        }

    
    return { launchComputation }

    }

})

</script>

<style scoped>
</style>