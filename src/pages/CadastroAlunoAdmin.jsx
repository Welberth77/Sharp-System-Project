import { useState } from 'react';
import Sidebar from '../components/Sidebar'; 
import HeaderAdmin from '../components/HeaderAdmin';

function CadastroAlunoAdmin({ onNavigate, showNotification }) {
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

    /**
     * CORREÇÃO: Função de Submissão que navega após o cadastro simulado
     */
    const handleSubmit = (e) => {
        e.preventDefault();
        
        console.log('Dados do Novo Aluno:', formData);

        // 1. Mostrar notificação de sucesso
        showNotification(`Aluno "${formData.nomeCompleto}" cadastrado com sucesso! Redirecionando...`, 'success');
        
        // 2. Navegar após um pequeno delay para que o usuário veja a notificação
        // Esta é a parte corrigida que garante o redirecionamento.
        setTimeout(() => {
            onNavigate('dashboard'); 
        }, 1500);
    };
    
    const primaryColor = '#283890'; 
    const inputClasses = "mt-1 block w-full rounded-lg border-gray-300 shadow-sm p-3 border focus:border-blue-500 focus:ring-blue-500 transition-shadow duration-200";
    const labelClasses = "block text-sm font-medium text-gray-700 mb-1";

    return (
        <div className="flex-1 flex flex-col">
            <main className="flex-1 p-8 overflow-y-auto">
                <div className="max-w-4xl mx-auto bg-white p-8 rounded-xl shadow-2xl">
                    <h2 className="text-3xl font-extrabold text-gray-900 mb-6 border-b pb-3">
                        Detalhes do Novo Aluno
                    </h2>
                    
                    <form onSubmit={handleSubmit}>
                        
                        <h3 className="text-xl font-semibold text-gray-700 mb-4 mt-6">Dados Pessoais e de Contato</h3>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 mb-8">
                            
                            {/* Nome Completo */}
                            <div>
                                <label htmlFor="nomeCompleto" className={labelClasses}>Nome Completo</label>
                                <input type="text" id="nomeCompleto" name="nomeCompleto" value={formData.nomeCompleto} onChange={handleChange} required className={inputClasses} />
                            </div>
                            
                            {/* Data de Nascimento */}
                            <div>
                                <label htmlFor="dataNascimento" className={labelClasses}>Data de Nascimento</label>
                                <input type="date" id="dataNascimento" name="dataNascimento" value={formData.dataNascimento} onChange={handleChange} required className={inputClasses} />
                            </div>
                            
                            {/* CPF */}
                            <div>
                                <label htmlFor="cpf" className={labelClasses}>CPF</label>
                                <input type="text" id="cpf" name="cpf" value={formData.cpf} onChange={handleChange} required maxLength="14" placeholder="000.000.000-00" className={inputClasses} />
                            </div>

                            {/* RG */}
                            <div>
                                <label htmlFor="rg" className={labelClasses}>RG</label>
                                <input type="text" id="rg" name="rg" value={formData.rg} onChange={handleChange} required className={inputClasses} />
                            </div>
                            
                            {/* Email */}
                            <div>
                                <label htmlFor="email" className={labelClasses}>E-mail</label>
                                <input type="email" id="email" name="email" value={formData.email} onChange={handleChange} required className={inputClasses} />
                            </div>

                            {/* Telefone */}
                            <div>
                                <label htmlFor="telefone" className={labelClasses}>Telefone</label>
                                <input type="tel" id="telefone" name="telefone" value={formData.telefone} onChange={handleChange} required placeholder="(99) 99999-9999" className={inputClasses} />
                            </div>
                            
                        </div>

                        {/* Endereço */}
                        <div className="mb-8">
                            <label htmlFor="endereco" className={labelClasses}>Endereço Completo</label>
                            <input type="text" id="endereco" name="endereco" value={formData.endereco} onChange={handleChange} required placeholder="Rua, Número, Bairro, Cidade - UF" className={inputClasses} />
                        </div>

                        {/* Seção de Matrícula e Acesso */}
                        <h3 className="text-xl font-semibold text-gray-700 mb-4 border-t pt-6">Dados de Matrícula e Acesso</h3>

                        {/* Matrícula e Senha */}
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 mb-8">
                            
                            {/* Número de Matrícula */}
                            <div>
                                <label htmlFor="numeroMatricula" className={labelClasses}>Número de Matrícula</label>
                                <input type="text" id="numeroMatricula" name="numeroMatricula" value={formData.numeroMatricula} onChange={handleChange} required className={inputClasses} />
                            </div>
                            
                            {/* Senha Padrão (Provisória) */}
                            <div>
                                <label htmlFor="senhaPadrao" className={labelClasses}>Senha Inicial (Provisória)</label>
                                <input type="password" id="senhaPadrao" name="senhaPadrao" value={formData.senhaPadrao} onChange={handleChange} required placeholder="Ex: 123456" className={inputClasses} />
                            </div>
                        </div>
                        
                        {/* Botão de Cadastro */}
                        <div className="pt-6 border-t mt-8">
                            <button
                                type="submit"
                                className={`flex w-full justify-center rounded-xl bg-[${primaryColor}] px-4 py-3 text-lg font-bold uppercase tracking-wider text-white shadow-lg transition-transform duration-200 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-600 focus:ring-offset-2 active:scale-[0.99]`}
                            >
                                CADASTRAR ALUNO
                            </button>
                        </div>
                    </form>
                </div>
            </main>
        </div>
    );
}

export default CadastroAlunoAdmin;