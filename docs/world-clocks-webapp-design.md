# Webapp Clock di Campagna

## Obiettivo

Realizzare una webapp estremamente semplice e molto visiva per il master. Deve servire a rappresentare l'avanzamento del mondo di gioco senza spiegazioni lunghe: il master apre la pagina, aggiunge card-clock al volo, sceglie lo stile grafico, le posiziona sulla plancia, le modifica in tempo reale durante la sessione e salva lo stato in JSON per riprenderlo in futuro.

La richiesta del master, ridotta all'essenziale:

- Schermata inizialmente vuota.
- Un pulsante `Aggiungi`.
- Da `Aggiungi` si puo creare una card-clock oppure una barra discreta da plancia.
- I tipi grafico principali sono tre e devono essere scelti subito in cima alla modale: `Clock`, `Barra -X / 0 / +X` e `Barra segmentata`.
- Un pulsante `Aggiungi giocatore`.
- Da `Aggiungi giocatore` si crea una card dedicata a un giocatore.
- Ogni card giocatore deve avere il nome del giocatore.
- Dentro ogni card giocatore deve essere possibile aggiungere gli stessi tipi grafico dell'`Aggiungi` principale, ma solo dentro quella card.
- Deve restare possibile avere grafici totali/globali, separati dai grafici dei singoli giocatori.
- I grafici totali/globali restano card libere sulla plancia, ma possono essere fissati in alto in una zona `Party`.
- La card-clock deve avere un nome.
- Ogni card deve avere un titolo modificabile.
- Ogni grafico dentro una card deve avere una label modificabile visibile sopra il grafico.
- Il master deve scegliere il tipo grafico prima di compilare i campi specifici.
- Il tipo `Clock` usa il quadrante a torta.
- Il tipo `Barra segmentata` usa caselle normali che si riempiono progressivamente.
- Servono anche due barre iniziali da 21 quadratini, con valore centrale `0`, ma non devono essere obbligatoriamente fisse in alto.
- Le impostazioni delle barre devono essere modificabili.
- Deve essere possibile creare altre barre con la stessa UX delle due barre iniziali, direttamente dal pulsante `Aggiungi`, scegliendo liberamente quante caselle devono avere.
- Un tasto `Salva` deve chiedere un nome per il salvataggio.
- I salvataggi nominati devono comparire in una barra laterale e poter essere ricaricati al volo.
- Il tasto `Salva` deve anche creare/scaricare un file `.json` visibile al master, pensato solo come backup e per eventuale importazione.
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
- Il valore predefinito del titolo campagna e `La caduta dei cieli`, ma deve restare modificabile.
- Pulsante `Aggiungi`.
- Pulsante `Aggiungi giocatore`.
- Pulsante `Salva`.
- Pulsante `Carica`.
- Il file JSON viene generato dal flusso `Salva`, senza richiedere al master di capire il formato.
- Eventuale pulsante `Reset`.

Subito sotto:

- Una fascia `Barre` per le barre fissate in alto.
- Le due barre iniziali partono in questa fascia, ma il master puo spostarle in plancia.
- Se nella fascia ci sono piu barre, il layout prova ad affiancarle; quando lo spazio non basta, le ridimensiona e va a capo automaticamente.

Lateralmente:

- Una barra laterale a scomparsa con i salvataggi nominati, cosi la plancia puo usare quasi tutto lo spazio quando il master non sta caricando scene.
- Anche quando e chiusa, la barra laterale deve restare richiamabile con un pulsante/linguetta visibile.
- Ogni salvataggio deve mostrare almeno nome, data di aggiornamento e numero di clock.
- Cliccando un salvataggio, la plancia corrente viene sostituita rapidamente dopo conferma se ci sono modifiche non salvate.

Al centro:

