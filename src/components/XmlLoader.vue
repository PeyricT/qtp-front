/*
 See tricks : https://learnvue.co/2020/01/how-to-add-drag-and-drop-to-your-vuejs-project/
*/
<!-- PARTIE PROTEO-->

<template>

   <div class="flex">
       
        <DragAndDrop class="p-3 w-9/10"
        @xml-load="loadDroppedFile"
        @xls-drop="xlsDropped=true"
        @file-name="loadFileName"
        />
        <!--<InputFile/>-->
        <!-- <Button class="p-button-link w-1/10" @click="loadExample" label="Load example"/> -->
        <p><input type="file" ref="file" @change="readFile($event)" /></p>

    </div>
    
    <div v-if="loaded && uniprotDBFilled">

        Select proteome
        
        <Dropdown v-model="selectedProteome" :options="proteomes" optionLabel="name" placeholder="Select your reference proteome">
        </Dropdown>

        <p><span v-if="selectedProteome.name">
        {{selectedProteome.name}} databse contains {{selectedProteome.protein_number}} of your proteins </span></p>

    </div>

    <Button v-if="selectedProteome.name" label="Metadata" @click="clickLoadButton"/>  
    
   <Loader class="p-mt-2" v-if="xlsDropped" message="Data are loading..."/>
   <Loader class="p-mt-2" v-if="loaded && !uniprotDBFilled" message="Uniprot data are stored..."/>
    <div v-if="loaded && uniprotDBFilled && !xlsDropped && canShowTable" class="mt-5">
        
        <div class="border border-primary p-3">
            <div
                class="font-semibold mb-2">

                {{FN}}
            </div>
            <p> {{jsonData.length}} proteins</p>
            <p>
                {{selectedColumns.length}} selected columns
            </p>
            </div>
</div>
</template>

<script lang="ts">
import { defineComponent, computed, ref, onMounted, onUnmounted, reactive, watch, onBeforeUpdate, onUpdated, Ref } from 'vue';
//import { ref } from 'vue'

import DragAndDrop from '@/components/DragAndDrop.vue';
import Loader from '@/components/global/Loader.vue'
import InputFile from '@/components/InputFile.vue'
//import FileUpload from 'primevue/fileupload';
import Button from 'primevue/button'; 
//import DataTable from 'primevue/datatable';
import Column from 'primevue/column';
import MultiSelect from 'primevue/multiselect'; 
import InputText from 'primevue/inputtext';
import Dropdown from 'primevue/dropdown';
import {FilterMatchMode} from 'primevue/api';
import XLSX  from 'xlsx';
import { useStore } from 'vuex'

import { logDB } from '../utilities/uniprot-storage';
const UniprotDatabase = logDB(); 
import { UniprotStorage } from '../utilities/uniprot-storage';
import { range } from '../utilities/basic_functions'
import { async } from 'q';
import { file } from '@babel/types';
import { index } from 'd3-array';

interface ColTemplate{
    field: string; 
    header: string; 
    idx: number; 
}

interface Proteome{
    name: string; 
    protein_number: number; 
}

