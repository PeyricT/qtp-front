export const range = (start: number, stop: number) => {
    return [...Array(stop-start).keys()].map(i => i+start); 
}

/*
Function that add new_elmt to array if it's not already inside and remove it if it's already inside
*/
export const addOrRemoveFromArray = (array: any[], new_elmt:any):any[] => {
    if (array.includes(new_elmt)) array = array.filter(elmt => elmt !== new_elmt)
    else array.push(new_elmt)
    return array
}