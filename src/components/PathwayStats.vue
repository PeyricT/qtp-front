<template>
<div class="datatable">
    <Button v-if="refresh" label="Refresh pathway significance" @click="launchComputation"/>
    <Button v-else label="Compute pathways significance" :disabled="computationLaunched" @click="launchComputation"/>
    <div v-if="computationLaunched" class="bg-gray-100">
        <Loader v-if="!resultsLoaded" message="ORA under computation..."/>
        <div v-if="resultsLoaded">
            <div v-if="Object.keys(ORAResultsList).length === 0"> No GO terms with significative p-value {{pvalue}} </div>
            <div v-else> 
                <DataTable :value="ORAResultsList" class="datatable p-datatable-sm h-full" sortField="pvalue" :sortOrder="1" :scrollable="true" scrollHeight="500px">
                    <template #header>
                        <p class="text-lg">{{ORAResultsList.length}} GO terms with p-value &lt; {{pvalue}} </p>
                    </template>
                    <Column field="go" header="GO Term" :sortable="true"/>
                    <Column field="name" header="Name" :sortable="true"/>
                    <Column field="pvalue" header="P-value" :sortable="true"/>
                    <Column field="ns" header="NS" :sortable="true"/>
                </DataTable>
            </div>
        </div>
    </div>
</div>
</template>

<script lang="ts">

import { defineComponent, ref, PropType, onMounted, onUpdated, watch } from 'vue'; 
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
        },
        allProts : {
            type : Array as PropType<string[]>, 
            default:[]
        }, 
        refresh : {
            type: Boolean as PropType<boolean>,
            default: false
        }
    },

    setup(props, { emit }){

        const resultsLoaded = ref(false); 
        const computationLaunched = ref(false); 
        const ORAResultsList = ref({}); 
        const store = useStore(); 
        const pvalue = 0.1
        const method = "fisher"; 


        const launchComputation = async () => {
            computationLaunched.value = true; 
            emit('disable-go')
            const apiInput: PwasAPIInput = {
                proteinsExp : props.allProts,
                proteinsDelta : props.selectedProts, 
                method: method, 
                taxid: props.taxid, 
                pvalue: pvalue
            }

            fetch(`/api/pwas/ora`, {
                method: 'POST',
                body: JSON.stringify(apiInput),
                headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            }}).then(async (response) => {
                const responseData = await response.json()
                console.log(responseData); 
                ORAResultsList.value = responseData.fusedNS.list
                resultsLoaded.value = true; 
            })
            
            
        }

        const closeResults = () => {
            console.log("close")
            computationLaunched.value = false; 
            resultsLoaded.value = false; 
            emit('enable-volcano')
        }
        

        onUpdated( () => {
         })
    
    return { launchComputation, resultsLoaded, computationLaunched, closeResults, ORAResultsList, pvalue}

    }

})

</script>

<style>
.close{
  cursor: pointer;
  color: #aaa;
  float: right;
  font-size: 28px;
  font-weight: bold;
}

.datatable{
    height:500px; 
}

</style>