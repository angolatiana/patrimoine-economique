import express from "express";
import { readFile } from "../data/index.js";

const app = express()
//endP
app.get("/possession",(async(request,reponse) =>{
    reponse.send (await readFile("./data.json"))
}))


app.listen(3000,() =>{
    console.log("je teste")
})