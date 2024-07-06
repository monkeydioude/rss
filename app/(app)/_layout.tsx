import { Stack } from "expo-router"

export default () => {
  return (
    <Stack screenOptions={{
      header: () => null
    }}>
      <Stack.Screen name="index" />
    </Stack>
  )
}