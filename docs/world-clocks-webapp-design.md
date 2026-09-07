# Webapp Clock di Campagna

## Obiettivo

Realizzare una webapp estremamente semplice e molto visiva per il master. Deve servire a rappresentare l'avanzamento del mondo di gioco senza spiegazioni lunghe: il master apre la pagina, aggiunge card-clock al volo, sceglie lo stile grafico, le posiziona sulla plancia, le modifica in tempo reale durante la sessione e salva lo stato in JSON per riprenderlo in futuro.

La richiesta del master, ridotta all'essenziale:

- Schermata inizialmente vuota.
- Un pulsante `Aggiungi`.
- Da `Aggiungi` si crea una card-clock.
- Un pulsante `Crea grafici giocatore`.
- Da `Crea grafici giocatore` si crea una card dedicata a un giocatore.
- Ogni card giocatore deve avere il nome del giocatore.
- Dentro ogni card giocatore deve essere possibile aggiungere tutti i clock/grafici necessari.
- Deve restare possibile avere grafici totali/globali, separati dai grafici dei singoli giocatori.
- I grafici totali/globali restano card libere sulla plancia, ma possono essere fissati in alto in una zona `Party`.
- La card-clock deve avere un nome.
- Il master deve scegliere lo stile grafico del clock.
- Il clock deve chiedere quanti spicchi/segmenti/caselle servono in base allo stile scelto.
- Il clock a torta resta la forma principale, ma l'interfaccia deve poter ospitare piu stili visivi.
- Servono anche due barre fisse da 21 quadratini, con valore centrale `0`.
- Le impostazioni delle barre devono essere modificabili.
- Un tasto `Salva` deve chiedere un nome per il salvataggio.
- I salvataggi nominati devono comparire in una barra laterale e poter essere ricaricati al volo.
- Deve restare possibile esportare tutta la pagina in `.json`.
- Il JSON deve permettere di ricreare la pagina tra sessioni.
- La webapp deve essere responsive e utilizzabile in modo semplificato anche da cellulare con gesture mobile.

## Decisione Tecnica

Consiglio React + Vite + TypeScript, senza backend.

Per questo progetto Flutter non porta vantaggi reali: l'obiettivo non e pubblicare un'app nativa, ma avere uno strumento rapido, apribile in browser e modificabile senza infrastruttura. React permette di arrivare prima a una versione usabile, soprattutto per una UI da plancia con card posizionabili e controlli che aggiornano la grafica in tempo reale.

Non serve backend nella prima versione. La persistenza principale locale sara composta da:

- salvataggi nominati in `localStorage`, visibili nella barra laterale;
- autosave tecnico di sicurezza, sempre in `localStorage`;
- esportazione/importazione JSON per backup, passaggio tra dispositivi o ripresa futura.

Il salvataggio nominato non sostituisce il JSON: e il modo rapido per richiamare scene gia preparate nello stesso browser. Il JSON resta il formato portabile.

## Esperienza Utente

La schermata deve partire quasi vuota, evocativa e leggibile.

In alto:

- Nome della campagna o della scena.
- Pulsante `Aggiungi`.
- Pulsante `Crea grafici giocatore`.
- Pulsante `Salva`.
- Pulsante `Carica`.
- Pulsante `Esporta JSON`, se si decide di separarlo da `Salva`.
- Eventuale pulsante `Reset`.

Subito sotto:

- Le due barre fisse da 21 quadratini.

Lateralmente:

- Una barra laterale con i salvataggi nominati.
- Ogni salvataggio deve mostrare almeno nome, data di aggiornamento e numero di clock.
- Cliccando un salvataggio, la plancia corrente viene sostituita rapidamente dopo conferma se ci sono modifiche non salvate.

Al centro:

- Una plancia libera dove il master posiziona le card dei clock globali e le card giocatore.
- Una zona alta `Party`, facoltativa, dove fissare i clock globali che devono restare sempre visibili.

La pagina non deve sembrare una dashboard gestionale moderna. Deve sembrare una plancia fantasy da master: legno scuro, pergamena, oro brunito, elementi come segnalini appoggiati sul tavolo.

Vincoli di leggibilita e contenimento:

