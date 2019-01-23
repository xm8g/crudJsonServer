import React, { Component } from 'react'
import Main from '../templates/Main'
import axios from 'axios'

const headerProps = {
    icon: 'users',
    title: 'Usuários ',
    subtitle: 'Cadastro de Usuários: Incluir, Alterar, Excluir e Listar'
}

const baseUrl = 'http://localhost:3001/users'
const initialState = {
    user: { name: '', email: '' },
    list: []
}

class UserCrud extends Component {

    state = { ...initialState }

    componentWillMount() {
        axios(baseUrl).then(resp => {
            this.setState({
                list: resp.data
            })
        })
    }

    clear() {
        this.setState( { user: initialState.user })
    }

    save() {
        const user = this.state.user
        const method = user.id ? 'put' : 'post'
        const url = user.id ? `${baseUrl}/${user.id}` : baseUrl
        axios[method](url, user).then(resp => {
            const list = this.getUpdatedList(resp.data)
            this.setState( { user: initialState.user, list })
        })
    }

    updateField(event) {
        const user = { ...this.state.user }
        user[event.target.name] = event.target.value
        this.setState({ user })
    }

    load(user) {
        this.setState({ user })
    }

    remove(user) {
        axios.delete(`${baseUrl}/${user.id}`).then(resp => {
            const list = this.state.list.filter(u => u.id !== user.id)
            this.setState({ list })
        })
    }

    renderTable() {
        return (
            <table className="table mt-4">
                <thead>
                    <tr>
                        <th>ID</th>
                        <th>Nome</th>
                        <th>Email</th>
                        <th>Ações</th>
                    </tr>
                </thead>
                <tbody>
                    {this.renderRows()}
                </tbody>
            </table>
        )
    }

    renderRows() {
        return this.state.list.map(user => {
            return (
                <tr key={user.id}>
                    <td>{user.id}</td>
                    <td>{user.name}</td>
                    <td>{user.email}</td>
                    <td>
                        <button className="btn btn-warning" onClick={() => this.load(user)}>
                            <i className="fa fa-pencil"></i>
                        </button>
                        <button className="btn btn-danger ml-2" onClick={() => this.remove(user)}>
                            <i className="fa fa-trash"></i>
                        </button>
                    </td>
                </tr>
            )
        })
    }

    renderForm() {
        return (
            <div className="form">
                <div className="row">
                    <div className="col-xs-12 col-md-6">
                        <div className="form-group">
                            <label>Nome: </label>
                            <input type="text" name="name" className="form-control" 
                                onChange={e => this.updateField(e)} value={this.state.user.name} 
                                placeholder="Digite o nome..." />
                        </div>
                    </div>
                    <div className="col-xs-12 col-md-6">
                        <div className="form-group">
                            <label>Email: </label>
                            <input type="text" name="email" className="form-control" 
                                onChange={e => this.updateField(e)} value={this.state.user.email} 
                                placeholder="Digite o email..." />
                        </div>
                    </div>
                </div>
                <hr />
                <div className="row">
                    <div className="col-12 d-flex justify-content-end">
                        <button className="btn btn-primary" onClick={e => this.save(e)}>
                            Salvar
                        </button>
                        <button className="btn btn-secondary ml-2" onClick={e => this.clear(e)}>
                            Cancelar
                        </button>
                    </div>
                </div>
            </div>
        )
    }

    getUpdatedList(user) {
        const list = this.state.list.filter(u => u.id !== user.id) //retorna nova lista anterior a atualização
        list.unshift(user) //coloca o novo user no inicio da lista
        return list
    }

    render() {
        return (
            <Main {...headerProps}>
                {this.renderForm()}
                {this.renderTable()}
            </Main>
        )
    }
}
export default UserCrud
