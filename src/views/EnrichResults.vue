<!-- <template>
    <div class="plots" style="display:flex; flex-direction: row; justify-content: space-between; ">
        <div id="dropdown">
            <p class="text-lg p-1 pb-2 font-medium"> Enrich 1 </p>
                <Dropdown
                    placeholder="Choose"
                    v-model="selectedAxis.x" 
                    :options="selectionLists.x" 
                    :filter="true" 
                    optionLabel="name">

                </Dropdown>
        </div>
        <div id="plot">
            plot
        </div>
    </div>
</template>

<script lang="ts">
import { defineComponent, ref, Ref, PropType, watch, toRefs, computed, ComputedRef, reactive } from "vue";
import Button from 'primevue/button'
import Dialog from 'primevue/dialog'
import Dropdown from 'primevue/dropdown'
import { copyArrayOfObjects } from '../utilities/Arrays';
import { SelectionInterface } from '../types/volcano'; 

    type AxisType = "x" | "y"

    interface OptionType {
        name : string;
        optionDisabled: boolean;
    }

    interface AxisSelectionListInterface {
        x:OptionType[]
        y:OptionType[]
    }

    interface AxisSelectionInterface {
        x:OptionType
        y:OptionType
    }

    export default defineComponent({
        components: {Dropdown},

            setup(props, {emit}){
        //const displayDialog = ref(false); 
        const selectedAxis = reactive({
            x : {'name': '', optionDisabled: false} ,
            y : {'name': '', optionDisabled: false}
        })
        const selectedX: Ref<OptionType> = ref({'name': '', optionDisabled: false})
        const selectedY: Ref<OptionType> = ref({'name': '', optionDisabled: false})
        const data = toRefs(props).data
        const selectionLists: ComputedRef<AxisSelectionListInterface> = computed(() => {
            const dataFormat: OptionType[] = data.value.map(val => ({name : val.name, optionDisabled: false}))
            return { 'x' : dataFormat, 'y' : copyArrayOfObjects(dataFormat) as OptionType[]}
        });

        const axisSelection = (axis: AxisType) => {
            console.log("axisSelection")
            const axisToChange: AxisType = axis === "x" ? "y" : "x"
            selectionLists.value[axisToChange].forEach(option => {
                if (option.name === selectedAxis[axis].name) option.optionDisabled = true
                else option.optionDisabled = false 
            })    
        }

        const reinitAxisSelection = () => {
            selectedAxis.x = {'name': '', optionDisabled: false}
            selectedAxis.y = {'name': '', optionDisabled: false}
            selectionLists.value.x.forEach(option => option.optionDisabled = false)
            selectionLists.value.y.forEach(option => option.optionDisabled = false)
        }

        const closeDialog = () =>{
            reinitAxisSelection();   
        }

        const newPlot = () => {
            console.log("newPlot")
            emit("new-plot", selectedAxis.x.name, selectedAxis.y.name); 
        }

        return { selectedX, selectedY,  axisSelection, closeDialog, selectionLists, data, selectedAxis, newPlot }

    }
        }
    })

</script> -->