import { createContext, useEffect, useRef, useState } from 'react';
import React from 'react';
import { Animated, ColorValue, Dimensions, Keyboard, View } from 'react-native';

type MenuContext = {
  toggleMenu: () => void,
  setMenuStyle: (style: MenuStyle) => void,
  // setMenuProps: (style: MenuProps) => void,
}

export const MenuContext = createContext<MenuContext>({
  toggleMenu: () => {},
  setMenuStyle: () => {},
  // setMenuProps: () => {},
}); 

type Animation = {
  type: "block" | "slide",
  duration: number,
}

export type MenuProps = {
  toggleMenu: () => void
}

export type MenuStyle = {
  backgroundColor?: ColorValue;
  top?: number;
}

const maxLeft = -Dimensions.get("window").width;
const defaultAnimationDuration = 300;

const getAnimationDuration = (animation?: Animation): number => {
  if (!animation) {
    return defaultAnimationDuration;
  }

  if (animation.type == "block") {
    return 0;
  }

  return animation.duration;
}

type Props = {
  MenuComponent: any,
  children: JSX.Element,
  animation?: Animation
}

const MenuProvider = ({ children, MenuComponent, animation }: Props): JSX.Element => {
  const [isMenuOpen, setIsMenuOpen] = useState<boolean>(false);
  const [menuStyle, setMenuStyle] = useState<MenuStyle>({});
  const slideValue = useRef(new Animated.Value(0));
  const animationDuration = getAnimationDuration(animation);

  const menuProps: MenuProps = {
    toggleMenu: () => {
      Keyboard.dismiss();
      setIsMenuOpen(!isMenuOpen)
    }
  }

  // init values
  useEffect(() => {
    slideValue.current.setValue(maxLeft);
  }, [])

  const toValue = !isMenuOpen ? maxLeft : 0;

  Animated.timing(slideValue.current, {
    toValue,
    duration: animationDuration,
    useNativeDriver: false,
  }).start()

  return (
    <MenuContext.Provider value={{
      toggleMenu: menuProps.toggleMenu,
      setMenuStyle,
    }}>
      <Animated.View
        style={{
          left: slideValue.current,
          width: Dimensions.get("window").width,
          position: "absolute",
          height: "100%",
          zIndex: 2,
          top: menuStyle.top,
          display: "flex"
        }}
      >
        <View style={{
          ...menuStyle,
          height: "100%",
        }}>
          <MenuComponent {...menuProps} />
        </View>
      </Animated.View>
      {children}
    </MenuContext.Provider>
  )
}
export default MenuProvider;