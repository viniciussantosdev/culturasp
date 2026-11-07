#Importa o modulo de serializers do Django REST framework
#ele é responsavel por transformar os dados do Models em JSON
#e também receber JSON para transformar em objetos Django
from rest_framework import serializers

#Importa models que vamos disponibilizar atraves da API
from .models import Categoria, Usuario, Evento, Interesse
from django.contrib.auth import get_user_model
from django.contrib.auth.password_validation import validate_password
from rest_framework.validators import UniqueValidator

Usuario = get_user_model()

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
        read_only_fields = ['criado_por']


#converte os dados de interesse para JSON e vice versa
class InteresseSerializer(serializers.ModelSerializer):
    class Meta:
        model = Interesse
        fields = '__all__'
        read_only_fields = ['usuario', 'data_registro']

class CadastroSerializer(serializers.ModelSerializer):
    nome = serializers.CharField(write_only=True)

    email = serializers.EmailField(
        validators=[
            UniqueValidator(
                queryset=Usuario.objects.all(),
                message="Este email já está cadastrado."
            )
        ]
    )

    senha = serializers.CharField(
        write_only=True,
        validators=[validate_password]
    )

    class Meta:
        model = Usuario
        fields = ['nome', 'email', 'senha']

    def create(self, validated_data):
        nome = validated_data.pop('nome')
        email = validated_data['email']

        usuario = Usuario(
            username=email,
            email=email,
            first_name=nome,
            tipo=Usuario.Tipo.VISITANTE
        )

        usuario.set_password(validated_data['senha'])
        usuario.save()

        return usuario