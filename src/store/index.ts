import { map } from 'd3';
import { createStore } from 'vuex'
import * as XLSX from 'xlsx';

export interface Ome{
  name: string; 
  number: number; 
}

export default createStore({
  state: {
  prot_cols: new Map<string, [any]>(),
  gene_cols: new Map<string, [any]>(),

  prot_ids: new Map<string, number>(),
  gene_ids: new Map<string, number>(),

  prot_xlsx: false,
  gene_xlsx: false,

  proteomes: new Array<Ome>(),
  genomes: new Array<Ome>(),
  },
  getters: {
    getProtColsName: (state) => {
      return Array.from(state.prot_cols.keys())
    },
    getGeneColsName: (state) => {
      return Array.from(state.gene_cols.keys())
    },

    getProtCol: (state) => (col: string) => {
      return state.prot_cols.get(col)
    },
    getGeneCol: (state) => (col: string) => {
      return state.gene_cols.get(col)
    },

    getProt: (state) => (prot: string) => {
      if (!state.prot_ids.has(prot)){
        return undefined
      }
      let id: number = state.prot_ids.get(prot) as number;
      let protData = new Map<string, any>();
      state.prot_cols.forEach((value, key)=>{
        protData.set(key, value[id])
      })

      return protData
    },
    getGene: (state) => (gene: string) => {
      if (!state.gene_ids.has(gene)){
        return undefined
      }
      let id: number = state.gene_ids.get(gene) as number;
      let geneData = new Map<string, any>();
      state.gene_cols.forEach((value, key)=>{
        geneData.set(key, value[id])
      })

      return geneData
    },

    getProteomes(state){
      return state.proteomes
    },
    getGenomes(state){
      return state.genomes
    },

    isProtXlsx(state){
      return state.prot_xlsx
    },
    isGeneXlsx(state){
      return state.prot_xlsx
    },

  },
  mutations: {
    setProtCol(state, data){
      state.prot_cols.set(data.colName, data.colData);
    },
    setGeneCol(state, data){
      state.gene_cols.set(data.colName, data.colData);
    },

    setProtIds(state, data){
      let ids = data.ids as Array<string>
      ids.forEach((value, index) => {
        state.prot_ids.set(value, index)
      })
    },
    setGeneIds(state, data){
      let ids = data.ids as Array<string>
      ids.forEach((value, index) => {
        state.gene_ids.set(value, index)
      })
    },

    setProteome(state, data){
      let proteomes_ = data.proteomes;
      Object.keys(proteomes_).forEach((value, index) => {
        state.proteomes.push({name: value, number: proteomes_[value] as number})
      })
    },
    setGenome(state, data){
      let genomes_ = data.genomes;
      Object.keys(genomes_).forEach((value, index) => {
        let key = Object.keys(value)[0];
        state.genomes.push({name: value, number: genomes_[value] as number})
      })
    },

    setProtXlsx(state, data){
      state.prot_xlsx = data.state;
    },
    setGeneXlsx(state, data){
      state.gene_xlsx = data.state;
    }
  },
  actions: {
  },
  modules: {
  }
})