- Una plancia a griglia dove il master mette le card dei clock globali, le barre non fissate in alto e le card giocatore.
- Le card sulla plancia si agganciano automaticamente una accanto all'altra e si ridimensionano in base allo spazio disponibile.
- Su desktop la plancia usa al massimo 3 colonne.
- Su smartphone la plancia usa al massimo 2 colonne, scendendo a una sola colonna quando lo spazio reale non permette una lettura comoda.
- Quando non c'e spazio per tenere una card nella riga corrente, la card va automaticamente a capo.
- Una zona alta `Party`, facoltativa, dove fissare i clock globali che devono restare sempre visibili.
- Quando il master crea un nuovo elemento, questo deve comparire sotto gli elementi gia presenti nella plancia, oppure comunque sopra visivamente se c'e sovrapposizione temporanea: non deve nascere dietro o sotto altre card.

La pagina non deve sembrare una dashboard gestionale moderna. Deve sembrare una plancia fantasy da master: legno scuro, pergamena, oro brunito, elementi come segnalini appoggiati sul tavolo.

Vincoli di leggibilita e contenimento:

- Ogni card deve contenere sempre tutti i propri controlli: input, select, barre segmentate e pulsanti non devono uscire dal bordo della card.
- Il titolo della card e la label del grafico sono due testi distinti: il titolo identifica la card, la label descrive il singolo grafico visualizzato dentro la card.
- I campi modificabili devono usare placeholder di esempio chiari, per esempio `es. Allarme della cittadella`, `es. Equilibrio onirico`, `es. Sociale` e `es. Fisico`, senza obbligare il master a cancellare testo precompilato.
- Se il master lascia un campo vuoto in creazione, la webapp deve usare un fallback semplice e sicuro come `Nuovo clock`, `Nuova barra` o `Grafico giocatore`.
- I controlli dentro una card devono adattarsi alla larghezza disponibile con griglie responsive, `min-width: 0` e dimensioni stabili.
- L'header deve poter mandare i pulsanti a capo sotto al titolo quando lo spazio orizzontale non basta, senza tagliare il nome della campagna.
- Il contrasto tra testo, controlli, segmenti e sfondo deve essere controllato con attenzione, perche lo sfondo fantasy e molto scuro e textureizzato.
- Gli stati vuoti, pieni, selezionati e disabilitati dei clock devono essere distinguibili anche quando il colore scelto e scuro.
- I placeholder devono restare leggibili ma secondari rispetto al testo inserito.
- Le card devono poter essere compatte, ma non sacrificare leggibilita e tap target.
- Quando una card viene puntata o modificata, deve salire visivamente sopra le altre card per mantenere leggibili i controlli anche durante spostamenti o sovrapposizioni temporanee.
- La plancia non deve avere altezza rigida con contenuti tagliati: deve crescere o permettere scroll verticale per mostrare tutti gli elementi.

## Responsive E Uso Mobile

La webapp deve essere comoda anche da cellulare, ma senza forzare la stessa esperienza desktop in uno spazio troppo piccolo.

Comportamento consigliato:

- Desktop e tablet: plancia a griglia responsive, con card agganciate in massimo 3 colonne.
- Cellulare: vista semplificata con card in massimo 2 colonne, oppure una colonna quando la larghezza effettiva e troppo ridotta.
- Le posizioni delle card restano nel JSON per compatibilita e per possibili evoluzioni, ma la resa visuale principale usa l'ordine della griglia.
- Le barre devono restare usabili su schermo piccolo anche quando hanno molte caselle, usando quadratini piu compatti o scorrimento interno alla card.
- I controlli principali devono essere raggiungibili con tap: `Aggiungi`, `Salva`, salvataggi laterali, `+1`, `-1`, cambio valore barre.

Gesture mobile consigliate:

- Tap su uno spicchio/casella per impostare l'avanzamento.
- Swipe a destra su una card-clock per aumentare di `+1`.
- Swipe a sinistra su una card-clock per diminuire di `-1`.
- Tap lungo o pulsante dedicato per aprire impostazioni/modifica della card.
- Drag della posizione disattivato o secondario su cellulare, per non creare conflitto con lo scroll.

