// Transcrit data 

interface TransDatum{
    gene_name?: string;
    baseMean: string;
    log2FC: string;
    lfcSE: string;
    stat: string;
    pvalue: string;
    pvalueadj: string;
}

type TransFetch = {[index: string]: TransDatum}
export class TransStorage{

    data: TransFetch;
    transcriptome: string;
    providerURL: string|undefined

    constructor(url?: string){
        this.data = {}
        this.transcriptome = ''
        this.providerURL = url
    }


}