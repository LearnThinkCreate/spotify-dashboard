import { useAtom } from "jotai"
import { atomWithStorage } from "jotai/utils"

import { Theme } from "@/components/themes"

type Config = {
  theme: Theme["name"]
  radius: number,
  era: string
}

const configAtom = atomWithStorage<Config>("config", {
  theme: "default",
  radius: 0.5,
  era: ''
})

export function useConfig() {
  return useAtom(configAtom)
}