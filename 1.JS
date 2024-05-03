let arr=[1,2,3,4,2,9,8,2,3,4,5,6,7,6,6,6,6]

for (let index = 0; index < arr.length; index++) {
   for (let index1 = index+1; index1 < arr.length; index1++) {
    if(arr[index]==arr[index1])
    arr[index1]=''
    
   } 

}
console.log(arr.sort())
