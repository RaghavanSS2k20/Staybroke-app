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

export async function addExpense(expense) {
    const res = await fetch(`${BACKEND_URI}/expense/`,{
        method:'POST',
        headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            expense
          //   value: true, // or false depending on your input
          }),
    })
    const data = await res.json()
    if(res.ok){
        return {
            success:true,
            data:data.data
        }
    }else{
        return {
            success:false,
            error:data.error
        }
    }
}
export async function updateExpense(expense) {
    const { id, description, amount } = expense;
  
    if (!id || !description || !amount) {
      return {
        success: false,
        error: "All fields (id, description, amount) are required."
      };
    }
  
    try {
      const res = await fetch(`${BACKEND_URI}/expense/${id}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({  description, amount }),
      });
  
      const data = await res.json();
  
      if (res.ok) {
        return {
          success: true,
          data: data.data,
        };
      } else {
        return {
          success: false,
          error: data.error || 'Failed to update expense.',
        };
      }
    } catch (error) {
      console.error('Error updating expense:', error);
      return {
        success: false,
        error: error.message || 'Network error. Please try again later.',
      };
    }
  }

export async function deleteExpense(id) {
  if(!id){
    return {
      success: false,
      error: "All fields (id, description, amount) are required."
    };
  }

  try{
    const res = await fetch(`${BACKEND_URI}/expense/${id}`, {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json',
      },
    });
    const data = await res.json();
    if(res.ok){
      return{
        success:true,
        data:data.data
      }
    }else{
      return{success: false,
      error: data.error}
    }
  }catch(e){
    return{
      success:false,
      error: e.message
    }
  }
}