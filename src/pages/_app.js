'use client'
import { ChakraProvider } from "@chakra-ui/react";

import "@/styles/globals.css";
import { Provider } from "@/components/ui/provider";
import { zohoPuvi } from "../../public/assets/fonts/font";
import { gilroyRegular, gilroyMedium, gilroyBold, gilroyBlack } from "../../public/assets/fonts/font"; // Import the fonts
import localFont from 'next/font/local';
import Layout from "@/components/layoutComponent";
import { SheetProvider } from "@/contexts/SheetContext";
import { NavBarProvider } from "@/contexts/NavBarContext";
export default function App({ Component, pageProps }) {
  return (
  <div className={`${zohoPuvi.variable}`}>
    <Provider>
      <NavBarProvider>
        <SheetProvider>
          <Layout>
            <Component {...pageProps} />
          </Layout>
        </SheetProvider>
      </NavBarProvider>
    </Provider>
    </div>
  );
}