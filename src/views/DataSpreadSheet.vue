<template>
  <div class="bite" style="display:flex; flex-direction: row; justify-content: space-between; ">
      <div id="proteo">
        <p class="text-xl font-medium m-2"> Load your proteomics data </p>
        <XmlLoader />
      </div>
      <div id="transcripto">
        <p class="text-xl font-medium m-2"> Load your transcriptomics data </p>
        <XmlLoaderTrans />
      </div>
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue';
//import HelloWorld from '@/components/HelloWorld.vue'; // @ is an alias to /src
import XmlLoader from '@/components/XmlLoader.vue'; // @ is an alias to /src
import XmlLoaderTrans from '@/components/XmlLoaderTrans.vue';
export default defineComponent({
  name: 'DataSpreadSheet',
  components: {
    XmlLoader,
    XmlLoaderTrans
  //  HelloWorld,
  },
  mounted(){
    //console.log("Mounting spreadsheet");
  }
});
</script>

<style scoped>
#proteo{
  /*text-align:center; */ 
  width:50%;
  color: green;
}
#transcripto{
  /*text-align:center; */ 
  width:50%;
}
</style>
