<template>


<div class="select-list p-2 overflow-scroll w-full">

    
<p class="font-bold mb-1">
Filtered proteins list ({{points.length}}) :
</p>

<ul>
    <li 
    v-for="point in points" 
    :key="point"
    class="list-item cursor-pointer"
    @click="clickProt(point.d.id)"
    :class="{ 'selected': selectedProt.includes(point.d.id)}">
        {{point.d.id}} : {{point.d.fullName}} 
    </li>
</ul>
</div>
</template>

<script lang="ts">
import { defineComponent, ref, Ref, PropType, toRefs } from 'vue';
import { useStore } from 'vuex'
import { toggle } from '../utilities/Arrays'
import { Points } from '../types/volcano'; 
import Listbox from 'primevue/listbox';  



export default defineComponent({
    components : { Listbox }, 
    props : {
        points: {
            type: Array as PropType<Points[]>, 
            default: []
        }
    },

    setup(props){
        //ATTRIBUTES
        const store = useStore(); 
        const selectedProt: Ref<string[]> = ref([])
        const { points } = toRefs(props)

        //METHODS
        const clickProt = (prot_id: string) => {
            selectedProt.value = toggle(selectedProt.value, prot_id)

            const filterPredicate = (point: Points): boolean => {
                if (selectedProt.value.includes(point.d.id)) return true
                return false
            }

            store.commit("proteinSelection/filterHighlight", filterPredicate);

        }
        
               
       return { points, clickProt, selectedProt }
    }
    
})
</script>

<style scoped>


</style>