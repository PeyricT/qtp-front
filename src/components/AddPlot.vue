<template>
    <Button label="Add new plot" @click="displayDialog=true"/>
    <Dialog header="Add new plot" :visible="displayDialog">
        <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.
                Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.
                Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat
                cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.</p>
            <template #footer>
                <Button label="No" icon="pi pi-times" @click="displayDialog=false" class="p-button-text"/>
                <Button label="Yes" icon="pi pi-check" @click="displayDialog=false" autofocus />
            </template>
    </Dialog>

</template>

<script lang="ts">
import { defineComponent, ref } from "vue";
import Button from 'primevue/button'
import Dialog from 'primevue/dialog'

export default defineComponent ({
    components: { Button, Dialog }, 
    setup(){
        const displayDialog = ref(false); 

        return { displayDialog }

    }

})

</script>

<style>

</style>