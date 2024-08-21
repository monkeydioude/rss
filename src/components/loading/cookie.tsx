import { useEffect, useRef, useState } from "react";
import { Image, View } from "react-native";

const Cookie = (): React.ReactNode => {
    const [rotation, setRotation] = useState<number>(0)
    const rotationRaise = 5
    const animationRefreshTimer = 5
    const stronzo = useRef<any>({
        it: 0,
        rgb: [255, 0, 0],
        addF: 10,
        currDim: 0,
        dimToChange: 1,
        min: 0,
        max: 255,
    })

    useEffect(() => {
        const seed = setInterval(() => {
           setRotation((rotation + rotationRaise) % 360);
           const dimP = stronzo.current.dimToChange % 3
           if (stronzo.current.rgb[dimP] >= stronzo.current.max && stronzo.current.dimToChange > stronzo.current.currDim) {
                stronzo.current.it++
                stronzo.current.currDim = stronzo.current.it
                stronzo.current.dimToChange = stronzo.current.it - 1
                stronzo.current.addF *= -1
           } else if (stronzo.current.rgb[dimP] <= stronzo.current.min && stronzo.current.currDim > stronzo.current.dimToChange) {
            stronzo.current.dimToChange = stronzo.current.it + 1
            stronzo.current.addF *= -1
           } 

           stronzo.current.rgb[dimP] += stronzo.current.addF
        }, animationRefreshTimer)

        return () => clearInterval(seed)
    })

    return (
        <View style={{
            flex: 1,
            alignItems: "center",
            justifyContent: "center",
        }}>
            <Image
                style={{
                    transform: [{rotate: `${rotation}deg`}],
                    alignItems: "center",
                    position: "absolute",
                }}
                source={require('../../../assets/cookie_transparent.png')}
            />
            <Image
                style={{
                    transform: [{rotate: `${rotation}deg`}],
                    alignItems: "center",
                    tintColor: `rgba(${stronzo.current.rgb.join(",")}, 0.40)`,
                }}
                source={require('../../../assets/cookie_transparent.png')}
            />
        </View>
    )
}

export default Cookie;