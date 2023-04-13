import { create } from "zustand";

const initialFormValues = {
    code: "",
    name: "",
    isbn10: "",
    isbn13: "",
    releasedYear: "",
    coverPrice: "",
    genreId: "",
    description: "",
    selectedBooks: [],
    authors: [],
    previewFile: null,
};

export interface ICreateComboStore {
    formValues: typeof initialFormValues;
    setFormValues: (form: typeof initialFormValues) => void;
}

export const useCreateComboStore = create<ICreateComboStore>()((set) => ({
    formValues: {
        ...initialFormValues,
    },
    setFormValues: (values) => set({ formValues: values }),
}));