- Ogni card deve contenere sempre tutti i propri controlli: input, select, barre segmentate e pulsanti non devono uscire dal bordo della card.
- I controlli dentro una card devono adattarsi alla larghezza disponibile con griglie responsive, `min-width: 0` e dimensioni stabili.
- Il contrasto tra testo, controlli, segmenti e sfondo deve essere controllato con attenzione, perche lo sfondo fantasy e molto scuro e textureizzato.
- Gli stati vuoti, pieni, selezionati e disabilitati dei clock devono essere distinguibili anche quando il colore scelto e scuro.
- Le card devono poter essere compatte, ma non sacrificare leggibilita e tap target.

## Responsive E Uso Mobile

La webapp deve essere comoda anche da cellulare, ma senza forzare la stessa esperienza desktop in uno spazio troppo piccolo.

Comportamento consigliato:

- Desktop e tablet: plancia libera con card-clock posizionabili tramite drag and drop.
- Cellulare: vista semplificata verticale, con card in lista e controlli piu grandi.
- Le posizioni delle card restano salvate per desktop/tablet, ma su mobile possono essere ignorate visivamente.
- Le barre da 21 quadratini devono restare usabili su schermo piccolo, eventualmente andando a capo o usando quadratini piu compatti.
- I controlli principali devono essere raggiungibili con tap: `Aggiungi`, `Salva`, salvataggi laterali, `+1`, `-1`, cambio valore barre.

Gesture mobile consigliate:

- Tap su uno spicchio/casella per impostare l'avanzamento.
- Swipe a destra su una card-clock per aumentare di `+1`.
- Swipe a sinistra su una card-clock per diminuire di `-1`.
- Tap lungo o pulsante dedicato per aprire impostazioni/modifica della card.
- Drag della posizione disattivato o secondario su cellulare, per non creare conflitto con lo scroll.

La scelta strutturale e quindi una modalita ibrida: plancia libera dove c'e spazio, lista operativa dove il master usa il telefono.

## Flusso Principale

Il flusso centrale per un clock globale deve essere questo:

1. Il master preme `Aggiungi`.
2. Sceglie lo stile del clock tra piu tipi grafici.
3. Inserisce nome e quantita di segmenti, spicchi o caselle.
4. Conferma.
5. La webapp crea una card-clock sulla plancia.
6. Il master trascina la card dove preferisce.
7. Durante la sessione modifica avanzamento, lunghezza e impostazioni direttamente dalla card.
8. Alla fine preme `Salva`, inserisce un nome per il salvataggio e lo ritrova nella barra laterale.
9. Se vuole un backup o deve spostare la campagna su un altro dispositivo, esporta un JSON completo della plancia.

Il feedback deve essere immediato: quando il master cambia numero di spicchi, valore, stile o impostazioni, la grafica deve aggiornarsi subito.

## Grafici Globali E Zona Party

I grafici totali/globali restano card-clock libere sulla plancia. Il master deve pero poter fissare un clock globale in alto, in una zona contrassegnata dalla scritta `Party`.

Comportamento:

- Ogni clock globale puo essere libero sulla plancia oppure fissato nella zona `Party`.
- Quando e libero, usa `position` e puo essere trascinato.
- Quando e fissato in `Party`, viene mostrato nella fascia alta della plancia e non usa visivamente la posizione libera.
- Se viene sbloccato da `Party`, torna sulla plancia usando la sua ultima `position` salvata.
- La zona `Party` rappresenta i grafici globali/totali del gruppo, non un singolo giocatore.
- I clock dentro le card giocatore non possono essere fissati in `Party`, perche appartengono al giocatore.

Dato consigliato:

```json
{
  "id": "clock-1",
  "type": "pie",
  "name": "Allarme della cittadella",
  "segments": 6,
  "filled": 2,
  "color": "ember",
  "pinnedToParty": true,
  "position": {
    "x": 480,
    "y": 260
  }
}
```

## Grafici Per Giocatore

Oltre ai clock globali/totali, la webapp deve permettere di creare card dedicate ai singoli giocatori.

Il flusso deve essere questo:

