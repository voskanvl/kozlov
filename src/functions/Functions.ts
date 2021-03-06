export type Obj = { [key: string]: any }
export class MyFunctions{
  static compareObjects(prev: Obj, next: Obj): Obj {
    let res = {};
    const nextKeys = Object.keys(next);
    const prevKeys = Object.keys(prev);
    prevKeys.forEach(e => {
      if (nextKeys.includes(e)) {
        if (typeof prev[e] !== 'object') {
          if (prev[e] !== next[e]) res = {...res, [e]: next[e]}
        }
      }
    })
    nextKeys.forEach(e => {
      if (prevKeys.includes(e)) {
        if (typeof prev[e] !== 'object') {
          if (next[e] !== prev[e]) res = {...res, [e]: next[e]}
        }
      } else {
        res = {...res, [e]: next[e]}
      }
    })
    return res;
  }
  static getIdByName(arr:Array<Obj>,name:any):any{
    for(let e of arr){
      if('name' in e){
        if (e['name']===name) return e['id']
      }
    }
  }
  static stringArray(arr: string[] | number[] | Obj[], field?:string ): string[]{
    return arr.map(e=>{
      if (typeof e === 'object') {
        if (field && field in e) return e[field]
        return ""
      }
      return e.toString()
    })
  }
  static objectedDate(date: Date):object{
    const res = {
      year: date.getFullYear(),
        month: date.getMonth()+1,
        day: date.getDate()
    }
    return res
  }
}
