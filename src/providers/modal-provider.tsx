"use client"

import { createContext, useContext, useEffect, useState } from "react";

// children Prop
// modaldata initial empty(object)
// defining the type of the model Context
// creating a modelContext function and assigning the type
// creating a context and assinging the type of modelContextType
// creating a ModalProvider function 
// useState hooks for setting opening of model ,  data to store , crreating opening of model function and closing
// creating a usestate hook and wrapping in the useEffect hook for managing hydration error.
// creating a setOpen function which accepts 2 parameters model and dataFetching.
// putting condition if model and fetchData then setting the data to the data which is fetched from an api.
// and upadating the showingmodel and open model to true.
// same creating the setClose function and upadting the showing model and open model to false.
// checking if it is mounted or not if not than return null.
// lastly returing the modelContext Provider and passing the values and giving children and showing model in this provider.
// creating a custom hook useModel and wrapping a modelContext in usecontext hook
// checking if not context throw error else return context
// lastly exporting default ModalProvider


interface modelProviderProps {
    children : React.ReactNode
}

export type modelData  = {};

type ModelContextType = {
   data : modelData
   isOpen : boolean
   setOpen : (model : React.ReactNode , fetchData ? : () => Promise<any>) => void
   setClose : () => void
}

const ModelContext = createContext<ModelContextType>({
  data : {},
  isOpen : false,
  setOpen : (model : React.ReactNode , fetchData ? : () => Promise<any>) => {},
  setClose : () => {}
})

const ModelProvider : React.FC<modelProviderProps> = ({children}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [data, setData] = useState<modelData>({});
  const [showingModal, setShowingModal] = useState<React.ReactNode>(null);
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  const setOpen = async (
    model: React.ReactNode,
    fetchData?: () => Promise<any>
  ) => {
    if (model) {
      if (fetchData) {
        setData({ ...data, ...(await fetchData()) } || {});
      }
      setShowingModal(model);
      setIsOpen(true);
    }
  };

  const setClose = () => {
    setIsOpen(false);
    setData({});
  }

  if (!isMounted) return null

  return (
    <ModelContext.Provider value={{ data, setOpen, setClose, isOpen }}>
      {children}
      {showingModal}
    </ModelContext.Provider>
  )
}

export const useModal = () => {
    const context = useContext(ModelContext)
    if (!context) {
      throw new Error('useModal must be used within the modal provider')
    }
    return context
  }
  
  export default ModelProvider