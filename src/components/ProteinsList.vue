<template>
  <div>
    <div class="select-list p-2 overflow-scroll w-full">
      <p class="font-bold mb-1">
        Filtered proteins list ({{ points.length }}) :
      </p>

      <ul>
        <li
          v-for="point in points"
          :key="point"
          class="list-item cursor-pointer"
          @click="clickProt(point.d.id)"
          :class="{ selected: selectedProt.includes(point.d.id) }"
        >
          {{ point.d.id }} : {{ point.d.fullName }}
        </li>
      </ul>
    </div>

    <Button class="p-button-outlined w-full mt-3" @click="downloadProteins">
      <div class="flex-auto space-x-1">
        <i class="pi pi-download" />
        <span> Download proteins list </span>
      </div>
    </Button>
  </div>
</template>

<script lang="ts">
import { defineComponent, ref, Ref, PropType, toRefs } from "vue";
import { useStore } from "vuex";
import { toggle } from "../utilities/Arrays";
import { Points } from "../types/volcano";
import Button from "primevue/button";
import download from "downloadjs";

export default defineComponent({
  components: { Button },
  props: {
    points: {
      type: Array as PropType<Points[]>,
      default: [],
    },
  },

  setup(props, {emit}) {
    //ATTRIBUTES
    const store = useStore();
    const selectedProt: Ref<string[]> = ref([]);
    const { points } = toRefs(props);

    //METHODS
    const clickProt = (prot_id: string) => {
      selectedProt.value = toggle(selectedProt.value, prot_id);

      const filterPredicate = (point: Points): boolean => {
        if (selectedProt.value.includes(point.d.id)) return true;
        return false;
      };

      //store.commit("proteinSelection/filterHighlight", filterPredicate);
      console.log("selectedProt", selectedProt.value); 
      emit('click-on-prot', selectedProt.value)
    };

    const downloadProteins = () => {
        let report_str = "#Accession\tFull name\tGene name\tName\n"
        points.value.forEach(point => {
            report_str = report_str + `${point.d.id}\t${point.d.fullName}\t${point.d.geneName}\t${point.d.name}\n`
        })
        download(report_str, `selected_proteins.tsv`, "text/plain")
    }

    return { points, clickProt, selectedProt, downloadProteins };
  },
});
</script>

<style scoped>
</style>