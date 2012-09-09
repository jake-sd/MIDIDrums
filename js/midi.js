function midiMessageReceived( msgs ) {
  for (i=0; i<msgs.length; i++) {
    var cmd = msgs[i].data[0] >> 4;
    var channel = msgs[i].data[0] & 0xf;
    var noteNumber = msgs[i].data[1];
    var velocity = msgs[i].data[2];

    if ( cmd==8 || ((cmd==9)&&(velocity==0)) ) { // with MIDI, note on with velocity zero is the same as note off
      // note off
      noteOff( noteNumber );
    } else if (cmd == 9) {
      // note on
      noteOn( noteNumber, velocity/127.0);
    } else if (cmd == 11) {
      controller( noteNumber, velocity/127.0);
    }   
  }
}

var selectMIDIIn = null;
var selectMIDIOut = null;
var midiAccess = null;
var midiIn = null;
var midiOut = null;

function changeMIDIIn( ev ) {
  var list=midiAccess.enumerateInputs();
  var selectedIndex = ev.target.selectedIndex;

  if (list.length >= selectedIndex) {
    midiIn = midiAccess.getInput( list[selectedIndex] );
    midiIn.onmessage = midiMessageReceived;
  }
}

function changeMIDIOut( ev ) {
  var list=midiAccess.enumerateOutputs();
  var selectedIndex = ev.target.selectedIndex;

  if (list.length >= selectedIndex)
    midiOut = midiAccess.getOutput( list[selectedIndex] );
}

function onMIDIInit( midi ) {
  var preferredIndex = 0;
  midiAccess = midi;
  selectMIDIIn=document.getElementById("midiIn");
  selectMIDIOut=document.getElementById("midiOut");

  var list=midi.enumerateInputs();

  // clear the MIDI input select
  selectMIDIIn.options.length = 0;

  for (var i=0; i<list.length; i++)
    if (list[i].name.toString().indexOf("DJ") != -1)
      preferredIndex = i;

  if (list.length) {
    for (var i=0; i<list.length; i++)
      selectMIDIIn.options[i]=new Option(list[i].name,list[i].fingerprint,i==preferredIndex,i==preferredIndex);

    midiIn = midiAccess.getInput( list[preferredIndex] );
    midiIn.onmessage = midiMessageReceived;

    selectMIDIIn.onchange = changeMIDIIn;
  }

  // clear the MIDI output select
  selectMIDIOut.options.length = 0;
  preferredIndex = 0;
  list=midi.enumerateOutputs();

  for (var i=0; i<list.length; i++)
    if (list[i].name.toString().indexOf("DJ") != -1)
      preferredIndex = i;

  if (list.length) {
    for (var i=0; i<list.length; i++)
      selectMIDIOut.options[i]=new Option(list[i].name,list[i].fingerprint,i==preferredIndex,i==preferredIndex);

    midiOut = midiAccess.getOutput( list[preferredIndex] );
    selectMIDIOut.onchange = changeMIDIOut;
  }

}

function showBeat(index) {
  if (midiOut)
    midiOut.sendMessage( 0x90, 16 + index, ((index%4)==0) ? 0x03 : 0x07);
}

function hideBeat(index) {
  if (midiOut)
    midiOut.sendMessage( 0x80, 16 + index, 0x00 );
}


function onMIDISystemError( msg ) {
  console.log( "Error encountered:" + msg );
}
//init: start up MIDI
window.addEventListener('load', function() {   
  navigator.getMIDIAccess( onMIDIInit, onMIDISystemError );
});

var currentlyActiveInstrument = 0;

function setActiveInstrument(index) {

}

function toggleBeat(index) {
  
}