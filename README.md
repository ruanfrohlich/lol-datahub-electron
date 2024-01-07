<center>

<h1>lol-datahub-electron</h1>

<p>Obtenha automaticamente tudo o que você precisa para ganhar sua partida de League of Legends.</p>

</center>

</br>

## Dados sobre o desenvolvimento

<details>
  <summary><b>Interface atual do aplicativo</b></summary>

</br>

![Imagem da interface](/repo/interface.png/)

</br>

</details>

<details>
  <summary><b>Informações sobre os dados do League of Legends</b></summary>

</br>

## League Client API

https://www.mingweisamuel.com/lcu-schema/tool/#/Plugin%20lol-perks

## Informações do jogo

**Campeão:**
```
https://raw.communitydragon.org/latest/plugins/rcp-be-lol-game-data/global/pt_br/v1/champions/
```

**Campeões:**
```
https://ddragon.leagueoflegends.com/cdn/${latest}/data/pt_BR/champion.json
```

> Substituir ``latest`` pela versão atual.

**Items:**
```
https://raw.communitydragon.org/latest/plugins/rcp-be-lol-game-data/global/pt_br/v1/items.json
```

**Runas:**
```
https://raw.communitydragon.org/latest/plugins/rcp-be-lol-game-data/global/default/v1/perks.json
```

## Informações de partidas

**Dados de partidas:**

```
https://s3-us-west-1.amazonaws.com/riot-developer-portal/seed-data/matches1.json
```
> Esta é a pagina ``1``, mas não olhei quantas tem no total.

**Ids de contas:**
```
https://canisback.com/leagueId/
```
> Possui o ``leagueID`` e ``elo`` de players.

## Imagens

**Campeões:**
```
https://raw.communitydragon.org/latest/plugins/rcp-be-lol-game-data/global/default/v1/champion-icons/
```
**Skills:**
```
https://raw.communitydragon.org/latest/plugins/rcp-be-lol-game-data/global/default/assets/characters/${championName}/hud/icons2d/
```

> Substituir ``championName`` pela versão atual.

**Items:**
```
https://raw.communitydragon.org/latest/plugins/rcp-be-lol-game-data/global/default/assets/items/icons2d/
```
> Precisa de alguns ajustes, pois no JSON dos itens cita a imagem ``2138.png``, mas estes arquivos sempre possuem dados a mais, como ``2138_class_elixirofiron.png``.

**Runas:**
```
https://raw.communitydragon.org/latest/plugins/rcp-be-lol-game-data/global/default/v1/perk-images/
```

</br>

<details>