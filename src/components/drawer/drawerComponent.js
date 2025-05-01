import { useState, useEffect, useRef } from "react";
import { Drawer } from "@chakra-ui/react";
import styles from "./drawer.module.css";
import { Input } from "@chakra-ui/react";

export const Sheet = ({ open, setOpen }) => {
  const [amount, setAmount] = useState('');
  const contentRef = useRef(null);
  const inputRef = useRef(null);
  const [keyboardOpen, setKeyboardOpen] = useState(false);
  const initialHeightRef = useRef(0);
  if (typeof window === 'undefined') return;

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
          <div className={styles["drawerHeader"]}>Add Expense</div>
          <div className={styles["inputContainer"]}>
            <div className={styles["amountInput"]}>
              <span className={styles.currency}>₹</span>
              <input
                ref={inputRef}
                type="text"
                className={styles.input}
                value={amount}
                onChange={handleInputChange}
                placeholder="0.00"
              />
            </div>
          </div>
          <Input variant={'flushed'} borderBottomWidth={'2px'} fontWeight={'600'} fontSize={'1rem'} borderColor="#2D2F2F" placeholder="Description Here" width={"fit-content"} textAlign={'center'}/>
          <div className={styles.button}>
              Save
          </div>
        </div>
      </Drawer.Content>
    </Drawer.Root>
  );
};
