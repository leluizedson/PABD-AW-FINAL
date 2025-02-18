import asyncpg
from fastapi import FastAPI
import psycopg2
from pydantic import BaseModel


conn = psycopg2.connect(
    dbname="Sistema_de_prisao",
    user="postgres",
    password="SQL",
    host="localhost",
    port="5432"
)

cur = conn.cursor()


for i in range(1):
    id_preso = (input('Informe o id do preso: '))
    nome = (input('Informe o nome do preso: '))
    data_nasc = (input('Informe a data de nascimento do preso: '))
    sexo = (input('Informe o sexo do preso: '))
    tempo_pena = (input('Informe o tempo de pena do preso: '))
    estado = (input('Informe o estado do preso: '))

    cur.execute("""
        INSERT INTO preso (id_preso, nome, data_nasc, sexo, tempo_pena, estado)
        VALUES (%s, %s, %s, %s, %s, %s)
    """, (id_preso, nome, data_nasc, sexo, tempo_pena, estado))

conn.commit()

print("Dados inseridos com sucesso!")

cur.close()
conn.close()

app = FastAPI()

async def get_db_connection():
    return await asyncpg.connect(
        user="postgres",
        password="SQL",
        database="Sistema_de_prisao",
        host="localhost"
    )

@app.get("/")
async def home():
    return {"message": "Página principal funcionando!"}

@app.get("/test")
async def test_connection():
    conn = await get_db_connection()
    await conn.close()
    return {"message": "Conexão com oPostgreSQL bem-sucedida!"}

@app.get("/preso{id_preso}")
async def get_actors():
    conn = await get_db_connection()
    rows = await conn.fetch("SELECT * FROM preso")
    await conn.close()
    presos = []
    for row in rows:
       presos.append(f"ID do preso: {row['id_preso']}, "
              f"Nome: {row['nome']}, "
              f"Estado: {row['estado']}")
    return {"users": presos}

class preso(BaseModel):
    id_preso: int
    nome: str
    data_nasc: int
    sexo: str 
    tempo_pena: int 
    estado: bool

@app.post("/preso")
async def create_preso(preso: preso):
    conn = await get_db_connection()
    await conn.execute(
        "INSERT INTO preso (id_preso, nome, data_nasc, sexo, tempo_pena, estado) VALUES ($1, $2, $3, $4, $5, $6)",
        preso.id_preso, preso.nome, preso.data_nasc, preso.sexo, preso.tempo_pena, preso.estado
    )
    await conn.close()
    return {"message": "Ator criado com sucesso!"}