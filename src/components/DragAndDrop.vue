/*
 See tricks : https://learnvue.co/2020/01/how-to-add-drag-and-drop-to-your-vuejs-project/
*/
<template>
    <div class="w-auto rounded bg-gray-300 m-2 mb-3 p-2 h-full text-lg font-bold border-2 border-black border-opacity-100"
    @drop="handleDrop"
    @dragover.prevent
    @dragenter.prevent
    @dragover="dragged=true"
    @dragleave="dragged=false"
    :class="{ 'bg-gray-500': dragged }">
        <h1>
            Drop experience file
        </h1>
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
            const onLoad = (e: ProgressEvent<FileReader>) => {
                dropData.value = e?.target?.result as ArrayBuffer;
                //console.log("Fire XLS");
                console.log("emit xmlLoad")
                emit('xml-load', dropData.value);
                /*const d = e?.target?.result;
                if(d) {
                    //console.log("data In");
                    //console.log(d);
                    const data = new Uint8Array(d as ArrayBuffer);
                    emit('xml-load',data);
                }*/
            };
               
            const reader = new FileReader();
            reader.onload = onLoad;
            reader.readAsArrayBuffer(file);
        }

        const handleDrop = (e: DragEvent) => {
            emit('xls-drop')
            console.log("drop")
            dragged.value = false; 
            e.stopPropagation(); e.preventDefault();
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