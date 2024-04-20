import { useAtom } from "jotai"
import { atom } from "jotai"

import { Theme } from "@/components/themes"

type Config = {
  theme: Theme["name"]
  radius: number,
  era: string
}

const configAtom = atom<Config>({
  theme: "default",
  radius: 0.5,
  era: ''
})

export function useConfig() {
  return useAtom(configAtom)
}