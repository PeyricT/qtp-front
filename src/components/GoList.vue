<template>
<div class="select-list p-2 overflow-scroll w-full">
    <p class="font-bold mb-1"> Filtered GO list ({{Object.keys(go).length}})</p>
    <ul>
        <li 
        class="list-item cursor-pointer" 
        v-for="go_obj in go" 
        :key="go_obj.go.id"
        @click="clickSelection(go_obj.go.id)"
        :class="{ 'selected': goSelection.includes(go_obj.go.id) }">
            {{go_obj.go.id}} {{go_obj.go.term}} ({{go_obj.proteins.length}})
        </li>
    </ul>
</div>
</template>


<script lang="ts">
import { defineComponent, PropType, ref, Ref, toRefs, onUpdated, onMounted, computed } from 'vue';
import { GOIndexed, Points} from '../types/volcano';
import { useStore } from 'vuex';
import { toggle } from '../utilities/Arrays';

import Loader from '@/components/global/Loader.vue'

export default defineComponent({
    components : { Loader }, 

    props: {
        go: {
            type : Object as PropType<GOIndexed>, 
            default : {}
        }
    }, 

    setup(props){
        const goSelection: Ref<string[]> = ref([]); 
        const { go } = toRefs(props)
        const store = useStore(); 

        const clickSelection = (goId: string) => {

            goSelection.value = toggle(goSelection.value, goId)

            const filterPredicate = (point: Points): boolean => {
                const go_point = point.d.GO.map(go => go.id)
                const intersect = goSelection.value.filter(go_id => go_point.includes(go_id))
                if (intersect.length === 0) return false
                else return true
            }

            store.commit("proteinSelection/filterHighlight", filterPredicate);
        }

        onUpdated(() => console.log("UPDATE GO", go.value))

        return {go, clickSelection, goSelection}
    }
    
    
})
</script>

<style scoped>
</style>