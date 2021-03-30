export interface PwasAPIInput{
    proteinsExp : string[], 
    proteinsDelta : string[], 
    taxid: number, 
    method: StatMethod
}

type StatMethod = "fisher"