import express from 'express';
import { uuid, isUuid } from 'uuidv4';

const app = express();

app.use(express.json());

const projects = [];

// Middlewares
function logRequest(req, res, next) {
  const { method, url } = req;
  const logLabel = `[${method.toUpperCase()}] ${url}`;
  console.log(logLabel);
  return next();
}

function validateId(req, res, next) {
  const { id } = req.params;
  if (!isUuid(id)) {
    return res.status(401).json({ error: 'ID is invalid' });
  }
  return next();
}
app.use(logRequest);
app.use('/projects/:id', validateId);

// Listar todos os projetos
app.get('/projects', (req, res) => {
  return res.json(projects);
});

// criar novo projeto
app.post('/projects', (req, res) => {
  const { title, owner } = req.body;
  const project = { id: uuid(), title, owner };
  projects.push(project);

  return res.json(project);
});

// atualizar projeto
app.put('/projects/:id', (req, res) => {
  const { id } = req.params;
  const { title, owner } = req.body;
  const projectIndex = projects.findIndex((project) => project.id === id);
  if (projectIndex < 0) {
    return res.status(401).json({ error: 'Project not found!' });
  }
  const project = { id, title, owner };
  projects[projectIndex] = project;

  return res.json(project);
});

// deletar projeto
app.delete('/projects/:id', (req, res) => {
  const { id } = req.params;
  const projectIndex = projects.findIndex((project) => project.id === id);
  if (projectIndex < 0) {
    return res.status(401).json({ error: 'Project not found' });
  }
  projects.splice(projectIndex, 1);

  return res.json({ sucess: 'Project removed' });
});

app.listen(3333);
