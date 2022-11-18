import { GithubUser } from './GithubUser.js';

// classe que vai conter a logica de dados q serao estruturados
export class Favotites{
    constructor(root){
        this.root = document.querySelector(root);
        this.load();
    }

    load(){
        this.entries = JSON.parse(localStorage.getItem('@github-favorites:')) || [] 
    }

    save(){
        localStorage.setItem('@github-favorites:', JSON.stringify(this.entries))
    }

    async add(username){
        try{

            const userExists = this.entries.find(entry => entry.login === username)

            if(userExists) {
                throw new Error("Usuario ja existente");
            }
            const user = await GithubUser.search(username);

            if(user.login === undefined){
                throw new Error('Usuario nao encontrado');
            }

            this.entries = [user, ...this.entries]
            this.update()
            this.save()

        } catch(error){
            alert(error.message)
        }
    }
    
    delete(user){
        const filteredEntries = this.entries.filter((entry) => 
            entry.login !== user.login
        )

        this.entries = filteredEntries;
        this.update()
        this.save()
    }
}
//classe que vai criar a visualizacao e eventos do html

export class FavoritesView extends Favotites{
    constructor(root){
        super(root);

        this.tbody = this.root.querySelector('table tbody')

        this.update()
        this.onAdd()
    }

    onAdd(){
        const addButton = this.root.querySelector('.search button')
        addButton.onclick = () => {
            const { value } = this.root.querySelector('.search input')

            this.add(value)
        }
    }

    update(){
        this.removeAllTr()

        this.entries.forEach((user) => {
            const row = this.createRow()

            row.querySelector('.user img').src = `https://github.com/${user.login}.png`
            row.querySelector('.user a').href = `https://github.com/${user.login}`
            row.querySelector('.user p').textContent = user.name;
            row.querySelector('.user span').textContent = user.login;
            row.querySelector('.repositories').textContent = user.public_repos;
            row.querySelector('.followers').textContent = user.followers;

            row.querySelector('.remove').onclick = () => {
                const isOk = confirm('Tem certeza que deseja deletar essa linha?');

                if(isOk){
                    this.delete(user)
                }
            }

            this.tbody.append(row)
        })

    }

    createRow(){
        const tr = document.createElement('tr');
        tr.innerHTML = `
        <td class="user">
            <img src="https://github.com/ph-souzaa.png">
            <a href="https://github.com/ph-souzaa" target="_blank">
                <p>Pedro Souza</p>
                <span>ph-souzaa</span>
            </a>
        </td>
        <td class="repositories">76</td>
        <td class="followers">20</td>
        <td><button class="remove">&times;</button></td>
        `
        return tr;
    }

    removeAllTr(){
        this.tbody.querySelectorAll('tr')
        .forEach((tr) => {
            tr.remove()
        })
    }
}