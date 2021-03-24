<template>
<div class="list p-2 mr-5 overflow-scroll w-full">
<p class="font-bold mb-1">
Filtered proteins list ({{points.length}}) :
</p>
<ul>
    <li 
    v-for="point in points" 
    :key="point"
    class="hover:bg-light cursor-pointer"
    @click="clickProt(point.d.id)"
    :class="{ 'bg-light': selectedProt.includes(point.d.id)}">
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



export default defineComponent({
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

<style>
    .list{
        height:500px; 
        border:solid grey; 
        border-width:1px; 
        border-radius:5px; 
    }
    ::-webkit-scrollbar {
        -webkit-appearance: none;
        width: 7px;
        }
    ::-webkit-scrollbar-thumb {
        border-radius: 4px;
        background-color: rgba(0, 0, 0, .5);        
    }
</style>