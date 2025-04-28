// "use client";

// import { useEffect, useRef, useState } from "react";
// import { useNavBar } from "@/contexts/NavBarContext";
// import styles from "./navbar.module.css";

// export default function NavbarComponent() {
//   const { heading, setHeading, isExpandable, setIsExpandable } = useNavBar();
//   const navRef = useRef(null);

//   const [pullDistance, setPullDistance] = useState(0);
//   const [refreshTriggered, setRefreshTriggered] = useState(false);

//   useEffect(() => {
//     let hammer;

//     const initHammer = async () => {
//       const Hammer = (await import("hammerjs")).default; // Dynamic import here

//       hammer = new Hammer(navRef.current);

//       hammer.get("pan").set({ direction: Hammer.DIRECTION_VERTICAL });

//       hammer.on("panmove", (e) => {
//         if (e.deltaY > 0 && !refreshTriggered) {
//           setPullDistance(Math.min(e.deltaY, 150));
//         }
//       });

//       hammer.on("panend", () => {
//         if (pullDistance > 100) {
//           setRefreshTriggered(true);
//           setIsExpandable(true);
//         } else {
//           setPullDistance(0);
//           setRefreshTriggered(false);
//           setIsExpandable(false);
//         }
//       });
//     };

//     if (typeof window !== "undefined") {
//       initHammer();
//     }

//     return () => {
//       if (hammer) {
//         hammer.destroy();
//       }
//     };
//   }, [pullDistance, refreshTriggered, setIsExpandable]);

//   return (
//     <div ref={navRef} className={styles.navbar}>
//       <div
//         className={`${styles.navbarContent} ${refreshTriggered ? styles.centered : ""}`}
//         style={{
//           transform: `translateY(${pullDistance / 2}px)`,
//           transition: refreshTriggered ? "transform 0.5s ease" : "none",
//         }}
//       >
//         <h1 className={styles.title}>{heading || "Expenses"}</h1>
//         <p
//           className={styles.subtext}
//           style={{
//             opacity: refreshTriggered ? 1 : 0,
//             transition: "opacity 0.5s ease",
//           }}
//         >
//           Holding On Can Be Stressful
//           <br />
//           Let It Go For Refresh! 🖤
//         </p>
//       </div>
//     </div>
//   );
// }
import { useNavBar } from "@/contexts/NavBarContext";
import { Collapsible } from "@chakra-ui/react";
import styles from "./navbar.module.css";
import Image from "next/image";
import SadIcon from "@/assets/Navbar/sad.svg"
import DateIcon from "@/assets/Navbar/date.svg"
import { useState } from "react";
import { DownSVGComponent, SearchSVGComponent, CalendarSVGComponent, SadSVGComponent } from "@/assets/SVGComponents";
import downIcon from '@/assets/Navbar/down.svg';
export default function Navbar (){
  const [isDateClicked, setIsDateClicked] = useState(false);
  const [isSadClicked, setIsSadClicked] = useState(false);

  const { heading, setHeading, isExpandable, setIsExpandable } = useNavBar();
  const handleClick = (index) => {
    console.log("HIIO")
    setClickedIndex(index);
  };

  return(
    <Collapsible.Root  style={{ boxShadow : '0px 1px 4.9px rgba(0, 0, 0, 0.25)' }}>
      <Collapsible.Trigger  style={{ height: '3.5rem' }}>
        <div className={styles["navbarContainer"]}>
            <div className={styles["navbarContent"]}>
                <div className={styles["heading"]}>
                    {heading}
                </div>
                <div className={styles["expandIcon"]}>
                    <DownSVGComponent size={20}/>
                </div>
            </div>
        </div>
      </Collapsible.Trigger>
      <Collapsible.Content  >
            <div className={styles.hiddenContainer}>
              <div className={styles.searchBox}>
                <input
                  type="text"
                  placeholder="Search By Name"
                  className={styles.searchInput}
                />
                <div className={styles.searchIcon}>
                  <SearchSVGComponent size={20} />
                </div>
              </div> 
              <div className={styles.interactions}>
                <div 
                  className={`${styles.button} ${isDateClicked ? styles.clicked : ''}`}
                  onClick={() => setIsDateClicked(!isDateClicked)}
                >
                  <Image src={DateIcon} height={25} width={25} alt="Date" />
                </div>

                <div 
                  className={`${styles.button} ${isSadClicked ? styles.clicked : ''}`}
                  onClick={() => setIsSadClicked(!isSadClicked)}
                >
                  <Image src={SadIcon} height={27} width={27} alt="Sad" />
                </div>
              </div>            
            </div>
      </Collapsible.Content>
    </Collapsible.Root>
  )

}