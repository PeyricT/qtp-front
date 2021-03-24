<template>
<div class="flex">
    <form @submit="sendFile">
        <label for="myfile">Select a file:</label>
        <input type="file" id="myfile" name="myfile"><br><br>
        <input type="submit">
    </form>
</div>
</template>

<script lang="ts">
import  {defineComponent } from 'vue'; 

export default defineComponent({
    setup(){

        const sendFile = () => {
            console.log("sendFile")
        }

        return {sendFile}

    }
})
</script>

<style scoped>
</style>