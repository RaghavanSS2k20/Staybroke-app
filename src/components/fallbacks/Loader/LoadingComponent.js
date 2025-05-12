import { Spinner } from '@chakra-ui/react'
import styles from './loader.module.css'

export const Loader = ({message}) =>{
    return(
        <div className={styles.wrapper}>
            <div>
                <Spinner size={'xl'} borderWidth='4px'/>
            </div>
            <div className={styles.message}>
                {message}
            </div>
        </div>
    )
}