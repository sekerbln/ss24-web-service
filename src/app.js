import express from "express"
import path from 'path';
import { fileURLToPath } from 'url';
import * as fs from "fs";

// const __filename = fileURLToPath(import.meta.url);
// const __dirname = path.dirname(__filename);
const __dirname = '.';

const app = express()


app.use(express.static(path.join(__dirname, 'public')))
app.use(express.json())
app.get('/', function (req, res) {
    res.sendFile(`index.html`)
})

app.post('/api/avatars', (req, res)=>{
    console.log(" POST /api/avatars")
    let newAvatar = req.body
    newAvatar = {
        id: Date.now(),
        ...newAvatar,
        createdAt: new Date(Date.now()).toISOString()
    }

    try {
        const obj =  JSON.parse(fs.readFileSync(`${__dirname}/avatars.json`, "utf8"))

        fs.writeFileSync(`${__dirname}/avatars.json`, JSON.stringify([...obj, newAvatar]))
        res.status(201).set("Location", `/api/avatars/${newAvatar.id}`).send(newAvatar)
    }catch (e){
        res.sendStatus(500)
    }
})

app.get("/api/avatars", (req, res)=>{
    console.log(" GET /api/avatars")
    const avatarsArray =  JSON.parse(fs.readFileSync(`${__dirname}/avatars.json`, "utf8"))
    res.send(avatarsArray)
})

app.get("/api/avatars/:id", (req, res)=>{
    const avatarID = parseInt(req.params.id)
    console.log(` GET /api/avatars/:${avatarID}`)
    const avatarsArray =  JSON.parse(fs.readFileSync(`${__dirname}/avatars.json`, "utf8"))
    const avatar = avatarsArray.find((av)=>av.id===avatarID)
    if(!avatar)
        res.sendStatus(404)
    else
        res.send(avatar)
})

app.put("/api/avatars/:id", (req, res)=>{
    const avatarID = parseInt(req.params.id)
    const updateParams = req.body
    console.log(updateParams)
    console.log(` PUT /api/avatars/:${avatarID}`)
    const avatarsArray =  JSON.parse(fs.readFileSync(`${__dirname}/avatars.json`, "utf8"))
    const avatar = avatarsArray.find((av)=>av.id===avatarID)
    if(!avatar)
        res.sendStatus(404)
    else{
        avatarsArray[avatarsArray.indexOf(avatar)] = {...avatar, ...updateParams}
        fs.writeFileSync(`${__dirname}/avatars.json`, JSON.stringify(avatarsArray), (err) => {
            if (err) {
                console.log("ERROR")
            }
        })
        res.sendStatus(204)
    }

})

app.delete("/api/avatars/:id", (req, res)=>{
    const avatarID = parseInt(req.params.id)
    console.log(` DELETE /api/avatars/:${avatarID}`)
    const avatarsArray =  JSON.parse(fs.readFileSync(`${__dirname}/avatars.json`, "utf8"))
    const avatar = avatarsArray.findIndex((av)=>av.id===avatarID)
    if(avatar===-1)
        res.sendStatus(404)
    else{
        avatarsArray.splice(avatar, 1)
        fs.writeFileSync(`${__dirname}/avatars.json`, JSON.stringify(avatarsArray), (err) => {
            if (err) {
                console.log("ERROR")
            }
        })
        res.sendStatus(204)
    }

})

export default app;
