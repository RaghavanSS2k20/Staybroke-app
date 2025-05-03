const BACKEND_URI = process.env.NEXT_PUBLIC_API_URI;
export  async function getAllExpenses(){
    console.log("URI HERE : ",`${BACKEND_URI}/expense`)
    const response = await fetch(`${BACKEND_URI}/expense`)
    // console.log(response)
    if (!response.ok) {
        return {success:false, error:response.error}
      }
    
    const data = await response.json();
    
    return {
        success:true,
        data:data
    }

}

export async function updateGuilt(id){
    const res = await fetch(`${BACKEND_URI}/expense/${id}`,{
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          toUpdate: 'guilt',
        //   value: true, // or false depending on your input
        }),
    })

    const updatedExpense = await res.json();

    if(!res.ok){
        return {
            success:false,
            error:updatedExpense.error
        }
    }else{
        return{
            success:true,
            data:updatedExpense.data
        }
    }
}