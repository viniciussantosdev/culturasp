from django.contrib.auth.models import AbstractUser
from django.conf import settings
from django.db import models


class Categoria(models.Model):
    nome = models.CharField(max_length=100)

    def __str__(self):
        return self.nome


class Usuario(AbstractUser):
    class Tipo(models.TextChoices):
        VISITANTE = "visitante", "Visitante"
        ADMINISTRADOR = "administrador", "Administrador"

    tipo = models.CharField(
        max_length=20,
        choices=Tipo.choices,
        default=Tipo.VISITANTE
    )

    def __str__(self):
        return self.username


class Evento(models.Model):
    titulo = models.CharField(max_length=200)
    data = models.DateField()
    horario = models.TimeField()
    local = models.CharField(max_length=200)
    descricao = models.TextField()
    gratuito = models.BooleanField(default=False)

    categorias = models.ManyToManyField(Categoria)

    criado_por = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        on_delete=models.CASCADE,
        related_name="eventos_criados"
    )

    def __str__(self):
        return self.titulo


class Interesse(models.Model):
    usuario = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        on_delete=models.CASCADE,
        related_name="interesses"
    )

    evento = models.ForeignKey(
        Evento,
        on_delete=models.CASCADE,
        related_name="interesses"
    )

    data_registro = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"{self.usuario} - {self.evento}"
