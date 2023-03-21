<template>
<ul>
<li>
   <Button>
        Test1
    </Button>
</li>
<li>
   <Button>
        Test2
    </Button>
</li>
<li>
   <Button>
        Test3
    </Button>
</li>
<li>
   <Button>
        Test4
    </Button>
</li>
<li>
   <Button>
        Test5
    </Button>
</li>
<li>
   <Button>
        Test6
    </Button>
</li>
</ul>

<p> here are printed results </p>   
</template>

<script lang="ts">
import Button from 'primevue/button'
import { defineComponent } from 'vue';
export default defineComponent({
  name: 'DataTest',
  components: {
  },
  mounted(){
    //console.log("Mounting DataTest");
  }
});
</script>