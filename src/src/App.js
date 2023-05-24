import React from 'react';
import VoiceInput from './VoiceInput';

const App = () => {
  const handleRecordEnd = (recordedBlob) => {
    console.log('Recorded Blob:', recordedBlob);
  };

  return (
    <div>
      <h1>Voice Recording App</h1>
      <VoiceInput onRecordEnd={handleRecordEnd} />
    </div>
  )
}

export default App;