1. Il master preme `Crea grafici giocatore`.
2. Inserisce il nome del giocatore.
3. La webapp crea una card giocatore sulla plancia.
4. Dentro la card giocatore, il master puo aggiungere uno o piu clock/grafici.
5. Ogni clock dentro la card giocatore usa gli stessi stili dei clock globali: `Torta`, `Barra segmentata`, e in futuro eventuali altri stili.
6. Ogni clock interno ha nome, segmenti, avanzamento, colore e impostazioni proprie.
7. La card giocatore puo essere spostata sulla plancia come una card-clock globale.
8. Su mobile, le card giocatore entrano nella vista semplificata verticale insieme ai clock globali.

Scopo:

- Avere una vista totale/globale della situazione del mondo o della scena.
- Avere una vista individuale per ogni giocatore.
- Preparare piu clock per lo stesso giocatore senza riempire la plancia di card separate.

Comportamento minimo:

- Nome giocatore modificabile.
- Pulsante `Aggiungi grafico` dentro la card giocatore.
- Lista dei clock interni.
- Ogni clock interno deve poter avanzare con tap/click e pulsanti `-1` / `+1`.
- Ogni clock interno deve poter essere modificato nei suoi dati base.
- La card giocatore deve salvare tutto nel JSON e nei salvataggi nominati.

Decisione strutturale consigliata:

- Trattare i clock globali e le card giocatore come due collezioni separate nello stato.
- I clock globali restano in `clocks`.
- Le card giocatore vanno in `playerCards`.
- Ogni `playerCard` contiene una lista `clocks`.

Esempio dati:

```json
{
  "playerCards": [
    {
      "id": "player-1",
      "playerName": "Arlen",
      "position": {
        "x": 80,
        "y": 180
      },
      "size": "medium",
      "locked": false,
      "clocks": [
        {
          "id": "player-clock-1",
          "type": "pie",
          "name": "Corruzione del sogno",
          "segments": 6,
          "filled": 2,
          "color": "moss",
          "settings": {
            "showValue": true,
            "showControls": true
          },
          "updatedAt": "2026-09-07T00:00:00.000Z"
        }
      ]
    }
  ]
}
```

Nota: i clock dentro una card giocatore non hanno bisogno di una posizione propria, perche sono ordinati dentro la card. La posizione appartiene alla card giocatore.

## Barre Fisse

Servono due barre sempre presenti, ognuna con 21 quadratini. Il valore logico va da `-10` a `+10`, con `0` al centro.

### Barra 1: Atteggiamento

Scopo: misurare come il gruppo viene percepito, piu aggressivo/fisico o piu comunicativo/sociale.

Estremi:

- Sinistra: `Sociale`
- Centro: `0`
- Destra: `Fisico`

Interpretazione:

- Verso sinistra: il gruppo viene visto come diplomatico, comunicativo, sociale.
- Verso destra: il gruppo viene visto come diretto, fisico, aggressivo o risolutivo con la forza.

### Barra 2: Percezione Delle Fazioni

Scopo: misurare verso quale fazione il gruppo viene percepito come vicino.

Estremi:

- Sinistra: `Rinati`
- Centro: `0`
- Destra: `Cantori`

Interpretazione:

- Verso sinistra: il gruppo viene associato ai Rinati.
- Verso destra: il gruppo viene associato ai Cantori.

### Comportamento Delle Barre

Ogni barra deve:

- Mostrare 21 quadratini.
- Avere il quadratino centrale marcato come `0`.
- Consentire al master di cliccare un quadratino per impostare il valore.
- Evidenziare il valore corrente.
- Mostrare chiaramente gli estremi testuali.
- Permettere di modificare nome, etichetta sinistra, etichetta destra e valore corrente.
- Salvare il valore nel JSON.

Dato che il master parla di quadratini, le barre non devono essere slider continui. Devono essere discrete, fisiche, quasi da scheda cartacea.

## Clock

I clock vivono dentro card posizionabili sulla plancia.

La card e il contenitore stabile: titolo, controlli rapidi, grafico e impostazioni. Il grafico interno puo cambiare stile, ma la card resta trascinabile, salvabile e configurabile nello stesso modo.

### Creazione Clock

Quando il master preme `Aggiungi`, appare una piccola finestra/modale con:

- Stile grafico del clock.
- Nome del clock.
- Numero di spicchi, segmenti o caselle.
- Colore o tono visivo opzionale.
- Pulsante `Crea`.

