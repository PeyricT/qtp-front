<template>
<div class="m-2">
    <Button :disabled="computationLaunched"
    @click="launchComputation"> 
        Compute ORA on selected proteins
    </Button>
    
    <div v-if="computationLaunched" class="bg-gray-100">
        <Loader v-if="!resultsLoaded" message="ORA under computation..."/>
        <div v-if="resultsLoaded">
            <div v-if="Object.keys(ORAResultsList).length === 0"> No GO terms with significative p-value {{pvalue}} </div>
            <div v-else> 
                <DataTable :value="ORAResultsList" class="p-datatable-sm" sortField="pvalue" :sortOrder="1" :scrollable="true">
                    <template #header>
                        <p class="text-lg">{{ORAResultsList.length}} GO terms with p-value &lt; {{pvalue}} </p>
                    </template>
                    <Column field="go" header="GO Term" :sortable="true"/>
                    <Column field="name" header="Name" :sortable="true"/>
                    <Column field="pvalue" header="P-value" :sortable="true"/>
                </DataTable>
            </div>
        </div>
    </div>
    
</div>
</template>

<script lang="ts">

import { defineComponent, ref, PropType } from 'vue'; 
import { useStore } from 'vuex';

import { PwasAPIInput } from '../types/ora'

import Loader from '@/components/global/Loader.vue'; 
import Button from 'primevue/button';
import DataTable from 'primevue/datatable'; 
import Column from 'primevue/column';


export default defineComponent({

    components : { Loader, Button, DataTable, Column }, 

    props: {
        taxid: {
            type : Number as PropType<number>,
            default: 0
        }, 
        selectedProts: {
            type: Array as PropType<string[]>,
            default:[]
        }
    },

    setup(props, { emit }){

        const resultsLoaded = ref(false); 
        const computationLaunched = ref(false); 
        const ORAResultsList = ref({}); 
        const store = useStore(); 
        const pvalue = 0.5

        const launchComputation = async () => {
            computationLaunched.value = true; 
            emit('disable-volcano')
            
            const method = "fisher"; 
            const expAccessions = store.getters.getColDataByName("Accession", 'string')
            const apiInput: PwasAPIInput = {
                proteinsExp : expAccessions,
                proteinsDelta : props.selectedProts, 
                method: method, 
                taxid: props.taxid, 
                pvalue: pvalue
            }

            console.log("pwas input", apiInput)
            fetch(`/api/pwas/ora`, {
                method: 'POST',
                body: JSON.stringify(apiInput),
                headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            }}).then(async (response) => {
                const responseData = await response.json()
                ORAResultsList.value = responseData.fusedNS.list
                resultsLoaded.value = true; 
                console.log("END")
            })
            
            
        }

        const closeResults = () => {
            console.log("close")
            computationLaunched.value = false; 
            resultsLoaded.value = false; 
            emit('enable-volcano')
        }

    
    return { launchComputation, resultsLoaded, computationLaunched, closeResults, ORAResultsList, pvalue}

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