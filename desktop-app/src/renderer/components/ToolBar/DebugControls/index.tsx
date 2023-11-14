import { useEffect, useState } from 'react';
import { webViewPubSub } from 'renderer/lib/pubsub';
import { DebugDropDown } from '../../DebugDropDown';

export const DEBUGGER_CHANNEL = 'debug-tools';

export const ColorBlindnessControls = () => {
  const [debugName, setDebugName] = useState<string | undefined>(undefined);

  useEffect(() => {
    webViewPubSub.publish(DEBUGGER_CHANNEL, { debugName });
  }, [debugName]);

  return <DebugDropDown debugName={debugName} onChange={setDebugName} />;
};
