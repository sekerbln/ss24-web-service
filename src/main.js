const express = require('express')
const fs = require('fs')
const app = express()

app.use(express.urlencoded({extended: true}))

app.get('/', (req, res) => {
    res.sendFile(`${__dirname}/public/index.html`)
})

app.post('/create-avatar', async (req, res) => {
    console.log(req.body);

    const avatar = {
        id: Date.now(),
        avatarName: req.body.avatarName,
        childAge: parseInt(req.body.childAge),
        skinColor: req.body.skinColor,
        hairstyle: req.body.hairstyle,
        headShape: req.body.headShape,
        upperClothing: req.body.upperClothing,
        lowerClothing: req.body.lowerClothing,
        createdAt: new Date().toISOString()
    }

    try {
        const data = await fs.readFileSync(`${__dirname}/public/avatars.json`);
        const avatars = JSON.parse(data)

        avatars.push(avatar)

        await fs.writeFileSync(`${__dirname}/public/avatars.json`, JSON.stringify(avatars))

        res.sendStatus(200)
    } catch (error) {
        res.sendStatus(500)
    }
});

app.get('/avatars', async (req, res) => {
    try {
        const data = await fs.readFileSync(`${__dirname}/public/avatars.json`);
        const avatars = JSON.parse(data);

        const htmlList = `
            <ul>
                ${avatars.map(avatar => `
                    <li>
                        <a href="/avatar/${avatar.id}">${avatar.avatarName}</a>
                    </li>
                `).join('')}
            </ul>
        `;

        res.send(htmlList)
    } catch {
        res.sendStatus(500)
    }
});

app.get('/avatar/:id', async (req, res) => {
    try {
        const data = await fs.readFileSync(`${__dirname}/public/avatars.json`);
        const avatars = JSON.parse(data);

        const avatar = avatars.find(avatar => avatar.id === parseInt(req.params.id));

        if (!avatar) {
            res.sendStatus(404)
        }

        const htmlTable = `
            <table>
                <tr>
                    <td>Avatar Name</td>
                    <td>${avatar.avatarName}</td>
                </tr>
                <tr>
                    <td>Child Age</td>
                    <td>${avatar.childAge}</td>
                </tr>
                <tr>
                    <td>Skin Color</td>
                    <td>${avatar.skinColor}</td>
                </tr>
                <tr>
                    <td>Hairstyle</td>
                    <td>${avatar.hairstyle}</td>
                </tr>
                <tr>
                    <td>Head Shape</td>
                    <td>${avatar.headShape}</td>
                </tr>
                <tr>
                    <td>Upper Clothing</td>
                    <td>${avatar.upperClothing}</td>
                </tr>
                <tr>
                    <td>Lower Clothing</td>
                    <td>${avatar.lowerClothing}</td>
                </tr>
                <tr>
                    <td>Created At</td>
                    <td>${avatar.createdAt}</td>
                </tr>
            </table>
        `;

        res.send(htmlTable);
    } catch {
        res.sendStatus(500)
    }
})

app.listen(3000, () => {
    console.log("Server running...")
})
