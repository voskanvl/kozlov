/*
Параметры объекта:
Id - идентификатор
Name - название
Date - дата (датапикер)
Location - часть света (автокомплит)
Country - страна (автокомплит)
Region - регион (автокомплит)
Season - сезон (чекбокс со значениями зима, весна, лето, осень, можно выбрать один или несколько сезонов)
IsArchive - признак архивности (переключатель в архиве, не в архиве)
 */
enum Season{
  winter="зима",
  spring="весна",
  summer="лето",
  autumn="осень",
}
export class MainViewModel{
  Id:string = "";
  Name: string="";
  Date: Date = new Date(Date.now());
  Location: string="";
  Country: string="";
  Region: string="";
  Season: Season[] = [];
  IsArchive: boolean = false;
}
