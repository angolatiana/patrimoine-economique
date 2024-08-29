import express, { response } from "express";
import { readFile } from "../data/index.js";
import cors from "cors";

const app = express()
app.use(express.json())

//endP
app.get("/possession",(async(request,reponse) =>{
    reponse.send (await readFile("./data.json"))
}))

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