La scelta strutturale e quindi una modalita ibrida: griglia responsive dove c'e spazio, lista operativa compatta quando il master usa il telefono.

## Flusso Principale

Il flusso centrale per un clock globale deve essere questo:

1. Il master preme `Aggiungi`.
2. Sceglie `Clock` come tipo grafico.
3. Inserisce titolo della card, label del grafico e quantita di segmenti, spicchi o caselle.
4. Conferma.
5. La webapp crea una card-clock sulla plancia.
6. La card entra nella griglia della plancia, dopo gli elementi gia presenti.
7. Durante la sessione modifica avanzamento, lunghezza e impostazioni direttamente dalla card.
8. Alla fine preme `Salva`, inserisce un nome per il salvataggio e lo ritrova nella barra laterale.
9. Insieme al salvataggio interno, la webapp scarica anche un JSON completo della plancia per backup o importazione futura.

Il feedback deve essere immediato: quando il master cambia numero di spicchi, valore, stile o impostazioni, la grafica deve aggiornarsi subito.

Il flusso centrale per una barra da plancia deve essere questo:

1. Il master preme `Aggiungi`.
2. Sceglie `Barra -X / 0 / +X`.
3. Inserisce titolo della card, label del grafico, numero di caselle, etichetta sinistra, etichetta centrale ed etichetta destra.
4. Conferma.
5. La webapp crea una card-barra sulla plancia.
6. Il master puo cliccare i quadratini per impostare il valore, fissare la card in alto, modificarne numero di caselle ed etichette o eliminarla.

Il flusso centrale per una barra segmentata da plancia deve essere questo:

1. Il master preme `Aggiungi`.
2. Sceglie `Barra segmentata`.
3. Inserisce titolo, label, numero di caselle e colore.
4. Conferma.
5. La webapp crea una card con caselle normali che si riempiono da `0` al totale scelto.

## Grafici Globali E Zona Party

I grafici totali/globali restano card-clock libere sulla plancia. Il master deve pero poter fissare un clock globale in alto, in una zona contrassegnata dalla scritta `Party`.

Comportamento:

- Ogni clock globale puo essere libero sulla plancia oppure fissato nella zona `Party`.
- Quando e libero, entra nella griglia della plancia e non deve sovrapporsi alle altre card.
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
  "graphLabel": "Rintocchi mancanti",
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

1. Il master preme `Aggiungi giocatore`.
2. Inserisce il nome del giocatore.
3. La webapp crea una card giocatore sulla plancia.
4. In cima alla card il titolo e il nome del giocatore, modificabile.
5. Dentro la card giocatore, il master puo premere `Aggiungi` quante volte vuole.
6. Ogni aggiunta permette di scegliere tra `Clock`, `Barra -X / 0 / +X` e `Barra segmentata`.
7. Se il master sceglie `Barra -X / 0 / +X` e `X = 20`, il grafico mostra una scala discreta da `-20` a `+20`, con `0` al centro e 41 quadratini cliccabili.
8. Ogni grafico interno ha titolo, label, valore corrente e impostazioni specifiche modificabili.
9. La card giocatore entra nella griglia della plancia come una card-clock globale.
10. Su mobile, le card giocatore entrano nella vista semplificata verticale insieme ai clock globali.

Scopo:

- Avere una vista totale/globale della situazione del mondo o della scena.
- Avere una vista individuale per ogni giocatore.
- Preparare piu grafici per lo stesso giocatore senza riempire la plancia di card separate.

Comportamento minimo:

- Nome giocatore modificabile.
- Pulsante `Aggiungi` dentro la card giocatore.
- Lista dei grafici interni.
- Ogni grafico interno deve poter impostare il valore cliccando uno spicchio o un quadratino.
- Ogni grafico interno deve poter modificare titolo, label e impostazioni specifiche, come ampiezza `X`, segmenti o caselle.
- La card giocatore deve salvare tutto nel JSON e nei salvataggi nominati.

Decisione strutturale consigliata:

