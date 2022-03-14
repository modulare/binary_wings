flowchart TB

    intestazione[ NOME DI QUESTO SCHEMA: CaLIS_00 <br> TIPO: diagramma Mermaid https://mermaid-js.github.io/mermaid/#/flowchart <br> File:  generato da CaLIS_00.md , rappresentato da CaLIS_00.gif <br> PROTOTIPO: <br> DATA: <br> AUTORE:]
    -.-
    cli_System[CaLIS<br>Comparison and Linguistic Interchange System]
    cli_Format[CaLIF<br>Comparison and Linguistic Interchange Format]
    cli_Tool[CaLIT<br>Comparison and Linguistic Interchange Tool]
    cli_Raw[CaLIR<br>Comparison and Linguistic Interchange Raw]
    cli_System ---> cli_Format
    cli_System ---> cli_Tool
    cli_System ---> cli_Raw
    
    subgraph File[file di dati linguistici omologati]
        subgraph h[header]
            h1[tipo di schema]
            h2[tag...]
            h3[tag fine header]
            h1-->h2
            h2-->h3
        end
        subgraph s["stringa linguistica"]
            s1[id]
            s2[tag]
            s3[stringa]
            s1-->s2
            s2-->s3
        end
        h -----> s
    end

    subgraph Format[regole di formattazione]
        f1[formali]
        f2[informativi <br> metadati]
        f3[qualitativi <br> da 0 a n]
        f4[procedurali <br> script o riferimenti a tool sw]
        f5[riferimenti a  <br> risorse multimediali]
        databaseTag[(tag)]
        databaseTag <--- f1
        databaseTag <--- f2
        databaseTag <--- f3
        databaseTag <--- f4
        databaseTag <--- f5
        databaseTag--> databaseSchemi
        databaseSchemi[(schemi)]
    end

    subgraph Exp[esportazione]
        ExpCar[cartella di esportazione]
        tabulare
        stampa
        mm[materiale multimediale]
        fw[formati per WEB]
        ExpCar --> tabulare
        ExpCar --> stampa
        ExpCar --> mm
        ExpCar --> fw
    end

    cli_Format--->File
    cli_Format--->Format
    cli_Format--->Exp

    subgraph Tool[strumenti di elaborazione]
       traslitterazioni
       comparazioni
       aee[analisi ed estrapolazioni] 
       ge[gestione eccezioni]
       OCR
       geometrizzazioni
       visualizzazioni
      
    end

    cli_Tool--->Tool

    subgraph Raw[dati non integrati]
        AtlantiDigitalizzati
        AtlantiRasterizzati
        AtlantiCartacei
        BancheDatiDiMetadati 
        ContenutiMultimediali
        AltroMateriale
    end

    cli_Raw--->Raw

    databaseTag ---> File
    databaseSchemi ---> File