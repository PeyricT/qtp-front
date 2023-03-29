/*
 See tricks : https://learnvue.co/2020/01/how-to-add-drag-and-drop-to-your-vuejs-project/
*/
<template>
    <div class="drag-drop"
    @drop="handleDrop"
    @dragover.prevent
    @dragenter.prevent
    @dragover="dragged=true"
    @dragleave="dragged=false"
    :class="{ 'dragged': dragged }">
        <p>
            Drag and drop experience file to here to upload
        </p>
    </div>
</template>

<script lang="ts">
import { defineComponent, onMounted } from 'vue';
import { ref } from 'vue'
export default defineComponent({
    setup(_, { emit }){
        
        const dropData = ref(new ArrayBuffer(0));
        const dragged = ref(false);
        
        const processData = (d: DragEvent["dataTransfer"]) => {
            console.log("process data")
            if(!d) {
                console.warn("Empty file object");
                return;
            }           
            const file = d.files[0] as File;
                console.log("name du fichier :",file.name)
                emit('file-name', file.name);
            const onLoad = (e: ProgressEvent<FileReader>) => {
                dropData.value = e?.target?.result as ArrayBuffer;
                console.log("emit xmlLoad")
                emit('xml-load', dropData.value);

            };
               
            const reader = new FileReader();
            reader.onload = onLoad;
            reader.readAsArrayBuffer(file);
            //return file
        }

        const handleDrop = (e: DragEvent) => {
            emit('xls-drop')
            console.log("drop")
            dragged.value = false; 
            e.stopPropagation(); e.preventDefault();
            console.log(e.dataTransfer); 
            if(e.dataTransfer) 
                processData(e.dataTransfer)
        };

        onMounted ( ()=>{
            //console.log("Mounting drag&drop");
        });

        return {handleDrop, dragged};
    }
});
</script>

<style scoped>
    .drag-drop{
        border:solid; 
        border-width:thin; 
        background-color:var(--primary-10); 
    }
    .dragged{
        background-color:var(--primary-20); 
    }
</style>