- Trattare i clock globali e le card giocatore come due collezioni separate nello stato.
- I clock globali restano in `clocks`.
- Le card giocatore vanno in `playerCards`.
- Ogni `playerCard` contiene `tracks` per le barre simmetriche e `clocks` per clock a torta e barre segmentate.

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
      "clocks": [],
      "updatedAt": "2026-09-07T00:00:00.000Z",
      "tracks": [
        {
          "id": "player-track-1",
          "name": "Atteggiamento verso popolazione",
          "graphLabel": "Atteggiamento verso popolazione",
          "leftLabel": "-20",
          "centerLabel": "0",
          "rightLabel": "+20",
          "min": -20,
          "max": 20,
          "value": 0,
          "updatedAt": "2026-09-07T00:00:00.000Z"
        }
      ]
    }
  ]
}
```

Nota: i grafici dentro una card giocatore non hanno bisogno di una posizione propria, perche sono ordinati dentro la card. La posizione appartiene alla card giocatore.

## Barre Iniziali E Fascia Barre

Servono due barre iniziali, ognuna con 21 quadratini. Il valore logico iniziale va da `-10` a `+10`, con `0` al centro.

Queste barre non sono fisse per forza: partono nella fascia alta `Barre`, ma devono comportarsi come le altre card-barra. Il master deve poterle lasciare in alto, spostarle nella plancia, bloccarle/sbloccarle e modificarle con la stessa UX delle barre create dopo.

La fascia `Barre` deve usare un layout fluido:

- Con spazio sufficiente, tre o piu barre possono stare una accanto all'altra.
- Le barre fissate in alto si ridimensionano entro limiti leggibili.
- Quando lo spazio non basta, vanno a capo automaticamente.
- I quadratini restano contenuti nella card; se la scala diventa troppo lunga, lo scorrimento deve essere interno alla barra e non rompere la card.
- Il numero di caselle di una barra deve essere modificabile sia durante la creazione sia dalla card gia creata.
- Il default resta 21 per conservare la scala `-10 / 0 / +10`, ma non deve essere un limite.
- Se il master sceglie un numero pari, la barra conserva il numero esatto di caselle e include comunque lo `0`; la scala numerica risulta leggermente asimmetrica di una casella.

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

- Mostrare il numero di quadratini scelto dal master.
- Avere il quadratino che rappresenta il valore `0` marcato chiaramente.
- Consentire al master di cliccare un quadratino per impostare il valore.
- Evidenziare il valore corrente.
- Mostrare chiaramente gli estremi testuali.
- Mostrare chiaramente anche i valori numerici agli estremi, per esempio `-10` e `+10`, oltre alle eventuali label narrative.
- Permettere di modificare nome, etichetta sinistra, etichetta destra e valore corrente.
- Salvare il valore nel JSON.

Dato che il master parla di quadratini, le barre non devono essere slider continui. Devono essere discrete, fisiche, quasi da scheda cartacea.

## Barre Da Plancia

Oltre alle due barre iniziali, il master deve poter creare altre barre dalla UX di `Aggiungi`.

Comportamento:

- Le barre create da `Aggiungi` usano la stessa interazione delle barre iniziali: numero di quadratini scelto, centro `0`, click sul quadratino per impostare il valore.
- Vivono come card libere sulla plancia o nella fascia alta `Barre`, quindi hanno posizione, blocco posizione, fissaggio in alto ed eliminazione.
- Hanno titolo card, label del grafico, etichetta sinistra, etichetta centrale, etichetta destra e valore modificabili.
- Sono salvate nel JSON e nei salvataggi nominati.
- Non entrano nella zona `Party`, che resta dedicata ai clock globali/totali.
- Possono invece entrare nella fascia `Barre`, insieme alle barre iniziali.
- Su mobile vengono mostrate come card in lista, con quadratini tappabili.
- Nella plancia principale si agganciano alla griglia responsive come clock e card giocatore.

Decisione strutturale:

- Le due barre iniziali restano in `tracks`, ma con gli stessi campi di posizionamento delle barre da plancia.
- Le barre create dal master vanno in una collezione separata `boardTracks`.
- Questa separazione evita di confondere le barre sempre presenti con quelle narrative create per una scena specifica.
- Entrambe le collezioni usano `pinnedToTop` per decidere se una barra e nella fascia alta o nella plancia.

Esempio dati:

```json
{
  "boardTracks": [
    {
      "id": "board-track-1",
      "name": "Tensione del sogno",
      "graphLabel": "Equilibrio onirico",
      "leftLabel": "Calma",
      "centerLabel": "0",
      "rightLabel": "Frattura",
      "min": -7,
      "max": 7,
      "value": 0,
      "position": {
        "x": 80,
        "y": 340
      },
      "size": "medium",
      "locked": false,
      "pinnedToTop": false,
      "updatedAt": "2026-09-07T00:00:00.000Z"
    }
  ]
}
```

## Clock

I clock vivono dentro card posizionabili sulla plancia.

La card e il contenitore stabile: titolo, controlli rapidi, grafico e impostazioni. Il grafico interno puo cambiare stile, ma la card resta trascinabile, salvabile e configurabile nello stesso modo.

### Creazione Grafico

Quando il master preme `Aggiungi`, appare una piccola finestra/modale con:

- Tipo grafico in cima: `Clock`, `Barra -X / 0 / +X`, `Barra segmentata`.
- Titolo della card.
- Label del grafico, mostrata sopra al grafico.
- Numero di spicchi, segmenti o caselle.
- Colore o tono visivo opzionale.
- Pulsante `Crea`.
- Placeholder di esempio sui campi testuali, lasciando i valori effettivi liberi.

Il numero di elementi deve essere richiesto sempre. Preset consigliati:

- 4
- 6
- 8
- 10
- 12

Deve comunque essere possibile inserire un numero manuale libero. Il numero minimo resta `2`, ma non deve esserci un blocco massimo arbitrario come `12`.

Nota visuale: con molti segmenti il clock deve restare contenuto nella card. La torta puo diventare molto fitta, mentre la barra segmentata deve poter andare a capo su piu righe senza uscire dal contenitore.

### Tipi Di Grafico

I tipi grafico devono essere presentati come scelta principale, non come sottotipo del clock.

Tipi previsti:

- `Clock`: cerchio diviso in spicchi. E lo stile principale per minacce, rituali e fronti narrativi.
- `Barra -X / 0 / +X`: barra simmetrica con valori negativi a sinistra, `0` al centro e valori positivi a destra.
- `Barra segmentata`: barra orizzontale divisa in caselle normali, utile per progressi lineari che si riempiono da `0` al totale.

Il `Clock` e la `Barra segmentata` possono condividere internamente alcuni dati (`segments`, `filled`, `name`, `color`, `settings`), ma la UI non deve presentarli come varianti dello stesso clock.

Per i grafici dentro una card giocatore, i dati condivisi restano gli stessi tranne `position` e `size`, che appartengono alla card contenitore.

### Clock A Torta

Requisiti:

- Forma circolare divisa in spicchi.
- Spicchi vuoti e pieni ben distinguibili.
- Click su uno spicchio per impostare l'avanzamento.
- Pulsanti rapidi `-1` e `+1`.
- Nome sempre leggibile.
- Label del grafico sempre leggibile sopra al quadrante.
- Indicazione discreta tipo `3 / 6`.
- Stato completato quando tutti gli spicchi sono pieni.
- Il grafico deve avere abbastanza contrasto tra spicchi vuoti, spicchi pieni, bordi e sfondo della card.
- Il numero di spicchi non deve essere limitato artificialmente a `12`; il master puo scegliere numeri piu alti, accettando che il grafico diventi piu fitto.

Implementazione consigliata:

- SVG generato in React.
- Ogni spicchio e un `path` cliccabile.
- Nessuna libreria grafica pesante.
- La dimensione del clock deve restare stabile e leggibile.

### Posizionamento

Il master deve poter decidere l'ordine e la zona delle card-clock nella pagina senza rischiare sovrapposizioni.

MVP:

- Il nuovo clock nasce nella plancia, dopo gli elementi gia presenti.
- La plancia aggancia automaticamente le card in una griglia responsive.
- Con 2 card vicine, le card si affiancano e si ridimensionano.
- Con 3 card vicine su desktop, la riga si stringe in 3 colonne.
- Su smartphone la griglia non supera 2 colonne.
- La posizione viene ancora salvata nel JSON per compatibilita, ma non deve causare sovrapposizione visuale.

Opzionale ma utile:

- Dimensione piccola, media, grande.
- Blocco posizione per evitare spostamenti accidentali durante la sessione.
- Ordinamento manuale con drag dentro la griglia, in una versione successiva.

Per una prima versione rapida, eviterei il ridimensionamento libero: meglio tre taglie stabili, piu facili da usare e meno fragili su mobile.

### Modifica In Tempo Reale

Ogni card-clock deve permettere modifiche immediate:

- Cambiare avanzamento con click sul grafico.
- Usare `-1` e `+1`.
- Cambiare lunghezza del clock, cioe numero di segmenti/spicchi.
- Cambiare stile grafico, se compatibile.
- Cambiare nome.
- Cambiare label del grafico.
- Cambiare colore.
- Spostare o riordinare la card nella plancia, secondo il modello di griglia scelto.
- Salvare automaticamente lo stato in memoria locale dopo ogni modifica.

Se il master riduce il numero di segmenti sotto il valore gia riempito, il valore `filled` va clampato al nuovo massimo.

Il numero di segmenti/spicchi non deve avere un massimo fisso nell'MVP. Il minimo resta `2`; se viene inserito un valore non valido, la UI deve riportarlo a un valore valido senza rompere il clock.

## Salvataggio

## Salvataggi Con Nome E Barra Laterale

Quando il master preme `Salva`:

- La webapp chiede un nome per il salvataggio.
- Se il nome e nuovo, crea una nuova schermata salvata.
- Se il nome esiste gia, chiede se sovrascrivere oppure salvare una copia con nome diverso.
- Il salvataggio viene aggiunto o aggiornato nella barra laterale.
- La webapp scarica anche un file `.json` con lo stesso stato, cosi il master ha un file visibile solo per backup, importazione futura o passaggio a un altro dispositivo.
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
        "campaignName": "La caduta dei cieli",
        "tracks": [],
        "clocks": [],
        "boardTracks": [],
        "playerCards": []
      }
    }
  ]
}
```

