import { normalize } from "./normalization"
import { ifNotThenArrayOf } from "./type_ops"

export const isUnwantedCategories = (cat: string): boolean => (
    false
    // ["PAID"].indexOf(cat) > -1
)

export const firstLetterCapitalize = (text: string): string => (
    text.split(" ").map((c: string) => c.charAt(0).toUpperCase() + c.slice(1).toLowerCase()).join(" ")
)

export const toLower = (text: string): string => (
    text.toLocaleLowerCase()
)

export const removeWhiteSpaces = (text: string): string => (
    text.replaceAll(" ", "")
)
export const normalizeItemCategory = (category: string|string[]|undefined): string => {
    return ifNotThenArrayOf<string>(category)
        .filter((el: string, index: number) => !isUnwantedCategories(el) && index < 5)
        .map((el: string) => (
            normalize([
                toLower,
                firstLetterCapitalize,
                removeWhiteSpaces,
            ], el)
        ))
        .join(", #") 
}