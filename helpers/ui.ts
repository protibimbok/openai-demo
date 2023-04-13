export type ClassNames = undefined | null | {[key: string]: boolean} | Array<ClassNames> | string;

const resolveObj = (classes:{[key:string]:boolean}) =>{
    let str = '';
    for(let c in classes){
        if(classes[c]){
            str += str?' ':'';
            str += c;
        }
    }
    return str;
}


export const classNames = (classes: ClassNames) : string=>{
    let str = '';
    if(!classes){
        return str;
    }
    if(typeof classes === 'string'){
        return classes;
    }
    if(typeof classes.length === 'number'){
        for(let i = 0; i<classes.length; i++){
            //@ts-ignore
            const c = classNames(classes[i]);
            if(!c)continue;
            str += str?' ':'';
            str += c;
        }
    }
    const c = resolveObj(classes as {});
    if(!c)return str;
    str += str?' ':'';
    str += c;
    return str;
}
