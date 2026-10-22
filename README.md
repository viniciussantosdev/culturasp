## Backend — Cultura SP

### Tecnologias

- Python
- Django
- Django REST Framework
- Banco de dados configurado no projeto

### Como executar localmente

1. Entre na pasta `backend`.
2. Crie e ative o ambiente virtual.
3. Instale as dependências:

   ```bash
   python -m pip install -r requirements.txt
   ```

4. Aplique as migrações:

   ```bash
   python manage.py migrate
   ```

5. Carregue os dados iniciais:

   ```bash
   python manage.py loaddata dados_iniciais
   ```

6. Inicie o servidor:

   ```bash
   python manage.py runserver
   ```

### Endereços da API

| Método | Endpoint | Descrição |
|---|---|---|
| GET | `/api/eventos/` | Listar eventos |
| GET | `/api/eventos/?categoria=1` | Filtrar eventos por categoria |
| GET | `/api/categorias/` | Listar categorias |

**Endereços locais**

- Frontend React: `http://localhost:5173`
- Backend Django: `http://localhost:8000`
- API de eventos: `http://localhost:8000/api/eventos/`
- API de categorias: `http://localhost:8000/api/categorias/`

> Os endpoints documentados devem corresponder às rotas efetivamente configuradas no projeto. Confirme também o nome do parâmetro utilizado pelo filtro antes de publicar esta documentação.
