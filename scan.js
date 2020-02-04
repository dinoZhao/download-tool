var fs = require('fs')
 
 
//遍历文件夹，获取所有文件夹里面的文件信息

function geFileList(path)
{
 var filesList = [];
 readFile(path,filesList);
 return filesList;
}
//遍历读取文件
function readFile(path,filesList)
{
  var files;
  
try {
  files = fs.readdirSync(path);
} catch (error) {
  return
}
 //需要用到同步读取
 files.forEach(walk);
 function walk(file)
 { 
  try {
    stats = fs.statSync(path+'/'+file); 
   
  } catch (error) {
    // console.log(error)
    return
  }
   
  
  if(stats.isDirectory())
  {
   readFile(path+'/'+file,filesList);
  }
  else
  { 
    if(stats.size/1024/1024<100){
      // console.log(stats.size)
      return
    }else{
      console.log(stats.size/1024/1024)
    }
   //创建一个对象保存信息
   var obj = new Object();
   obj.size = stats.size;//文件大小，以字节为单位
   obj.name = file;//文件名
   obj.path = path+'/'+file; //文件绝对路径
   filesList.push(obj);
  }  
 }
}
 
//写入文件utf-8格式
function writeFile(fileName,data)
{ 
 fs.writeFile(fileName,data,'utf-8',complete);
 function complete()
 {
  console.log("文件生成成功");
 } 
}
 
 
var filesList = geFileList("C:/Users/dinoz/Downloads");
filesList.sort(sortHandler);
function sortHandler(a,b)
{
 if(a.size > b.size)
 return -1;
 else if(a.size < b.size) return 1
 return 0;
}
var str='';
for(var i=0;i<filesList.length;i++)
{
 var item = filesList[i];
 var desc ="文件名:"+item.name + " "
  +"大小:"+(item.size/1024/1024).toFixed(2) +"Mb"+" "
  +"路径:"+item.path;
 str+=desc +"\n"
}
 
 
writeFile("test.txt",str);