<template>
<div>
  <Loader v-if="!uniprotLoaded && !uniprotError" message="Uniprot data are loading..."/>
  <Error v-if="uniprotError" message="Can't retrieve uniprot data"/>
  <Warning v-if="!taxid && !uniprotError && uniprotLoaded" message="More than 1 taxid in your protein data. Impossible to compute ORA."/>
      <!--<Listbox v-model="selected" :options="availableData" :multiple="true" :filter="true" filterPlaceholder="Search" listStyle="max-height:250px" optionLabel="name">
      <template #header>
        <p class="pl-3 pt-3 text-xl font-semibold"> Choose data records to display (x and y axes) </p>
      </template>
      </Listbox>
      <Button class="w-full mt-2" label="Plot" :disabled="!canDraw" @click="draw"/>-->
    <AddPlot :data="availableData" @new-plot="drawNewPlot"/>
    <div v-for="(plotData, key) in plotsData" :key="key">
      {{plotData.xLabel}}
      {{plotData.yLabel}}
      <Volcano :data="plotData" :taxid="taxid" :plotNumber="key"/>
    </div> 
    <!--<div>
        <OpenableWarnMessage class="mt-2" v-if="volcanoDrawed && nanProt.length >= 1" :header="nanProt.length + ' proteins with no data'" :contentTab="nanProt" content="These proteins don't have data : "/>
        <div class="flex">
          <Volcano 
              :data="plotData" 
              :taxid="taxid"
              @volcano-drawed="volcanoDrawed=true"
              @prot-selection-change="saveSelectedProtId"/>
        </div>
    </div>
  <ComputeORA v-if="volcanoDrawed && taxid"
          @disable-volcano="volcanoDisabled=true"
          @enable-volcano="volcanoDisabled=false"
          :taxid="taxid"
          :selectedProts="selectedProts"
          />-->
</div>
</template>

<script lang="ts">
import { defineComponent, computed, ref, Ref, reactive, onMounted, ComputedRef } from 'vue';
import { useStore, mapGetters } from 'vuex'
//import Sliders from '@/components/Sliders.vue';
import Volcano from '@/components/Volcano.vue';
import ProteinsList from '@/components/ProteinsList.vue';
import GoList from '@/components/GoList.vue'; 
import Error from '@/components/global/Error.vue'; 
import Loader from '@/components/global/Loader.vue'; 
import Warning from '@/components/global/Warning.vue'; 
import ComputeORA from '@/components/ComputeORA.vue'
import Listbox from 'primevue/listbox';
import Button from 'primevue/button';
import OpenableWarnMessage from '@/components/global/OpenableWarnMessage.vue'
import AddPlot from '@/components/AddPlot.vue'


import { toggle } from '../utilities/Arrays';
//import protToGoWorker from '@/workers/prot_to_go_worker'; 
import { logDB } from '../utilities/uniprot-storage';
const UniprotDatabase = logDB(); 
import * as t from '../types/volcano';

export default defineComponent({


  components: { /*Sliders,*/ Volcano, ProteinsList, GoList, Error, Loader, ComputeORA, Warning, Listbox, Button, OpenableWarnMessage, AddPlot },

  setup() {
  }


})
</script>

<style scoped>
.active {
  background-color : orange;
}

.disabled{
    z-index:2; 
    position:absolute; 
    width:100%;
    height:100%;
    background-color:black;
    opacity:0.7;  
}

</style>