Il numero di elementi deve essere richiesto sempre. Preset consigliati:

- 4
- 6
- 8
- 10
- 12

Deve comunque essere possibile inserire un numero manuale entro un range ragionevole, ad esempio da 2 a 12 nella versione iniziale.

### Stili Di Clock

Gli stili devono condividere gli stessi dati di base: `segments`, `filled`, `name`, `color`, `position`, `size`, `settings`.

Per i clock dentro una card giocatore, i dati condivisi restano gli stessi tranne `position` e `size`, che appartengono alla card contenitore.

Stili consigliati:

- `Torta`: cerchio diviso in spicchi. E lo stile principale per minacce, rituali e fronti narrativi.
- `Barra segmentata`: barra orizzontale divisa in caselle, utile per progressi lineari.
- `Caselle`: griglia di quadratini, vicina al linguaggio della bozza cartacea.
- `Anello`: cerchio/anello che si riempie a segmenti, piu compatto e scenografico.

Per la versione rapida possiamo implementare subito `Torta` e `Barra segmentata`, lasciando `Caselle` e `Anello` come stili successivi se il master li vuole davvero. L'importante e progettare i dati in modo che aggiungere uno stile non richieda di rifare il salvataggio.

### Clock A Torta

Requisiti:

- Forma circolare divisa in spicchi.
- Spicchi vuoti e pieni ben distinguibili.
- Click su uno spicchio per impostare l'avanzamento.
- Pulsanti rapidi `-1` e `+1`.
- Nome sempre leggibile.
- Indicazione discreta tipo `3 / 6`.
- Stato completato quando tutti gli spicchi sono pieni.
- Il grafico deve avere abbastanza contrasto tra spicchi vuoti, spicchi pieni, bordi e sfondo della card.

Implementazione consigliata:

- SVG generato in React.
- Ogni spicchio e un `path` cliccabile.
- Nessuna libreria grafica pesante.
- La dimensione del clock deve restare stabile e leggibile.

### Posizionamento

Il master deve poter decidere dove mettere ogni card-clock nella pagina.

MVP:

- Il nuovo clock nasce al centro della plancia o in una posizione libera.
- La card si puo trascinare con drag and drop.
- La posizione viene salvata nel JSON.

Opzionale ma utile:

- Dimensione piccola, media, grande.
- Blocco posizione per evitare spostamenti accidentali durante la sessione.

Per una prima versione rapida, eviterei il ridimensionamento libero: meglio tre taglie stabili, piu facili da usare e meno fragili su mobile.

### Modifica In Tempo Reale

Ogni card-clock deve permettere modifiche immediate:

- Cambiare avanzamento con click sul grafico.
- Usare `-1` e `+1`.
- Cambiare lunghezza del clock, cioe numero di segmenti/spicchi.
- Cambiare stile grafico, se compatibile.
- Cambiare nome.
- Cambiare colore.
- Spostare la card.
- Salvare automaticamente lo stato in memoria locale dopo ogni modifica.

Se il master riduce il numero di segmenti sotto il valore gia riempito, il valore `filled` va clampato al nuovo massimo.

## Salvataggio JSON

Il formato JSON e obbligatorio come formato portabile, ma il flusso rapido del master deve usare salvataggi nominati interni alla webapp.

## Salvataggi Con Nome E Barra Laterale

Quando il master preme `Salva`:

- La webapp chiede un nome per il salvataggio.
- Se il nome e nuovo, crea una nuova schermata salvata.
- Se il nome esiste gia, chiede se sovrascrivere oppure salvare una copia con nome diverso.
- Il salvataggio viene aggiunto o aggiornato nella barra laterale.
- Ogni salvataggio contiene l'intero stato della pagina: campagna, barre, clock, posizioni, valori, stili e impostazioni.
- Cliccando un salvataggio dalla barra laterale, la webapp ricarica quella schermata.
- Se la plancia corrente ha modifiche non salvate, la webapp chiede conferma prima di sostituirla.

La barra laterale serve per avere schermate gia pronte: ad esempio scene diverse, fronti narrativi diversi, versioni pre-sessione, oppure set di clock specifici per un luogo o fazione.

Dato che non c'e backend, questi salvataggi sono locali al browser. Per portarli altrove bisogna usare esportazione/import JSON.

