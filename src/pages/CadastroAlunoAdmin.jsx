import React, { useState } from 'react';
import Sidebar from '../components/Sidebar'; 
import HeaderAdmin from '../components/HeaderAdmin';

function CadastroAlunoAdmin() {
    const [formData, setFormData] = useState({
        nomeCompleto: '',
        dataNascimento: '',
        cpf: '',
        rg: '',
        email: '',
        telefone: '',
        endereco: '',
        numeroMatricula: '',
        senhaPadrao: '' 
    });

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        console.log('Dados do Novo Aluno:', formData);
        alert('Aluno "'+ formData.nomeCompleto +'" cadastrado com sucesso! (Simulado)');
    };
    
    // Simulação da função onLogout para evitar erros de prop
    const handleLogoutSimulado = () => console.log("Logout simulado"); 

    // O primary color da sua aplicação
    const primaryColor = '#283890'; 

    return (
        // Layout principal: Sidebar (fixa) e Conteúdo (flex)
        <div className="flex min-h-screen bg-gray-100">
            
            {/* 1. Sidebar (Componente sem Ícones) */}
            <Sidebar onLogout={handleLogoutSimulado} /> 
            
            {/* Container de Conteúdo (ocupa o resto da tela) */}
            <div className="flex-1 flex flex-col">
                
                {/* 2. Header do Admin (Componente sem Ícones) */}
                <HeaderAdmin adminName="Administrador Master" />
                
                {/* Conteúdo Principal do Formulário */}
                <main className="flex-1 p-8 overflow-y-auto">
                    
                    <div className="max-w-4xl mx-auto bg-white p-8 rounded-lg shadow-xl">
                        <h2 className="text-2xl font-bold text-gray-800 mb-6">
                            Detalhes do Novo Aluno
                        </h2>
                        
                        <form onSubmit={handleSubmit}>
                            
                            {/* Campos Pessoais e Contato (Grid de 2 colunas) */}
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
                                
                                {/* Nome Completo */}
                                <div>
                                    <label htmlFor="nomeCompleto" className="block text-sm font-medium text-gray-700 mb-1">Nome Completo</label>
                                    <input
                                        type="text"
                                        id="nomeCompleto"
                                        name="nomeCompleto"
                                        value={formData.nomeCompleto}
                                        onChange={handleChange}
                                        required
                                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm p-3 border focus:border-blue-500 focus:ring-blue-500"
                                    />
                                </div>
                                
                                {/* Data de Nascimento */}
                                <div>
                                    <label htmlFor="dataNascimento" className="block text-sm font-medium text-gray-700 mb-1">Data de Nascimento</label>
                                    <input
                                        type="date"
                                        id="dataNascimento"
                                        name="dataNascimento"
                                        value={formData.dataNascimento}
                                        onChange={handleChange}
                                        required
                                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm p-3 border focus:border-blue-500 focus:ring-blue-500"
                                    />
                                </div>
                                
                                {/* CPF */}
                                <div>
                                    <label htmlFor="cpf" className="block text-sm font-medium text-gray-700 mb-1">CPF</label>
                                    <input
                                        type="text"
                                        id="cpf"
                                        name="cpf"
                                        value={formData.cpf}
                                        onChange={handleChange}
                                        required
                                        maxLength="14"
                                        placeholder="000.000.000-00"
                                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm p-3 border focus:border-blue-500 focus:ring-blue-500"
                                    />
                                </div>

                                {/* RG */}
                                <div>
                                    <label htmlFor="rg" className="block text-sm font-medium text-gray-700 mb-1">RG</label>
                                    <input
                                        type="text"
                                        id="rg"
                                        name="rg"
                                        value={formData.rg}
                                        onChange={handleChange}
                                        required
                                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm p-3 border focus:border-blue-500 focus:ring-blue-500"
                                    />
                                </div>
                                
                                {/* Email */}
                                <div>
                                    <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">E-mail</label>
                                    <input
                                        type="email"
                                        id="email"
                                        name="email"
                                        value={formData.email}
                                        onChange={handleChange}
                                        required
                                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm p-3 border focus:border-blue-500 focus:ring-blue-500"
                                    />
                                </div>

                                {/* Telefone */}
                                <div>
                                    <label htmlFor="telefone" className="block text-sm font-medium text-gray-700 mb-1">Telefone</label>
                                    <input
                                        type="tel"
                                        id="telefone"
                                        name="telefone"
                                        value={formData.telefone}
                                        onChange={handleChange}
                                        required
                                        placeholder="(99) 99999-9999"
                                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm p-3 border focus:border-blue-500 focus:ring-blue-500"
                                    />
                                </div>
                                
                            </div>

                            {/* Endereço (Linha Completa) */}
                            <div className="mb-8">
                                <label htmlFor="endereco" className="block text-sm font-medium text-gray-700 mb-1">Endereço Completo</label>
                                <input
                                    type="text"
                                    id="endereco"
                                    name="endereco"
                                    value={formData.endereco}
                                    onChange={handleChange}
                                    required
                                    placeholder="Rua, Número, Bairro, Cidade - UF"
                                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm p-3 border focus:border-blue-500 focus:ring-blue-500"
                                />
                            </div>

                            <h3 className="text-xl font-semibold text-gray-700 mb-4 border-t pt-6">
                                Dados de Matrícula e Acesso
                            </h3>

                            {/* Matrícula e Senha (Grid de 2 colunas) */}
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
                                
                                {/* Número de Matrícula */}
                                <div>
                                    <label htmlFor="numeroMatricula" className="block text-sm font-medium text-gray-700 mb-1">Número de Matrícula</label>
                                    <input
                                        type="text"
                                        id="numeroMatricula"
                                        name="numeroMatricula"
                                        value={formData.numeroMatricula}
                                        onChange={handleChange}
                                        required
                                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm p-3 border focus:border-blue-500 focus:ring-blue-500"
                                    />
                                </div>
                                
                                {/* Senha Padrão (Provisória) */}
                                <div>
                                    <label htmlFor="senhaPadrao" className="block text-sm font-medium text-gray-700 mb-1">Senha Inicial (Provisória)</label>
                                    <input
                                        type="password"
                                        id="senhaPadrao"
                                        name="senhaPadrao"
                                        value={formData.senhaPadrao}
                                        onChange={handleChange}
                                        required
                                        placeholder="Ex: 123456"
                                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm p-3 border focus:border-blue-500 focus:ring-blue-500"
                                    />
                                </div>
                            </div>
                            
                            {/* Botão de Cadastro */}
                            <div className="pt-6 border-t mt-8">
                                <button
                                    type="submit"
                                    className={`flex w-full justify-center rounded-lg bg-[${primaryColor}] px-4 py-3 text-lg font-bold uppercase tracking-wider text-white shadow-lg transition-colors duration-200 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-600 focus:ring-offset-2`}
                                >
                                    CADASTRAR ALUNO
                                </button>
                            </div>
                        </form>
                    </div>
                </main>
            </div>
        </div>
    );
}

export default CadastroAlunoAdmin;