'use client'
import { HTMLAttributes, ReactNode, useEffect, useRef } from 'react';
import pullToRefresh from '../utils/usePullToRefresh';
// import { ReactNode } from 'react';
import styles from "./layout.module.css"
import { BottomTabBar } from './BottomTab/BottomTabBar';
// import SheetProvider from '@/components/sheet/SheetProvider';
import GlobalSheetRenderer from './globalSheetRenderer';
import NavbarComponent from './navbar/navbarComponent';
import PushInitializer from '@/utils/pushInitializer';
import { AddSVGComponent } from '@/assets/SVGComponents';
export default function Layout({children}) {
  async function handleRefresh() {
    // await onRefresh();
  }

  // const hasBeenInit = useRef<boolean | null>(null);
  // const refreshRef = useRef<HTMLDivElement>(null);
  // const ptrRef = useRef<HTMLDivElement>(null);
  // const bodyRef = useRef<HTMLDivElement>(null);


    return (
        <div className={styles.root} >
         <PushInitializer />
          <NavbarComponent />
          <main>
            {children}
          </main>
          <GlobalSheetRenderer />
          <BottomTabBar/>

        </div>
      );

}

