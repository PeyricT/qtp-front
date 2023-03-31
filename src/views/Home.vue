<template>
  <h1 class="text-center m-4 text-6xl font-semibold"> QTP </h1>
  <TabView>
    <TabPanel header="Overview"> 
      <DataSpreadSheet/>
    </TabPanel>
    <TabPanel header="Volcano plots">
    <!-- <TabPanel header="Volcano plots" :disabled="!xlsDisplayed">
      <DataExplore v-if="xlsDisplayed"/> -->
      <DataExplore/>
    </TabPanel>
    <TabPanel header="Enrichment results">
      <DataTest/>
    </TabPanel>
  </TabView>
</template>

<script lang="ts">
import TabView from 'primevue/tabview';
import TabPanel from 'primevue/tabpanel';
import DataSpreadSheet from '@/views/DataSpreadSheet.vue'
import DataExplore from '@/views/DataExplore.vue'
import DataTest from '@/views/DataTest.vue'
import { defineComponent } from '@vue/runtime-core';
import { useStore } from 'vuex'
import { computed } from 'vue'
export default defineComponent({
  components : { TabView, TabPanel, DataSpreadSheet, DataExplore, DataTest},
  setup(){
    const store = useStore()
    const xlsDisplayed = computed(() => store.state.states.xlsDisplayed)

    return { xlsDisplayed }

  }
})
</script>

<style>

</style>
