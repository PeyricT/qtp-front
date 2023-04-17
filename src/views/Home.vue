<template>
  <h1 class="text-center m-4 text-6xl font-semibold"> QTP </h1>
  <TabView>
    <TabPanel header="Overview"> 
      <DataSpreadSheet/>
    </TabPanel>
    <TabPanel header="Volcano plots">
    <!-- <TabPanel header="Volcano plots" :disabled="!isProtXlsx"> -->
      <!-- <DataExplore v-if="isProtXlsx"/> -->
      <DataExplore/>
    </TabPanel>
    <TabPanel header="Enrichment results">
      <EnrichResults/>
    </TabPanel>
  </TabView>
</template>

<script lang="ts">
import TabView from 'primevue/tabview';
import TabPanel from 'primevue/tabpanel';
import DataSpreadSheet from '@/views/DataSpreadSheet.vue'
import DataExplore from '@/views/DataExplore.vue'
//import DataTest from '@/views/DataTest.vue'
import { defineComponent } from '@vue/runtime-core';
import { mapGetters, mapMutations, useStore } from 'vuex'
import { computed } from 'vue'
import EnrichResults from './EnrichResults.vue';
export default defineComponent({
  components : { TabView, TabPanel, DataSpreadSheet, DataExplore, EnrichResults },
  computed: {
        ...mapGetters(['isProtXlsx']),
    },
    setup(){

    },
})
</script>

<style>

</style>
