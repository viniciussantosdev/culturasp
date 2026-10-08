#Importa o modulo de serializers do Django REST framework
#ele é responsavel por transformar os dados do Models em JSON
#e também receber JSON para transformar em objetos Django
from rest_framework import serializers

#Importa models que vamos disponibilizar atraves da API
from . models import Categoria, Usuario, Evento, Interesse


#Serializer da categoria
#Converte os dados do model Categoria para JSON e vice versa
class CategoriaSerializer(serializers.ModelSerializer):
    class meta:
        #define qual model sera utilizado
        model = Categoria

        #'__all__' significa que todos os campos do model serao disponibilizados na API
        fields = '__all__'



#Serializer do usuario, permite transformar os dados do usuario em JSON
        class UsuarioSerializer(serializers.ModelSerializer):
            class Meta:
                model = Usuario
                fields = '__all__'

#permite transformar os dados do Evento em JSON
        class EventosSerializer(serializers.ModelSerializer):
            class meta:
                model = Evento
                fields = '__all__'
#converte os dados de interesse para JSON e vice versa
        class InteresseSerializers(serializers.ModelSerializer):
            class meta:
                model = Evento
                fields = '__all__'


        