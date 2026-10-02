require('dotenv').config();

const express = require('express');
const path = require('path');
const { criarTarefa, listarTarefas, concluirTarefa, editarTarefa, excluirTarefa } = require('./supabase');

const app = express();

app.use(express.json());

// Serve o frontend (index.html)
app.use(express.static(path.join(__dirname, 'public')));

// ===== GET /tarefas → lista todas =====
app.get('/tarefas', async (req, res) => {
  try {
    const dados = await listarTarefas();
    res.json(dados);
  } catch (e) {
    res.status(500).json({ erro: e.message });
  }
});

// ===== POST /tarefas → cria nova tarefa =====
app.post('/tarefas', async (req, res) => {
  try {
    const { titulo, prazo, prioridade } = req.body;
    if (!titulo) return res.status(400).json({ erro: 'Campo obrigatório: titulo' });
    const tarefa = await criarTarefa(titulo, prazo, prioridade);
    res.status(201).json(tarefa);
  } catch (e) {
    res.status(400).json({ erro: e.message });
  }
});

// ===== PATCH /tarefas/:id/concluir → marca como concluída =====
app.patch('/tarefas/:id/concluir', async (req, res) => {
  try {
    const tarefa = await concluirTarefa(req.params.id);
    res.json(tarefa);
  } catch (e) {
    res.status(400).json({ erro: e.message });
  }
});

// ===== PUT /tarefas/:id → edita tarefa =====
app.put('/tarefas/:id', async (req, res) => {
  try {
    const { titulo, prazo, prioridade } = req.body;
    if (!titulo) return res.status(400).json({ erro: 'Campo obrigatório: titulo' });
    const tarefa = await editarTarefa(req.params.id, titulo, prazo, prioridade);
    res.json(tarefa);
  } catch (e) {
    res.status(400).json({ erro: e.message });
  }
});

// ===== DELETE /tarefas/:id → apaga tarefa =====
app.delete('/tarefas/:id', async (req, res) => {
  try {
    const data = await excluirTarefa(req.params.id);
    res.json(data);
  } catch (e) {
    res.status(400).json({ erro: e.message });
  }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`API rodando em http://localhost:${PORT}`);
});
