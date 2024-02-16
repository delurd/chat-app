import { useEffect, useState } from "react"

export const useWindowSize = () => {
    const [windowWidth, setWindowWidth] = useState(0)

    useEffect(() => {
        setWindowWidth(window.innerWidth)
        function onChangeWindowSize() {
            setWindowWidth(window.innerWidth);
        }

        window.addEventListener('resize', onChangeWindowSize);

        return () => {
            window.removeEventListener('resize', onChangeWindowSize);
        };
    }, [])

    return { windowWidth }
}