Struttura dati locale consigliata:

```json
{
  "schemaVersion": 1,
  "activeSaveId": "save-1",
  "saves": [
    {
      "id": "save-1",
      "name": "Sessione 03 - Ponte dei Rinati",
      "createdAt": "2026-09-07T00:00:00.000Z",
      "updatedAt": "2026-09-07T00:00:00.000Z",
      "campaign": {
        "schemaVersion": 1,
        "campaignName": "Sogno Erotico",
        "tracks": [],
        "clocks": []
      }
    }
  ]
}
```

## Esportazione JSON

Il pulsante `Esporta JSON`, oppure una voce dentro il flusso `Salva`, deve permettere di scaricare un file `.json`.

Quando viene premuto:

- La webapp prende lo stato corrente della pagina.
- Genera un file `.json`.
- Il file contiene barre, card-clock, nomi, valori, stile grafico, spicchi/segmenti, avanzamento, posizione e impostazioni visive.
- Il master conserva quel file come persistenza tra sessioni.

Nome file consigliato:

```text
clock-campagna-nome-2026-09-07.json
```

Il JSON deve includere una versione schema per poter evolvere il formato senza rompere i salvataggi vecchi.

Esempio:

```json
{
  "schemaVersion": 1,
  "campaignName": "Sogno Erotico",
  "tracks": [
    {
      "id": "attitude",
      "name": "Atteggiamento",
      "leftLabel": "Sociale",
      "centerLabel": "0",
      "rightLabel": "Fisico",
      "min": -10,
      "max": 10,
      "value": 0
    },
    {
      "id": "factions",
      "name": "Percezione delle fazioni",
      "leftLabel": "Rinati",
      "centerLabel": "0",
      "rightLabel": "Cantori",
      "min": -10,
      "max": 10,
      "value": 0
    }
  ],
  "clocks": [
    {
      "id": "clock-1",
      "type": "pie",
      "name": "Il sogno si incrina",
      "segments": 6,
      "filled": 2,
      "color": "ember",
      "settings": {
        "showValue": true,
        "showControls": true
      },
      "position": {
        "x": 480,
        "y": 260
      },
      "size": "medium",
      "locked": false,
      "pinnedToParty": false,
      "updatedAt": "2026-09-07T00:00:00.000Z"
    }
  ],
  "playerCards": [
    {
      "id": "player-1",
      "playerName": "Arlen",
      "position": {
        "x": 80,
        "y": 180
      },
      "size": "medium",
      "locked": false,
      "clocks": [
        {
          "id": "player-clock-1",
          "type": "pie",
          "name": "Corruzione del sogno",
          "segments": 6,
          "filled": 2,
          "color": "moss",
          "settings": {
            "showValue": true,
            "showControls": true
          },
          "updatedAt": "2026-09-07T00:00:00.000Z"
        }
      ]
    }
  ]
}
```

## Caricamento JSON

Il pulsante `Carica` deve permettere di selezionare un file `.json` salvato prima.

Comportamento:

- Legge il file.
- Valida `schemaVersion`.
- Controlla che esistano `tracks` e `clocks`.
- Se esiste `playerCards`, valida anche le card giocatore e i clock interni.
- Chiede conferma prima di sostituire la plancia corrente.
- Dopo il caricamento, permette di salvarlo con nome nella barra laterale.
- Se il file non e valido, mostra un errore chiaro e non cancella nulla.

## Autosave Locale

Oltre ai salvataggi nominati, conviene mantenere un autosave tecnico in `localStorage`.

Chiave proposta:

```text
gdr-world-clocks:v1
```

Ruolo:

- Proteggere il master da refresh accidentali.
- Ripristinare l'ultima pagina aperta.
- Non sostituire i salvataggi nominati.
- Non sostituire il JSON come formato portabile.

All'avvio, se esiste un autosave, la webapp puo ripristinarlo automaticamente o mostrare un piccolo messaggio tipo `Ultima sessione ripristinata`.

## Identita Visiva

La direzione grafica deve richiamare una app fantasy da tavolo, prendendo ispirazione dal progetto esistente in `C:\xampp\htdocs\Dd\flutter_dd`.

Elementi osservati nel riferimento:

