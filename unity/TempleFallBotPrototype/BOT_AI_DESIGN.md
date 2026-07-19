# TempleFall Bot AI Design

## Objetivo profesional

Los bots de TempleFall no deben ser perfectos. Deben hacer que el mapa se sienta
vivo y que el jugador tenga presion mientras se prueba la Vertical Slice 0.1.

## Estados principales

| Estado | Proposito |
|---|---|
| SearchingLoot | Conseguir arma, municion y curacion |
| Patrolling | Moverse por el mapa cuando no hay amenaza |
| MovingToSafeZone | Escapar de la vegetacion |
| EngagingEnemy | Atacar si ve enemigo |
| TakingCover | Buscar proteccion si esta en peligro |
| Healing | Curarse cuando tiene item |
| Retreating | Huir cuando esta en muy baja vida |
| PushingTempleObjective | Ir por misiones del templo |

## Reglas de decision

El bot decide en este orden:

1. Si esta fuera de zona, moverse a zona segura.
2. Si tiene vida critica, curarse o retirarse.
3. Si ve enemigo, atacar o cubrirse.
4. Si no tiene arma o ve loot util, buscar loot.
5. Si le interesa el templo, intentar objetivo.
6. Si no hay urgencia, patrullar.

Este orden evita bots tontos que se quedan peleando mientras la vegetacion los
mata.

## Perfiles de dificultad

### Easy

- Reacciona lento.
- Falla mas disparos.
- Se cubre poco.
- Sirve para jugadores nuevos.

### Normal

- Reaccion media.
- Apunta decente.
- Busca loot y pelea con logica.
- Sirve para la version offline normal.

### Hard

- Reacciona rapido.
- Apunta mejor.
- Usa mas cobertura.
- Intenta mas objetivos del templo.
- Sirve para retos o pruebas avanzadas.

## Emparejamiento por nivel

Decision de diseno: la dificultad de los bots depende del nivel del jugador.

| Nivel del jugador | Bots faciles | Bots normales | Bots dificiles |
|---:|---:|---:|---:|
| 1-3 | 70% | 30% | 0% |
| 4-8 | 40% | 50% | 10% |
| 9-15 | 20% | 55% | 25% |
| 16+ | 10% | 45% | 45% |

La clase `BotDifficultyScaler` contiene esta regla para Unity.

## Lo que falta para Unity

Para probar estos scripts en Unity se necesita:

- Proyecto Unity 3D.
- NavMesh horneado en el mapa.
- Prefab de bot con `NavMeshAgent`.
- Layers configuradas para enemigos, loot y obstaculos.
- Prefabs de armas con `WeaponDefinition`.
- Objetos de loot con `LootItem`.
- Un objeto `SafeZoneInfo`.
- Enemigos o player con `IDamageable`.

## Regla de calidad

No se debe mejorar a los bots haciendo trampa invisible. Si el bot ve al jugador
sin linea de vision, se siente injusto. Mejor hacerlo mas listo con estados,
distancias, cobertura y reacciones.
