import asyncpg
from fastapi import FastAPI
import psycopg2
from pydantic import BaseModel
from datetime import date

conn = psycopg2.connect(
    dbname="Sistema_de_prisao",
    user="postgres",
    password="SQL",
    host="localhost",
    port="5432"
)

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

@app.get("/preso/{idpreso}")
async def get_preso():
    conn = await get_db_connection()
    rows = await conn.fetch("SELECT * FROM preso")
    await conn.close()
    presos = []
    for row in rows:
       presos.append(f"ID do preso: {row['idpreso']}, "
              f"Nome: {row['nome']}, "
              f"Estado: {row['estado']}")
    return {"users": presos}

class Preso(BaseModel):
    idpreso: int
    nome: str
    datanacs: date
    sexo: str 
    tempopena: int 
    estado: bool

@app.post("/preso")
async def create_preso(preso: Preso):
    conn = await get_db_connection()
    await conn.execute(
        "INSERT INTO preso (idpreso, nome, datanacs, sexo, tempopena, estado) VALUES ($1, $2, $3, $4, $5, $6)",
        preso.idpreso, preso.nome, preso.datanacs, preso.sexo, preso.tempopena, preso.estado
    )
    await conn.close()
    return {"message": "Preso criado com sucesso!"}

class presoUpdate(BaseModel):
    nome: str
    datanacs: date
    tempopena: int
    estado: bool

@app.put("/preso/{idpreso}")
async def update_preso(idpreso: int, preso: presoUpdate):
    conn = await get_db_connection()
    result = await conn.execute(
        """
            UPDATE preso
            SET nome = $1, datanacs = $2, tempopena = $3, estado = $4
            WHERE idpreso = $5
        """,
        preso.nome, preso.datanacs, preso.tempopena, preso.estado, idpreso
    )
    await conn.close()
    if result == "UPDATE 1":
        return {"message": f"presos atualizados com sucesso! ID do preso: {idpreso}"}
    else:
        return {"message": "Preso não foi atualizado"}
    
@app.delete("/preso/{idpreso}")
async def delete_preso(idpreso: int):
    conn = await get_db_connection()
    result = await conn.execute("DELETE FROM preso WHERE idpreso = $1", idpreso)
    await conn.close()
    if result == "DELETE 1":
        return {"message": f"Preso deletado com sucesso! ID do ator: {idpreso}"}
    else:
        return {"message": "Preso não foi deletado"}