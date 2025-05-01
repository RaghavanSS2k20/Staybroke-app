'use client'
import { HTMLAttributes, ReactNode, useEffect, useRef } from 'react';
import pullToRefresh from '../utils/usePullToRefresh';
// import { ReactNode } from 'react';
import styles from "./layout.module.css"
import { BottomTabBar } from './BottomTab/BottomTabBar';
import NavbarComponent from './navbar/navbarComponent';
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
          <NavbarComponent />
          <main>
            {children}
          </main>
          
          <BottomTabBar/>
        </div>
      );

}

