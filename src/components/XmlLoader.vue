/*
 See tricks : https://learnvue.co/2020/01/how-to-add-drag-and-drop-to-your-vuejs-project/
*/
<template>
    <div class="flex">
       
        <DragAndDrop class="p-3 w-9/10"
        @xml-load="storeData"
        />

   </div>
   <div v-if="isProtXlsx">
    Select proteome
    <Dropdown v-model="selectedProteome" :options="getProteomes" optionLabel="name" placeholder="Select your reference proteome" @change="onChange($event)">
    </Dropdown>
    <span v-if="selectedProteome.name">
    {{selectedProteome.name}} contains {{selectedProteome.number}} of your proteins </span>

    </div>
   <Button class="p-button-link w-1/10" @click="store" label="Store cols"/>
   <Button class="p-button-link w-1/10" @click="acc" label="Store Acc"/>
   <Button class="p-button-link w-1/10" @click="prots" label="store prot"/>
</template>

<script lang="ts">
import { defineComponent, computed, ref, onMounted, onUnmounted, reactive, watch, onBeforeUpdate, onUpdated, Ref, shallowReactive } from 'vue';
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
import { mapGetters, mapMutations, useStore } from 'vuex'

import { logDB } from '../utilities/uniprot-storage';
const UniprotDatabase = logDB(); 
import { range } from '../utilities/basic_functions'
import { Ome } from '../store/index'


export default defineComponent({
    components : { DragAndDrop, Loader, InputFile, Button, Column, MultiSelect, InputText, Dropdown },
    computed: {
        ...mapGetters(['getGeneCol', 'getGene', 'getGeneColsName', 'getProtCol', 'getProt', 'getProtColsName', 'getProteomes', 'isProtXlsx', 'getCurrentProteome']),
    },
    methods: {
        ...mapMutations(['setGeneCol', 'setGeneIds', 'setProtCol', 'setProtIds', 'setProteome', 'setProtXlsx', 'setCurrentGenome', 'setCurrentProteome']),
        onChange(event: any){
          console.log(this.selectedProteome.name)
          this.setCurrentProteome({state: this.selectedProteome.name})
        },
        store(){
          console.log(this.getProtColsName)
        },
        acc(){
          console.log(this.getCurrentProteome)
        },
        prots(){
          fetch('/api/uniprot/get/A0A087WV00', {
            method: 'GET',
            headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json'
            }}).then(async (response) => {
                const responseData = await response.json()
                console.log(responseData)
            })
        },
        arrayColumn(arr: any, n:number): Array<any>{return arr.map((x:any) => x[n])},

        storeData(data: any){
            const wb = XLSX.read(data, {type:"array"});
            var aoa = XLSX.utils.sheet_to_json(wb.Sheets[wb.SheetNames[0]], {header: 1});
            console.log('sheet to json '+wb.SheetNames[0])
            var col0 = aoa[0] as Array<any>
            var ncol = col0.length
            console.log(ncol)
            for (let index = 0; index < ncol; index++) {
              let arr = this.arrayColumn(aoa, index)
              this.setProtCol({colName: arr[0], colData: arr.slice(1)})
              if(arr[0] === 'Accession'){
                this.setProtIds({ids: arr.slice(1)})
                console.log(arr[2])
              }
            }
            console.log("loading data: Done")
            fetch('api/uniprot/proteome_scan', {
            method: 'POST',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({'uniprotIDs' : this.getProtCol('Accession')})
            }).then(async (response) => {
              console.log(response);
              const responseData = await response.json();
              console.log(responseData);
              this.setProteome({proteomes: responseData});
              this.setProtXlsx({state: true});
        })
        },

        storeProteome(name: string){
          this.setCurrentProteome(name);
        },
    },
    setup(){
      const selectedProteome : Ref<Ome> = ref({'name': '', 'number': 0});
      return { selectedProteome }
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