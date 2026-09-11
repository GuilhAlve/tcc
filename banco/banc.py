import sqlite3
import os
from Flask import Flask, render_template, request, redirect

app = Flask(__name__, template_folder="Front")

conexao = sqlite3.connect("banco.db")
cursor = conexao.cursor()

cursor.execute("""CREATE TABLE IF NOT EXISTS usuarios (
  Id INTEGER PRIMARY KEY,
  nome TEXT NOT NULL,
  email TEXT UNIQUE NOT NULL,
  senha TEXT NOT NULL,
  cargo TEXT DEFAULT 'usuarios'
  )
""")
cursor.execute("""INSERT INTO usuarios (nome, email, senha, cargo)
                 VALUES (?,?,?,?)""", ("Guilherme", "gui@email.com", "senha123", "Admin"))

conexao.commit()

cursor.execute("SELECT * FROM usuarios")
print(cursor.fetchall())

def form_dados():
    conexao = sqlite3.connect("banco.db")
    cursor = conexao.cursor()

    nome = input("Digite seu nome")
    if nome !="":
       print("Campo preenchido, avançando...")
    else:
        print("Campo vazio")

    email = input("Digite um email")
    if email !="":
        print("Campo preenchido, avançando...")
    else:
        print("Campo vazio")

    senha = input("Crie uma senha")
    if senha !="":
        print("Campo preenchido, avançando...")
    else:
        print("Campo vazio") 
    cargo = input("Qul a sua função na empresa?")
    if cargo !="":
        print("Campo preenchido, avançando...")
    else:
         print("Campo vazio") 

    conexao.close()