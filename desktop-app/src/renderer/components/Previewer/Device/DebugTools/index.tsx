import { useCallback, useEffect, useState } from 'react';
import { webViewPubSub } from 'renderer/lib/pubsub';
import {
  A11Y,
  LAYOUT,
  DebugDropDown,
  DEBUGTOOLS,
} from '../../../DebugDropDown';
import { DEBUGGER_CHANNEL } from '../../../ToolBar/DebugControls';

import { a11ycss, grid, hostile, layout } from '../assets';

interface InjectedCss {
  key: string;
  css: string;
  js: string | null;
  name: string;
}

interface Props {
  webview: Electron.WebviewTag | null;
}

const STYLESHEETS = {
  [DEBUGTOOLS.GRID]: ((size = 15): string => grid(size))(),
  [DEBUGTOOLS.LAYOUT]: layout,
  [DEBUGTOOLS.A11YCSS]: a11ycss,
  [DEBUGTOOLS.HOSTILE]: hostile,
};

export const DebugTools = ({ webview }: Props) => {
  const [injectCss, setInjectCss] = useState<InjectedCss>();

  const reApplyCss = useCallback(async () => {
    if (webview === null) {
      return;
    }
    if (injectCss === undefined) {
      return;
    }
    const key = await webview.insertCSS(injectCss.css);
    if (injectCss.js != null) {
      await webview.executeJavaScript(injectCss.js);
    }

    setInjectCss({ ...injectCss, key });
  }, [webview, injectCss, setInjectCss]);

  const applyCss = useCallback(
    async (debugType: string, css: string, js: string | null = null) => {
      if (webview === null) {
        return;
      }
      if (css === undefined) {
        return;
      }

      if (injectCss !== undefined) {
        if (injectCss.name === debugType) {
          return;
        }
        if (injectCss.js !== null) {
          webview.reload();
        }
        await webview.removeInsertedCSS(injectCss.key);
        setInjectCss(undefined);
      }

      try {
        const key = await webview.insertCSS(css);
        if (js !== null) {
          await webview.executeJavaScript(js);
        }
        setInjectCss({ key, css, name: debugType, js });
      } catch (error) {
        // eslint-disable-next-line no-console
        console.error('Error inserting css', error);
        // dispatch(setCss(undefined));
        setInjectCss(undefined);
      }
    },
    [setInjectCss, webview, injectCss]
  );

  const clearSimulation = useCallback(async () => {
    if (webview === null) {
      return;
    }
    if (injectCss === undefined) {
      return;
    }
    await webview.removeInsertedCSS(injectCss.key);
    setInjectCss(undefined);
  }, [webview, injectCss, setInjectCss]);

  useEffect(() => {
    if (webview === null) {
      return () => {};
    }
    const handler = async () => {
      reApplyCss();
    };

    webview.addEventListener('did-navigate', handler);

    return () => {
      webview.removeEventListener('did-navigate', handler);
    };
  }, [webview, reApplyCss]);

  const applyDebugTool = useCallback(
    async (debugName: string) => {
      const css = STYLESHEETS[debugName];
      console.log({ css });
      return applyCss(debugName, css);
    },
    [applyCss]
  );

  const applyDebugger = useCallback(
    async (simulation = '') => {
      if (A11Y.concat(LAYOUT).indexOf(simulation) !== -1) {
        return applyDebugTool(simulation);
      }
      return clearSimulation();
    },
    [applyDebugTool, clearSimulation]
  );

  useEffect(() => {
    const handler = ({ simulationName }: { simulationName: string }) => {
      applyDebugger(simulationName);
    };
    webViewPubSub.subscribe(DEBUGGER_CHANNEL, handler);

    return () => {
      webViewPubSub.unsubscribe(DEBUGGER_CHANNEL, handler);
    };
  }, [applyDebugger]);

  return <DebugDropDown debugName={injectCss?.name} onChange={applyDebugger} />;
};
