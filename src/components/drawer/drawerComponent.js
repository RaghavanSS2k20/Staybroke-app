import { useState, useEffect, useRef } from "react";
import { Drawer } from "@chakra-ui/react";
import styles from "./drawer.module.css";
import { Input } from "@chakra-ui/react";
import { Spinner } from "@chakra-ui/react";
import { addExpense, updateExpense } from "@/services/ExpenseService";


export const ExpenseSheet = ({ open, setOpen,mode, expenseData, reload }) => {
  const [amount, setAmount] = useState('');
  const [description, setDescription] = useState('')
  const[loading, setLoading] = useState(false);
  const[buttonText, setButtonText] = useState('Save')
  const contentRef = useRef(null);
  const inputRef = useRef(null);
  const [keyboardOpen, setKeyboardOpen] = useState(false);
  const initialHeightRef = useRef(0);
  if (typeof window === 'undefined') return;

  useEffect(() => {
    console.log(mode)
    setButtonText("Save")
    if (mode === "edit" && expenseData) {
      // pre-fill form with expenseData
      setAmount(expenseData.amount)
      setDescription(expenseData.description)
      
      console.log("Datahere  : ",expenseData)
      // cons
    } else {
      // reset form for "add"
      setAmount("")
      setDescription("")
      
    }
  }, [mode, expenseData]);

  useEffect(() => {
    if (typeof window === 'undefined') return;
  
    const handleViewportResize = () => {
      const heightDiff = window.innerHeight - window.visualViewport.height;
      console.log("Viewport diff:", heightDiff);
  
      if (heightDiff > 100) {
        console.log("📱 Keyboard is open");
        setKeyboardOpen(true);
      } else {
        console.log("⌨️ Keyboard is closed");
        setKeyboardOpen(false);
      }
    };

   
  
    window.visualViewport.addEventListener('resize', handleViewportResize);
  
    return () => {
      window.visualViewport.removeEventListener('resize', handleViewportResize);
    };
  }, []);
  
  const handleInputChange = (e) => {
    const val = e.target.value;
    if (/^\d*\.?\d{0,2}$/.test(val)) {
      setAmount(val);
    }
  };

  const handleDescriptionInput=(e)=>{
    const val = e.target.value
    setDescription(val)
  }

  const handleSave = async () =>{
      setLoading(true)
      setButtonText("Loading....")
      if(mode === 'edit'){
        const id = expenseData._id
        const resp = await updateExpense({
          id,
          description,
          amount
        })
        if(resp.success){
          if (navigator.vibrate) {
            navigator.vibrate(50); // Vibrates for 200ms
          }

          setLoading(false)
          setButtonText("Saved!")
          setOpen(false)
          reload()
        }else{
          setButtonText("Failed !")
          setLoading(false)
        }
      }else{
        const resp = await addExpense({
          description,
          amount
        })

        if(resp.success){
          

          setLoading(false)
          setButtonText("Added!")
          setOpen(false)
          if (navigator.vibrate) {
            
            navigator.vibrate(50); // Vibrates for 200ms
            reload()
          }
          
          
        }else{
          setButtonText("Failed !")
          setLoading(false)
        }
      }
  }



  return (
    <Drawer.Root
      open={open}
      onOpenChange={(e) => setOpen(e.open)}
      placement="bottom"
      size="xl"
      bgColor="white"
    >
      <Drawer.Backdrop />
      <Drawer.Content className={styles["drawer"]} roundedTop="13">
        <div
          ref={contentRef}
          className={`${styles.drawerContent} ${
            keyboardOpen ? styles.keyboardOpen : ''
          }`}
        >
          <div className={styles["drawerHeader"]}>{mode === "edit" ? "Edit Expense" : "Add Expense"}</div>
          <div className={styles["inputContainer"]}>
            <div className={styles["amountInput"]}>
              <span className={styles.currency}>₹</span>
              <input
                ref={inputRef}
                type="number"
                className={styles.input}
                value={amount}
                onChange={handleInputChange}
                placeholder="0.00"
              />
            </div>
          </div>
          <Input value={description} onChange={handleDescriptionInput} variant={'flushed'} borderBottomWidth={'2px'} fontWeight={'600'} fontSize={'1rem'} borderColor="#2D2F2F" placeholder="Description Here" width={"fit-content"} textAlign={'center'}/>
          <div className={styles.button} onClick={handleSave} >
              {buttonText}
              {
                loading && (
                  <Spinner size="xs" />
                )
              }
          </div>
        </div>
      </Drawer.Content>
    </Drawer.Root>
  );
};
