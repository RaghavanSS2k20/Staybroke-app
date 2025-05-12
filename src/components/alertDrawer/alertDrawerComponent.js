import { useState, useEffect, useRef } from "react";
import { Drawer } from "@chakra-ui/react";
import styles from "./alert.module.css";
import { Input } from "@chakra-ui/react";
import { Spinner } from "@chakra-ui/react";
import { Alert } from "@chakra-ui/react";
const AlertSheet = ({header, alert,data, actions, alertOpen, setAlertOpen}) =>{
    if (typeof window === 'undefined') return;
    
    const handleContinueClick = ()=>{
        actions.continue()
    }

    return(
        <Drawer.Root
            open={alertOpen}
            onOpenChange={(e) => setAlertOpen(e.open)}
            placement="bottom"
            size="xl"
            bgColor="white"
        >
        <Drawer.Backdrop />
        <Drawer.Content className={styles["drawer"]} roundedTop="13">
            <div
                className={styles.drawerContent}
            >
                <div className={styles["drawerHeader"]}>
                    Alert!
                </div>
                <div className={styles["headingContainer"]}>
                    {header}
                </div>
                <div className={styles["alertContainer"]}>
                    <Alert.Root status="info" variant={'outline'} color={'black'} colorPalette={'gray'} borderColor={'black'} className={styles["alert"]}>
                        <Alert.Indicator color={'black'}/>
                        <Alert.Title>{alert}</Alert.Title>
                    </Alert.Root>
                </div>
                <div className={styles["actions"]}>
                    <div className={`${styles.button} ${styles.delete}`}>
                        Cancel
                    </div>
                    <div className={styles.button} onClick={handleContinueClick}>
                        Delete
                    </div>
                </div>

            </div>
        </Drawer.Content>


        </Drawer.Root>   
    )



}

export default AlertSheet