## File JSON Di Backup

Il file `.json` viene creato dal flusso `Salva`.

Quando il master salva:

- La webapp prende lo stato corrente della pagina.
- Genera un file `.json`.
- Il file contiene barre, card-clock, nomi, valori, stile grafico, spicchi/segmenti, avanzamento, posizione e impostazioni visive.
- Il master puo conservare quel file senza doverlo aprire o capire: serve solo per importarlo in futuro o spostarlo su un altro dispositivo.

Nome file consigliato:

```text
clock-campagna-nome-2026-09-07.json
```

Il JSON deve includere una versione schema per poter evolvere il formato senza rompere i salvataggi vecchi.

Esempio:

```json
{
  "schemaVersion": 1,
  "campaignName": "La caduta dei cieli",
  "tracks": [
    {
      "id": "attitude",
      "name": "Atteggiamento",
      "graphLabel": "Bilanciamento del gruppo",
      "leftLabel": "Sociale",
      "centerLabel": "0",
      "rightLabel": "Fisico",
      "min": -10,
      "max": 10,
      "value": 0,
      "position": {
        "x": 36,
        "y": 36
      },
      "size": "medium",
      "locked": false,
      "pinnedToTop": true,
      "updatedAt": "2026-09-07T00:00:00.000Z"
    },
    {
      "id": "factions",
      "name": "Percezione delle fazioni",
      "graphLabel": "Vicinanza percepita",
      "leftLabel": "Rinati",
      "centerLabel": "0",
      "rightLabel": "Cantori",
      "min": -10,
      "max": 10,
      "value": 0,
      "position": {
        "x": 96,
        "y": 86
      },
      "size": "medium",
      "locked": false,
      "pinnedToTop": true,
      "updatedAt": "2026-09-07T00:00:00.000Z"
    }
  ],
  "boardTracks": [],
  "clocks": [
    {
      "id": "clock-1",
      "type": "pie",
      "name": "Il sogno si incrina",
      "graphLabel": "Frattura del velo",
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
      "updatedAt": "2026-09-07T00:00:00.000Z",
      "tracks": [
        {
          "id": "player-track-1",
          "name": "Atteggiamento verso popolazione",
          "graphLabel": "Atteggiamento verso popolazione",
          "leftLabel": "-20",
          "centerLabel": "0",
          "rightLabel": "+20",
          "min": -20,
          "max": 20,
          "value": 0,
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
- Se esiste `playerCards`, valida anche le card giocatore e i grafici interni.
- Chiede conferma prima di sostituire la plancia corrente.
- Dopo il caricamento, permette di salvarlo con nome nella barra laterale.
- Se il file non e valido, mostra un errore chiaro e non cancella nulla.
- Il caricamento da JSON non crea automaticamente una voce nella barra laterale: dopo aver importato, il master puo premere `Salva` per registrare quella schermata con nome.

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
    TrackRail.tsx
    TrackSquares.tsx
    Board.tsx
    ClockToken.tsx
    PlayerCard.tsx
    PlayerTrackList.tsx
    AddPlayerCardModal.tsx
    ClockStylePicker.tsx
    PieClock.tsx
    SegmentedBarClock.tsx
    AddClockModal.tsx
    ClockSettingsPanel.tsx
    TrackToken.tsx
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
- Header minimale con `Aggiungi`, `Salva`, `Carica`.
- Salvataggio con nome tramite modale semplice.
- Barra laterale a scomparsa con schermate salvate ricaricabili al volo.
- Due barre iniziali da 21 quadratini, fissate in alto solo finche il master lo desidera:
  - `Atteggiamento`: `Sociale` / `0` / `Fisico`.
  - `Percezione delle fazioni`: `Rinati` / `0` / `Cantori`.
- Fascia `Barre` con resize e ritorno a capo automatico quando il master fissa in alto piu barre.
- Impostazioni modificabili per nome/estremi/valori delle barre.
- Creazione card-clock con scelta dello stile grafico.
- Creazione grafico con scelta principale tra `Clock`, `Barra -X / 0 / +X` e `Barra segmentata`.
- Creazione barra da plancia con la stessa UX delle due barre iniziali.
- Titolo card e label sopra grafico modificabili per clock e barre.
- Creazione card giocatore con nome del giocatore.
- Possibilita di aggiungere piu grafici di tutti e tre i tipi dentro ogni card giocatore.
- Grafici giocatore configurabili con titolo, label, valore `X`, segmenti o caselle secondo il tipo scelto.
- Creazione clock a torta con nome e numero spicchi.
- Creazione barra segmentata con nome e numero caselle.
- Avanzamento del clock cliccando il grafico o usando `-1` / `+1`.
- Modifica in tempo reale di lunghezza, stile e impostazioni.
- Card-clock, barre libere e card giocatore agganciate nella griglia responsive della plancia.
- Possibilita di fissare i clock globali in alto nella zona `Party`.
- Card giocatore disposte nella stessa griglia responsive della plancia.
- Download automatico del JSON completo quando si preme `Salva`.
- Caricamento da JSON.
- Autosave in `localStorage`.
- Layout responsive.
- Su mobile, vista semplificata a lista con gesture principali per avanzamento.
- Card e controlli interni sempre contenuti, senza overflow visivo.
- Contrasto rinforzato su sfondi scuri e textureizzati.
- Segmenti/spicchi liberi oltre `12`, con minimo `2`.

Versione 0.2, solo se serve:

- Clock ad anello.
- Taglie piccola/media/grande.
- Blocco posizione.
- Colori o categorie.
- Archivio dei clock completati.
- Gestione avanzata dei salvataggi: rinomina, duplica, elimina.

## Cose Da Evitare

- Backend.
- Login.
- Ruoli master/giocatori.
- Sincronizzazione realtime.
- Tabelle o layout troppo gestionali.
- Troppe opzioni nella modale di creazione.
- Ridimensionamento libero nella prima versione.
- Forzare il drag libero come interazione principale quando la griglia evita sovrapposizioni.
- Permettere a card vicine di sovrapporsi invece di ridimensionarsi o andare a capo.
- Dipendenze pesanti per disegnare i clock.
- Un editor da grafica professionale: deve restare uno strumento da sessione, non un costruttore complesso.
- Creare una card separata per ogni singolo grafico giocatore quando piu grafici appartengono allo stesso giocatore.

## Domande Ancora Aperte

- I clock devono avere una descrizione/note oppure basta il nome?
- I clock completati restano visibili o vanno archiviati?
- Il master vuole poter cambiare colore ai clock gia nella prima versione?
- Serve una modalita schermo intero per usarla al tavolo?
- La barra laterale dei salvataggi su mobile deve diventare un drawer, una tendina o una sezione in alto?
- Quando si sta modificando un salvataggio gia attivo, `Salva` deve proporre quel nome come default e aggiornare quel salvataggio se il master conferma lo stesso nome.
- I grafici dentro una card giocatore devono essere sempre visibili o collassabili per non occupare troppo spazio?
- La card giocatore deve avere anche un grafico riepilogativo/totale automatico o solo i grafici che il master aggiunge manualmente?
- La zona `Party` deve essere sempre visibile anche quando non contiene clock, oppure apparire solo quando almeno un clock e fissato?

## Stima

Per una versione 0.1 piccola ma curata:

- Setup React/Vite/TypeScript: 30-60 minuti.
- Layout fantasy e plancia: 1-2 ore.
- Barre a caselle configurabili: 1 ora.
- Impostazioni modificabili delle barre: 45-60 minuti.
- Clock a torta SVG: 1-2 ore.
- Barra segmentata: 45-60 minuti.
- Zona `Party` per fissare clock globali: 30-60 minuti.
- Card giocatore con grafici interni: 1-2 ore.
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

Il cuore dell'app deve essere questo: una plancia fantasy vuota, due barre iniziali da 21 caselle e un pulsante `Aggiungi` che crea tre tipi grafico globali: `Clock`, `Barra -X / 0 / +X` e `Barra segmentata`. Le barre possono stare nella fascia alta `Barre`, con resize e ritorno a capo automatico, oppure vivere nella griglia della plancia. I clock globali restano nella griglia della plancia, ma possono essere fissati in alto nella zona `Party`. Deve esserci anche `Aggiungi giocatore`, che crea una card giocatore con nome e con la possibilita di aggiungere gli stessi tre tipi grafico dentro la card. Il master deve poter salvare schermate con nome nella barra laterale e richiamarle subito; il JSON deve restare il formato portabile per backup e passaggio tra sessioni o dispositivi. Su desktop la webapp funziona come plancia scrollabile a massimo 3 colonne, mentre su cellulare diventa una plancia semplificata a massimo 2 colonne con gesture rapide.

## Regola Di Lavoro Sul Documento

Ogni volta che si aggiunge, affina o cambia una parte del progetto:

- Rileggere questo documento prima di modificare codice o struttura.
- Aggiornare il documento con la nuova decisione.
- Eliminare o correggere parti superate, ambigue o in conflitto.
- Fermarsi e discutere con il master quando la modifica implica una decisione strutturale non ancora condivisa.
