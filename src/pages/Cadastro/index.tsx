import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../../services/api';
import { 
  Box, 
  Container, 
  Typography, 
  TextField, 
  Button, 
  Stack, 
  Dialog, 
  DialogTitle, 
  DialogContent, 
  DialogContentText, 
  DialogActions 
} from '@mui/material';

export default function CadastroPage() {
  const [nome, setNome] = useState('');
  const [email, setEmail] = useState('');
  const [senha, setSenha] = useState('');

  const handleEnviar = async () => { 
    try {
      const url = 'https://localhost:7151/api/Cadastros/registrar';
      
      const dadosParaEnviar = {
        nome: nome,
        email: email,
        senha: senha
      };

      const resposta = await api.post(url, dadosParaEnviar);

      if (resposta.status === 200 || resposta.status === 201) {
        setOpenModal(true);
      }
    } catch (error) {
      console.error("Erro na conexão:", error);
      alert("Não foi possível conectar á API")
    }
  };

  const navigate = useNavigate();

 
  const [openModal, setOpenModal] = useState(false);

  const handleFecharModal = () => {
    setOpenModal(false);
  };

  const handleIrParaLogin = () => {
    setOpenModal(false); 
    navigate('/login');  
  };

  return (
    <Container 
      maxWidth="sm" 
      sx={{ 
        minHeight: '100vh', 
        display: 'flex', 
        flexDirection: 'column',
        justifyContent: 'center' 
      }}
    >
      {/* --- CARTÃO PRINCIPAL --- */}
      <Box
        sx={{
          bgcolor: 'background.paper',
          borderRadius: 2,
          boxShadow: 3,
          display: 'flex',
          flexDirection: 'column',
          gap: 3,
          p: 4,
        }}
      >
        <Typography variant="h5" component="h1" align="center" gutterBottom>
          Cadastro
        </Typography>

        <TextField fullWidth label="Nome Completo" variant="outlined" value={nome} onChange={(e) => setNome(e.target.value)}/>
        <TextField fullWidth label="Email" variant="outlined" type="email" value={email} onChange={(e) => setEmail(e.target.value)}/>
        {/* Adicionei type="password" aqui para os caracteres ficarem ocultos (***) */}
        <TextField fullWidth label="Senha" variant="outlined" type="password" value={senha} onChange={(e) => setSenha(e.target.value)} />

        <Stack direction="row" justifyContent="center">
          <Button variant="outlined" color="primary" onClick={handleEnviar}>
            Cadastrar
          </Button>
        </Stack>
      </Box>

      {/* --- TEXTO INFERIOR PARA QUEM JÁ TEM CONTA --- */}
      <Stack direction="row" spacing={1} justifyContent="center" sx={{ mt: 3 }}>
        <Typography variant="body1" color="text.secondary">
          Já está cadastrado?
        </Typography>
        <Typography 
          variant="body1" 
          color="primary" 
          fontWeight="bold"
          onClick={() => navigate('/login')}
          sx={{ 
            cursor: 'pointer', 
            textDecoration: 'underline', 
            '&:hover': { opacity: 0.8 } 
          }}
        >
          Logar
        </Typography>
      </Stack>

      {/* --- CÓDIGO DO MODAL (Fica invisível até clicar em Cadastrar) --- */}
      <Dialog 
        open={openModal} 
        onClose={handleFecharModal} // Fecha se o usuário clicar fora da caixa branca
      >
        <DialogTitle>
          Cadastro Realizado!
        </DialogTitle>
        
        <DialogContent>
          <DialogContentText>
            Seus dados foram registrados com sucesso. O que você deseja fazer agora?
          </DialogContentText>
        </DialogContent>
        
        <DialogActions sx={{justifyContent: "center", marginBottom: 1}}>
          <Button variant="contained" color="primary" onClick={handleIrParaLogin} sx={{justifyContent: "center"}} autoFocus>
            Ir para Login
          </Button>
        </DialogActions>
      </Dialog>
      {/* --- FIM DO MODAL --- */}

    </Container>
  );
}