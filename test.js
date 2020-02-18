function test(){
  let i=1
  return new Promise((resolve,reject)=>{
   setTimeout(()=>{
resolve('55')
   },3000)
   return true
  })
}
test().then(res=>{
  console.log(res)
}).catch(err=>console.error(err))