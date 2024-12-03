import React, { useState, useEffect } from "react";

interface DocumentMetadata {
    filename: string;
    page_label: number;
}

interface Document {
    object: string;
    doc_id: string;
    doc_metadata: DocumentMetadata;
 
    checked: boolean;
}


const SelectDocuments: React.FC = () => {
    const [documents, setDocuments] = useState<Document[]>([]);

    const [formData, setFormData] = useState({
        modelName: "", // Inizializza con una stringa vuota
        description:"",
       
    });

    
 
    const handleInputChange = (
        event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
    ) => {
        const { name, value } = event.target;
        setFormData((prevData) => ({
            ...prevData,
            [name]: value,
        }));
    };
   
    //prendo tutti i documenti dal Backend che a sua volta li ha presi da private-GPT
    useEffect(() => {
        fetch("http://localhost:3000/documents/getAllDocuments")
            .then((response) => response.json())
            .then((data: { data: Document[] }) => {
                const documentsWithChecked = data.data.map((doc) => ({
                    ...doc,
                    checked: false, // Aggiungi o sovrascrivi il valore di checked
                }));
                setDocuments(documentsWithChecked);
            })

            .catch((error) => console.error("Errore nel caricamento dei documenti", error));
    }, []);
    const handleChange = (doc_id: string) => {
    const copyProducts = [...documents];
    const modifiedProducts = copyProducts.map(document => {
      if (doc_id === document.doc_id) {
        document.checked = !document.checked;
      }
      return document;
    });
    setDocuments(modifiedProducts);
  }; 

  
  const getDocumentIds=()=>{
    return documents.filter(doc=>doc.checked).map(doc=>doc.doc_id);
  }
  
    const postDocuments = () => {
        fetch("http://localhost:3000/documents/postmodel", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },

            body: JSON.stringify({ documentIds: getDocumentIds(),
                                   modelName: formData.modelName,
                                   description: formData.description,
             }),

        })
            .then((response) => response.json())
            .then((data) => {
                console.log(data);
            })
            .catch((error) => console.error("Errore durante il salvataggio dei documenti", error));
    };


    return (
        <div>
            <h2>Seleziona i documenti</h2>
            <p>Elenco dei documenti caricati:</p>
            <form>
            <div>
            <label>
               Modello:
               <input
                   type="text"
                   name="modelName"
                   value={formData.modelName}
                   onChange={handleInputChange}
                   placeholder="Nome"
               />
           </label>
            </div>
            <ul>
                {documents.length > 0 ? (
                    documents.map((doc) => (
                        <li key={doc.doc_id}>
                            <strong>Nome File:</strong> {doc.doc_metadata.filename}{" "}
                            <input
                                type="checkbox"
                                //insert de document in the array of selected documents
                                checked={doc.checked}  // il check è attivo se il documento è selezionato
                                //aggiungi il metodo handleChange quando viene cambiato lo stato di selezione del documento
                                onChange={()=>handleChange(doc.doc_id)}
                            />
                        </li>
                    ))
                ) : (
                    <p>Nessun documento trovato.</p>
                )}
            </ul>
            <div>
            <label>
                Description:
                <textarea
                name="description" // Deve corrispondere alla chiave nello stato
                onChange={handleInputChange}
                value={formData.description}
                />
            </label>
            </div>
            </form>
         <button onClick={postDocuments}>Seleziona documenti</button> 
        </div>
    );
};
    
    export default SelectDocuments;