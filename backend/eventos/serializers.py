#Importa o modulo de serializers do Django REST framework
#ele é responsavel por transformar os dados do Models em JSON
#e também receber JSON para transformar em objetos Django
from rest_framework import serializers

#Importa models que vamos disponibilizar atraves da API
from .models import Categoria, Usuario, Evento, Interesse


#Serializer da categoria
#Converte os dados do model Categoria para JSON e vice versa
class CategoriaSerializer(serializers.ModelSerializer):
    class Meta:
        #define qual model sera utilizado
        model = Categoria

        #'__all__' significa que todos os campos do model serao disponibilizados na API
        fields = '__all__'


#Serializer do usuario, permite transformar os dados do usuario em JSON
class UsuarioSerializer(serializers.ModelSerializer):
    class Meta:
        model = Usuario
        fields = ['id', 'username', 'email', 'tipo']


#permite transformar os dados do Evento em JSON
class EventoSerializer(serializers.ModelSerializer):
    class Meta:
        model = Evento
        fields = '__all__'


#converte os dados de interesse para JSON e vice versa
class InteresseSerializer(serializers.ModelSerializer):
    class Meta:
        model = Interesse
        fields = '__all__'