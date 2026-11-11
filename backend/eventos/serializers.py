from rest_framework import serializers
from django.contrib.auth import get_user_model

from .models import Categoria, Evento, Interesse

Usuario = get_user_model()


class CadastroSerializer(serializers.Serializer):
    nome = serializers.CharField(max_length=150)
    email = serializers.EmailField()
    senha = serializers.CharField(write_only=True)

    def validate_email(self, value):
        if Usuario.objects.filter(email=value).exists():
            raise serializers.ValidationError(
                'Este email já está cadastrado.'
            )
        return value

    def create(self, validated_data):
        nome = validated_data['nome']
        email = validated_data['email']
        senha = validated_data['senha']

        usuario = Usuario(
            username=email,
            email=email,
            first_name=nome,
            tipo=Usuario.Tipo.VISITANTE
        )

        usuario.set_password(senha)
        usuario.save()

        return usuario


class UsuarioSerializer(serializers.ModelSerializer):
    class Meta:
        model = Usuario
        fields = ['id', 'first_name', 'email', 'tipo']


class CategoriaSerializer(serializers.ModelSerializer):
    class Meta:
        model = Categoria
        fields = '__all__'


class EventoSerializer(serializers.ModelSerializer):
    class Meta:
        model = Evento
        fields = '__all__'


class InteresseSerializer(serializers.ModelSerializer):
    class Meta:
        model = Interesse
        fields = '__all__'
        read_only_fields = ['usuario', 'data_registro']
