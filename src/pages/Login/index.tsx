import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../../services/api';
import axios from 'axios';
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

export default function LoginPage() {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [senha, setSenha] = useState('');
  const [openModal, setOpenModal] = useState(false);

  const handleLogin = async () => {
    try {
      const dadosParaMudar = {
        email: email,
        senha: senha,
      };

      const resposta = await api.post('/api/Cadastros/login', dadosParaMudar);

      if (resposta.status === 200 || resposta.status === 201) {
        localStorage.setItem('usuario', JSON.stringify(resposta.data));
        setOpenModal(true);
      }

    } catch (error) {
      if (axios.isAxiosError(error)) {
        if (error.response && error.response.status === 401) {
          alert("Email ou senha inválidos!");
        } else {
          alert("Erro no servidor. Verifique a API.");
        }
      } else {
        console.error("Erro inesperado:", error);
        alert("Erro ao conectar com o servidor.");
      }
    }
  }

  const handleFecharModal = () => {
    setOpenModal(false);
  };

  const handleIrParaInicio = () => {
    setOpenModal(false);
    navigate('/inicial');
    console.log("Indo para a tela inicial...");
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
          Login
        </Typography>

        {/* Campos reduzidos apenas para Email e Senha */}
        <TextField fullWidth label="Email" variant="outlined" type="email" value={email} onChange={(e) => setEmail(e.target.value)} />
        <TextField fullWidth label="Senha" variant="outlined" type="password" value={senha} onChange={(e) => setSenha(e.target.value)} />

        <Stack direction="row" justifyContent="center">
          <Button variant="contained" color="primary" onClick={handleLogin}>
            Entrar
          </Button>
        </Stack>
      </Box>

      {/* --- TEXTO INFERIOR PARA QUEM NÃO TEM CONTA --- */}
      <Stack direction="row" spacing={1} justifyContent="center" sx={{ mt: 3 }}>
        <Typography variant="body1" color="text.secondary">
          Não tem uma conta?
        </Typography>
        <Typography
          variant="body1"
          color="primary"
          fontWeight="bold"
          onClick={() => navigate('/cadastro')} // Redireciona para o Cadastro
          sx={{
            cursor: 'pointer',
            textDecoration: 'underline',
            '&:hover': { opacity: 0.8 }
          }}
        >
          Cadastre-se
        </Typography>
      </Stack>

      {/* --- CÓDIGO DO MODAL DE SUCESSO --- */}
      <Dialog
        open={openModal}
        onClose={handleFecharModal}
      >
        <DialogTitle>
          Bem-vindo de volta!
        </DialogTitle>

        <DialogContent>
          <DialogContentText>
            Seu login foi realizado com sucesso. Deseja prosseguir para a tela inicial?
          </DialogContentText>
        </DialogContent>

        <DialogActions sx={{ justifyContent: "center", marginBottom: 1 }}>
          <Button variant="contained" color="primary" onClick={handleIrParaInicio} autoFocus>
            Entrar no Sistema
          </Button>
        </DialogActions>
      </Dialog>
      {/* --- FIM DO MODAL --- */}

    </Container>
  );
}