"use client";
import { createContext,  useContext, useState } from "react"

interface LangContextType  {
    lang: "fr" | "en" | "es";
    toggleLang: (lang: LangContextType['lang']) => void
}


export const LangContext = createContext<LangContextType>({
    lang: 'fr',
    toggleLang: () => {}
})


export const LangProvider = ({ children }) => {
    const [lang, setLang] = useState< LangContextType["lang"]>("fr");
   
    const toggleLang = (lang: LangContextType["lang"]) => {
        setLang(lang)
    }



    return (
        <LangContext.Provider value={{ lang, toggleLang }}>
            {children}
        </LangContext.Provider>
    )
}



export const useLangContext = () => {
    
    const context = useContext(LangContext)
  if (!context) {
    throw new Error('useLangContext must be used within the modal provider')
  }
  return context
}