- Sfondo scuro con texture legno/carbone.
- Pannelli tipo pergamena scura o metallo brunito.
- Accenti oro, bronzo e rame.
- Testi principali in stile fantasy, simile a Cinzel.
- Bottoni con texture da tavola di legno.
- Cornici sottili, rivetti, ombre morbide.

Palette di riferimento:

```text
Background:    #060807
Panel:         #10130F
Panel 2:       #171B15
Text:          #FFF2D6
Muted text:    #D6C39E
Accent gold:   #B99A56
Gold soft:     #D6C487
Parchment:     #3C392B
Blood:         #6F2C29
Moss:          #29362C
Ember:         #A4512A
Border:        #686851
Field:         #100B07
```

Asset da riusare o replicare:

- `assets/ui/dnd/charcoal-wood.jpg` per lo sfondo.
- `assets/ui/login-d20-parchment.png` come alternativa evocativa.
- `assets/ui/dnd/button-plank.png` e varianti per pulsanti.
- `assets/ui/dnd/rivet-iron.png` per dettagli visivi.

Se la webapp vive in un nuovo progetto React, conviene copiare solo gli asset necessari dentro `public/assets/`.

## Architettura React

Stack consigliato:

- React
- Vite
- TypeScript
- CSS semplice o CSS Modules
- `lucide-react` per icone piccole e leggibili

Stato:

- `useReducer` per modifiche prevedibili.
- `localStorage` per autosave.
- Funzioni pure per `saveJson`, `loadJson` e validazione.

Struttura proposta:

```text
src/
  App.tsx
  main.tsx
  styles/
    theme.css
    app.css
  components/
    CampaignHeader.tsx
    FixedTracks.tsx
    TrackSquares.tsx
    Board.tsx
    ClockToken.tsx
    PlayerCard.tsx
    PlayerClockList.tsx
    AddPlayerCardModal.tsx
    ClockStylePicker.tsx
    PieClock.tsx
    SegmentedBarClock.tsx
    AddClockModal.tsx
    ClockSettingsPanel.tsx
    SavedScenesSidebar.tsx
    SaveSceneModal.tsx
    MobileClockList.tsx
    Toolbar.tsx
  state/
    campaignReducer.ts
    defaultCampaign.ts
    storage.ts
    jsonPersistence.ts
    savedScenes.ts
  types/
    campaign.ts
    savedScene.ts
public/
  assets/
    charcoal-wood.jpg
    button-plank.png
    button-plank-active.png
    rivet-iron.png
```

## MVP

Versione 0.1:

- Schermata vuota con sfondo fantasy.
- Header minimale con `Aggiungi`, `Salva`, `Carica`, eventuale `Esporta JSON`.
- Salvataggio con nome tramite modale semplice.
- Barra laterale con schermate salvate ricaricabili al volo.
- Due barre fisse da 21 quadratini:
  - `Atteggiamento`: `Sociale` / `0` / `Fisico`.
  - `Percezione delle fazioni`: `Rinati` / `0` / `Cantori`.
- Impostazioni modificabili per nome/estremi/valori delle barre.
- Creazione card-clock con scelta dello stile grafico.
- Creazione card giocatore con nome del giocatore.
- Possibilita di aggiungere piu clock dentro ogni card giocatore.
- Creazione clock a torta con nome e numero spicchi.
- Creazione clock a barra segmentata con nome e numero segmenti.
- Avanzamento del clock cliccando il grafico o usando `-1` / `+1`.
- Modifica in tempo reale di lunghezza, stile e impostazioni.
- Spostamento delle card-clock sulla plancia.
- Possibilita di fissare i clock globali in alto nella zona `Party`.
- Spostamento delle card giocatore sulla plancia.
- Esportazione completa in JSON.
- Caricamento da JSON.
- Autosave in `localStorage`.
- Layout responsive.
- Su mobile, vista semplificata a lista con gesture principali per avanzamento.
- Card e controlli interni sempre contenuti, senza overflow visivo.
- Contrasto rinforzato su sfondi scuri e textureizzati.

Versione 0.2, solo se serve:

- Clock a caselle.
- Clock ad anello.
- Taglie piccola/media/grande.
- Blocco posizione.
- Colori o categorie.
- Archivio dei clock completati.
- Gestione avanzata dei salvataggi: rinomina, duplica, elimina, esporta singolo salvataggio.

