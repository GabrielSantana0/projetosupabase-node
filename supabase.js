require('dotenv').config();

const { createClient } = require('@supabase/supabase-js');
const fetch = require('node-fetch');

const SUPABASE_URL = process.env.SUPABASE_URL;
const SUPABASE_ANON_KEY = process.env.SUPABASE_ANON_KEY;

if (!SUPABASE_URL || !SUPABASE_ANON_KEY) {
  throw new Error('Configure SUPABASE_URL e SUPABASE_ANON_KEY no .env');
}

const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY, {
  global: { fetch },
});

// ===================== CREATE =====================
async function criarTarefa(titulo, prazo, prioridade) {
  const { data, error } = await supabase
    .from('tarefas')
    .insert([{ titulo, prazo: prazo || null, prioridade: prioridade || 'Media' }])
    .select()
    .single();

  if (error) throw error;
  return data;
}

// ================= READ (todas) =================
async function listarTarefas() {
  const { data, error } = await supabase
    .from('tarefas')
    .select('*')
    .order('criado_em', { ascending: false });

  if (error) throw error;
  return data;
}

// ===================== UPDATE — concluir =====================
async function concluirTarefa(id) {
  const { data, error } = await supabase
    .from('tarefas')
    .update({ concluida: true })
    .eq('id', id)
    .select();

  if (error) throw error;
  return data[0];
}

// ===================== DELETE =====================
async function excluirTarefa(id) {
  const { data, error } = await supabase
    .from('tarefas')
    .delete()
    .eq('id', id)
    .select();

  if (error) throw error;
  return data;
}

// ===================== UPDATE — editar =====================
async function editarTarefa(id, titulo, prazo, prioridade) {
  const { data, error } = await supabase
    .from('tarefas')
    .update({ titulo, prazo: prazo || null, prioridade })
    .eq('id', id)
    .select();

  if (error) throw error;
  return data[0];
}

module.exports = {
  supabase,
  criarTarefa,
  listarTarefas,
  concluirTarefa,
  editarTarefa,
  excluirTarefa,
};