export default defineComponent({
    components : { DragAndDrop, Loader, InputFile, Button, Column, MultiSelect, InputText, Dropdown },
    setup(_, { emit }){
        
        const store = useStore()

        const loaded = ref(false);
        const xlsDropped = ref(false);
        const uniprotDBFilled = ref(false);
        const canShowTable = ref(false);

        const columns: Ref<ColTemplate[]> = ref([]); //TO DO : typing
        const jsonData = ref([]) // TO DO : typing
        const selectedColumns: Ref<ColTemplate[]> = ref([]); 

        const proteomes: Ref<Proteome[]> = ref([])
        const selectedProteome : Ref<Proteome> = ref({'name': '', 'protein_number': 0})

        const filters = ref(
            {'global': { value: null, matchMode:FilterMatchMode.CONTAINS }}
        )
        let FN = ref(); 

        let uniprotStorages: {[index: string]:any} = {};

        //const active = computed(() => store.state.count);
        const headers = computed( () => {
            //console.log("HEADERS", store.getters.sheetNames); 
            return  store.getters.sheetNames;
        });

        const loadDroppedFile = async (dropData: any) => {
            store.commit('states/mutateXlsDisplayed', false)
            xlsDropped.value = true;
            uniprotDBFilled.value = false; 
            loaded.value = false; 
 
            await storeData(dropData); 

            const storedIds = await UniprotDatabase.getAll(); 

            console.log("new request for proteome ?", storedIds)

            const proteomesRes = await getProteome(storedIds); 

            proteomes.value = Object.entries(proteomesRes).map(([proteomeName, proteinNumber]) => {
                return {name : proteomeName, protein_number: proteinNumber}
            })
        };

        const loadFileName = (file_name: any) => {
            //console.log("fn",file_name)
            FN.value=file_name
        }

        const readFile = async (e: Event ) => {

            const DataFile = ref(new ArrayBuffer(0))

            console.log("toto");
            // To avoid events withtout files
             if (!(e.target instanceof HTMLInputElement && e.target?.files)) {
                 return;
            }

            store.commit('states/mutateXlsDisplayed', false)
            xlsDropped.value = true;
            uniprotDBFilled.value = false; 
            loaded.value = false;

            let xlsxFile = e.target?.files[0];

            console.log(xlsxFile)
            console.log("Ajout de UniprotStorage dans bdd")

            /////////////
            const onLoad = (e: ProgressEvent<FileReader>) => {
                DataFile.value = e?.target?.result as ArrayBuffer;
                console.log("value en arraybuffer")
            };
               
            const reader = new FileReader();
            reader.onload = onLoad;
            reader.readAsArrayBuffer(xlsxFile);
            //return file
            /////////////

            uniprotStorages[xlsxFile.name] = new UniprotStorage() 
            console.log(uniprotStorages)
            //eturn
            await storeData(DataFile.value)
            
            const storedIds = await uniprotStorages[xlsxFile.name].getAll();
            console.log("new request for proteome ?", storedIds)

            const proteomesRes = await getProteome(storedIds);
            proteomes.value = Object.entries(proteomesRes).map(([proteomeName, proteinNumber]) => {
                return {name : proteomeName, protein_number: proteinNumber}
            })
        }

        const storeInUniprotDatabase = (uniprotStorage: { add: (arg0: string[]) => Promise<any>; }): Promise<boolean> => {
            console.log("storeInUniprotDatabase")
            return new Promise((res, rej) => {
                const uniprotIdList: string[]|undefined = store.getters.getColDataByName("Accession", "string");
                console.log("database proteo:", store.getters.getColDataByName("Accession", "string"))
                console.log(uniprotIdList)
                if (uniprotIdList){ 
                    UniprotDatabase.add(uniprotIdList)
                    .then(() => res(true))
                    .catch((err: any) => rej(err))
                    console.log("add de uniprotList dans uniprotstorage", UniprotDatabase)
                }
                
                else rej(Error("Can't fill up uniprot database. No uniprot ids"))
            })
        } 

        const onSelection = (val: ColTemplate[]) => {
            console.log("add", val)
            selectedColumns.value = columns.value.filter(col => val.includes(col))
            store.commit('mutateSelectedCols', val.map(col => col.idx))
        }

        const storeData = async (data: any) => {
            console.log("kéblo")
            const wb = XLSX.read(data, {type:"array"});
                console.log("enregistrement du fichier", wb)
                store.dispatch('initStoreBook', wb);
                xlsDropped.value = false; 
                loaded.value = true;

                await storeInUniprotDatabase(uniprotStorages[data.name]); 
                uniprotDBFilled.value = true; 

                const headers = store.getters.currentSheetHeaders
                const col: ColTemplate[] = headers.map((header:string, index:number) => {return {field: header.replace(/\./g, ''), header: header, idx: index}})
                columns.value = col
                const _ = store.getters.json
                const _jsonData = [] as any
                _.forEach((row: any) => {
                    let newRow = {} as any
                    Object.keys(row).forEach((key: string) => {
                        const newKey = key.replace(/\./g, ''); 
                        newRow[newKey] = row[key]
                    })
                    _jsonData.push(newRow)
                })
                jsonData.value = _jsonData; 
                const selectedCols = col.filter((colElmt:any) => (colElmt.field.includes('Abundance Ratio') && ! colElmt.field.includes("Variability")) || colElmt.field === "Accession"); 
                
                selectedColumns.value = selectedCols
                store.commit('mutateSelectedCols', selectedCols.map(col => col.idx))
            
                store.commit('states/mutateXlsDisplayed', true)
        }

        const getProteome = async(uniprotIDs: string[]) : Promise<{[proteome_name : string]: number}> => {
            const response = await fetch(`/api/uniprot/proteome_scan`, {
                method: 'POST',
                headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json'
                },
                body: JSON.stringify({'uniprotIDs' : uniprotIDs})
            });

            return response.json()
        }

        const clickLoadButton = async() => {
            canShowTable.value = true
            UniprotDatabase.registerProteome(selectedProteome.value.name)
            //console.log ("db: ", UniprotDatabase)
            console.log(UniprotDatabase.proteome); 
        }

        return { loadDroppedFile, xlsDropped, loaded, uniprotDBFilled, jsonData, selectedColumns, columns, onSelection, headers, filters, proteomes, selectedProteome, clickLoadButton,canShowTable, loadFileName, FN, readFile};
    }
});
</script>

<style scoped>


.col-clickable-div{
    height:100%; 
    width:calc(100% - 5px); 
    position:absolute; 
    top:0; 
    left:0; 
    cursor:pointer; 
}

.resize-cursor {
    /*background-color:red;*/
    top: 0; 
    right: 0; 
    width: 5px; 
    position: absolute; 
    cursor: col-resize; 
    user-select:none; 
    height:100%; 
}

.resize-cursor:hover {
    border-right:3px solid #4f304f; 
}

.cell-content {
    min-width:min-content; 
}

.loader,
.loader:after {
  border-radius: 50%;
  width: 5em;
  height: 5em;
}
.loader {
  /*margin: 60px auto;*/
  font-size: 10px;
  position: relative;
  text-indent: -9999em;
  border-top: 0.5em solid rgba(0,0,0, 0.2);
  border-right: 0.5em solid rgba(0,0,0, 0.2);
  border-bottom: 0.5em solid rgba(0,0,0, 0.2);
  border-left: 0.5em solid #000000;
  -webkit-transform: translateZ(0);
  -ms-transform: translateZ(0);
  transform: translateZ(0);
  -webkit-animation: load8 1.1s infinite linear;
  animation: load8 1.1s infinite linear;
}
@-webkit-keyframes load8 {
  0% {
    -webkit-transform: rotate(0deg);
    transform: rotate(0deg);
  }
  100% {
    -webkit-transform: rotate(360deg);
    transform: rotate(360deg);
  }
}
@keyframes load8 {
  0% {
    -webkit-transform: rotate(0deg);
    transform: rotate(0deg);
  }
  100% {
    -webkit-transform: rotate(360deg);
    transform: rotate(360deg);
  }
}

.loader-textdiv{
    display:flex;
    height:100%; 
    margin:auto 0px; 
}

.test{
    width:100%; 
}



</style>