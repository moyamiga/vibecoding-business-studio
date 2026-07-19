# TempleFall Unity Bot Prototype

Este paquete es una base profesional para la IA de bots de TempleFall en Unity.
No reemplaza el proyecto Phaser actual; sirve como preparacion para una futura
migracion o prototipo 3D.

## Objetivo

Crear bots exploradores que puedan:

- Buscar loot.
- Equiparse.
- Detectar enemigos.
- Disparar.
- Curarse.
- Huir de la vegetacion.
- Moverse hacia zona segura.
- Intentar objetivos del templo.

## Como usar en Unity

1. Crear un proyecto 3D en Unity.
2. Copiar la carpeta `Assets/TempleFall/Scripts` dentro del proyecto Unity.
3. Crear un GameObject para el bot.
4. Agregar estos componentes:
   - `TempleFallBotController`
   - `BotPerception`
   - `BotMovement`
   - `BotCombat`
   - `BotLooting`
   - `BotSafeZoneAwareness`
5. Asignar un `TempleFallBotProfile` al controlador.

## Nota

Estos scripts estan pensados como arquitectura inicial. No se han compilado en
Unity desde esta sesion porque Unity no esta instalado aqui.

