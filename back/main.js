import express, { response } from "express";
import { readFile } from "../data/index.js";
import cors from "cors";

const app = express();
app.use(express.json());
app.use(cors());

//endP
app.get("/possession",(async(request,reponse) =>{
    reponse.send (await readFile("./data.json"))
}))

app.get("/possession/:libelle",(async(request,reponse) =>{
    const { libelle } = request.params;
    const { dateFin } = request.body;
    const data = await readFile("./data.json");
    const possessions = data.data[1].data.possessions;
    const possession = possession.find(p => p.libelle ===libelle);

}))
/*
app.get("/patrimoine/:valeur",(async(request,reponse) =>{
    const valeur = request.params.valeur
    const data = await readFile ("./data.json")


    const possessions = data.data[1].data.possessions 
    const filtrerPossession = ()=>{
        return possessions.filter((valeur) => possessions.valeur <= valeur)
    }
    reponse.send(filtrerPossession())
}))

app.post("/newvalue",(async(request,reponse) =>{
    const body = request.body
    reponse.send(body)
}))


app.listen(3000,() =>{
    console.log("je teste")
})
    */
app.put("/possession/:libelle", async (request,reponse) => {
    const { libelle } = request.params;
    const { dateFin } = request.body;
    const data = await readFile("./data.json");
    const possessions = data.data[1].data.possessions;
    const possession = possessions.find(p => p.libelle === libelle);

    if (possession) {
        possession.dateFin = dateFin;
        await writeFile("./data.json", data);
        reponse.json(possession);
    } else {
        reponse.status(404).json({ error: 'Possession not found' });
    }
});

app.post("/possession", async (request,reponse) => {
    const { libelle, valeur, dateDebut, dateFin, taux } = request.body;
    const data = await readFile("./data.json");
    const possessions = data.data[1].data.possessions;
    const newPossession = { libelle, valeur, dateDebut, dateFin, taux };
    possessions.push(newPossession);
    await writeFile("./data.json", data);
    reponse.status(201).json(newPossession);
});

app.get("/patrimoine/range", async (request,reponse) => {
    const { dateDebut, dateFin, jour, type } = request.query; 

    const data = await readFile("./data.json");
    const possessions = data.data[1].data.possessions;

    const filteredPossessions = possessions.filter(p => {
        const isInRange = new Date(p.dateDebut) >= new Date(dateDebut) &&
            new Date(p.dateFin) <= new Date(dateFin);
        return isInRange;
    });

    const totalValue = filteredPossessions.reduce((sum, p) => sum + p.valeur, 0);
    reponse.json({ totalValue });
});

app.put("/possession/:libelle/close", async (request,reponse) => {
    const { libelle } = request.params;
    const currentDate = new Date().toISOString();

    const data = await readFile("./data.json");
    const possessions = data.data[1].data.possessions;
    const possession = possessions.find(p => p.libelle === libelle);

    if (possession) {
        possession.dateFin = currentDate;
        await writeFile("./data.json", data);
        reponse.json(possession);
    } else {
        reponse.status(404).json({ error: 'Possession not found' });
    }
});

app.get("/patrimoine/:valeur", async (request,reponse) => {
    const { valeur } = request.params;

    const data = await readFile("./data.json");
    const possessions = data.data[1].data.possessions;
    const filteredPossessions = possessions.filter(p => p.valeur <= parseFloat(valeur));
    reponse.json(filteredPossessions);
});

app.post("/newValue", async (request,reponses) => {
    const body = request.body;
    reponses.status(201).json(body);
});

app.listen(3000, () => {
    console.log("Server running on port 3000");
});
