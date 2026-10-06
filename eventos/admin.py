from django.contrib import admin
from .models import Evento, Categoria, Interesse

admin.site.register(Evento)
admin.site.register(Categoria)
admin.site.register(Interesse)