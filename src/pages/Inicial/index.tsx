import { useState, useEffect } from 'react';
import { Box, Container, Typography, Stack, Avatar, Divider, Button, TextField } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import api from '../../services/api';

export default function InicioPage() {
  const navigate = useNavigate();

  // 1. Estados da Tela
  const [editando, setEditando] = useState(false); // Controla se estamos no modo de edição
  
  // O estado 'usuario' guarda os dados originais e oficiais
  const [usuario, setUsuario] = useState(() => {
    const dadosSalvos = localStorage.getItem('usuario');
    if (dadosSalvos) {
      return JSON.parse(dadosSalvos);
    }
    return { id: '', nome: '', email: '', senha: '' };
  });

  // O estado 'dadosEdicao' funciona como um "rascunho" enquanto a pessoa digita
  const [dadosEdicao, setDadosEdicao] = useState({ id: '', nome: '', email: '', senha: '' });

  // 2. Segurança da Rota
  useEffect(() => {
    const dadosSalvos = localStorage.getItem('usuario');
    if (!dadosSalvos) {
      navigate('/login');
    }
  }, [navigate]);

  // 3. Funções de Ação
  const handleSair = () => {
    localStorage.removeItem('usuario');
    navigate('/login');
  };

  const iniciarEdicao = () => {
    setDadosEdicao(usuario); // Copia os dados oficiais para o rascunho
    setEditando(true);       // Ativa o modo de edição
  };

  const cancelarEdicao = () => {
    setEditando(false); // Apenas fecha o modo de edição sem salvar
  };

  const salvarEdicao = async () => {
    try {
      // Faz o PUT para a API passando o ID na URL e o rascunho no corpo
      const resposta = await api.put(`/api/Cadastros/editar/${usuario.id}`, dadosEdicao);

      if (resposta.status === 200) {
        // Se a API confirmar o salvamento, atualizamos os dados oficiais
        setUsuario(resposta.data);
        localStorage.setItem('usuario', JSON.stringify(resposta.data)); // Atualiza a gaveta
        setEditando(false); // Fecha o modo de edição
        alert("Dados atualizados com sucesso!");
      }
    } catch (error) {
      console.error(error);
      alert("Erro ao atualizar os dados. Verifique a conexão com o servidor.");
    }
  };

  return (
    <Container 
      maxWidth="sm" 
      sx={{ 
        minHeight: '100vh', 
        display: 'flex', 
        alignItems: 'center', 
        justifyContent: 'center' 
      }}
    >
      <Box
        sx={{
          bgcolor: 'background.paper',
          borderRadius: 2,
          boxShadow: 3,
          p: 4,
          width: '100%',
          display: 'flex',
          flexDirection: 'column',
          gap: 3,
        }}
      >
        {/* CABEÇALHO */}
        <Stack direction="row" spacing={1} alignItems="center">
          <Avatar sx={{ width: 64, height: 64, bgcolor: 'primary.main' }}>
            {usuario.nome ? usuario.nome.charAt(0).toUpperCase() : 'U'} 
          </Avatar>
          <Box> 
            <Typography variant="h5" component="h1" fontWeight="bold" sx={{textAlign: "left"}}>
              Olá, {usuario.nome || 'Usuário'}!
            </Typography>
            <Typography variant="body2" color="text.secondary">
              {editando ? "Atualize suas informações abaixo" : "Seus dados cadastrais"}
            </Typography>
          </Box>
        </Stack>

        <Divider />

        {/* CORPO: Alterna entre Texto puro (Visualizar) e TextFields (Editar) */}
        <Stack spacing={2}>
            <Box>
                <Typography variant="caption" color="text.secondary">Nome:</Typography>
                {editando ? (
                  <TextField size="small" fullWidth value={dadosEdicao.nome} onChange={(e) => setDadosEdicao({...dadosEdicao, nome: e.target.value})} />
                ) : (
                  <Typography variant="body1" fontWeight="500">{usuario.nome}</Typography>
                )}
            </Box>

            <Box>
                <Typography variant="caption" color="text.secondary">Email:</Typography>
                {editando ? (
                  <TextField size="small" fullWidth type="email" value={dadosEdicao.email} onChange={(e) => setDadosEdicao({...dadosEdicao, email: e.target.value})} />
                ) : (
                  <Typography variant="body1" fontWeight="500">{usuario.email}</Typography>
                )}
            </Box>

            <Box>
                <Typography variant="caption" color="text.secondary">Senha:</Typography>
                {editando ? (
                  <TextField size="small" fullWidth type="text" value={dadosEdicao.senha} onChange={(e) => setDadosEdicao({...dadosEdicao, senha: e.target.value})} />
                ) : (
                  <Typography variant="body1" fontWeight="500">{usuario.senha || '********'}</Typography>
                )}
            </Box>   
        </Stack>

        {/* BOTÕES: Alternam dependendo do modo */}
        <Stack direction="row" spacing={2} justifyContent="flex-end" sx={{ mt: 2 }}>
          {editando ? (
            <>
              <Button variant="text" color="inherit" onClick={cancelarEdicao}>Cancelar</Button>
              <Button variant="contained" color="success" onClick={salvarEdicao}>Salvar Alterações</Button>
            </>
          ) : (
            <>
              <Button variant="outlined" color="primary" onClick={handleSair} sx={{ mr: 'auto' }}>Sair</Button>
              <Button variant="contained" color="primary" onClick={iniciarEdicao}>Editar Perfil</Button>
            </>
          )}
        </Stack>

      </Box>
    </Container>
  );
}