## Cose Da Evitare

- Backend.
- Login.
- Ruoli master/giocatori.
- Sincronizzazione realtime.
- Tabelle o layout troppo gestionali.
- Troppe opzioni nella modale di creazione.
- Ridimensionamento libero nella prima versione.
- Forzare il drag libero su cellulare come interazione principale.
- Dipendenze pesanti per disegnare i clock.
- Un editor da grafica professionale: deve restare uno strumento da sessione, non un costruttore complesso.
- Creare una card separata per ogni singolo clock giocatore quando piu clock appartengono allo stesso giocatore.

## Domande Ancora Aperte

- Il titolo della campagna deve essere davvero `Sogno Erotico` o e solo il nome della prima scena?
- I clock devono avere una descrizione/note oppure basta il nome?
- I clock completati restano visibili o vanno archiviati?
- Quali stili grafici vuole davvero nella prima versione oltre a torta e barra segmentata?
- Il master vuole poter cambiare colore ai clock gia nella prima versione?
- Le barre fisse devono essere sempre in alto o anche loro posizionabili?
- Serve una modalita schermo intero per usarla al tavolo?
- La barra laterale dei salvataggi su mobile deve diventare un drawer, una tendina o una sezione in alto?
- `Salva` deve sempre sovrascrivere il salvataggio attivo dopo la prima scelta del nome, oppure deve chiedere il nome ogni volta?
- L'esportazione JSON deve essere un pulsante separato oppure una scelta dentro la modale di salvataggio?
- I clock dentro una card giocatore devono essere sempre visibili o collassabili per non occupare troppo spazio?
- La card giocatore deve avere anche un clock riepilogativo/totale automatico o solo i clock che il master aggiunge manualmente?
- La zona `Party` deve essere sempre visibile anche quando non contiene clock, oppure apparire solo quando almeno un clock e fissato?

## Stima

Per una versione 0.1 piccola ma curata:

- Setup React/Vite/TypeScript: 30-60 minuti.
- Layout fantasy e plancia: 1-2 ore.
- Barre da 21 quadratini: 1 ora.
- Impostazioni modificabili delle barre: 45-60 minuti.
- Clock a torta SVG: 1-2 ore.
- Clock a barra segmentata: 45-60 minuti.
- Zona `Party` per fissare clock globali: 30-60 minuti.
- Card giocatore con clock interni: 1-2 ore.
- Picker stile grafico: 30-45 minuti.
- Modale `Aggiungi`: 45-60 minuti.
- Drag and drop: 1-2 ore.
- Salva/carica JSON: 1 ora.
- Salvataggi nominati e barra laterale: 1-2 ore.
- Autosave localStorage: 30-45 minuti.
- Layout responsive e gesture mobile: 1-2 ore.
- Verifica desktop/mobile: 45-90 minuti.

Totale realistico: una giornata corta, con margine per rifinire il feeling visivo.

## Decisione Consigliata

Procedere con React + Vite + TypeScript, senza backend.

Il cuore dell'app deve essere questo: una plancia fantasy vuota, due barre fisse da 21 caselle e un pulsante `Aggiungi` che crea card-clock globali nominabili, posizionabili e configurabili in tempo reale. I clock globali restano liberi sulla plancia, ma possono essere fissati in alto nella zona `Party`. Deve esserci anche `Crea grafici giocatore`, che crea una card giocatore con nome e con la possibilita di aggiungere piu clock interni. Il master deve poter salvare schermate con nome nella barra laterale e richiamarle subito; il JSON deve restare il formato portabile per backup e passaggio tra sessioni o dispositivi. Su desktop la webapp funziona come plancia libera, mentre su cellulare diventa una lista operativa semplificata con gesture rapide.

## Regola Di Lavoro Sul Documento

Ogni volta che si aggiunge, affina o cambia una parte del progetto:

- Rileggere questo documento prima di modificare codice o struttura.
- Aggiornare il documento con la nuova decisione.
- Eliminare o correggere parti superate, ambigue o in conflitto.
- Fermarsi e discutere con il master quando la modifica implica una decisione strutturale non ancora condivisa.
